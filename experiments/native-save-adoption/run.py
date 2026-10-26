"""Real official/SaveKit scene consumers; no replacement serializer or VM."""
import argparse
import hashlib
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import urllib.request
import zipfile

HERE = Path(__file__).resolve().parent
SAVEKIT_COMMIT = "9ca2dabdfd24712a2ad60b76d0a04e5a981b6e4a"
OFFICIAL_URL = "https://github.com/godotengine/godot-demo-projects/releases/download/4.7-6ad6167/loading_serialization.zip"
OFFICIAL_SHA = "7411444c576b9b0d1cb44fb5eea8d8c88f912497f4448778357ca3e69caf6f3e"
MIGRATION = '''
# This project changed click_count's new-game default from 0 to 1.
# Its only legacy schema omitted zero; missing in that schema means old zero.
func load_from_dict(s: SaveKitDeserializer, values: Dictionary) -> void:
	# Supply the legacy domain default before decoding, not an unencoded value
	# inserted into the serializer's wire-format dictionary.
	if not values.has("click_count"):
		click_count = 0
	super.load_from_dict(s, values)

func save_to_dict(s: SaveKitSerializer) -> Dictionary:
	var values := super.save_to_dict(s)
	values["click_count"] = s.encode_var(click_count)
	return values
'''


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def copy_fixed_source(source, target):
    commit = subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip()
    if commit != SAVEKIT_COMMIT:
        raise ValueError("Expected fixed SaveKit source commit")
    subprocess.run(["git", "-C", str(source), "diff", "--exit-code", "HEAD", "--"], check=True,
                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    files = subprocess.check_output(["git", "-C", str(source), "ls-files", "-z"]).decode().split("\0")
    for name in filter(None, files):
        path = Path(name)
        # Copy the complete playable demo and plugin, not optional GUT/CI sources.
        if path.parts[0] in ("tests", ".github") or name == ".gutconfig.json":
            continue
        if path.is_absolute() or ".." in path.parts or (source / path).is_symlink():
            raise ValueError("Unexpected tracked path")
        destination = target / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source / path, destination)


def extract_official(archive, root):
    if digest(archive) != OFFICIAL_SHA:
        raise ValueError("Official demo archive hash mismatch")
    with zipfile.ZipFile(archive) as bundle:
        for item in bundle.infolist():
            path = Path(item.filename)
            if path.is_absolute() or ".." in path.parts:
                raise ValueError("Archive path escapes destination")
        bundle.extractall(root)
    return root / "serialization"


def environment(root):
    env = dict(os.environ)
    for key, name in (("HOME", "home"), ("XDG_CONFIG_HOME", "config"),
                      ("XDG_DATA_HOME", "data"), ("XDG_CACHE_HOME", "cache"), ("TMPDIR", "tmp")):
        path = root / name
        path.mkdir(parents=True, exist_ok=True)
        env[key] = str(path)
    return env


def invoke(command, cwd, env, log, expected=0, marker=None):
    result = subprocess.run(command, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, timeout=45)
    log.write_text(result.stdout)
    if result.returncode != expected:
        raise RuntimeError(f"{log.name}: exit {result.returncode}, expected {expected}")
    if "ERROR:" in result.stdout or (expected == 0 and "SAVE_FAILED:" in result.stdout):
        raise RuntimeError(f"{log.name}: native error despite expected exit")
    if expected == 1:
        failures = [line for line in result.stdout.splitlines() if line.startswith("SAVE_FAILED:")]
        if set(failures) != {"SAVE_FAILED: untouched old green remains zero",
                             "SAVE_FAILED: original UI consumes old zero"}:
            raise RuntimeError(f"{log.name}: unexpected counterexample failures: {failures}")
    if marker and marker not in result.stdout:
        raise RuntimeError(f"{log.name}: missing result")
    print("PASS", log.stem, flush=True)


