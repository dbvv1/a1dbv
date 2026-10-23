"""Application-local solution; no cattrs source patch required."""

import argparse
from decimal import Decimal
from importlib import import_module

BACKENDS = ("json", "pyyaml", "ujson", "orjson", "msgspec")


def make_decimal_converter(backend):
    if backend not in BACKENDS:
        raise ValueError("Unsupported backend: " + backend)
    converter = import_module("cattrs.preconf." + backend).make_converter()
    if backend != "msgspec":
        converter.register_unstructure_hook(Decimal, str)
    if backend == "pyyaml":
        converter.register_structure_hook(Decimal, lambda value, _: Decimal(str(value)))
    else:
        converter.register_structure_hook(Decimal, lambda value, _: Decimal(value))
    return converter


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("backend", choices=BACKENDS)
    args = parser.parse_args()
    converter = make_decimal_converter(args.backend)
    original = Decimal("12345678901234567890.1234500")
    payload = converter.dumps(
        {"amount": [original]}, unstructure_as=dict[str, list[Decimal]]
    )
    restored = converter.loads(payload, dict[str, list[Decimal]])["amount"][0]
    if restored.as_tuple() != original.as_tuple():
        raise RuntimeError("Decimal representation changed")
    print(payload)
    print("Exact Decimal tuple retained:", restored.as_tuple())


if __name__ == "__main__":
    main()
