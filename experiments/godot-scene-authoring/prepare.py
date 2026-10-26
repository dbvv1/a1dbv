"""Fetch a fixed official demo; preserve its source and asset licenses."""
import hashlib
import io
from pathlib import Path
import stat
import urllib.request
import zipfile

URL = "https://github.com/godotengine/godot-demo-projects/releases/download/4.7-6ad6167/2d_dodge_the_creeps.zip"
SHA256 = "cebca9d95eccd4fafa2b9c3892fd75be527c25044e6e78f91fe92b76ece29052"


def extract_verified(data: bytes, destination: Path, digest: str = SHA256) -> Path:
    if hashlib.sha256(data).hexdigest() != digest:
        raise ValueError("Official demo archive checksum mismatch")
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        for entry in archive.infolist():
            path = Path(entry.filename)
            if (path.is_absolute() or ".." in path.parts or not path.parts
                    or path.parts[0] != "dodge_the_creeps"
                    or stat.S_ISLNK(entry.external_attr >> 16)):
                raise ValueError("Unsafe archive entry")
        archive.extractall(destination)
    project = destination / "dodge_the_creeps"
    for name in ("project.godot", "main.gd", "player.gd", "LICENSE.md", "fonts/LICENSE.txt"):
        if not (project / name).is_file():
            raise ValueError(f"Missing official demo input: {name}")
    return project


def prepare(destination: Path, archive: Path | None) -> Path:
    if archive is not None:
        data = archive.read_bytes()
    else:
        with urllib.request.urlopen(URL, timeout=60) as response:
            data = response.read(4 * 1024 * 1024)
    return extract_verified(data, destination)
