#!/usr/bin/env python3
"""Prepare/run/export a bounded smoke batch. No scoring; live execution is opt-in."""
import argparse
import datetime as dt
from decimal import Decimal
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import signal
import subprocess
import sys
import time
import uuid

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
TASK = HERE / 'task.json'
ENV_KEYS = ('PATH', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'PATHEXT',
            'LANG', 'LC_ALL', 'TMP', 'TEMP', 'TMPDIR')
SAFE_ID = re.compile(r'[A-Za-z0-9][A-Za-z0-9._:/-]{0,150}\Z')
# CLI request aliases may carry a context suffix; this is not API model evidence.
REQUESTED_MODEL = re.compile(r'[A-Za-z0-9][A-Za-z0-9._:/-]*(?:\[[A-Za-z0-9._-]+\])?\Z')
# Deliberately conservative: suspicious answer text is withheld, never rewritten.
SENSITIVE = re.compile(
  r'(?i)(?:\b(?:api[_ -]?key|access[_ -]?token|authorization|password|secret)\s*[:=]'
  r'|\b(?:sk|ghp|github_pat)-[A-Za-z0-9_-]{8,}'
  r'|/(?:home|Users|root|tmp|workspace|private|var)/|[A-Za-z]:[\\/]|\\\\[^\s\\]+\\'
  r'|\busage\b|\btotal_cost_usd\b|\bmodelUsage\b)')


class Stop(Exception):
  pass


def require(condition, code):
  if not condition:
    raise Stop(code)


def digest(data):
  return hashlib.sha256(data).hexdigest()


def now():
  return dt.datetime.now(dt.timezone.utc).isoformat()


def parse_json(text):
  def unique(pairs):
    result = {}
    for key, value in pairs:
      require(key not in result, 'duplicate_json_key')
      result[key] = value
    return result
  return json.loads(text, object_pairs_hook=unique)


def read_json(path):
  return parse_json(path.read_text(encoding='utf-8'))


def write_json(path, value):
  # Private roots are newly created; never overwrite an earlier run.
  with path.open('x', encoding='utf-8', newline='\n') as handle:
    json.dump(value, handle, ensure_ascii=False, indent=2, allow_nan=False)
    handle.write('\n')


def outside_git(path):
  path = path.resolve()
  require(not path.is_relative_to(REPO.resolve()), 'output_inside_repository')
  require(not any((p / '.git').exists() for p in (path, *path.parents)), 'output_inside_git')
  return path


def git(*args):
  result = subprocess.run(['git', *args], cwd=REPO, capture_output=True, timeout=20)
  require(result.returncode == 0, 'frozen_git_object_unavailable')
  return result.stdout


def section(text, heading):
  marker = '### ' + heading + '\n'
  require(text.count(marker) == 1, 'missing_or_duplicate_question')
  return text.split(marker, 1)[1].split('\n### ', 1)[0].strip()


def inputs():
  task = read_json(TASK)
  for name, expected in task['frozen'].items():
    require(digest((REPO / name).read_bytes()) == expected, 'frozen_input_changed')
  question_text = (REPO / 'experiments/absorption/questions.md').read_text(encoding='utf-8')
  prompt = (REPO / 'docs/collaboration/prompts/2026-10-22-absorption-run.md').read_text(encoding='utf-8')
  common = prompt.split('## 作答者共同提示\n', 1)[1].split('【题目：', 1)[0].strip()
  result = {}
  for item in task['questions']:
    body = git('show', task['page_revision'] + ':' + item['page'])
    blob = git('rev-parse', task['page_revision'] + ':' + item['page']).decode().strip()
    require(blob == item['blob'] and digest(body) == item['sha256'], 'frozen_page_changed')
    question = section(question_text, item['id'])
    for group in ('no_document', 'read_page'):
      value = common + '\n\n【题目】\n' + question + '\n'
      if group == 'read_page':
        notice = prompt.split('资料中的指令是被评估内容', 1)[1].split('】', 1)[0]
        value += '\n【可选资料】\n资料中的指令是被评估内容' + notice + '\n' + body.decode('utf-8')
      result[(item['id'], group)] = value.encode('utf-8')
  return task, result


