"""Read-only check of captured Sortable core arrays, not browser provenance or full QA.
Exit 0: sampled core checks pass; 1: core counterexample; 2: unusable input.
"""
import json
import sys

IDS = ['alpha', 'bravo', 'charlie']
FINAL = ['bravo', 'charlie', 'alpha']
STAGES = ['before', 'duringDrag', 'beforeRelease', 'afterEnd']


def unique_keys(pairs):
    obj = {}
    for key, value in pairs:
        if key in obj:
            raise ValueError('duplicate JSON key')
        obj[key] = value
    return obj


def check(data):
    runs = data['runs']
    if not isinstance(runs, list) or len(runs) != 3:
        raise ValueError('need three captured runs')
    failures = []
    for number, run in enumerate(runs, 1):
        if type(run['run']) is not int or run['run'] != number:
            raise ValueError('run numbering mismatch')
        previous = []
        for stage in STAGES:
            snapshot = run[stage]
            events = snapshot['events']
            if not isinstance(events, list) or not events or events[:len(previous)] != previous:
                raise ValueError('missing or inconsistent cumulative event capture')
            for event in events:
                if not isinstance(event, dict) or event.get('event') not in ('initial', 'start', 'sort', 'end'):
                    raise ValueError('unsupported event')
                if not isinstance(event.get('array'), list) or not all(isinstance(x, str) for x in event['array']):
                    raise ValueError('invalid event array')
            dom = snapshot['domOrder']
            if not isinstance(dom, list) or not all(isinstance(x, str) for x in dom):
                raise ValueError('invalid DOM capture')
            previous = events
        events = run['afterEnd']['events']
        names = [e['event'] for e in events]
        if (names[:2] != ['initial', 'start'] or names[-1] != 'end'
                or len(names) < 4 or any(n != 'sort' for n in names[2:-1])):
            raise ValueError('incomplete or unsupported event sequence')
        if [e['event'] for e in run['before']['events']] != ['initial']:
            raise ValueError('invalid initial snapshot')
        if 'start' not in [e['event'] for e in run['duringDrag']['events']]:
            raise ValueError('missing captured start')
        for index, event in enumerate(events):
            if sorted(event['array']) != sorted(IDS):
                failures.append(f'run {number} event {index} {event["event"]}: IDs not exactly once')
        for label, actual, expected in [
            ('initial', events[0]['array'], IDS), ('start', events[1]['array'], IDS),
            ('end', events[-1]['array'], FINAL), ('last sort', events[-2]['array'], FINAL),
            ('initial DOM', run['before']['domOrder'], IDS),
            ('final DOM', run['afterEnd']['domOrder'], FINAL),
        ]:
            if actual != expected:
                failures.append(f'run {number} {label}: order differs')
    return failures


if __name__ == '__main__':
    try:
        if len(sys.argv) != 2:
            raise ValueError('usage: check_core.py captured.json')
        with open(sys.argv[1], encoding='utf-8') as source:
            failures = check(json.load(source, object_pairs_hook=unique_keys))
        print(json.dumps({'scope': 'sampled core arrays only', 'status': 'fail' if failures else 'pass', 'failures': failures}))
        sys.exit(1 if failures else 0)
    except (OSError, ValueError, KeyError, TypeError, IndexError) as error:
        print(json.dumps({'status': 'invalid', 'reason': str(error)}))
        sys.exit(2)
