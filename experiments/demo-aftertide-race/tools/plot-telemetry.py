"""Render the deterministic CSVs produced by tools/telemetry.mjs."""
import csv
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator


OUT = Path(__file__).resolve().parents[1] / "telemetry"
BG, AX, INK, MUTED, GRID = "#101a21", "#17252d", "#f3e9db", "#a7b8bf", "#334852"
AMBER, BLUE, RED, GREEN = "#f6b96c", "#77c8e3", "#f78980", "#a8d28c"
WHEELS = {"FL": AMBER, "FR": BLUE, "RL": RED, "RR": GREEN}
INFO = json.loads((OUT / "summary.json").read_text(encoding="utf-8"))
plt.rcParams.update({
    "figure.facecolor": BG, "axes.facecolor": AX, "axes.edgecolor": GRID,
    "axes.labelcolor": MUTED, "axes.titlecolor": INK, "text.color": INK,
    "xtick.color": MUTED, "ytick.color": MUTED, "grid.color": GRID,
    "axes.titlesize": 11, "axes.labelsize": 9, "legend.fontsize": 8,
    "legend.labelcolor": INK, "font.family": "DejaVu Sans",
    "xtick.labelsize": 8, "ytick.labelsize": 8, "savefig.facecolor": BG
})


def load(name):
    with (OUT / (name + ".csv")).open(encoding="utf-8", newline="") as f:
        return [{k: float(v) for k, v in row.items()} for row in csv.DictReader(f)]


def series(data, key):
    return [row[key] for row in data]


def chart(ax, title, unit, x, data, lines, legend=True):
    ax.set_title(title, loc="left", fontweight="bold", pad=8)
    ax.set_ylabel(unit)
    ax.grid(alpha=0.75, linewidth=0.55)
    ax.set_axisbelow(True)
    ax.yaxis.set_major_locator(MaxNLocator(6))
    for k, label, color, style in lines:
        ax.plot(x, series(data, k), label=label, color=color, linestyle=style, linewidth=1.45)
    ax.set_xlim(x[0], x[-1])
    if legend:
        ax.legend(loc="upper right", frameon=False, ncols=min(4, len(lines)), handlelength=1.45)


def headline(fig, title, subtitle):
    header = .958
    fig.text(.079, header, title, fontsize=20, weight="bold", va="top")
    fig.text(.080, header - .40 / fig.get_figheight(), subtitle, fontsize=9.3, color=MUTED, va="top")


cases = {
    "launch": ("Full-throttle launch", lambda v: f"0–100 km/h   {v['zeroTo100']:.3f} s     |     Peak longitudinal acceleration   {v['maxDriveG']:.2f} g"),
    "circle": ("Skidpad / hold and push past grip", lambda v: f"Steady   {v['steadyKmh']:.1f} km/h · {v['steadyRadius']:.1f} m · {v['steadyLatG']:.3f} g     |     Peak   {v['maxLatG']:.3f} g"),
    "lane-change": ("Single lane change at 85 km/h", lambda v: f"Lateral displacement   {v['endX']:.2f} m     |     Exit heading   {v['endYaw']:.2f}°     |     Peak   {v['maxLatG']:.3f} g"),
    "hairpin": ("Hairpin / brake, rotate, exit", lambda v: f"Entry   108 km/h     |     Apex   {v['apexSpeed']:.1f} km/h     |     Peak brake   {v['maxBrakeG']:.3f} g     |     Wall contacts   0"),
    "drift-recovery": ("Hairpin / handbrake and countersteer", lambda v: f"Peak body slip   {v['maxBeta']:.1f}°     |     Opposite rack   {v['peakCountersteer']:.1f}°     |     Back under 3° in   {v['secondsToRecover']:.3f} s"),
    "wall-contact": ("Oblique guardrail contact", lambda v: f"Before contact   {v['firstContactKmh']:.1f} km/h     |     0.5 s later   {v['speedAfterHalfSecond']:.1f} km/h     |     Contact at   {v['firstContact']:.3f} s")
}