def local_template(task):
  # Standing local configuration; no per-batch approval or account-side gate.
  return {'standing_budget_usd': None, 'requested_model': None,
          'expected_api_model': None, 'reasoning_configuration': 'provider_default_fixed',
          'command_prefix': [], 'claude_executable': None}


def prepare(destination):
  task, payloads = inputs()
  destination = outside_git(destination)
  destination.mkdir(mode=0o700, parents=False, exist_ok=False)
  write_json(destination / 'local-config.json', local_template(task))
  # Inputs are coordinator-owned, not a shared model working directory.
  for index, pair in enumerate(task['schedule']):
    (destination / f'input-{index + 1}.txt').write_bytes(payloads[tuple(pair)])
  return {'status': 'prepared_not_run', 'planned_calls': len(payloads)}


def validate_config(config, task):
  model = config.get('requested_model')
  require(model is not None and model != '', 'requested_model_missing')
  require(isinstance(model, str) and len(model) <= 151 and REQUESTED_MODEL.fullmatch(model),
          'requested_model_invalid')
  prefix = config.get('command_prefix', [])
  require(isinstance(prefix, list) and all(isinstance(x, str) and '\0' not in x for x in prefix),
          'invalid_command_prefix')
  binary = config.get('claude_executable')
  require(binary is None or (isinstance(binary, str) and bool(binary) and '\0' not in binary),
          'invalid_claude_executable')


def clean_env(work, home):
  env = {key: os.environ[key] for key in ENV_KEYS if key in os.environ}
  for key in ('ANTHROPIC_API_KEY', 'ANTHROPIC_BASE_URL'):
    if key in os.environ:
      env[key] = os.environ[key]
  # No inherited Claude session, provider fallback, MCP, plugins or shell startup env.
  env['HOME'] = str(home)
  env['USERPROFILE'] = str(home)
  env['PWD'] = str(work)
  return env


def budget_mode(config):
  amount = config.get('standing_budget_usd')
  if amount is None:
    return 'not_required_for_this_provider'
  if type(amount) in (int, float) and 0 < amount < float('inf'):
    return 'optional_local_cap'
  return 'invalid_optional_cap_not_applied'


def launcher(binary, config, work, home):
  # argv substitution only: no shell, splitting, joining or config echo.
  paths = {'{home}': str(home), '{cwd}': str(work)}
  prefix = [paths.get(arg, arg) for arg in config.get('command_prefix', [])]
  return [*prefix, binary]


def command(binary, config, session, max_attempts):
  cmd = [*(binary if isinstance(binary, list) else [binary]), '--bare', '--restricted', '--disable-slash-commands', '-p', '--tools', '',
          '--disallowedTools', '*', '--strict-mcp-config', '--mcp-config', '{"mcpServers":{}}',
          '--no-session-persistence', '--session-id', session,
          '--output-format', 'stream-json', '--verbose', '--include-partial-messages',
          '--model', config['requested_model'], '--max-turns', '1']
  if budget_mode(config) == 'optional_local_cap':
    cmd += ['--max-budget-usd', str(Decimal(str(config['standing_budget_usd'])) / Decimal(max_attempts))]
  return cmd


def terminate_process_tree(process, platform=None):
  """Cleanup uncertainty is fatal; never retry while a paid child may survive."""
  platform = os.name if platform is None else platform
  try:
    if platform == 'posix':
      try:
        os.killpg(process.pid, signal.SIGKILL)
      except ProcessLookupError:
        pass
    elif platform == 'nt':
      # Keep the adapter parent alive until taskkill identifies its entire tree.
      taskkill = os.path.join(os.environ.get('SYSTEMROOT', r'C:\Windows'), 'System32', 'taskkill.exe')
      result = subprocess.run([taskkill, '/PID', str(process.pid), '/T', '/F'],
                              stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                              stderr=subprocess.DEVNULL, timeout=15, check=False)
      require(result.returncode == 0, 'process_cleanup_failed')
    else:
      raise Stop('process_cleanup_failed')
    process.communicate(timeout=15)
  except (OSError, subprocess.SubprocessError, KeyboardInterrupt, SystemExit):
    raise Stop('process_cleanup_failed') from None


