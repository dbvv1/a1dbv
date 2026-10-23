"""Replay only the first multiline guest payload in two pinned author examples.

Requires pwasm==0.2a0 and wasmtime==50.0.1, installed separately from PyPI.
Downloads the two pinned public source files unless --inputs-dir is supplied;
verifies their hashes, extracts strings with ast, never executes their host code.
This is a narrow compatibility experiment, not a security sandbox.
"""

import argparse, ast, contextlib, hashlib, importlib.metadata, io, json, os, pathlib, sys, tempfile, types, urllib.request

os.environ["PWASM_CACHE_DIR"] = ""
import pwasm, wasmtime
from pwasm.guests import QuickJS, MicroPython, MQuickJS

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output-dir", type=pathlib.Path)
parser.add_argument(
    "--inputs-dir",
    type=pathlib.Path,
    help="Existing unmodified pinned author example files; no download",
)
args = parser.parse_args()
ROOT = args.output_dir or pathlib.Path(tempfile.mkdtemp(prefix="pwasm-consumer-"))
ROOT.mkdir(parents=True, exist_ok=True)
if not __debug__:
    raise RuntimeError(
        "Do not run this acceptance entry with python -O: assertions are required"
    )
INPUTS = args.inputs_dir or ROOT
SOURCE_BASE = "https://raw.githubusercontent.com/simonw/research/fe91d6d50a0cacfebae78ab186417109af3446ee/wasmi-python-sandbox/examples/"
INPUT_HASHES = {
    "untrusted_js.py": "c2df7cf6d11d74a859b0c9b2b6a3070b22cb9dced00d4c021a618c25bca9165a",
    "untrusted_python.py": "5e4df20313b5c0c7594147677885718899014cb58e8764b2dfe66985b60c35b2",
}
for filename, digest in INPUT_HASHES.items():
    if args.inputs_dir is None:
        with urllib.request.urlopen(SOURCE_BASE + filename, timeout=30) as response:
            (ROOT / filename).write_bytes(response.read())
    assert hashlib.sha256((INPUTS / filename).read_bytes()).hexdigest() == digest, (
        filename + " differs from pinned source"
    )
for package, version in [("pwasm", "0.2a0"), ("wasmtime", "50.0.1")]:
    assert importlib.metadata.version(package) == version, (
        "Requires " + package + "==" + version
    )
GUEST_HASHES = {
    "quickjs.wasm": "6dba22b6af15ae1d3e13d0a1e780ab21e8d2814ab934760fe17bdaa63c0d7191",
    "mquickjs.wasm": "2a940bfe3f5142f7abda0f7c42bc66c0e2c51052e119437ae8fa819a9c9f6833",
    "micropython.wasm": "6f7b35aa342738ddfc47b3a34381afb62be3f640ead7f0e112020a2873baf84f",
}
for filename, digest in GUEST_HASHES.items():
    assert (
        hashlib.sha256(
            (pathlib.Path(pwasm.__file__).parent / "guests" / filename).read_bytes()
        ).hexdigest()
        == digest
    ), (filename + " differs from fixed wheel")

result = {
    "versions": {n: importlib.metadata.version(n) for n in ["pwasm", "wasmtime"]},
    "python": sys.version,
    "fixed_sha": "3398e812b0fffe4db8dbf1eb2df2d7b60ec7dad7",
}


def extract(filename, method):
    t = ast.parse((INPUTS / filename).read_text())
    return next(
        n.args[0].value
        for n in ast.walk(t)
        if isinstance(n, ast.Call)
        and isinstance(n.func, ast.Attribute)
        and n.func.attr == method
        and n.args
        and isinstance(n.args[0], ast.Constant)
        and isinstance(n.args[0].value, str)
        and "\n" in n.args[0].value
    )


js_code = extract("untrusted_js.py", "eval")
py_code = extract("untrusted_python.py", "exec")
functions = {
    "lookup_user": lambda uid: {"id": uid, "name": f"user-{uid}", "admin": uid == 1},
    "now": lambda: 1234567890.0,
}


