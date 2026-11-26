#!/usr/bin/env python3
"""Pixel-level visual regression pre-gate for locked-camera 3D game comparisons.

Passing this pre-gate is ONLY a necessary filter against washed-out lighting,
shadow-floor collapse, dynamic-range compression, and severe desaturation.
It does NOT prove an aesthetic or 3A quality upgrade; any passing pair must
still pass a code-blind, dual-order pairwise VLM critique and human review.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def load_rgb(path: Path, top_crop_ratio: float) -> np.ndarray:
    if not (0.0 <= top_crop_ratio < 1.0):
        raise ValueError(f"--top-crop-ratio must be in [0.0, 1.0), got {top_crop_ratio}")
    img = Image.open(path).convert("RGB")
    arr = np.asarray(img, dtype=np.float32)
    if arr.shape[0] < 1 or arr.shape[1] < 1:
        raise ValueError(f"Empty image dimensions: {arr.shape}")
    if top_crop_ratio > 0.0:
        crop_y = int(round(arr.shape[0] * top_crop_ratio))
        if crop_y >= arr.shape[0]:
            raise ValueError(
                f"--top-crop-ratio={top_crop_ratio} crops entire image height {arr.shape[0]}"
            )
        arr = arr[crop_y:, :]
    return arr


def split_side_by_side(arr: np.ndarray, center_gap: int) -> tuple[np.ndarray, np.ndarray]:
    width = arr.shape[1]
    if width < 2:
        raise ValueError(f"Side-by-side image width must be >= 2, got {width}")
    mid = width // 2
    half_gap = max(0, center_gap // 2)
    left_end = mid - half_gap
    right_start = mid + half_gap
    if left_end <= 0 or right_start >= width:
        raise ValueError(
            f"--center-gap={center_gap} leaves empty half on image width {width}"
        )
    left = arr[:, :left_end]
    right = arr[:, right_start:]
    aligned_w = min(left.shape[1], right.shape[1])
    return left[:, :aligned_w], right[:, -aligned_w:]


def measure_stats(rgb: np.ndarray) -> dict[str, float]:
    lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    max_c = rgb.max(axis=-1)
    min_c = rgb.min(axis=-1)
    sat = np.where(max_c > 1.0, (max_c - min_c) / (max_c + 1e-6), 0.0)
    p5 = float(np.percentile(lum, 5))
    p50 = float(np.percentile(lum, 50))
    p95 = float(np.percentile(lum, 95))
    return {
        "p5": round(p5, 2),
        "p50": round(p50, 2),
        "p95": round(p95, 2),
        "rms": round(float(lum.std()), 2),
        "dynamic_range": round(p95 - p5, 2),
        "mean_sat": round(float(sat.mean()), 4),
        "dark_pct": round(float((lum < 40.0).mean() * 100.0), 2),
    }


def maybe_compute_flip(baseline: np.ndarray, candidate: np.ndarray) -> dict[str, object]:
    if baseline.shape != candidate.shape:
        return {"status": "skipped_shape_mismatch"}
    try:
        import flip_evaluator  # type: ignore
    except ImportError:
        return {"status": "not_installed"}
    ref = np.clip(baseline / 255.0, 0.0, 1.0)
    test = np.clip(candidate / 255.0, 0.0, 1.0)
    _, mean_err, _ = flip_evaluator.evaluate(ref, test, "LDR")
    return {"status": "ok", "mean_ldr_flip": round(float(mean_err), 4)}


def evaluate_pair(
    baseline_rgb: np.ndarray,
    candidate_rgb: np.ndarray,
    args: argparse.Namespace,
) -> dict[str, object]:
    base = measure_stats(baseline_rgb)
    cand = measure_stats(candidate_rgb)

    p5_lift = round(cand["p5"] - base["p5"], 2)
    rms_drop_pct = round(
        ((base["rms"] - cand["rms"]) / base["rms"] * 100.0) if base["rms"] > 1e-6 else 0.0, 2
    )
    dr_drop_pct = round(
        ((base["dynamic_range"] - cand["dynamic_range"]) / base["dynamic_range"] * 100.0)
        if base["dynamic_range"] > 1e-6
        else 0.0,
        2,
    )
    sat_drop_pct = round(
        ((base["mean_sat"] - cand["mean_sat"]) / base["mean_sat"] * 100.0)
        if base["mean_sat"] > 1e-6
        else 0.0,
        2,
    )
    dark_collapse_pct = round(
        ((base["dark_pct"] - cand["dark_pct"]) / base["dark_pct"] * 100.0)
        if base["dark_pct"] > 1e-6
        else 0.0,
        2,
    )

    reasons: list[str] = []
    if p5_lift > args.max_p5_lift:
        reasons.append(f"p5_shadow_floor_lift: +{p5_lift} > +{args.max_p5_lift}")
    if (
        base["dark_pct"] >= args.min_baseline_dark_pct
        and dark_collapse_pct > args.max_dark_collapse_pct
    ):
        reasons.append(
            f"dark_shadow_collapse: -{dark_collapse_pct}% > -{args.max_dark_collapse_pct}%"
        )
    if rms_drop_pct > args.max_rms_drop_pct:
        reasons.append(f"rms_contrast_drop: -{rms_drop_pct}% > -{args.max_rms_drop_pct}%")
    if dr_drop_pct > args.max_dr_drop_pct:
        reasons.append(f"dynamic_range_drop: -{dr_drop_pct}% > -{args.max_dr_drop_pct}%")
    if sat_drop_pct > args.max_sat_drop_pct:
        reasons.append(f"saturation_drop: -{sat_drop_pct}% > -{args.max_sat_drop_pct}%")

    result: dict[str, object] = {
        "baseline": base,
        "candidate": cand,
        "deltas": {
            "p5_lift": p5_lift,
            "dark_collapse_pct": dark_collapse_pct,
            "rms_drop_pct": rms_drop_pct,
            "dr_drop_pct": dr_drop_pct,
            "sat_drop_pct": sat_drop_pct,
        },
        "verdict": "FAIL" if reasons else "PASS",
        "reasons": reasons,
    }
    if args.flip:
        result["flip"] = maybe_compute_flip(baseline_rgb, candidate_rgb)
    return result


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, help="Baseline screenshot path")
    parser.add_argument("--candidate", type=Path, help="Candidate screenshot path")
    parser.add_argument("--side-by-side", type=Path, help="Stitched Left|Right PNG path")
    parser.add_argument("--top-crop-ratio", type=float, default=0.0, help="Crop top HUD/title ratio")
    parser.add_argument("--center-gap", type=int, default=4, help="Pixel gap at side-by-side seam")
    parser.add_argument("--flip", action="store_true", help="Compute NVIDIA LDR-FLIP if installed")
    parser.add_argument("--max-p5-lift", type=float, default=15.0)
    parser.add_argument("--max-rms-drop-pct", type=float, default=20.0)
    parser.add_argument("--max-dr-drop-pct", type=float, default=20.0)
    parser.add_argument("--max-sat-drop-pct", type=float, default=25.0)
    parser.add_argument("--max-dark-collapse-pct", type=float, default=60.0)
    parser.add_argument("--min-baseline-dark-pct", type=float, default=8.0)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        if args.side_by_side:
            full = load_rgb(args.side_by_side, args.top_crop_ratio)
            base_rgb, cand_rgb = split_side_by_side(full, args.center_gap)
        elif args.baseline and args.candidate:
            base_rgb = load_rgb(args.baseline, args.top_crop_ratio)
            cand_rgb = load_rgb(args.candidate, args.top_crop_ratio)
        else:
            print(
                "Error: specify either --side-by-side or both --baseline and --candidate.",
                file=sys.stderr,
            )
            return 2
    except (OSError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    report = evaluate_pair(base_rgb, cand_rgb, args)
    print(json.dumps(report, ensure_ascii=True, indent=2))
    return 0 if report["verdict"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
