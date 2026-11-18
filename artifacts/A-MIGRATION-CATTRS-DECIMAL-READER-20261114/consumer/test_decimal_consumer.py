"""Real-consumer acceptance for cattrs PR #822 (Decimal in JSON/PyYAML preconf).

Consumer shape comes from python-attrs/cattrs#761: ``attrs`` class
``Order(amount: Decimal)`` must round-trip through the stdlib-json and PyYAML
preconfigured converters while keeping the Decimal precision (no float in the
path). Only synthetic values are used.

Two ways to run this file:

* ``python test_decimal_consumer.py --json OUT.json --label NAME`` collects a
  machine-readable observation record (errors included) and exits 0 when the
  record was written.
* ``python -m pytest test_decimal_consumer.py`` asserts the expected final
  behavior. On a build without the PR these assertions fail; that failure is
  the baseline evidence, not a reason to weaken them.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import platform
import sys
from decimal import Decimal
from typing import Any

import cattrs
import yaml
from attrs import define
from cattrs.preconf.json import make_converter as json_make_converter
from cattrs.preconf.pyyaml import make_converter as pyyaml_make_converter

# Values required by the task: two ordinary values and one with at least 30
# significant digits. "1.10" additionally pins the exponent (trailing zero).
VALUES = [
    Decimal("19.99"),
    Decimal("0.1"),
    Decimal("1234567890.123456789012345678901234567890"),
    Decimal("1.10"),
]
HIGH_PRECISION = VALUES[2]


@define
class Order:
    amount: Decimal


@define
class Mixed:
    id: int
    name: str
    amount: Decimal
    note: str | None = None


@define
class PlainOrder:
    id: int
    name: str
    note: str | None = None


@define
class Stamp:
    when: dt.datetime


def _json_converter() -> Any:
    return json_make_converter()


def _yaml_converter() -> Any:
    return pyyaml_make_converter()


def _error(exc: BaseException) -> dict[str, Any]:
    info: dict[str, Any] = {
        "error_type": f"{type(exc).__module__}.{type(exc).__name__}",
        "error_message": str(exc)[:300],
    }
    sub_exceptions = getattr(exc, "exceptions", None)
    if sub_exceptions:
        info["sub_exceptions"] = [
            f"{type(sub).__module__}.{type(sub).__name__}: {sub}"
            for sub in sub_exceptions
        ]
    return info


def _record(
    cases: list[dict[str, Any]],
    group: str,
    serializer: str,
    case: str,
    fn: Any,
) -> None:
    """Run ``fn`` and append its observation dict to ``cases``."""
    entry: dict[str, Any] = {
        "group": group,
        "serializer": serializer,
        "case": case,
    }
    try:
        entry.update(fn())
        entry["status"] = "ok"
    except BaseException as exc:  # noqa: BLE001 - baseline failures are data
        entry.update(_error(exc))
        entry["status"] = "error"
    cases.append(entry)


def _doc_amount(serializer: str, raw: str) -> Any:
    return (json.loads(raw) if serializer == "json" else yaml.safe_load(raw))[
        "amount"
    ]


def _roundtrip_case(serializer: str, value: Decimal) -> dict[str, Any]:
    converter = _json_converter() if serializer == "json" else _yaml_converter()
    order = Order(value)
    raw = converter.dumps(order)
    doc_amount = _doc_amount(serializer, raw)
    back = converter.loads(raw, Order)

    return {
        "input_kind": "string",
        "value_repr": repr(value),
        "value_significant_digits": len(value.as_tuple().digits),
        "value_exponent": value.as_tuple().exponent,
        "dumps_raw": raw,
        "serialized_amount_repr": repr(doc_amount),
        "serialized_amount_type": type(doc_amount).__name__,
        "serialized_is_str": isinstance(doc_amount, str),
        "serialized_equals_source_str": isinstance(doc_amount, str)
        and doc_amount == str(value),
        "loads_type": type(back.amount).__name__,
        "loads_is_decimal": isinstance(back.amount, Decimal),
        "loads_repr": repr(back.amount),
        "loads_str": str(back.amount),
        "loads_equals_value": back.amount == value,
        "loads_as_tuple_equal": back.amount.as_tuple() == value.as_tuple(),
        "loads_str_equal": str(back.amount) == str(value),
    }


def _direct_api_case(serializer: str, value: Decimal) -> dict[str, Any]:
    converter = _json_converter() if serializer == "json" else _yaml_converter()
    unstructured = converter.unstructure(value)
    structured = converter.structure(str(value), Decimal)
    return {
        "input_kind": "string",
        "value_repr": repr(value),
        "unstructure_repr": repr(unstructured),
        "unstructure_type": type(unstructured).__name__,
        "unstructure_is_str": isinstance(unstructured, str),
        "structure_is_decimal": isinstance(structured, Decimal),
        "structure_repr": repr(structured),
        "structure_as_tuple_equal": structured.as_tuple() == value.as_tuple(),
    }


def _numeric_input_case(serializer: str, raw: str) -> dict[str, Any]:
    converter = _json_converter() if serializer == "json" else _yaml_converter()
    back = converter.loads(raw, Order)
    amount = back.amount
    parsed = (
        json.loads(raw)["amount"] if serializer == "json" else yaml.safe_load(raw)["amount"]
    )
    return {
        "input_kind": "number",
        "dumps_raw": raw,
        "wire_value_repr": repr(parsed),
        "wire_value_type": type(parsed).__name__,
        "loads_type": type(amount).__name__,
        "loads_is_decimal": isinstance(amount, Decimal),
        "loads_repr": repr(amount),
        "loads_str": str(amount),
        "loads_equals_decimal_literal": amount == Decimal(str(parsed)),
        "note": (
            "Wire number is decoded by the backend to float before cattrs sees "
            "it; the binary expansion is the float path, not the Decimal hook. "
            "Reported separately and not attributed to the candidate."
        ),
    }


def _invalid_string_case(serializer: str, bad: str) -> dict[str, Any]:
    converter = _json_converter() if serializer == "json" else _yaml_converter()
    raw = (
        json.dumps({"amount": bad})
        if serializer == "json"
        else yaml.safe_dump({"amount": bad})
    )
    back = converter.loads(raw, Order)
    return {
        "input_kind": "string",
        "invalid_value": bad,
        "loads_repr": repr(back.amount),
        "note": "Expected to raise; reaching here means invalid input was accepted.",
    }


def _mixed_fields_case(serializer: str) -> dict[str, Any]:
    converter = _json_converter() if serializer == "json" else _yaml_converter()
    mixed = Mixed(7, "alpha", Decimal("19.99"), None)
    raw = converter.dumps(mixed)
    back = converter.loads(raw, Mixed)
    return {
        "mixed_raw": raw,
        "mixed_equals": back == mixed,
        "mixed_amount_is_decimal": isinstance(back.amount, Decimal),
        "mixed_amount_as_tuple_equal": back.amount.as_tuple()
        == mixed.amount.as_tuple(),
    }


def _pure_non_decimal_case(serializer: str) -> dict[str, Any]:
    """No Decimal anywhere: this path must be identical on every build."""
    converter = _json_converter() if serializer == "json" else _yaml_converter()
    order = PlainOrder(7, "alpha", None)
    raw = converter.dumps(order)
    back = converter.loads(raw, PlainOrder)
    plain = {"id": 1, "tags": ["a", "b"], "flag": True}
    plain_raw = converter.dumps(plain)
    plain_back = converter.loads(plain_raw, dict)
    stamp = Stamp(dt.datetime(2026, 11, 3, 12, 0, 0))
    stamp_raw = converter.dumps(stamp)
    stamp_back = converter.loads(stamp_raw, Stamp)
    return {
        "order_raw": raw,
        "order_equals": back == order,
        "plain_raw": plain_raw,
        "plain_equals": plain_back == plain,
        "stamp_raw": stamp_raw,
        "stamp_equals": stamp_back == stamp,
    }


def collect(label: str) -> dict[str, Any]:
    cases: list[dict[str, Any]] = []
    for serializer in ("json", "yaml"):
        for value in VALUES:
            _record(
                cases,
                "decimal_string_roundtrip",
                serializer,
                f"Order(amount=Decimal({value!r}))",
                lambda s=serializer, v=value: _roundtrip_case(s, v),
            )
            _record(
                cases,
                "direct_api",
                serializer,
                f"unstructure/structure Decimal({value!r})",
                lambda s=serializer, v=value: _direct_api_case(s, v),
            )

        numeric_raw = (
            '{"amount": 19.99}' if serializer == "json" else "amount: 19.99\n"
        )
        _record(
            cases,
            "numeric_input",
            serializer,
            "Order(amount=19.99) from a wire number",
            lambda s=serializer, r=numeric_raw: _numeric_input_case(s, r),
        )
        int_raw = '{"amount": 42}' if serializer == "json" else "amount: 42\n"
        _record(
            cases,
            "numeric_input",
            serializer,
            "Order(amount=42) from a wire integer",
            lambda s=serializer, r=int_raw: _numeric_input_case(s, r),
        )

        for bad in ("not-a-decimal", ""):
            _record(
                cases,
                "invalid_decimal_string",
                serializer,
                f"Order(amount={bad!r})",
                lambda s=serializer, b=bad: _invalid_string_case(s, b),
            )

        _record(
            cases,
            "mixed_fields",
            serializer,
            "Mixed(Decimal + non-Decimal fields)",
            lambda s=serializer: _mixed_fields_case(s),
        )
        _record(
            cases,
            "non_decimal_behavior",
            serializer,
            "PlainOrder/plain dict/datetime (no Decimal)",
            lambda s=serializer: _pure_non_decimal_case(s),
        )

    summary: dict[str, Any] = {
        "total_cases": len(cases),
        "by_status": {},
        "by_group": {},
    }
    for case in cases:
        summary["by_status"][case["status"]] = (
            summary["by_status"].get(case["status"], 0) + 1
        )
        summary["by_group"][case["group"]] = summary["by_group"].get(case["group"], 0) + 1

    return {
        "label": label,
        "environment": {
            "python_version": platform.python_version(),
            "python_implementation": platform.python_implementation(),
            "platform": platform.platform(),
            "cattrs_version": _dist_version("cattrs"),
            "attrs_version": _dist_version("attrs"),
            "pyyaml_version": _dist_version("PyYAML"),
            "cattrs_module_file_suffix": _module_suffix(cattrs.__file__),
        },
        "values": [str(v) for v in VALUES],
        "cases": cases,
        "summary": summary,
    }


def _dist_version(name: str) -> str:
    import importlib.metadata as md

    try:
        return md.version(name)
    except md.PackageNotFoundError:
        return "missing"


def _module_suffix(path: str) -> str:
    # Keep the recorded environment path-free; the suffix shows it is an
    # installed copy (site-packages/cattrs/__init__.py), not the source tree.
    normalized = path.replace("\\", "/")
    marker = "/site-packages/"
    return normalized[normalized.index(marker) + 1 :] if marker in normalized else "unknown"


# ---------------------------------------------------------------------------
# pytest assertions: expected behavior after the PR is integrated.
# ---------------------------------------------------------------------------


import pytest  # noqa: E402


@pytest.mark.parametrize("serializer", ["json", "yaml"])
@pytest.mark.parametrize("value", VALUES)
def test_decimal_dumps_as_string_and_roundtrips(serializer: str, value: Decimal) -> None:
    observed = _roundtrip_case(serializer, value)
    assert observed["serialized_is_str"]
    assert observed["serialized_equals_source_str"]
    assert observed["loads_is_decimal"]
    assert observed["loads_equals_value"]
    assert observed["loads_as_tuple_equal"]
    assert observed["loads_str_equal"]


@pytest.mark.parametrize("serializer", ["json", "yaml"])
@pytest.mark.parametrize("value", VALUES)
def test_direct_unstructure_structure(serializer: str, value: Decimal) -> None:
    observed = _direct_api_case(serializer, value)
    assert observed["unstructure_is_str"]
    assert observed["unstructure_repr"] == repr(str(value))
    assert observed["structure_is_decimal"]
    assert observed["structure_as_tuple_equal"]


def _is_invalid_operation(exc: BaseException) -> bool:
    if type(exc).__name__ == "InvalidOperation":
        return True
    return any(
        type(sub).__name__ == "InvalidOperation"
        for sub in getattr(exc, "exceptions", [])
    )


@pytest.mark.parametrize("serializer", ["json", "yaml"])
def test_invalid_decimal_string_raises(serializer: str) -> None:
    converter = _json_converter() if serializer == "json" else _yaml_converter()
    # Direct structure surfaces InvalidOperation itself.
    with pytest.raises(Exception) as direct:
        converter.structure("not-a-decimal", Decimal)
    assert type(direct.value).__name__ == "InvalidOperation"
    # Structuring a class wraps it in cattrs' ClassValidationError group.
    with pytest.raises(Exception) as grouped:
        _invalid_string_case(serializer, "not-a-decimal")
    assert _is_invalid_operation(grouped.value)


@pytest.mark.parametrize("serializer", ["json", "yaml"])
def test_pure_non_decimal_behavior_unchanged(serializer: str) -> None:
    observed = _pure_non_decimal_case(serializer)
    assert observed["order_equals"]
    assert observed["plain_equals"]
    assert observed["stamp_equals"]


@pytest.mark.parametrize("serializer", ["json", "yaml"])
def test_mixed_fields_preserve_decimal_alongside_others(serializer: str) -> None:
    observed = _mixed_fields_case(serializer)
    assert observed["mixed_equals"]
    assert observed["mixed_amount_is_decimal"]
    assert observed["mixed_amount_as_tuple_equal"]


@pytest.mark.parametrize("serializer", ["json", "yaml"])
def test_numeric_input_is_reported_not_claimed(serializer: str) -> None:
    raw = '{"amount": 19.99}' if serializer == "json" else "amount: 19.99\n"
    observed = _numeric_input_case(serializer, raw)
    # The wire number goes through float in the backend, so exact equality
    # with the decimal literal is not expected; the case documents that.
    assert observed["loads_is_decimal"]
    assert observed["loads_equals_decimal_literal"] is False
    assert "not attributed to the candidate" in observed["note"]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", required=True)
    parser.add_argument("--label", required=True)
    args = parser.parse_args(argv)
    record = collect(args.label)
    with open(args.json, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(record, fh, indent=2, sort_keys=False, ensure_ascii=False)
        fh.write("\n")
    print(json.dumps(record["summary"], indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())