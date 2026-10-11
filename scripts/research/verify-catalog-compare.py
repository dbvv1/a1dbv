#!/usr/bin/env python3
"""Independently check published Catalog Compare fixtures and generated reports.

Usage: python3 scripts/research/verify-catalog-compare.py CHECKOUT RESULTS
Run the upstream core runner first. This reads synthetic fixtures only; no network.
"""
import csv
import hashlib
import json
import sys
from decimal import Decimal, localcontext
from pathlib import Path

checkout, results = map(Path, sys.argv[1:3])
fixtures = checkout / "tests/acceptance/fixtures"
manifest = json.loads((fixtures / "expected-results.json").read_text())
matched_rows = 0
expected_numeric_fields = 0
with localcontext() as context:
  context.prec = 1000
  for case in manifest["comparison_cases"]:
    rows = json.loads((results / "reports" / (case["id"] + ".json")).read_text())["rows"]
    inputs = {}
    for side in ("before", "after"):
      name = case[side]
      with (fixtures / name).open(encoding="utf-8-sig", newline="") as handle:
        inputs[side] = list(csv.reader(handle, delimiter=manifest["files"][name]["delimiter"], strict=True))
    for row in rows:
      if row["status"] not in ("changed", "unchanged"):
        continue
      values = {}
      for side in ("before", "after"):
        source = inputs[side]
        column = source[0].index(case["options"][side + "_value_column"])
        if len(row[side]) != 1:
          raise ValueError((case["id"], row["key"], side))
        raw = source[row[side][0]["record"] - 1][column].strip()
        if case["options"][side + "_decimal"] == "comma":
          raw = raw.replace(",", ".")
        values[side] = Decimal(raw)
        if values[side] != Decimal(row[side + "Number"]):
          raise ValueError((case["id"], row["key"], side))
      if values["after"] - values["before"] != Decimal(row["delta"]):
        raise ValueError((case["id"], row["key"], "delta"))
      if (values["after"] == values["before"]) != (row["status"] == "unchanged"):
        raise ValueError((case["id"], row["key"], "status"))
      matched_rows += 1
    for expected in case["expected"]["rows"]:
      if expected["status"] not in ("changed", "unchanged"):
        continue  # Unmatched rows do not promise normalized Number fields.
      actual = [row for row in rows if row["key"] == expected["sku"]]
      if len(actual) != 1:
        raise ValueError((case["id"], expected["sku"]))
      for field, key in (("before_numeric", "beforeNumber"), ("after_numeric", "afterNumber"), ("delta", "delta")):
        if field in expected:
          if Decimal(str(expected[field])) != Decimal(actual[0][key]):
            raise ValueError((case["id"], key))
          expected_numeric_fields += 1
receipt = json.loads((checkout / "docs/browser-verification.json").read_text())
print(json.dumps({
  "matched_rows_checked_against_source_csv": matched_rows,
  "authored_matched_numeric_fields_checked": expected_numeric_fields,
  "browser_receipt_source_hash_matches": {
    name: hashlib.sha256((checkout / "dist" / name).read_bytes()).hexdigest() == value
    for name, value in receipt["source_sha256"].items()
  },
  "scope": "Synthetic matched numeric rows only; no UI, browser, model or deployment test."
}, indent=2))
