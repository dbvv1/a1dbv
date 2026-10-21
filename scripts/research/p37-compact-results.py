"""Remove bulky snapshots, preserving their canonical Python JSON SHA-256."""
import hashlib
import json
from pathlib import Path

results = json.loads(Path("results.json").read_text())
for artifact in results["artifacts"].values():
    snapshot = artifact.pop("snapshot")
    canonical = json.dumps(snapshot, sort_keys=True, separators=(",", ":"))
    artifact["semanticSnapshotSHA256"] = hashlib.sha256(canonical.encode()).hexdigest()
Path("compact-results.json").write_text(json.dumps(results, indent=2) + "\n")