for kind, (title, subtitle) in cases.items():
    data = load(kind)
    t = series(data, "time")
    fig, ax = plt.subplots(3, 2, figsize=(11.3, 8.25), sharex=True)
    fig.subplots_adjust(left=.08, right=.966, top=.856, bottom=.084, hspace=.39, wspace=.235)
    headline(fig, title, subtitle(INFO[kind]))
    chart(ax[0, 0], "Speed", "km/h", t, data, [("speed", "Speed", BLUE, "-")], False)
    chart(ax[0, 1], "Acceleration", "g", t, data,
          [("latG", "Lateral", AMBER, "-"), ("longG", "Longitudinal", BLUE, "--")])
    chart(ax[1, 0], "Tire slip", "deg", t, data, [(f"{w}_slip", w, color, "-") for w, color in WHEELS.items()])
    chart(ax[1, 1], "Normal load", "N", t, data, [(f"{w}_load", w, color, "-") for w, color in WHEELS.items()])
    chart(ax[2, 0], "Yaw rate and body slip", "deg/s · deg", t, data,
          [("yawRate", "Yaw deg/s", BLUE, "-"), ("beta", "Body slip deg", AMBER, "--")])
    inputs = [("throttle", "Throttle", GREEN, "-"), ("brake", "Brake", RED, "-"), ("hand", "Handbrake", AMBER, "--")]
    if kind == "wall-contact":
        inputs = [("impact", "Contact envelope", RED, "-")]
    chart(ax[2, 1], "Pedal and lever state" if kind != "wall-contact" else "Impact feedback", "0–1", t, data, inputs)
    ax[2, 1].set_ylim(-.04, 1.13)
    for a in ax[2]:
        a.set_xlabel("Time (s)")
    if kind == "circle":
        for a in ax.flat:
            a.axvspan(10, 14, color=BLUE, alpha=.07, linewidth=0)
    elif kind == "drift-recovery":
        for a in ax.flat:
            a.axvline(INFO[kind]["peakTime"], color=AMBER, alpha=.58, linewidth=.8, linestyle=":")
    elif kind == "wall-contact":
        for a in ax.flat:
            a.axvline(INFO[kind]["firstContact"], color=AMBER, alpha=.58, linewidth=.8, linestyle=":")
    fig.text(.080, .022, "Physics 120 Hz    /    CSV 40 Hz    /    FL FR RL RR viewed from driver's seat", fontsize=8, color=MUTED)
    fig.savefig(OUT / (kind + ".png"), dpi=155)
    plt.close(fig)

fig, ax = plt.subplots(1, 2, figsize=(11.3, 4.6))
fig.subplots_adjust(left=.08, right=.965, top=.74, bottom=.17, wspace=.26)
headline(fig, "Steering response and tire curve", "85 km/h, 1.318° rack step    /    Pure lateral force before friction ellipse and load sensitivity")
r = load("step-steer")
s = INFO["response"]
settled = [p["yawRate"] for p in r if p["time"] >= 1]
steady_yaw = sum(settled) / len(settled)
out = [{**x, "yawNorm": x["yawRate"] / steady_yaw,
        "rackNorm": x["steer"] / s["stepRackDegrees"]} for x in r]
chart(ax[0], "Step response, normalized", "fraction of steady response", series(out, "time"), out,
      [("rackNorm", "Rack", AMBER, "-"), ("yawNorm", "Yaw rate", BLUE, "-")])
ax[0].legend(loc="lower right", frameon=False, ncols=2, handlelength=1.45)
ax[0].axhline(.9, color=MUTED, alpha=.64, linestyle=":", linewidth=.8)
ax[0].set_xlim(0, .75)
ax[0].set_xlabel("Time (s)")
data = load("tire-curve")
chart(ax[1], "Pure lateral tire force", "fraction of peak", series(data, "slip_deg"), data,
      [("front", "Front", AMBER, "-"), ("rear", "Rear", BLUE, "--")])
for k, color in [("frontPeak", AMBER), ("rearPeak", BLUE)]:
    ax[1].axvline(s[k], color=color, alpha=.64, linestyle=":", linewidth=.8)
ax[1].set_xlabel("Absolute tire slip angle (deg)")
fig.savefig(OUT / "response-and-tires.png", dpi=155)
plt.close(fig)