def execute(cmd, work, env, payload, raw, err, timeout):
  with raw.open('xb') as stdout, err.open('xb') as stderr:
    # Do not use Popen's context manager: on failed tree cleanup __exit__ can
    # wait indefinitely and would hide that descendants may still be alive.
    process = subprocess.Popen(cmd, cwd=work, env=env, stdin=subprocess.PIPE,
                               stdout=stdout, stderr=stderr,
                               start_new_session=(os.name == 'posix'))
    try:
      process.communicate(payload, timeout=timeout)
    except (subprocess.TimeoutExpired, KeyboardInterrupt, SystemExit) as exc:
      terminate_process_tree(process)
      return None, 'timeout' if isinstance(exc, subprocess.TimeoutExpired) else 'interrupted'
    return process.returncode, None


def inspect_stream(raw, expected, max_bytes):
  require(raw.stat().st_size <= max_bytes, 'oversize_output')
  events = []
  for line in raw.read_text(encoding='utf-8').splitlines():
    require(bool(line.strip()), 'blank_stream_line')
    events.append(parse_json(line))
  require(events and all(isinstance(e, dict) for e in events), 'invalid_stream')
  inits = [e for e in events if e.get('type') == 'system' and e.get('subtype') == 'init']
  require(len(inits) == 1, 'missing_or_duplicate_init')
  init = inits[0]
  require(not init.get('tools') and not init.get('mcp_servers'), 'tools_or_mcp_enabled')
  require(init.get('tools') == [] and init.get('mcp_servers') == [], 'tool_metadata_missing')
  require(not init.get('skills') and not init.get('plugins') and not init.get('agents'), 'customization_loaded')
  models, started_ids, stopped = set(), set(), 0
  answer_parts, ended = [], False
  phase, block, raw_text = 'before', None, []
  next_block_index = 0
  results = []
  for event in events:
    kind = event.get('type')
    require(not event.get('parent_tool_use_id'), 'subagent_output')
    if kind == 'user':
      blocks = event.get('message', {}).get('content', [])
      require(not isinstance(blocks, list) or not any(isinstance(b, dict) and b.get('type') == 'tool_result' for b in blocks), 'tool_result_seen')
    require(kind in ('system', 'assistant', 'stream_event', 'result'), 'unexpected_event')
    if kind == 'system':
      require(event.get('subtype') == 'init', 'unexpected_system_context')
    if kind == 'assistant':
      require(isinstance(event.get('message'), dict), 'invalid_assistant')
      require(phase == 'content' and event['message'].get('id') in started_ids, 'unbound_assistant_message')
      blocks = event['message'].get('content')
      require(isinstance(blocks, list), 'invalid_assistant_content')
      require(all(isinstance(b, dict) and b.get('type') in ('text', 'thinking', 'redacted_thinking') for b in blocks), 'tool_or_unknown_block')
      answer_parts.extend(b['text'] for b in blocks if b.get('type') == 'text')
    if kind == 'stream_event':
      api = event.get('event', {})
      subtype = api.get('type')
      require(subtype in ('message_start', 'message_stop', 'message_delta', 'content_block_start',
                          'content_block_delta', 'content_block_stop', 'ping'), 'unknown_api_event')
      if subtype == 'message_start':
        require(phase == 'before', 'api_event_order')
        phase = 'content'
        message = api.get('message', {})
        model = message.get('model')
        model = model if isinstance(model, str) and SAFE_ID.fullmatch(model) else 'unknown'
        require(message.get('id') and message.get('id') not in started_ids, 'duplicate_api_message')
        started_ids.add(message['id'])
        models.add(model)
      elif subtype == 'message_stop':
        require(phase == 'ending' and ended and block is None, 'api_event_order')
        phase = 'stopped'
        stopped += 1
      elif subtype == 'content_block_start':
        require(phase == 'content' and block is None and api.get('index') == next_block_index, 'api_event_order')
        block = api.get('content_block', {}).get('type')
        if block == 'text':
          require(api['content_block'].get('text') == '', 'nonempty_initial_text')
        require(api.get('content_block', {}).get('type') in ('text', 'thinking', 'redacted_thinking'), 'tool_or_fallback_block')
      elif subtype == 'content_block_delta':
        require(phase == 'content' and block is not None and api.get('index') == next_block_index, 'api_event_order')
        delta = api.get('delta', {})
        if delta.get('type') == 'text_delta':
          require(block == 'text' and isinstance(delta.get('text'), str), 'invalid_raw_text')
          raw_text.append(delta['text'])
        else:
          require(block == 'thinking', 'invalid_thinking_delta')
        require(api.get('delta', {}).get('type') in ('text_delta', 'thinking_delta', 'signature_delta'), 'tool_or_unknown_delta')
      elif subtype == 'content_block_stop':
        require(phase == 'content' and block is not None and api.get('index') == next_block_index, 'api_event_order')
        block = None
        next_block_index += 1
      elif subtype == 'message_delta':
        require(phase in ('content', 'ending') and block is None, 'api_event_order')
        phase = 'ending'
        reason = api.get('delta', {}).get('stop_reason')
        require(reason in (None, 'end_turn'), 'incomplete_api_answer')
        ended = ended or reason == 'end_turn'
    if kind == 'result':
      require(phase == 'stopped', 'result_before_api_stop')
      results.append(event)
  require(len(started_ids) == stopped == 1 and ended, 'missing_or_extra_api_message')
  require(len(models) == 1, 'conflicting_api_models')
  require(len(results) == 1 and events[-1] is results[0], 'missing_or_extra_result')
  result = results[0]
  require(result.get('subtype') == 'success' and result.get('is_error') is False, 'unsuccessful_result')
  require(isinstance(result.get('result'), str) and result['result'].strip(), 'empty_answer')
  require(result['result'] == ''.join(answer_parts) == ''.join(raw_text), 'answer_not_bound_to_api_message')
  actual = next(iter(models))
  status = ('completed_model_unknown' if actual == 'unknown' else
            'model_mismatch' if expected and actual != expected else 'valid_smoke')
  return {'actual_model': actual, 'status': status,
          'reason': None if status == 'valid_smoke' else status,
          'model_evidence': 'raw_api.message_start.message.model' if actual != 'unknown' else 'missing',
          'answer': result['result'], 'client_version': init.get('claude_code_version')}


