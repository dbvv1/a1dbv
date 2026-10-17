#!/usr/bin/env python3
"""Independently check published Catalog Compare fixtures and generated reports.

Usage: python3 scripts/research/verify-catalog-compare.py CHECKOUT RESULTS
Run the upstream core runner first. This reads synthetic fixtures only; no network.
"""
import csv
import hashlib
import json
import sys
from decimal import Decimal, InvalidOperation, localcontext
from pathlib import Path


def finite_decimal(value):
  try:
    number = Decimal(value)
  except (InvalidOperation, TypeError, ValueError) as error:
    raise ValueError(("invalid numeric value", value)) from error
  if not number.is_finite():
    raise ValueError(("non-finite numeric value", value))
  return number


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
    expected_matches = [row for row in case["expected"]["rows"]
                        if row["status"] in ("changed", "unchanged")]
    # Authored expectations determine mandatory checks, regardless of report status.
    for expected in expected_matches:
      actual = [row for row in rows if row["key"] == expected["sku"]]
      if len(actual) != 1:
        raise ValueError((case["id"], expected["sku"]))
      row = actual[0]
      if row["status"] != expected["status"]:
        raise ValueError((case["id"], row["key"], "status"))
      for field, key in (("before_numeric", "beforeNumber"), ("after_numeric", "afterNumber"), ("delta", "delta")):
        if field in expected:
          if finite_decimal(str(expected[field])) != finite_decimal(row[key]):
            raise ValueError((case["id"], key))
          expected_numeric_fields += 1
    # Expectations may be partial; also check additional reported matched rows.
    for row in rows:
      if row["status"] not in ("changed", "unchanged"):
        continue
      values = {}
      for side in ("before", "after"):
        source = inputs[side]
        column = source[0].index(case["options"][side + "_value_column"])
        if (not isinstance(row[side], list) or len(row[side]) != 1
            or not isinstance(row[side][0], dict)):
          raise ValueError((case["id"], row["key"], side))
        record = row[side][0].get("record")
        if type(record) is not int or not 2 <= record <= len(source):
          raise ValueError((case["id"], row["key"], side))
        raw = source[record - 1][column].strip()
        if case["options"][side + "_decimal"] == "comma":
          raw = raw.replace(",", ".")
        values[side] = finite_decimal(raw)
        if values[side] != finite_decimal(row[side + "Number"]):
          raise ValueError((case["id"], row["key"], side))
      if values["after"] - values["before"] != finite_decimal(row["delta"]):
        raise ValueError((case["id"], row["key"], "delta"))
      if (values["after"] == values["before"]) != (row["status"] == "unchanged"):
        raise ValueError((case["id"], row["key"], "status"))
      matched_rows += 1
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
