"""Run real Godot import, authoring, and official game consumers; no test doubles."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

from prepare import prepare

HERE = Path(__file__).resolve().parent


def invoke(engine, project, environment, log, arguments, expected=0, marker=None):
    result = subprocess.run(
        [str(engine), "--headless", "--path", str(project), *arguments],
        env=environment, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        timeout=45,
    )
    log.write_text(result.stdout, encoding="utf-8")
    if result.returncode != expected:
        raise RuntimeError(f"{log.name}: expected exit {expected}, got {result.returncode}")
    if expected == 0 and ("ERROR:" in result.stdout or "CHECK_FAILED:" in result.stdout):
        raise RuntimeError(f"{log.name}: engine error despite zero exit")
    if marker and marker not in result.stdout:
        raise RuntimeError(f"{log.name}: missing result marker {marker}")
    print(f"PASS {log.stem}")
    for line in result.stdout.splitlines():
        if line.startswith(("CONSUMER_RESULT", "AUTHOR_OK")):
            print("  " + line)
    return result.stdout


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--godot", type=Path, required=True, help="Official 4.7.2 editor executable")
    parser.add_argument("--archive", type=Path, help="Previously downloaded fixed official demo ZIP")
    args = parser.parse_args()
    engine = args.godot.resolve()
    if not engine.is_file() or not os.access(engine, os.X_OK):
        parser.error("Godot editor executable is missing or not executable")
    work = HERE / ".work"
    work.mkdir(exist_ok=True)
    run = Path(tempfile.mkdtemp(prefix="run-", dir=work))
    environment = dict(os.environ)
    for variable, folder in (("HOME", "home"), ("XDG_CONFIG_HOME", "config"),
                             ("XDG_CACHE_HOME", "cache"), ("XDG_DATA_HOME", "data"),
                             ("TMPDIR", "tmp")):
        path = run / folder
        path.mkdir()
        environment[variable] = str(path)
    version = subprocess.run([str(engine), "--version"], env=environment, text=True,
                             capture_output=True, check=True, timeout=10).stdout.strip()
    if version != "4.7.2.stable.official.ed1daf0bf":
        parser.error(f"This fixed experiment expects official 4.7.2, received {version}")
    print(version)
    project = prepare(run, args.archive)
    for name in ("author_variant.gd", "consume_scene.gd"):
        shutil.copy2(HERE / name, project / name)
    def call(name, arguments, expected=0, marker=None):
        return invoke(engine, project, environment, run / f"{name}.log", arguments, expected, marker)
    def consume(name, scene="main.tscn", speed="400", interval="0.5", radius="27", expected=0):
        return call(name, ["--fixed-fps", "60", "--script", "res://consume_scene.gd", "--",
                           f"res://{scene}", speed, interval, radius], expected, "CONSUMER_RESULT")
    call("parse", ["--script", "res://consume_scene.gd", "--check-only"])
    # Native logic can run with missing imported assets: require an actual failure.
    raw = consume("unimported-rejected", expected=1)
    if "CHECK_FAILED: imported" not in raw or "ERROR:" not in raw:
        raise RuntimeError("Unimported resource regression did not exercise original errors")
    call("import", ["--import"])
    consume("baseline")
    call("author", ["--script", "res://author_variant.gd"], marker="AUTHOR_OK")
    scene_text = (project / "variant.tscn").read_text()
    if 'path="res://variant_player_shape.tres"' not in scene_text:
        raise RuntimeError("Variant must reference the saved external shape resource")
    consume("variant", "variant.tscn", "240", "0.25", "14")
    consume("original-unchanged")
    call("missing-arguments", ["--script", "res://consume_scene.gd"], 2, "Expected scene")
    call("missing-scene", ["--script", "res://consume_scene.gd", "--",
                           "res://absent.tscn", "400", "0.5", "27"], 3, "absent.tscn")
    (project / "variant_player_shape.tres").rename(project / "variant_player_shape.absent")
    call("missing-shape", ["--fixed-fps", "60", "--script", "res://consume_scene.gd", "--",
                           "res://variant.tscn", "240", "0.25", "14"], 4, "missing collision shape")
    print("PASS: native import → author/save → fresh-process consumers; logs:", run.relative_to(HERE))


if __name__ == "__main__":
    main()