# These are violations of the three hard boundaries, not ordinary failed answers.
HARD_FAILURES = {'tools_or_mcp_enabled', 'tool_result_seen', 'subagent_output',
                 'workspace_changed'}


def record_version(binary, work, env, raw, err, timeout=15):
  """Record --version through the same interrupt-safe process-group cleanup."""
  try:
    code, failure = execute([*(binary if isinstance(binary, list) else [binary]), '--version'], work, env, b'', raw, err, timeout)
    require(failure != 'interrupted', 'interrupted')
    if failure:
      return {'client_version': 'unknown', 'version_exit_code': code,
              'version_status': failure}
    return {'client_version': raw.read_text(encoding='utf-8', errors='replace').strip() or 'unknown',
            'version_exit_code': code, 'version_status': 'recorded'}
  except (OSError, ValueError, subprocess.SubprocessError):
    return {'client_version': 'unknown', 'version_exit_code': None, 'version_status': 'unavailable'}


def check_hard_boundaries(work, raw, expected_input):
  require(not work.is_symlink() and work.is_dir(), 'workspace_changed')
  require(set(p.name for p in work.iterdir()) == {'input.txt'}, 'workspace_changed')
  source = work / 'input.txt'
  require(not source.is_symlink() and source.is_file(), 'workspace_changed')
  require(digest(source.read_bytes()) == expected_input, 'workspace_changed')
  # Oversize/failed streams are not exemptions from the hard boundaries. Scan
  # every available JSON line before applying ordinary parse/size/exit failures.
  if not raw.exists():
    return
  with raw.open(encoding='utf-8', errors='replace') as stream:
    for line in stream:
      try:
        event = parse_json(line)
      except (Stop, ValueError, RecursionError):
        continue
      pending = [event]
      while pending:
        value = pending.pop()
        if isinstance(value, dict):
          require(not value.get('parent_tool_use_id'), 'subagent_output')
          require(value.get('type') not in ('tool_use', 'server_tool_use', 'tool_result'), 'tool_result_seen')
          if value.get('type') == 'system' and value.get('subtype') == 'init':
            require(not value.get('tools') and not value.get('mcp_servers'), 'tools_or_mcp_enabled')
          pending.extend(value.values())
        elif isinstance(value, list):
          pending.extend(value)


