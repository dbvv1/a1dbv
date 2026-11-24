"""Create matching low and medium GPU meshes from the licensed Boulder 01 scan."""
import json
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1] / "assets" / "boulder"
SOURCE = json.loads((ROOT / "boulder_01_1k.gltf").read_text(encoding="utf-8"))
BUFFER = (ROOT / SOURCE["buffers"][0]["uri"]).read_bytes()


def accessor(number, width, dtype):
    a = SOURCE["accessors"][number]
    view = SOURCE["bufferViews"][a["bufferView"]]
    return np.frombuffer(BUFFER, dtype, a["count"] * width, view["byteOffset"]).reshape(-1, width)


POSITION = accessor(0, 3, "<f4")
NORMAL = accessor(1, 3, "<f4")
UV = accessor(2, 2, "<f4")
TRIANGLES = accessor(3, 1, "<u4").reshape(-1, 3)


def simplify(grid, atlas):
    normalized = (POSITION - POSITION.min(axis=0)) / np.ptp(POSITION, axis=0)
    spatial = np.floor(normalized * grid).astype(np.int32)
    keys = np.column_stack((spatial, np.floor(UV * atlas))).astype(np.int32)
    cells, mapping = np.unique(keys, axis=0, return_inverse=True)
    mapping = mapping.reshape(-1)
    count = np.bincount(mapping, minlength=len(cells))

    def collapse(field):
        return np.stack([np.bincount(mapping, axis) / count for axis in field.T], axis=-1).astype("<f4")

    _, where = np.unique(spatial, axis=0, return_inverse=True)
    where = where.reshape(-1)
    spatial_count = np.bincount(where)
    shared = np.stack([np.bincount(where, channel) / spatial_count for channel in POSITION.T], axis=-1)
    _, site_lookup = np.unique(cells[:, :3], axis=0, return_inverse=True)
    position = shared[site_lookup.reshape(-1)].astype("<f4")
    normal, uv = map(collapse, (NORMAL, UV))
    normal /= np.maximum(.00001, np.linalg.norm(normal, axis=-1, keepdims=True))
    faces = mapping[TRIANGLES]
    a, b, c = site_lookup.reshape(-1)[faces].T
    faces = faces[(a != b) & (b != c) & (c != a)]
    _, unique = np.unique(np.sort(faces, axis=1), axis=0, return_index=True)
    return position, normal, uv, faces[np.sort(unique)].astype("<u4").reshape(-1, 1)


def save(name, arrays):
    doc = json.loads(json.dumps(SOURCE))
    payload = bytearray()
    for i, values in enumerate(arrays):
        view = doc["bufferViews"][i]
        view["byteOffset"], view["byteLength"] = len(payload), values.nbytes
        payload.extend(values.tobytes())
        doc["accessors"][i]["count"] = len(values)
    doc["accessors"][0]["min"] = arrays[0].min(axis=0).tolist()
    doc["accessors"][0]["max"] = arrays[0].max(axis=0).tolist()
    doc["buffers"][0] = {"byteLength": len(payload), "uri": name + ".bin"}
    (ROOT / (name + ".bin")).write_bytes(payload)
    (ROOT / (name + ".gltf")).write_text(json.dumps(doc, separators=(",", ":")), encoding="utf-8")
    print(name, len(arrays[0]), len(arrays[3]) // 3)


if __name__ == "__main__":
    save("boulder-near", simplify(62, 38))
    save("boulder-field", simplify(22, 18))