def wire_probe(project):
    shutil.copy2(HERE / "probe.gd", project / "adoption_probe.gd")
    config = project / "project.godot"
    text = config.read_text()
    # GUT is an optional upstream test dependency, not used by the demo consumer.
    text = text.replace('enabled=PackedStringArray("res://addons/gut/plugin.cfg", "res://addons/savekit/plugin.cfg")',
                        'enabled=PackedStringArray()')
    text = text.replace('SaveManager="*uid://ck4ih2layufdo"',
                        'SaveManager="*res://addons/savekit/save_manager.gd"')
    if "[autoload]" in text:
        text = text.replace("[autoload]", '[autoload]\n\nAdoptionProbe="*res://adoption_probe.gd"', 1)
    else:
        text += '\n[autoload]\n\nAdoptionProbe="*res://adoption_probe.gd"\n'
    config.write_text(text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--godot", type=Path, required=True)
    parser.add_argument("--savekit-source", type=Path, required=True)
    parser.add_argument("--official-archive", type=Path)
    parser.add_argument("--work-dir", type=Path, required=True, help="External workspace directory for preserved native evidence")
    args = parser.parse_args()
    engine, source = args.godot.resolve(), args.savekit_source.resolve()
    if not engine.is_file() or not os.access(engine, os.X_OK):
        parser.error("Missing official Godot 4.7.2 executable")
    if not (source / ".git").exists():
        parser.error("Missing fixed SaveKit Git checkout (release ZIP excludes its demo)")
    work = args.work_dir.resolve()
    work.mkdir(parents=True, exist_ok=True)
    root = Path(tempfile.mkdtemp(prefix="run-", dir=work))
    env = environment(root / "environment")
    version = subprocess.check_output([str(engine), "--version"], env=env, text=True).strip()
    if version != "4.7.2.stable.official.ed1daf0bf":
        raise RuntimeError("Wrong engine version")
    print("Evidence:", root, flush=True)
    archive = args.official_archive
    if archive is None:
        archive = root / "official.zip"
        with urllib.request.urlopen(OFFICIAL_URL, timeout=30) as response, archive.open("wb") as target:
            shutil.copyfileobj(response, target)
    official = extract_official(archive, root)
    kit = root / "savekit"
    copy_fixed_source(source, kit)
    core = {str(p.relative_to(kit)): digest(p) for p in (kit / "addons/savekit").rglob("*") if p.is_file()}
    for project in (official, kit):
        wire_probe(project)
        invoke([str(engine), "--headless", "--path", str(project), "--import"], root, env,
               root / (project.name + "-import.log"))

    def run(project, phase, expected=0):
        invoke([str(engine), "--headless", "--path", str(project), "--fixed-fps", "60", "--", phase],
               root, env, root / (phase + ".log"), expected, f"SAVE_RESULT phase={phase}")

    run(official, "official-save")
    run(official, "official-load")
    run(kit, "save")
    originals = list((root / "environment/data").rglob("original.json"))
    if len(originals) != 1:
        raise RuntimeError("Expected exactly one native original save")
    original_hash = digest(originals[0])
    run(kit, "load-v1")
    box = kit / "demo/box_data.gd"
    original_box = box.read_text()
    changed = original_box.replace('click_count: int = 0', 'click_count: int = 1')
    if changed == original_box:
        raise RuntimeError("Authored default did not change")
    box.write_text(changed)
    run(kit, "fresh-v2")
    run(kit, "load-v2-unmigrated", 1)
    box.write_text(changed + MIGRATION)
    run(kit, "load-v2-migrated")
    run(kit, "fresh-v2-migrated")
    if digest(originals[0]) != original_hash:
        raise RuntimeError("Original save changed")
    if any(digest(kit / name) != value for name, value in core.items()):
        raise RuntimeError("Upstream SaveKit implementation changed")
    print("PASS: official JSON world → SaveKit original world → default-change counterexample → project migration", flush=True)


if __name__ == "__main__":
    main()
