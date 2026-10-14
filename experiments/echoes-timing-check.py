#!/usr/bin/env python3
"""Recompute published Echoes of AI Task 2 timing aggregates, without dependencies.

This is an independent arithmetic check, not a model run or causal reanalysis.
Source repository: https://github.com/codescene-research/echoes-of-ai-emse-2025
Fixed commit: 472ebca6d20af5d6de4264897ba98220ce521fd0
Data: data/task2_preprocessed.csv
Git blob SHA-1: 13c0c42c21f81c6520ac3909f14d3e21610d64b9
CSV SHA256: 01fd71607bdd8262b241d612160f7ea7aa0760ac4cbc2d5b05aab89730a02077
Cross-checked raw data: data/task2_raw.csv
Git blob SHA-1: 1ed6b90bc6746a894e0586cd5683a09a449d8f88
Method: data/preprocess_data.ipynb, blob 9230385ea21b31a22dffbcd74b565214ce44ea1c
Grouping: frequentist/completion_time.ipynb, blob f1d77efc4fda590fdeb4b2214b446e3d51acb170

Fixture projection (in original CSV record order): keep treatment exactly ai/human;
select treatment, measured_time, estimated_time, clean_time; rename as below.
No IDs, demographics, free text, or exit-survey fields are retained.
The original preprocessed file has 1001 CSV records: 75 eligible, 925 fully blank,
and one without ID/treatment but with estimated_time=clean_time=33. The latter is
excluded by the author's group filter. It is not an additional participant.
Raw and processed eligible IDs/timing values were checked for agreement before
projection. The fixture cannot reproduce that identity check or assignment flows.

Time fields are SECONDS (despite the upstream data README saying minutes).
Author rule: use estimated_time when present; otherwise measured_time <= 57600;
otherwise exclude timing. Divide by 60 only for output. Timing-source subgroups
are descriptive sensitivity checks, not randomized groups or causal estimates.
No completion-rate denominator or predecessor-equal-weight estimate is produced.

Run: python3 experiments/echoes-timing-check.py
Negative/positive checks: python3 experiments/echoes-timing-check.py --self-test
The fixed embedded fixture is the only input. Self-tests reject missing or
malformed fixture data; failures exit nonzero. No network access.

The embedded numerical projection is derived from the MIT-licensed package.
Upstream MIT license follows in full; keep it when redistributing this fixture.
"""
# MIT License
#
# Copyright (c) 2025 CodeScene Research
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


import argparse
import csv
import hashlib
import io
import json
import math
from statistics import median
import sys

FIELDS = ['group', 'measured_seconds', 'estimated_seconds', 'clean_seconds']
EXPECTED_GROUPS = {'ai': 40, 'human': 35}
FIXTURE_SHA256 = 'f1535b8884281dc6ba6be315d2c38a8ead2c49d829430de01696976f3559df42'
FIXTURE = """group,measured_seconds,estimated_seconds,clean_seconds
ai,4773.0,,4773.0
ai,15671.0,,15671.0
ai,6327.0,,6327.0
ai,391708.0,5400.0,5400.0
ai,94967.0,19800.0,19800.0
ai,9746.0,9746.0,9746.0
ai,93246.0,16200.0,16200.0
ai,88591.0,14400.0,14400.0
ai,8057.0,,8057.0
ai,9269.0,,9269.0
ai,2087753.0,46800.0,46800.0
ai,9493.0,,9493.0
ai,25989.0,9000.0,9000.0
ai,13893.0,,13893.0
ai,345239.0,,
ai,3083.0,,3083.0
ai,176969.0,16200.0,16200.0
ai,14018.0,12600.0,12600.0
ai,15159.0,15159.0,15159.0
ai,15575.0,5400.0,5400.0
ai,5679.0,,5679.0
ai,15301.0,,15301.0
ai,2283.0,,2283.0
ai,5552.0,1800.0,1800.0
ai,3633.0,,3633.0
ai,6307.0,,6307.0
ai,254191.0,10800.0,10800.0
ai,7266.0,,7266.0
ai,2328917.0,7200.0,7200.0
ai,95419.0,7200.0,7200.0
ai,3525.0,,3525.0
ai,3347.0,,3347.0
ai,8164.0,,8164.0
ai,8031.0,,8031.0
ai,5503.0,,5503.0
ai,635784.0,23400.0,23400.0
ai,9684.0,,9684.0
ai,26709.0,10800.0,10800.0
human,5872.0,,5872.0
human,15663.0,,15663.0
human,12750.0,10800.0,10800.0
human,4768.0,,4768.0
human,90659.0,32400.0,32400.0
human,15779.0,15779.0,15779.0
human,6743.0,,6743.0
human,102986.0,10800.0,10800.0
human,5229.0,,5229.0
ai,5160.0,,5160.0
ai,174173.0,25200.0,25200.0
human,7085.0,,7085.0
human,1853771.0,12600.0,12600.0
human,601178.0,3600.0,3600.0
human,3319.0,,3319.0
human,54386.0,,54386.0
human,5297.0,,5297.0
human,2887.0,,2887.0
human,8471.0,,8471.0
human,1166364.0,43200.0,43200.0
human,17044.0,9000.0,9000.0
human,7745.0,,7745.0
human,2971.0,,2971.0
human,3160.0,,3160.0
human,102541.0,25200.0,25200.0
human,14569.0,14400.0,14400.0
human,2218.0,,2218.0
human,34324.0,27000.0,27000.0
human,10358.0,,10358.0
human,9110.0,9110.0,9110.0
human,13893.0,,13893.0
human,92064.0,21600.0,21600.0
human,12002.0,,12002.0
human,2124109.0,,
human,16006.0,12600.0,12600.0
human,906861.0,14400.0,14400.0
human,870038.0,,
"""


