"""Cut, fit and subdivide the CC0 MakeHuman hands for the Boreal glove rig."""
import json
from collections import defaultdict
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "evidence" / "makehuman-source"
RIG = json.loads((SOURCE / "default.mhskel").read_bytes())
WEIGHTS = json.loads((SOURCE / "default_weights.mhw").read_bytes())["weights"]


def load_obj():
    verts, faces = [], []
    group = ""
    for line in (SOURCE / "base.obj").read_text(encoding="utf-8").splitlines():
        cols = line.split()
        if not cols:
            continue
        if cols[0] == "g":
            group = cols[1]
        elif cols[0] == "v":
            verts.append(list(map(float, cols[1:4])))
        elif cols[0] == "f" and group == "body":
            faces.append([int(part.split("/")[0]) - 1 for part in cols[1:]])
    return np.array(verts), faces


VERTS, FACES = load_obj()


def unit(v):
    return v / max(np.linalg.norm(v), 1e-8)


def hand(side):
    group = "L" if side < 0 else "R"
    suffix = "." + group
    chains = [[f"finger{i}-{k}{suffix}" for k in (1, 2, 3)] for i in (2, 3, 4, 5, 1)]
    wrist = "wrist" + suffix

    def joint(bone, end):
        return VERTS[RIG["joints"][RIG["bones"][bone][end]]].mean(axis=0)

    origin = joint(wrist, "head")
    base = np.array([joint(chain[0], "head") for chain in chains[:4]])
    z = -unit(base.mean(axis=0) - origin)
    x = -side * unit(base[0] - base[-1])
    x = unit(x - z * np.dot(x, z))
    y = unit(np.cross(z, x))
    basis = np.stack((x, y, z), axis=1)

    def local(pos):
        return (pos - origin) @ basis * .108 + (0.0, -.005, .103)

    points = local(VERTS)
    bone_names = [wrist, *[name for chain in chains for name in chain]]
    chains_local = np.array([local(np.array([joint(name, "head") for name in chain] + [joint(chain[-1], "tail")])) for chain in chains])
    # Keep only vertices on the relevant anatomical hand and its wrist overlap.
    mask = (VERTS[:, 0] * -side > 3.65) & (points[:, 2] < .132)
    face_ids = [face for face in FACES if all(mask[i] for i in face)]
    local_ids = sorted(set(i for face in face_ids for i in face))
    ids = {index: i for i, index in enumerate(local_ids)}
    faces = [[ids[i] for i in face] for face in face_ids]
    p = points[local_ids]
    weights = np.zeros((len(p), len(bone_names)))
    for j, name in enumerate(bone_names):
        for source_index, amount in WEIGHTS[name]:
            if source_index in ids:
                weights[ids[source_index], j] = amount
    weights[:, 0] = np.maximum(weights[:, 0], 1 - weights[:, 1:].sum(axis=1))

    # One subdivision level preserves the connected finger web and palm topology.
    face_fields = []
    edge_faces = defaultdict(list)
    vertex_faces = defaultdict(list)
    vertex_edges = defaultdict(set)
    field = np.concatenate((p, weights), axis=1)
    for i, face in enumerate(faces):
        face_fields.append(field[face].mean(axis=0))
        for a, b in zip(face, face[1:] + face[:1]):
            e = tuple(sorted((a, b)))
            edge_faces[e].append(i)
            vertex_faces[a].append(i)
            vertex_edges[a].add(e)
            vertex_edges[b].add(e)
    cooked = []
    for i, vertex in enumerate(field):
        edges = vertex_edges[i]
        rim = [e for e in edges if len(edge_faces[e]) == 1]
        if rim:
            other = [field[e[0] if e[1] == i else e[1]] for e in rim]
            cooked.append(vertex * .75 + np.array(other).mean(axis=0) * .25)
        else:
            faces_near = np.array([face_fields[f] for f in vertex_faces[i]]).mean(axis=0)
            midpoints = np.array([field[list(e)].mean(axis=0) for e in edges]).mean(axis=0)
            n = len(edges)
            cooked.append((faces_near + 2 * midpoints + (n - 3) * vertex) / n)
    edge_ids = {}
    for e, neighbors in edge_faces.items():
        edge_ids[e] = len(cooked)
        edge = field[list(e)].mean(axis=0)
        if len(neighbors) == 2:
            edge = (edge * 2 + face_fields[neighbors[0]] + face_fields[neighbors[1]]) / 4
        cooked.append(edge)
    triangles = []
    for i, face in enumerate(faces):
        centre = len(cooked)
        cooked.append(face_fields[i])
        for j, current in enumerate(face):
            following = edge_ids[tuple(sorted((current, face[(j + 1) % len(face)])))]
            preceding = edge_ids[tuple(sorted((face[j - 1], current)))]
            triangles.extend(((current, following, centre), (current, centre, preceding)))

    fields = np.array(cooked)
    xyz = fields[:, :3]
    triangles = np.array(triangles)
    cross = np.cross(xyz[triangles[:, 1]] - xyz[triangles[:, 0]], xyz[triangles[:, 2]] - xyz[triangles[:, 0]])
    normal = np.zeros_like(xyz)
    for i in range(3):
        np.add.at(normal, triangles[:, i], cross)
    normal /= np.maximum(1e-8, np.linalg.norm(normal, axis=1, keepdims=True))
    dorsal = np.clip(normal[:, 1], 0, 1)
    knuckles = np.exp(-((xyz[:, 2] + .005) / .035) ** 2)
    wrist_fade = 1 - np.clip((xyz[:, 2] - .099) / .028, 0, 1)
    xyz = xyz + normal * ((.0027 + .0043 * dorsal * knuckles) * wrist_fade)[:, None]
    weights = np.maximum(0, fields[:, 3:])
    joints = np.argsort(weights, axis=1)[:, -4:][:, ::-1]
    weights = np.take_along_axis(weights, joints, axis=1)
    weights /= np.maximum(1e-8, weights.sum(axis=1, keepdims=True))
    return {"position": xyz.round(5).ravel().tolist(), "index": triangles.ravel().tolist(),
            "joint": joints.ravel().tolist(), "weight": weights.round(4).ravel().tolist(), "chains": chains_local.round(5).tolist()}


if __name__ == "__main__":
    hands = [hand(-1), hand(1)]
    target = ROOT / "assets" / "gloves.json"
    target.write_text(json.dumps(hands, separators=(",", ":")), encoding="utf-8")
    for h in hands:
        print(len(h["position"]) // 3, "vertices", len(h["index"]) // 3, "triangles")