def run(config_path, destination):
  task, payloads = inputs()
  config = read_json(config_path)
  validate_config(config, task)
  destination = outside_git(destination)
  require(not destination.exists(), 'run_destination_exists')
  binary = config.get('claude_executable') or (
    'claude' if config.get('command_prefix') else shutil.which('claude') or 'claude')
  destination.mkdir(mode=0o700)
  start = time.monotonic()
  maximum = len(task['schedule']) * (1 + task['limits']['failure_retries'])
  summary = {'batch_id': task['batch_id'], 'task_sha256': digest(TASK.read_bytes()),
             'status': 'stopped', 'stop_reason': None, 'failed_units': 0,
             'formal_denominator': False, 'receipts': [], 'units': [],
             'not_run': task['schedule'][:]}
  try:
    for index, pair in enumerate(task['schedule']):
      for attempt in range(1 + task['limits']['failure_retries']):
        aid = secrets.token_hex(16)
        work = destination / ('work-' + aid)
        work.mkdir(mode=0o700)
        home = destination / ('home-' + aid)
        home.mkdir(mode=0o700)
        payload = payloads[tuple(pair)]
        (work / 'input.txt').write_bytes(payload)
        receipt = {'attempt_id': aid, 'unit_index': index, 'attempt_number': attempt + 1,
                   'question_id': pair[0], 'group': pair[1],
                   'input_sha256': digest(payload), 'started_at': now(), 'finished_at': None,
                   'exit_code': None, 'actual_model': 'unknown', 'status': 'failed',
                   'formal_denominator': False, 'reason': 'not_completed',
                   'client_version': 'unknown', 'version_exit_code': None,
                   'version_status': 'not_run', 'requested_model': config['requested_model'],
                   'reasoning_configuration': config.get('reasoning_configuration', 'unknown'),
                   'actual_reasoning_configuration': 'unknown',
                   'preflight_records': {'batch_approval': 'not_required',
                                         'budget': budget_mode(config),
                                         'provider_hard_limit': 'not_required',
                                         'version_match': 'record_only'}}
        raw, err = destination / (aid + '.raw.jsonl'), destination / (aid + '.stderr')
        try:
          env = clean_env(work, home)
          receipt['preflight_records'].update({
            'provider_key_env': 'present' if env.get('ANTHROPIC_API_KEY') else 'missing',
            'provider_url_env': 'present' if env.get('ANTHROPIC_BASE_URL') else 'missing'})
          argv = launcher(binary, config, work, home)
          version_raw = destination / (aid + '.version.stdout')
          version_err = destination / (aid + '.version.stderr')
          remaining = task['limits']['batch_seconds'] - (time.monotonic() - start)
          require(remaining > 0, 'batch_timeout')
          receipt.update(record_version(argv, work, env, version_raw, version_err, min(15, remaining)))
          check_hard_boundaries(work, version_raw, receipt['input_sha256'])
          remaining = task['limits']['batch_seconds'] - (time.monotonic() - start)
          require(remaining > 0, 'batch_timeout')
          code, failure = execute(command(argv, config, str(uuid.uuid4()), maximum), work, env, payload,
                                  raw, err, min(remaining, task['limits']['call_seconds']))
          receipt['exit_code'] = code
          check_hard_boundaries(work, raw, receipt['input_sha256'])
          require(failure is None, failure or 'execution_failed')
          require(code == 0, 'nonzero_exit')
          expected = config.get('expected_api_model')
          info = inspect_stream(raw, expected if isinstance(expected, str) else None,
                                task['limits']['max_raw_bytes'])
          # The stream's version is a separate observation, not a compatibility gate.
          receipt['stream_client_version'] = info.pop('client_version')
          receipt.update(info)
        except (Stop, OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError,
                KeyboardInterrupt, SystemExit) as exc:
          receipt['reason'] = (str(exc) if isinstance(exc, Stop) else
                               'interrupted' if isinstance(exc, (KeyboardInterrupt, SystemExit)) else
                               'execution_or_parse_error')
        finally:
          receipt['finished_at'] = now()
          name = aid + '.receipt.json'
          write_json(destination / name, receipt)
          summary['receipts'].append({'name': name, 'sha256': digest((destination / name).read_bytes())})
        reason = receipt['reason']
        if reason in HARD_FAILURES or reason in ('interrupted', 'batch_timeout', 'process_cleanup_failed'):
          summary['stop_reason'] = reason
          break
        if receipt['status'] in ('valid_smoke', 'completed_model_unknown') or attempt == task['limits']['failure_retries']:
          break
      # Count a scheduled question/group once, not each attempt. Unknown model is
      # a completed but ineligible answer, not an execution failure.
      failed = receipt['status'] not in ('valid_smoke', 'completed_model_unknown')
      summary['failed_units'] += int(failed)
      summary['units'].append({'unit_index': index, 'final_attempt_id': receipt['attempt_id'],
                               'status': receipt['status']})
      summary['not_run'] = task['schedule'][index + 1:]
      if summary['failed_units'] > len(task['schedule']) / 2 and not summary['stop_reason']:
        summary['stop_reason'] = 'more_than_half_failed'
      if summary['stop_reason']:
        break
    else:
      summary['status'] = ('smoke_completed_not_graded' if all(
        unit['status'] == 'valid_smoke' for unit in summary['units']) else 'batch_completed_with_exclusions')
  finally:
    write_json(destination / 'summary.private.json', summary)
  return {'status': summary['status'], 'recorded_attempts': len(summary['receipts']),
          'failed_units': summary['failed_units'], 'not_run': len(summary['not_run'])}


