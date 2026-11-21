"""Create the synthetic local PEP 503 input for the uv CLI task."""
import argparse
from pathlib import Path
from zipfile import ZipFile, ZipInfo


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", type=Path, help="new empty index directory")
    args = parser.parse_args()
    root = args.directory.resolve()
    root.mkdir(parents=True, exist_ok=False)
    page = root / "fixturepkg"
    page.mkdir()
    links = []
    for version, withdrawn in (
        ("0.0.23", False), ("0.0.24.dev1", True), ("0.0.24", False),
        ("0.0.33", False), ("0.0.34.dev8", True), ("0.0.34", False),
        ("0.1.0", False),
    ):
        name = f"fixturepkg-{version}"
        wheel = f"{name}-py3-none-any.whl"
        with ZipFile(page / wheel, "w") as archive:
            metadata = (
                f"Metadata-Version: 2.3\nName: fixturepkg\nVersion: {version}\n"
                "Requires-Python: >=3.14\n\n"
            )
            info = "Wheel-Version: 1.0\nRoot-Is-Purelib: true\nTag: py3-none-any\n"
            for filename, contents in (
                ("METADATA", metadata), ("WHEEL", info),
                ("RECORD", f"{name}.dist-info/RECORD,,\n"),
            ):
                archive.writestr(ZipInfo(f"{name}.dist-info/{filename}"), contents)
        yanked = ' data-yanked="withdrawn-fixture"' if withdrawn else ""
        links.append(f'<a href="{wheel}" data-requires-python="&gt;=3.14"{yanked}>{wheel}</a>')
    (page / "index.html").write_bytes(
        ("<!doctype html><html><body>\n" + "\n".join(links) + "\n</body></html>\n").encode("ascii")
    )
    print(root.as_uri())


if __name__ == "__main__":
    main()
