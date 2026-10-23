"""Exact Decimal strings across five preconfigured backends (issue #761)."""

from decimal import Decimal
from importlib import import_module

import pytest
from attrs import define
from msgspec import to_builtins

from cattrs import Converter
from cattrs.errors import StructureHandlerNotFoundError
from cattrs.fns import identity

BACKENDS = ["json", "pyyaml", "ujson", "orjson", "msgspec"]
VALUES = [
    "12345678901234567890.123456789012345678900",
    "1.2300",
    "-0.00",
    "1E+30",
    "1E-100",
    "0E+9",
]


@define
class Amount:
    value: Decimal


@define
class Ledger:
    values: list[dict[str, Decimal]]


@pytest.fixture(params=BACKENDS)
def converter(request):
    return import_module("cattrs.preconf." + request.param).make_converter()


@pytest.mark.parametrize("text", VALUES)
@pytest.mark.parametrize("shape", ["scalar", "attrs", "nested"])
def test_exact_decimal_roundtrip(converter, text, shape):
    value = Decimal(text)
    if shape == "scalar":
        obj, typ, extract = value, Decimal, lambda v: v
    elif shape == "attrs":
        obj, typ, extract = Amount(value), Amount, lambda v: v.value
    else:
        obj, typ, extract = (
            Ledger([{"amount": value}]),
            Ledger,
            lambda v: v.values[0]["amount"],
        )
    structured = converter.structure(
        converter.unstructure(obj, unstructure_as=typ), typ
    )
    restored = converter.loads(converter.dumps(obj, unstructure_as=typ), typ)
    assert extract(structured).as_tuple() == value.as_tuple()
    assert extract(restored).as_tuple() == value.as_tuple()


@pytest.mark.parametrize("backend", BACKENDS)
def test_encoded_scalar_is_string(backend):
    converter = import_module("cattrs.preconf." + backend).make_converter()
    value = Decimal("1.2300")
    assert converter.loads(converter.dumps(value), str) == str(value)


@pytest.mark.parametrize(
    "typ, expected",
    [
        (Decimal, identity),
        (Amount, to_builtins),
        (list[Decimal], identity),
        (dict[str, Decimal], to_builtins),
        (Ledger, to_builtins),
    ],
)
def test_msgspec_preserves_native_hooks(typ, expected):
    converter = import_module("cattrs.preconf.msgspec").make_converter()
    assert converter.get_unstructure_hook(typ) is expected
    assert converter.get_dumps_hook(typ) == converter.encoder.encode


@pytest.mark.parametrize("shape", ["scalar", "attrs", "list", "dict", "nested"])
def test_msgspec_custom_hook_wins_after_native_hook_cached(shape):
    converter = import_module("cattrs.preconf.msgspec").make_converter()
    value = Decimal("1.2300")
    examples = {
        "scalar": (value, Decimal, lambda v: v),
        "attrs": (Amount(value), Amount, lambda v: v.value),
        "list": ([value], list[Decimal], lambda v: v[0]),
        "dict": ({"amount": value}, dict[str, Decimal], lambda v: v["amount"]),
        "nested": (
            Ledger([{"amount": value}]),
            Ledger,
            lambda v: v.values[0]["amount"],
        ),
    }
    obj, typ, extract = examples[shape]
    assert converter.get_dumps_hook(typ) == converter.encoder.encode
    converter.register_unstructure_hook(Decimal, lambda v: "decimal:" + str(v))
    converter.register_structure_hook(
        Decimal, lambda v, _: Decimal(v.removeprefix("decimal:"))
    )
    assert converter.get_unstructure_hook(typ) not in (identity, to_builtins)
    assert converter.get_dumps_hook(typ) != converter.encoder.encode
    payload = converter.get_dumps_hook(typ)(obj)
    assert b"decimal:1.2300" in payload
    assert extract(converter.loads(payload, typ)).as_tuple() == value.as_tuple()


@pytest.mark.parametrize("backend", BACKENDS)
def test_numeric_acceptance_not_precision_recovery(backend):
    converter = import_module("cattrs.preconf." + backend).make_converter()
    assert converter.structure(42, Decimal) == Decimal(42)
    incoming = 0.1
    expected = Decimal(str(incoming)) if backend == "pyyaml" else Decimal(incoming)
    assert converter.structure(incoming, Decimal).as_tuple() == expected.as_tuple()


def test_plain_converter_unchanged():
    converter = Converter()
    value = Decimal("1.2300")
    assert converter.unstructure(value) is value
    with pytest.raises(StructureHandlerNotFoundError):
        converter.structure("1.2300", Decimal)


@pytest.mark.parametrize("shape", ["scalar", "attrs", "list", "dict", "nested"])
def test_msgspec_native_dumps_hook_executes(shape):
    converter = import_module("cattrs.preconf.msgspec").make_converter()
    value = Decimal("-0.000")
    examples = {
        "scalar": (value, Decimal, lambda v: v),
        "attrs": (Amount(value), Amount, lambda v: v.value),
        "list": ([value], list[Decimal], lambda v: v[0]),
        "dict": ({"amount": value}, dict[str, Decimal], lambda v: v["amount"]),
        "nested": (
            Ledger([{"amount": value}]),
            Ledger,
            lambda v: v.values[0]["amount"],
        ),
    }
    obj, typ, extract = examples[shape]
    hook = converter.get_dumps_hook(typ)
    assert hook == converter.encoder.encode
    payload = hook(obj)
    assert b'"-0.000"' in payload
    assert extract(converter.loads(payload, typ)).as_tuple() == value.as_tuple()
