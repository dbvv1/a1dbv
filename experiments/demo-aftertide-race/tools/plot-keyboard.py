"""Plot the driver-input recordings from check-keyboard.mjs."""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1] / "telemetry"
DATA = json.loads((ROOT / "keyboard-samples.json").read_text(encoding="utf-8"))
M = json.loads((ROOT / "keyboard-summary.json").read_text(encoding="utf-8"))
BG, PANEL, INK, MUTED, GRID = "#111a20", "#19272e", "#f4ebdc", "#a7b8bf", "#364a53"
GOLD, BLUE, RED, GREEN = "#f6ba6b", "#78cce7", "#fb938a", "#a8d78f"
plt.rcParams.update({
    "figure.facecolor": BG, "axes.facecolor": PANEL, "axes.edgecolor": GRID,
    "axes.labelcolor": MUTED, "axes.titlecolor": INK, "text.color": INK,
    "xtick.color": MUTED, "ytick.color": MUTED, "grid.color": GRID,
    "axes.titlesize": 10, "axes.labelsize": 9, "legend.fontsize": 8,
    "legend.labelcolor": INK, "font.family": "DejaVu Sans",
    "xtick.labelsize": 8, "ytick.labelsize": 8, "savefig.facecolor": BG
})


def start(title, detail, rows=2, cols=2):
    fig, axes = plt.subplots(rows, cols, figsize=(11.8, 8.0), squeeze=False)
    fig.subplots_adjust(left=.09, right=.962, top=.822, bottom=.096, hspace=.44, wspace=.24)
    fig.text(.09, .955, title, fontsize=20, weight="bold", va="top")
    fig.text(.09, .892, detail, fontsize=9.4, color=MUTED, va="top")
    return fig, axes.flatten()


def get(r, field):
    return field(r) if callable(field) else r[field]


def line(ax, case, field, label, color, style="-", width=1.55):
    rows = DATA[case]["rows"]
    ax.plot([r["time"] for r in rows], [get(r, field) for r in rows],
            color=color, linestyle=style, label=label, linewidth=width)


def panel(ax, title, unit, limit=None, legend=True):
    ax.set_title(title, loc="left", weight="bold")
    ax.set_ylabel(unit)
    ax.set_xlabel("Time from first keydown (s)")
    ax.grid(alpha=.72, linewidth=.52)
    ax.set_axisbelow(True)
    ax.margins(x=.005)
    if limit:
        ax.set_xlim(*limit)
    if legend:
        ax.legend(loc="best", frameon=False, ncols=2, handlelength=1.45)


def key(case, code, event):
    return next(k["time"] for k in DATA[case]["keys"] if k["code"] == code and k["type"] == event)


def key_band(ax, start, stop, color=GOLD):
    ax.axvspan(start, stop, color=color, alpha=.092, linewidth=0)


def key_plot(ax, case):
    keys = DATA[case]["keys"]
    styles = {
        "KeyD": ("D", GOLD, 1.0), "KeyA": ("A", BLUE, -1.0), "Space": ("Space", RED, .68),
        "KeyW": ("W", GREEN, .93), "KeyS": ("S", RED, .72)
    }
    for code in dict.fromkeys(k["code"] for k in keys):
        label, color, level = styles[code]
        down, up = key(case, code, "down"), key(case, code, "up")
        ax.step([-.1, down, up, DATA[case]["rows"][-1]["time"]], [0, level, 0, 0],
                label=label, color=color, where="post", linewidth=1.65)


def save(fig, name):
    fig.text(.09, .025, "Aftertide  /  trusted Chrome keyevents  /  120 Hz physics, render-frame samples",
             fontsize=8, color=MUTED)
    fig.savefig(ROOT / ("keyboard-" + name + ".png"), dpi=145)
    plt.close(fig)


def right_yaw(r):
    return -r["yawRate"]


def right_rack(r):
    return -r["steer"]


r, l = M["right-100"], M["left-100"]
fig, ax = start("01  Steering direction at 100 km/h",
                f"Held for 1 s  |  D world heading {r['rightHeading']:+.1f}° & screen nose {r['screenNosePx']:+.1f} px"
                f"  |  A {l['rightHeading']:+.1f}° & {l['screenNosePx']:+.1f} px")
directions = [("right-100", "D", GOLD, "-"), ("left-100", "A", BLUE, "-"),
              ("arrow-right-100", "Right arrow", RED, "--"), ("arrow-left-100", "Left arrow", GREEN, "--")]
for j, (field, label, unit) in enumerate([
    ("rightHeading", "Body heading relative to start", "deg, +right"),
    ("screenNose", "Projected nose relative to tail", "native px, +right"),
    ("rightM", "World displacement from initial heading", "m, +right"),
    (right_rack, "Physical front-wheel steering", "deg, +right")
]):
    for case, name, color, style in directions:
        line(ax[j], case, field, name, color, style)
    key_band(ax[j], 0, key("right-100", "KeyD", "up"))
    ax[j].axhline(0, color=MUTED, alpha=.35, linewidth=.7)
    panel(ax[j], label, unit, (-.07, 1.6))
save(fig, "direction")

a, b = M["tap-100"], M["tap-140"]
fig, ax = start("02  A light direction tap",
                f"100 km/h  {a['maxYawRate']:.2f}°/s yaw · {a['maxBeta']:.2f}° body slip"
                f"     |     140 km/h  {b['maxYawRate']:.2f}°/s yaw · {b['maxBeta']:.2f}° body slip")