class Reference:
    def __init__(self):
        c = wasmtime.Config()
        c.consume_fuel = True
        self.engine = wasmtime.Engine(c)
        self.store = wasmtime.Store(self.engine)
        self.store.set_fuel(100_000_000)
        self.store.set_limits(memory_size=32 << 20)
        self.store.set_wasi(wasmtime.WasiConfig())
        linker = wasmtime.Linker(self.engine)
        linker.define_wasi()
        self.buffers = {}
        self.pending = b""
        self.module = wasmtime.Module.from_file(
            self.engine,
            str(pathlib.Path(pwasm.__file__).parent / "guests/quickjs.wasm"),
        )

        def read(c, p, n):
            return bytes(c.get("memory").read(c, p, p + n))

        def write(c, fd, p, n):
            self.buffers.setdefault(fd, bytearray()).extend(read(c, p, n))

        def call(c, np, nl, ap, al):
            name = read(c, np, nl).decode()
            args = json.loads(read(c, ap, al))
            try:
                self.pending = json.dumps(functions[name](*args)).encode()
                return len(self.pending)
            except Exception as e:
                self.pending = f"{type(e).__name__}: {e}".encode()
                return -len(self.pending)

        def take(c, p, n):
            c.get("memory").write(c, self.pending[:n], p)

        callbacks = {
            "host_interrupt": lambda c: 0,
            "host_write": write,
            "host_call": call,
            "host_take": take,
        }
        for i in self.module.imports:
            if i.module == "env":
                linker.define_func(
                    "env", i.name, i.type, callbacks[i.name], access_caller=True
                )
        self.instance = linker.instantiate(self.store, self.module)
        self.e = self.instance.exports(self.store)
        self.e["_initialize"](self.store)
        assert self.e["qjs_init"](self.store, 0, 512 << 10) == 0

    def eval(self, code):
        self.buffers = {}
        b = code.encode()
        p = self.e["malloc"](self.store, len(b) + 1)
        self.e["memory"].write(self.store, b + b"\0", p)
        status = self.e["qjs_eval"](self.store, p, len(b))
        self.e["free"](self.store, p)
        return {
            "status": status,
            "result": bytes(self.buffers.get(3, b"")).decode(),
            "stdout": bytes(self.buffers.get(1, b"")).decode(),
            "exception": bytes(self.buffers.get(4, b"")).decode(),
        }


ref = Reference()
result["quickjs_reference"] = ref.eval(js_code)
js = QuickJS(max_memory=32 << 20, timeout=10, functions=functions)
result["quickjs_pwasm"] = {"result": js.eval(js_code), "stdout": js.take_output()}
assert result["quickjs_reference"]["status"] == 0
assert result["quickjs_reference"]["exception"] == ""
assert result["quickjs_pwasm"]["result"] == [1, 4, 9, True, "number"]
assert result["quickjs_pwasm"]["result"] == json.loads(
    result["quickjs_reference"]["result"]
)
assert result["quickjs_pwasm"]["stdout"] == result["quickjs_reference"]["stdout"]
assert (
    result["quickjs_pwasm"]["stdout"]
    == 'hello from JS, user is {"id":1,"name":"user-1","admin":true}\n'
)
# Same author-authored MicroPython code against CPython semantics; no real accounts/prices.
prices = lambda *symbols: {s: len(s) * 10.5 for s in symbols}
mp = MicroPython(max_memory=32 << 20, timeout=10, functions={"get_prices": prices})
result["micropython_pwasm"] = mp.exec(py_code)
host = types.ModuleType("host")
host.call = lambda name, *args: prices(*args)
previous_host = sys.modules.get("host")
sys.modules["host"] = host
out = io.StringIO()
try:
    with contextlib.redirect_stdout(out):
        exec(py_code, {})
finally:
    if previous_host is None:
        sys.modules.pop("host", None)
    else:
        sys.modules["host"] = previous_host
result["cpython_reference"] = out.getvalue()
print("MicroPython raw:", repr(result["micropython_pwasm"]), flush=True)
print("CPython raw:", repr(result["cpython_reference"]), flush=True)
result["micropython_raw_text_equal"] = (
    result["micropython_pwasm"] == result["cpython_reference"]
)


def parse_price_output(text):
    first, *rest = text.splitlines()
    mapping, total = first.removeprefix("prices: ").split(" total: ")
    return {
        "prices": ast.literal_eval(mapping),
        "total": float(total),
        "remaining_lines": rest,
    }


result["micropython_semantic"] = parse_price_output(result["micropython_pwasm"])
result["cpython_semantic"] = parse_price_output(result["cpython_reference"])
# Content-only mapping equality is THIS replay's chosen acceptance criterion,
# not a proven author requirement. Raw order differences remain visible.
assert result["micropython_semantic"] == result["cpython_semantic"]
assert result["micropython_semantic"] == {
    "prices": {"AAPL": 42.0, "GOOG": 42.0},
    "total": 84.0,
    "remaining_lines": ["caught: insufficient funds", "[0, 1, 2, 3, 4, 5, 6]"],
}
assert result["micropython_raw_text_equal"] is False
result["micropython_semantic_equal"] = True

