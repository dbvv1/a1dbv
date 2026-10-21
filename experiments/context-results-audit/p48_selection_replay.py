"""原创、标准库、确定性人工账本回放；不运行模型，不是评估框架或安全沙箱。

三个路径是假设的独立历史，不是同一次运行的先后阶段。输入分数为人工
聚合值，无样本推断能力。B 的投影是代码职责边界，不是保密/进程隔离。
"""
import argparse
import json
import math
from decimal import Decimal
from pathlib import Path


def number(value, label):
  if isinstance(value, bool) or not isinstance(value, (int, float)):
    raise ValueError(f'{label}: missing or nonnumeric value')
  if not math.isfinite(value):
    raise ValueError(f'{label}: nonfinite value')
  return value


def stable_ids(values, label):
  if not values or any(not isinstance(x, str) or not x.strip() for x in values):
    raise ValueError(f'{label}: require nonempty string IDs')
  if len(set(values)) != len(values):
    raise ValueError(f'{label}: duplicate IDs')


def validate(ledger):
  if not isinstance(ledger, dict):
    raise ValueError('ledger must be a JSON object')
  if ledger.get('evidence') != 'synthetic_not_model_result':
    raise ValueError('require synthetic_not_model_result')
  if ledger.get('changed_factor') != 'one_skill_description':
    raise ValueError('only one_skill_description is supported')
  rows = ledger['candidates']
  ids = [row['id'] for row in rows]
  stable_ids(ids, 'candidates')
  if ledger['baseline_id'] != ids[0]:
    raise ValueError('baseline must be first in preregistered round order')
  for row in rows:
    if not isinstance(row.get('description'), str) or not row['description'].strip():
      raise ValueError('missing description')
  splits = ledger['split_ids']
  all_ids = []
  for split in ('train', 'val', 'test'):
    stable_ids(splits[split], split)
    all_ids.extend(splits[split])
  stable_ids(all_ids, 'disjoint splits')
  policy = ledger['preregistered']
  if policy['goal'] not in ('maximize', 'minimize'):
    raise ValueError('unknown goal')
  if policy['tie_break'] != 'earliest_round':
    raise ValueError('only preregistered earliest_round is supported')
  if number(policy['minimum_improvement'], 'minimum_improvement') <= 0:
    raise ValueError('minimum_improvement must be positive')
  if ledger['input_unit'] != 'synthetic_effort_units_not_usd_or_model_cost':
    raise ValueError('require explicitly synthetic input units')
  for row in rows:
    for field in ('proposal', 'evaluation', 'human_review'):
      if number(row['synthetic_inputs'].get(field), field) < 0:
        raise ValueError('negative synthetic inputs')
  return rows, policy


def selection_projection(rows, split):
  """只拷贝ID及指定选择分数；B调用时split固定为val。"""
  return [{'id': r['id'], 'score': number(r.get(split), f"{r['id']}.{split}")}
          for r in rows]


def select(projection, goal):
  """严格改善才换人，相等保留预注册较早轮；不接收完整候选账。"""
  if goal not in ('maximize', 'minimize'):
    raise ValueError('unknown goal')
  stable_ids([r['id'] for r in projection], 'selection')
  winner = None
  trace = []
  for row in projection:
    score = number(row['score'], 'selection score')
    if winner is None or (score > winner['score'] if goal == 'maximize'
                          else score < winner['score']):
      winner = row
    trace.append({'considered_id': row['id'], 'score': score,
                  'winner_id': winner['id']})
  return winner['id'], trace


def final_pair(rows, baseline_id, frozen_id, policy, split='test'):
  """仅冻结pair可进终评；这里不接受任何重选请求。"""
  by_id = {row['id']: row for row in rows}
  scores = {cid: number(by_id[cid].get(split), f'{cid}.{split}')
            for cid in dict.fromkeys((baseline_id, frozen_id))}
  # Decimal strings avoid binary subtraction changing an exact threshold tie.
  delta = Decimal(str(scores[frozen_id])) - Decimal(str(scores[baseline_id]))
  improvement = delta if policy['goal'] == 'maximize' else -delta
  return {'winner_id': frozen_id, 'scores': scores,
          'goal_adjusted_improvement': number(float(improvement), 'improvement'),
          'decision': 'accept' if improvement >= Decimal(str(policy['minimum_improvement'])) else 'reject'}


def independent_path(rows, baseline_id, policy):
  # Freeze ID before any test read. Nonselected test scores never enter this path.
  projection = selection_projection(rows, 'val')
  frozen_id, trace = select(projection, policy['goal'])
  result = final_pair(rows, baseline_id, frozen_id, policy)
  return {'selection_data': 'val', 'selection_trace': trace,
          'frozen_winner_id': frozen_id, 'final_data': 'test',
          'final': result, 'reselection_after_test': False}


def replay(ledger):
  rows, policy = validate(ledger)
  baseline = ledger['baseline_id']
  # B is replayed first to keep its boundary visible even in this single process.
  b = independent_path(rows, baseline, policy)
  a_winner, a_trace = select(selection_projection(rows, 'test'), policy['goal'])
  revision = ledger['post_final_revision']
  ids = [r['id'] for r in rows]
  if revision['parent_id'] not in ids or revision['candidate_id'] not in ids:
    raise ValueError('unknown revision candidate')
  if ids.index(revision['parent_id']) >= ids.index(revision['candidate_id']):
    raise ValueError('revision must follow its parent')
  if revision.get('fresh_eval') is not None:
    raise ValueError('this narrow replay only supports absent fresh_eval; evaluate separately')
  totals = {field: sum(r['synthetic_inputs'][field] for r in rows)
            for field in ('proposal', 'evaluation', 'human_review')}
  for field, total in totals.items():
    number(total, f'total.{field}')
  return {
    'evidence': ledger['evidence'], 'skill_id': ledger['skill_id'],
    'scope': 'counterfactual_data_roles_only_not_model_effectiveness',
    'candidate_count': len(rows), 'candidate_ids': ids,
    'preregistered': policy, 'split_ids': ledger['split_ids'],
    'proposal_data': {'A': 'train', 'B': 'train', 'C': 'train_and_old_test'},
    'inputs': {'unit': ledger['input_unit'], 'all_candidate_totals': totals,
               'meaning': 'whole_synthetic_ledger_not_per_path_actual_cost'},
    'A': {'selection_data': 'test', 'selection_trace': a_trace,
          'winner_id': a_winner, 'decision': 'selection_only',
          'independent_final_evaluation': False},
    'B': b,
    'C': {'parent_id': revision['parent_id'], 'revised_id': revision['candidate_id'],
          'description_changed_after': 'old_test_feedback',
          'old_test_role': 'development_evidence',
          'old_test_scores': {r['id']: r['test'] for r in rows},
          'fresh_eval': None, 'decision': 'defer',
          'reason': 'revised_description_requires_new_independent_final_evaluation'},
  }


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('fixture', nargs='?', type=Path,
                      default=Path(__file__).with_name('p48-selection-fixture.json'))
  args = parser.parse_args()
  try:
    result = replay(json.loads(args.fixture.read_text(encoding='utf-8')))
  except (ValueError, KeyError, TypeError, OSError) as exc:
    parser.exit(2, f'invalid ledger: {exc}\n')
  print(json.dumps(result, ensure_ascii=False, allow_nan=False, separators=(',', ':')))


if __name__ == '__main__':
  main()