def number(value, required=False):
    if value == '':
        if required:
            raise ValueError('Missing required measured time')
        return None
    try:
        result = float(value)
    except (TypeError, ValueError) as exc:
        raise ValueError('Invalid numeric time') from exc
    if not math.isfinite(result) or result < 0:
        raise ValueError('Time must be finite and nonnegative')
    return result


def read_fixture(text):
    reader = csv.DictReader(io.StringIO(text), strict=True)
    if reader.fieldnames != FIELDS:
        raise ValueError('Missing or unexpected fixture columns')
    result = []
    counts = dict.fromkeys(EXPECTED_GROUPS, 0)
    for row in reader:
        if None in row or any(value is None for value in row.values()):
            raise ValueError('Malformed fixture row')
        group = row['group']
        if group not in counts:
            raise ValueError('Missing or unknown treatment group')
        measured = number(row['measured_seconds'], required=True)
        estimated = number(row['estimated_seconds'])
        supplied = number(row['clean_seconds'])
        calculated = (estimated if estimated is not None else
                      measured if measured <= 57600 else None)
        if calculated != supplied:
            raise ValueError('Published clean time disagrees with preprocessing rule')
        counts[group] += 1
        source = ('estimated' if estimated is not None else
                  'measured' if calculated is not None else 'excluded')
        result.append((group, source, calculated))
    if counts != EXPECTED_GROUPS:
        raise ValueError('Fixture must contain exactly 40 ai and 35 human records')
    return result


def summarize(rows):
    output = {}
    for group, expected in EXPECTED_GROUPS.items():
        members = [r for r in rows if r[0] == group]
        timings = [r[2] / 60 for r in members if r[2] is not None]
        sources = {}
        for source in ('measured', 'estimated', 'excluded'):
            selected = [r for r in members if r[1] == source]
            values = [r[2] / 60 for r in selected if r[2] is not None]
            sources[source] = {'n': len(selected),
                               'median_minutes': median(values) if values else None}
        output[group] = {'valid_submissions': expected, 'valid_timings': len(timings),
                         'median_minutes': median(timings), 'by_timing_source': sources}
    return output


def self_test():
    passed = 0
    def check(condition, message):
        nonlocal passed
        if not condition:
            raise ValueError('Self-test failed: ' + message)
        passed += 1
    def rejects(text):
        nonlocal passed
        try:
            read_fixture(text)
        except (ValueError, csv.Error):
            passed += 1
            return
        raise ValueError('Self-test failed: malformed fixture accepted')
    rows = read_fixture(FIXTURE)
    result = summarize(rows)
    check(len(rows) == 75, 'valid row count')
    check(result['ai']['valid_timings'] == 39 and result['human']['valid_timings'] == 33,
          'timing denominators')
    check(sum(r[1] == 'estimated' for r in rows) == 33, 'estimated count')
    check(sum(r[1] == 'measured' for r in rows) == 39, 'measured count')
    check(sum(r[1] == 'excluded' for r in rows) == 3, 'missing clean time retained')
    rejects('')
    rejects('\n'.join(FIXTURE.splitlines()[:-1]) + '\n')
    rejects(FIXTURE.replace('ai,', 'unknown,', 1))
    parsed = list(csv.reader(io.StringIO(FIXTURE)))
    for column, value in ((1, ''), (1, 'NaN'), (1, '-1'), (2, 'inf'), (3, '1')):
        changed = [list(r) for r in parsed]
        changed[1][column] = value
        out = io.StringIO(newline='')
        csv.writer(out, lineterminator='\n').writerows(changed)
        rejects(out.getvalue())
    rejects(FIXTURE + 'ai,1,2\n')
    rejects(FIXTURE.replace('clean_seconds', 'other_column', 1))
    return {'self_test_checks_passed': passed}


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    try:
        if hashlib.sha256(FIXTURE.encode()).hexdigest() != FIXTURE_SHA256:
            raise ValueError('Embedded fixture digest mismatch')
        if args.self_test:
            output = self_test()
        else:
            text = FIXTURE
            rows = read_fixture(text)
            output = {'source_commit': '472ebca6d20af5d6de4264897ba98220ce521fd0',
                      'fixture_origin': 'embedded_public_data_projection',
                      'fixture_sha256': hashlib.sha256(text.encode()).hexdigest(),
                      'scope': 'Descriptive timing aggregates among valid submissions; not causal effects',
                      'groups': summarize(rows)}
        print(json.dumps(output, ensure_ascii=False, indent=2, allow_nan=False))
        return 0
    except (OSError, UnicodeError, ValueError, csv.Error) as exc:
        print('ERROR: ' + str(exc), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
