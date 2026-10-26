#!/usr/bin/env python3
"""Fetch one unchanged official example at the same revision as Cargo.toml."""
import argparse
import hashlib
from pathlib import Path
import urllib.request

REVISION = "25bd9983dee3ecb0677be03b9e2e23d2bd6d29cb"
SHA256 = "ec9857f0765148bcf690861bb7cc4f253a36811c6060e2305b5058d9cb83e126"
URL = f"https://raw.githubusercontent.com/gschup/ggrs/{REVISION}/examples/ex_game/ex_game.rs"


def prepare(source: Path | None, destination: Path) -> None:
    if source is None:
        with urllib.request.urlopen(URL, timeout=30) as response:
            data = response.read(100_000)
    else:
        data = source.read_bytes()
    if hashlib.sha256(data).hexdigest() != SHA256:
        raise ValueError("official sample SHA-256 mismatch; existing destination is unchanged")
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, help="use an existing fixed upstream ex_game.rs offline")
    args = parser.parse_args()
    prepare(args.source, Path(__file__).resolve().parent / ".work" / "ex_game.rs")
    print(f"Official sample verified: {REVISION}")