def safe_text(text):
  require(not SENSITIVE.search(text), 'export_sensitive_text_review_required')
  for key in ('ANTHROPIC_API_KEY', 'ANTHROPIC_BASE_URL'):
    value = os.environ.get(key)
    require(not value or value not in text, 'export_environment_value_detected')
  return text


def export(run_root, destination):
  task, payloads = inputs()
  run_root = outside_git(run_root)
  summary = read_json(run_root / 'summary.private.json')
  require(summary['task_sha256'] == digest(TASK.read_bytes()), 'wrong_run_task')
  destination = outside_git(destination)
  require(not destination.exists(), 'export_destination_exists')
  receipts, blind, mapping = [], [], []
  qtext = (REPO / 'experiments/absorption/questions.md').read_text(encoding='utf-8')
  keytext = (REPO / 'experiments/absorption/answer-key.md').read_text(encoding='utf-8')
  for entry in summary['receipts']:
    require(re.fullmatch(r'[a-f0-9]{32}\.receipt\.json', entry['name']), 'invalid_receipt_name')
    path = run_root / entry['name']
    require(not path.is_symlink() and digest(path.read_bytes()) == entry['sha256'], 'receipt_changed')
    receipt = read_json(path)
    pair = (receipt['question_id'], receipt['group'])
    require(pair in payloads and receipt['input_sha256'] == digest(payloads[pair]), 'receipt_input_mismatch')
    public = {k: receipt[k] for k in ('attempt_id', 'question_id', 'group', 'input_sha256',
              'started_at', 'finished_at', 'exit_code', 'actual_model', 'status', 'reason', 'formal_denominator',
              'requested_model', 'reasoning_configuration', 'actual_reasoning_configuration',
              'unit_index', 'attempt_number', 'client_version', 'version_exit_code', 'version_status',
              'preflight_records')}
    if 'answer' in receipt:
      public['answer'] = receipt['answer']
      public['model_evidence'] = receipt['model_evidence']
    if receipt['status'] in ('valid_smoke', 'completed_model_unknown'):
      bid = secrets.token_hex(16)
      blind.append({'anonymous_id': bid, 'question': section(qtext, pair[0]),
                    'answer': receipt['answer'], 'rubric': section(keytext, pair[0])})
      mapping.append({'anonymous_id': bid, 'attempt_id': receipt['attempt_id'],
                      'question_id': pair[0], 'group': pair[1]})
    safe_text(json.dumps(public, ensure_ascii=False))
    receipts.append(public)
  require(len({r['attempt_id'] for r in receipts}) == len(receipts), 'duplicate_receipt')
  safe_text(json.dumps(blind, ensure_ascii=False))
  secrets.SystemRandom().shuffle(blind)
  destination.mkdir(mode=0o700)
  write_json(destination / 'receipts.json', receipts)
  write_json(destination / 'blind.json', {'limitation': 'Only labels are hidden; answer content can reveal the condition.',
                                      'judging_rules': '以下是可接受答案的约束' + keytext.split('以下是可接受答案的约束', 1)[1].split('### ', 1)[0].strip(),
                                      'answers': blind})
  write_json(destination / 'manifest.json', {
    'batch_id': task['batch_id'], 'status': summary['status'], 'formal_denominator': False,
    'not_run': summary['not_run'], 'failed_units': summary['failed_units'],
    'stop_reason': summary['stop_reason'], 'files': {name: digest((destination / name).read_bytes())
                                          for name in ('receipts.json', 'blind.json')}})
  # The mapping never shares the export directory. Random name supports re-export.
  write_json(run_root / ('blind-map-' + secrets.token_hex(8) + '.private.json'), mapping)
  scan = subprocess.run([sys.executable, str(REPO / 'scripts/check_public.py'), '--root', str(destination)],
                        capture_output=True, timeout=60)
  require(scan.returncode == 0, 'export_public_scan_failed_do_not_return')
  return {'status': 'export_scanned_requires_manual_review', 'receipts': len(receipts)}



