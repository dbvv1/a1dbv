"""Reproduce semantic declaration/reference navigation with Jedi 0.19.2."""

import argparse
import sys
import json
from pathlib import Path
import jedi

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--source", type=Path, required=True)
parser.add_argument("--output", type=Path, required=True)
args = parser.parse_args()
if sys.flags.optimize:
    raise RuntimeError("Run navigation without -O")
source = args.source.resolve()
output = args.output.resolve()
output.parent.mkdir(parents=True, exist_ok=True)
jedi.settings.cache_directory = str(output.parent / "jedi-cache")
project = jedi.Project(path=source, added_sys_path=[str(source / "src")])
path = source / "tests/test_preconf.py"
code = path.read_text()
script = jedi.Script(code, path=path, project=project)
out = []
for i, line in enumerate(code.splitlines(), 1):
    for name in ["json", "ujson", "orjson", "msgspec", "pyyaml"]:
        symbol = name + "_make_converter"
        if i < 100 and line.lstrip().startswith("from ") and " as " + symbol in line:
            col = line.index(" as " + symbol) + 4
            definitions = script.goto(i, col, follow_imports=True)
            refs = script.get_references(i, col, scope="file")
            if not definitions or not refs:
                raise RuntimeError("Missing navigation result: " + symbol)
            out.append(
                {
                    "symbol": symbol,
                    "request": {
                        "file": "tests/test_preconf.py",
                        "line": i,
                        "column": col,
                    },
                    "definitions": [
                        {
                            "file": str(v.module_path.relative_to(source)),
                            "line": v.line,
                            "name": v.name,
                        }
                        for v in definitions
                    ],
                    "references": [{"line": v.line, "column": v.column} for v in refs],
                }
            )

for name in ["json", "ujson", "orjson", "msgspec", "pyyaml"]:
    path = source / "src/cattrs/preconf" / (name + ".py")
    code = path.read_text()
    script = jedi.Script(code, path=path, project=project)
    for i, line in enumerate(code.splitlines(), 1):
        if line.strip() == "configure_converter(res)":
            col = line.index("configure_converter")
            out.append(
                {
                    "symbol": name + ".configure_converter",
                    "request": {
                        "file": str(path.relative_to(source)),
                        "line": i,
                        "column": col,
                    },
                    "definitions": [
                        {
                            "file": str(v.module_path.relative_to(source)),
                            "line": v.line,
                            "name": v.name,
                        }
                        for v in script.goto(i, col)
                    ],
                    "references": [
                        {"line": v.line, "column": v.column}
                        for v in script.get_references(i, col, scope="file")
                    ],
                }
            )
if any(not entry["definitions"] or not entry["references"] for entry in out):
    raise RuntimeError("Missing declaration or reference results")
if len(out) != 10:
    raise RuntimeError(f"Expected ten semantic requests, got {len(out)}")
output.write_text(json.dumps(out, indent=2) + "\n")
print("10 semantic requests with declaration and reference results recorded")