for j, (field, title, unit) in enumerate([
    (right_rack, "Steer builds and returns", "deg, +right"), (right_yaw, "Yaw rate", "deg/s, +right"),
    (lambda r: -r["beta"], "Body slip", "deg, +right"),
    ("rightM", "Small trajectory correction", "m, +right")
]):
    line(ax[j], "tap-100", field, "100 km/h", GOLD)
    line(ax[j], "tap-140", field, "140 km/h", BLUE)
    key_band(ax[j], 0, key("tap-100", "KeyD", "up"))
    panel(ax[j], title, unit, (-.055, 1.32))
save(fig, "taps")

h = M["hold-100"]
fig, ax = start("03  Holding steer at speed",
                f"100 km/h, D for 3 s   |   {abs(h['steadyYawRate']):.1f}°/s steady yaw"
                f"   |   {abs(h['steadyLatG']):.2f} g steady lateral load   |   {h['maxBeta']:.2f}° peak body slip")
line(ax[0], "hold-100", right_rack, "100 km/h coast", GOLD)
line(ax[0], "power-high-140", right_rack, "140 km/h full throttle", BLUE, "--")
panel(ax[0], "Rack and return", "deg, +right")
line(ax[1], "hold-100", right_yaw, "100 km/h coast", GOLD)
line(ax[1], "power-high-140", right_yaw, "140 km/h full throttle", BLUE, "--")
panel(ax[1], "Yaw rate through the turn", "deg/s, +right")
line(ax[2], "hold-100", lambda r: r["wheels"][0]["load"] / 1000, "Outside front (FL)", GOLD)
line(ax[2], "hold-100", lambda r: r["wheels"][1]["load"] / 1000, "Inside front (FR)", BLUE)
panel(ax[2], "Load transfers to the outside", "kN")
line(ax[3], "hold-100", "cameraYawLag", "Camera heading lag (deg)", GOLD)
line(ax[3], "hold-100", lambda r: 100 * r["tireRms"], "Tire audio (RMS × 100)", BLUE, "--")
panel(ax[3], "Chase yaw and audio before release", "deg / scaled RMS")
for axis in ax:
    key_band(axis, 0, key("hold-100", "KeyD", "up"))
save(fig, "hold")

case = "hairpin-80"
h = M[case]
flip = key(case, "KeyA", "down")
recover = flip + h["recoverAfterCounter"] if h["recoverAfterCounter"] is not None else None
fig, ax = start("04  Handbrake drift into the hairpin",
                f"Entry {h['initialKmh']:.1f} km/h    |    Body slip {h['maxBeta']:.1f}°"
                f"    |    Recovers in {h['recoverAfterCounter']:.2f} s from A keydown")
key_plot(ax[0], case)
panel(ax[0], "Physical keys", "digital input")
line(ax[1], case, "speed", "Road speed", BLUE)
panel(ax[1], "Speed through the maneuver", "km/h")
line(ax[2], case, "beta", "Body slip (deg)", GOLD)
line(ax[2], case, right_rack, "Front steer (deg, +right)", BLUE, "--")
ax[2].axhline(3, color=MUTED, alpha=.68, linewidth=.7, linestyle=":")
panel(ax[2], "Slip and countersteer", "deg")
line(ax[3], case, right_yaw, "Body yaw rate (deg/s, +right)", BLUE)
line(ax[3], case, "cameraYawLag", "Chase heading lag (deg)", GOLD, "--")
panel(ax[3], "Chase lag follows the slide", "deg/s / deg")
for axis in ax:
    key_band(axis, key(case, "Space", "down"), key(case, "Space", "up"), RED)
    axis.axvline(flip, color=BLUE, alpha=.72, linewidth=.85, linestyle=":")
    if recover is not None:
        axis.axvline(recover, color=GREEN, alpha=.72, linewidth=.85, linestyle=":")
save(fig, "hairpin")

case, p = "pedals", M["pedals"]
fig, ax = start("05  Launch, shift and brake feedback",
                f"{len(p['shifts'])} upshifts  |  peak audio RMS · engine {p['maxEngineRms']:.3f}, brake {p['maxBrakeRms']:.3f}, shift {p['maxShiftRms']:.3f}")
line(ax[0], case, lambda r: r["rpm"]/1000, "Engine rpm / 1000", GOLD)
line(ax[0], case, "gear", "Gear", BLUE, "--")
panel(ax[0], "Revs fall on each upshift", "1000 rpm / gear")
line(ax[1], case, "throttle", "Throttle", GREEN)
line(ax[1], case, "brake", "Brake", RED, "--")
line(ax[1], case, "longG", "Longitudinal g", BLUE)
panel(ax[1], "Pedal state and longitudinal response", "0–1 / g")
for field, label, color in [("engineRms", "Engine", GOLD), ("brakeRms", "Brake texture", RED),
                            ("shiftRms", "Shift transient", BLUE), ("mixRms", "Final mix", GREEN)]:
    line(ax[2], case, field, label, color, width=1.3)
panel(ax[2], "Actual Web Audio signal", "linear RMS")
for field, label, color in [("cameraLaunch", "Launch pullback", GOLD), ("cameraBrake", "Brake push-in", RED),
                            ("cameraShift", "Shift pulse", BLUE)]:
    line(ax[3], case, field, label, color)
panel(ax[3], "Chase travel contributions", "m")
for axis in ax:
    key_band(axis, key(case, "KeyS", "down"), key(case, "KeyS", "up"), RED)
    for shift in p["shifts"]:
        axis.axvline(shift["time"], color=BLUE, alpha=.59, linewidth=.75, linestyle=":")
save(fig, "pedals")