# Actual acceptance boundary: author uses modern map/arrow syntax; ES5 guest not interchangeable.
result["mquickjs_author_program"] = {}
try:
    result["mquickjs_author_program"]["result"] = MQuickJS(timeout=10).eval(js_code)
except Exception as e:
    result["mquickjs_author_program"] = {"error": type(e).__name__, "message": str(e)}
# Language error is not a WASM trap. Compare same guest under both engines.
result["js_exception_reference"] = ref.eval("null.x")
try:
    js.eval("null.x")
except Exception as e:
    result["js_exception_pwasm"] = {"error": type(e).__name__, "message": str(e)}
result["after_language_error"] = js.eval("u.id * 2")
try:
    js.eval("while(true){}", soft_timeout=0.05)
except Exception as e:
    result["soft_stop"] = {"error": type(e).__name__, "message": str(e)}
result["after_soft_stop"] = js.eval("u.id * 2")
hard = QuickJS(timeout=10)
try:
    hard.eval("while(true){}", fuel=1000)
except Exception as e:
    result["hard_stop"] = {
        "error": type(e).__name__,
        "message": str(e),
        "decision": "discard this instance; no reuse acceptance",
    }
del hard
# Trusted synthetic test input only; mature validator versus decoder, no invalid execution.
invalid = wasmtime.wat2wasm('(module (func (export "bad") (result i32)))')
try:
    wasmtime.Module(wasmtime.Engine(), invalid)
    result["invalid_reference"] = "accepted"
except Exception as e:
    result["invalid_reference"] = {"error": type(e).__name__, "message": str(e)}
try:
    pwasm.decode_module(invalid)
    result["invalid_pwasm"] = "decoded without validation; not instantiated or executed"
except Exception as e:
    result["invalid_pwasm"] = {"error": type(e).__name__, "message": str(e)}
wat = '(module (memory 1) (func (export "run") (result i32) i32.const 65536 i32.load))'
b = wasmtime.wat2wasm(wat)
for engine in ["pwasm", "wasmtime"]:
    try:
        if engine == "pwasm":
            pwasm.instantiate(pwasm.decode_module(b)).exports.run()
        else:
            e = wasmtime.Engine()
            s = wasmtime.Store(e)
            i = wasmtime.Instance(s, wasmtime.Module(e, b), [])
            i.exports(s)["run"](s)
    except Exception as ex:
        result["out_of_bounds_" + engine] = {
            "error": type(ex).__name__,
            "message": str(ex),
        }
# Fail closed if any required negative/control observation is absent or changes.
assert result["mquickjs_author_program"].get("error") == "JSError"
assert "SyntaxError" in result["mquickjs_author_program"]["message"]
assert result["js_exception_reference"]["status"] == 1
assert result["js_exception_reference"]["result"] == ""
assert result["js_exception_reference"]["stdout"] == ""
assert result["js_exception_pwasm"]["error"] == "JSError"
assert "TypeError" in result["js_exception_pwasm"]["message"]
assert (
    result["js_exception_pwasm"]["message"]
    == result["js_exception_reference"]["exception"]
)
assert result["after_language_error"] == 2
assert (
    result["soft_stop"]["error"] == "JSError"
    and "interrupted" in result["soft_stop"]["message"]
)
assert result["after_soft_stop"] == 2
assert result["hard_stop"]["error"] == "OutOfFuel"
assert result["invalid_reference"]["error"] == "WasmtimeError"
assert "type mismatch" in result["invalid_reference"]["message"]
assert (
    result["invalid_pwasm"]
    == "decoded without validation; not instantiated or executed"
)
assert result["out_of_bounds_pwasm"]["error"] == "TrapError"
assert result["out_of_bounds_wasmtime"]["error"] == "Trap"
for engine in ["pwasm", "wasmtime"]:
    assert "out of bounds memory access" in result["out_of_bounds_" + engine]["message"]
result["acceptance_scope"] = (
    "First multiline payload only; content-only mapping criterion chosen for this replay; not general compatibility or security"
)
result["artifacts"] = {
    p.name: hashlib.sha256(p.read_bytes()).hexdigest()
    for p in (pathlib.Path(pwasm.__file__).parent / "guests").glob("*.wasm")
}
(ROOT / "consumer-results.json").write_text(
    json.dumps(result, ensure_ascii=False, indent=2)
)
print(json.dumps(result, ensure_ascii=False, indent=2))

print("PASS: " + str(ROOT / "consumer-results.json"))