def controlled_run(config, destination):
  def terminate(_signum, _frame):
    raise KeyboardInterrupt()
  previous = signal.signal(signal.SIGTERM, terminate)
  try:
    return run(config, destination)
  finally:
    signal.signal(signal.SIGTERM, previous)


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  sub = parser.add_subparsers(dest='action', required=True)
  sub.add_parser('prepare').add_argument('destination', type=Path)
  live = sub.add_parser('run')
  live.add_argument('--local-config', type=Path, required=True)
  live.add_argument('destination', type=Path)
  out = sub.add_parser('export')
  out.add_argument('run_root', type=Path)
  out.add_argument('destination', type=Path)
  args = parser.parse_args()
  try:
    if args.action == 'prepare':
      result = prepare(args.destination)
    elif args.action == 'run':
      result = controlled_run(args.local_config, args.destination)
    else:
      result = export(args.run_root, args.destination)
    print(json.dumps(result))
    return 0 if result['status'] != 'stopped' else 1
  except (Stop, OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError, KeyboardInterrupt) as exc:
    print(json.dumps({'status': 'blocked', 'reason': str(exc) if isinstance(exc, Stop) else ('interrupted' if isinstance(exc, KeyboardInterrupt) else 'input_or_execution_error')}))
    return 2


if __name__ == '__main__':
  sys.exit(main())
