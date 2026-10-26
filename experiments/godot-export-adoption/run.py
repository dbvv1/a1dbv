"""Export official Linux players, then run copied application packages, not the editor."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
AUTHORING = HERE.parent / "godot-scene-authoring"
sys.path.insert(0, str(AUTHORING))
from prepare import prepare  # Fixed official demo and verified extraction from prior unit.

TEMPLATE_HASHES = {
    "linux_debug.x86_64": "1a291d3d15e4180b60b0af96cf6458f11fe143636d76575ddf1e23d1a3f24f2e",
    "linux_release.x86_64": "d9f79ab89b5ae369aeed11c6052d402e8218cd503bf85b4a235f9c30c46a7c63",
}


def digest(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def write_preset(project, templates, corrected):
    include = "*.txt" if corrected else ""
    exclude = "unreleased/*" if corrected else ""
    (project / "export_presets.cfg").write_text(f'''[preset.0]
name="Linux Desktop"
platform="Linux"
runnable=true
export_filter="all_resources"
include_filter="{include}"
exclude_filter="{exclude}"
export_path=""
script_export_mode=2

[preset.0.options]
custom_template/debug={json.dumps(str(templates / "linux_debug.x86_64"))}
custom_template/release={json.dumps(str(templates / "linux_release.x86_64"))}
binary_format/architecture="x86_64"
binary_format/embed_pck=false
''', encoding="utf-8")


def copy_application(source, destination):
    files = [source / "game.x86_64", source / "game.pck"]
    if any(not path.is_file() or path.stat().st_size == 0 for path in files):
        raise ValueError("A playable package requires this build's executable AND PCK")
    destination.mkdir()
    for path in files:
        shutil.copy2(path, destination / path.name)
    return {path.name: digest(path) for path in files}


def copy_notices(project, delivery):
    shutil.copy2(project / "LICENSE.md", delivery / "LICENSE-demo.md")
    (delivery / "fonts").mkdir()
    shutil.copy2(project / "fonts/LICENSE.txt", delivery / "fonts/LICENSE.txt")
    notices = (project / "README.md").read_text().split("## Copying", 1)[1]
    (delivery / "ASSET-NOTICES.txt").write_text(notices, encoding="utf-8")


def isolated_environment(root):
    result = dict(os.environ)
    for key, folder in (("HOME", "home"), ("XDG_CONFIG_HOME", "config"),
                        ("XDG_CACHE_HOME", "cache"), ("XDG_DATA_HOME", "data"),
                        ("TMPDIR", "tmp")):
        path = root / folder
        path.mkdir(parents=True)
        result[key] = str(path)
    return result


def invoke(command, cwd, environment, log, expected=0, markers=()):
    result = subprocess.run(command, cwd=cwd, env=environment, text=True,
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=60)
    log.write_text(result.stdout, encoding="utf-8")
    if result.returncode != expected:
        raise RuntimeError(f"{log.name}: exit {result.returncode}, expected {expected}")
    if expected == 0 and any(word in result.stdout for word in ("ERROR:", "DELIVERY_FAILED:")):
        raise RuntimeError(f"{log.name}: error despite exit 0")
    for marker in markers:
        if marker not in result.stdout:
            raise RuntimeError(f"{log.name}: missing {marker}")
    print("PASS", log.stem, flush=True)
    for line in result.stdout.splitlines():
        if line.startswith("DELIVERY_RESULT"):
            print(" ", line, flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--godot", type=Path, required=True)
    parser.add_argument("--templates-dir", type=Path, required=True)
    parser.add_argument("--archive", type=Path)
    args = parser.parse_args()
    engine, templates = args.godot.resolve(), args.templates_dir.resolve()
    if not engine.is_file() or not os.access(engine, os.X_OK):
        parser.error("Official Godot 4.7.2 editor executable missing")
    for name, expected in TEMPLATE_HASHES.items():
        if not (templates / name).is_file() or digest(templates / name) != expected:
            parser.error(f"Official 4.7.2 template missing or mismatched: {name}")
    (HERE / ".work").mkdir(exist_ok=True)
    run = Path(tempfile.mkdtemp(prefix="run-", dir=HERE / ".work"))
    print("Evidence:", run.relative_to(HERE), flush=True)
    editor_env = isolated_environment(run / "editor-environment")
    version = subprocess.run([str(engine), "--version"], env=editor_env, text=True,
                             capture_output=True, timeout=10, check=True).stdout.strip()
    if version != "4.7.2.stable.official.ed1daf0bf":
        parser.error("Expected official editor 4.7.2")
    project = prepare(run, args.archive)
    project_file = project / "project.godot"
    text = project_file.read_text()
    text = text.replace('[application]\n', '[application]\n\nconfig/version="1.0.0"\n', 1)
    text += '\n[autoload]\n\nDeliveryProbe="*res://delivery_probe.gd"\n'
    project_file.write_text(text)
    shutil.copy2(HERE / "delivery_probe.gd", project / "delivery_probe.gd")
    (project / "stage_title.txt").write_text("Training shift\n")
    (project / "unreleased").mkdir()
    (project / "unreleased/bonus_level.json").write_text('{"stage":"not released yet"}\n')
    original = {name: digest(project / name) for name in
                ("main.gd", "player.gd", "mob.gd", "hud.gd", "main.tscn", "player.tscn")}
    editor = [str(engine), "--headless", "--path", str(project)]
    invoke(editor + ["--import"], run, editor_env, run / "import.log")
    invoke(editor + ["--fixed-fps", "60", "--", "smoke", "Training shift", "editor", "400", "1.0.0"],
           run, editor_env, run / "source-consumer.log", markers=("DELIVERY_RESULT",))

    def build(name, mode, corrected):
        write_preset(project, templates, corrected)
        output = run / ("export-" + name)
        output.mkdir()
        invoke(editor + ["--export-" + mode, "Linux Desktop", str(output / "game.x86_64")],
               run, editor_env, run / (name + "-export.log"))
        delivery = run / ("delivery-" + name)
        receipt = copy_application(output, delivery)
        # Preserve source/asset notices outside the PCK as part of local delivery.
        copy_notices(project, delivery)
        return delivery, receipt

    def consume(name, delivery, mode, title, speed, app_version, expected=0, extra=()):
        environment = isolated_environment(run / ("player-" + name))
        invoke([str(delivery / "game.x86_64"), "--headless", "--fixed-fps", "60", "--", "smoke",
                title, mode, str(speed), app_version], delivery, environment,
               run / (name + "-consumer.log"), expected, ("DELIVERY_RESULT", *extra))

    bad, _ = build("missing-filters", "release", False)
    consume("missing-filters", bad, "release", "Training shift", 400, "1.0.0", 1,
            ("packaged title consumed", "unreleased JSON excluded"))
    v1, v1_receipt = build("v1-release", "release", True)
    consume("v1-release", v1, "release", "Training shift", 400, "1.0.0")
    debug, _ = build("v1-debug", "debug", True)
    consume("v1-debug", debug, "debug", "Training shift", 400, "1.0.0")
    invoke(editor + ["--script", str(AUTHORING / "author_variant.gd")],
           run, editor_env, run / "author-v2.log", markers=("AUTHOR_OK",))
    text = project_file.read_text().replace('config/version="1.0.0"', 'config/version="1.1.0"')
    text = text.replace('run/main_scene="res://main.tscn"', 'run/main_scene="res://variant.tscn"')
    if 'run/main_scene="res://variant.tscn"' not in text:
        raise RuntimeError("V2 main scene selection did not change")
    project_file.write_text(text)
    (project / "stage_title.txt").write_text("Night shift\n")
    v2, _ = build("v2-release", "release", True)
    consume("v2-release", v2, "release", "Night shift", 240, "1.1.0")
    consume("v1-after-v2", v1, "release", "Training shift", 400, "1.0.0")
    if any(digest(v1 / name) != value for name, value in v1_receipt.items()):
        raise RuntimeError("Original delivered package changed")
    if any(digest(project / name) != value for name, value in original.items()):
        raise RuntimeError("Original upstream game scripts/scenes changed")
    print("PASS: source → debug/release application → copied package → V2 → unchanged V1", flush=True)


if __name__ == "__main__":
    main()
