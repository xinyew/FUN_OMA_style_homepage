"""Placeholder illustrations for the project pages.

These are drawn, not measured: the curves and maps show the kind of figure each
project produces, not results. Every one is marked `illustration: true` in its
project's index.md, which prints an ILLUSTRATION tag on the image. Replace them
with real photos and figures, then drop the flag.

    python3 scripts/make-plates.py            # rewrite the files in src/content/projects
    python3 scripts/make-plates.py some/dir   # or write them somewhere else

Each plate is 2400x1350 (16:9) JPEG in the research palette."""
import math, os, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import patches
from matplotlib.collections import LineCollection

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "content", "projects")
OUT = sys.argv[1] if len(sys.argv) > 1 else None
TARGETS = {  # plate name -> file inside src/content/projects
    "ubistat-cv": "ubistat/cv.jpg",
    "ubistat-battery": "ubistat/battery.jpg",
    "ubistat-requirements": "ubistat/requirements.jpg",
    "ubistat-water": "ubistat/water.jpg",
    "cpap-pressure": "cpap-pi/cover.jpg",
    "plp-vibration": "plp-vibration/cover.jpg",
    "robots-frequency": "frequency-robots/cover.jpg",
    "biohybrid": "biohybrid/cover.jpg",
    "dice-ecology": "care-ecologies/cover.jpg",
}

ORANGE, NAVY, GREEN, ROSE, PURPLE, OLIVE, TEAL = "#DE7744", "#2A4B81", "#2B6B51", "#BD475D", "#9170A2", "#938F34", "#56A9AE"
DARK_NAVY, DARK_PLUM, INK, LIGHT, PAPER = "#0d1829", "#18121f", "#111214", "#e7ebee", "#f3f3f0"
MONO = "Liberation Mono"
SANS = "Liberation Sans"
plt.rcParams["font.family"] = SANS

W, H, DPI = 12.0, 6.75, 200
rng = np.random.default_rng(7)


def canvas(bg):
    fig = plt.figure(figsize=(W, H), dpi=DPI, facecolor=bg)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 16); ax.set_ylim(0, 9)
    ax.set_facecolor(bg); ax.axis("off")
    return fig, ax


def grid(ax, color, step=0.5, lw=0.6, alpha=1.0):
    for x in np.arange(0, 16.01, step):
        ax.plot([x, x], [0, 9], color=color, lw=lw, alpha=alpha, zorder=0)
    for y in np.arange(0, 9.01, step):
        ax.plot([0, 16], [y, y], color=color, lw=lw, alpha=alpha, zorder=0)


def note(ax, x, y, s, color, size=9, ha="left", va="baseline", weight="normal", family=MONO, rot=0):
    ax.text(x, y, s, color=color, fontsize=size, ha=ha, va=va, family=family, weight=weight, rotation=rot, zorder=20)


def save(fig, name):
    path = os.path.join(OUT, name + ".jpg") if OUT else os.path.join(ROOT, TARGETS[name])
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fig.savefig(path, dpi=DPI, facecolor=fig.get_facecolor(), pil_kwargs={"quality": 86, "optimize": True, "progressive": True})
    plt.close(fig)
    print(name, os.path.getsize(path) // 1024, "KB")


# 1. UbiStat — four cyclic voltammograms, one per working electrode
def cv_loop(A, Epa, Epc, C):
    E = np.linspace(-0.4, 0.6, 600)
    sig = lambda x: 1 / (1 + np.exp(-x))
    fwd = C + 1.6 * (E + 0.4) + A * np.exp(-((E - Epa) / 0.075) ** 2) + 0.42 * A * sig((E - Epa) / 0.035) * np.exp(-np.clip(E - Epa, 0, None) / 0.55)
    rev = -C + 1.6 * (E + 0.4) - 0.88 * A * np.exp(-((E - Epc) / 0.085) ** 2) - 0.38 * A * sig((Epc - E) / 0.035) * np.exp(-np.clip(Epc - E, 0, None) / 0.55)
    return np.concatenate([E, E[::-1]]), np.concatenate([fwd, rev[::-1]])


def plate_ubistat_cv():
    fig, ax = canvas(DARK_NAVY)
    grid(ax, "#ffffff", step=0.5, lw=0.5, alpha=0.06)
    grid(ax, "#ffffff", step=2.0, lw=0.8, alpha=0.10)
    ox, oy, sx, sy = 6.2, 4.4, 8.6, 0.24  # E -> x, I -> y
    ax.plot([ox - 0.4 * sx - 0.3, ox + 0.6 * sx + 0.3], [oy, oy], color="#ffffff", lw=1.0, alpha=0.35)
    ax.plot([ox, ox], [0.6, 8.4], color="#ffffff", lw=1.0, alpha=0.35)
    specs = [(10.5, 0.24, 0.16, 1.8, ROSE), (8.2, 0.12, 0.05, 1.4, ORANGE), (6.4, 0.31, 0.22, 1.1, TEAL), (4.6, 0.05, -0.03, 0.9, PURPLE)]
    for A, Epa, Epc, C, col in specs:
        for k in range(5):  # faint earlier scans for depth
            E, I = cv_loop(A * (0.80 + 0.04 * k), Epa, Epc, C)
            ax.plot(ox + E * sx, oy + I * sy, color=col, lw=0.8, alpha=0.18, zorder=3)
        E, I = cv_loop(A, Epa, Epc, C)
        ax.plot(ox + E * sx, oy + I * sy, color=col, lw=4.2, solid_capstyle="round", zorder=5)
    for i, (lab, col) in enumerate(zip(["WE1", "WE2", "WE3", "WE4"], [ROSE, ORANGE, TEAL, PURPLE])):
        y = 8.25 - i * 0.42
        ax.add_patch(patches.Rectangle((12.9, y - 0.06), 0.42, 0.14, color=col, zorder=6))
        note(ax, 13.45, y - 0.05, lab, "#ffffff", 10)
    for e in (-0.4, -0.2, 0.0, 0.2, 0.4, 0.6):
        x = ox + e * sx
        ax.plot([x, x], [oy - 0.08, oy + 0.08], color="#ffffff", lw=1, alpha=0.5)
        note(ax, x, oy - 0.38, f"{e:+.1f}", "#ffffff", 8, ha="center")
    note(ax, 15.6, oy - 0.75, "E  (V vs Ag/AgCl)", "#ffffff", 9, ha="right")
    note(ax, ox + 0.15, 8.45, "I  (µA)", "#ffffff", 9)
    note(ax, 0.35, 0.35, "CYCLIC VOLTAMMETRY  ·  4 ELECTRODES  ·  1 SCAN EACH", "#ffffff", 8)
    save(fig, "ubistat-cv")


# 2. UbiStat — battery life on one coin cell
def plate_ubistat_battery():
    fig, ax = canvas(PAPER)
    x0, x1, y0, y1 = 1.2, 15.0, 1.2, 7.9
    n = 40 * 24 * 6  # six samples per hour
    days = np.arange(n) / (24 * 6)
    v = 3.0 - 0.18 * (days / 40) - 0.62 * (days / 40) ** 6
    task = (np.arange(n) % 6) == 0  # one task per hour
    v_load = v - np.where(task, 0.11 + 0.03 * days / 40, 0)
    X = x0 + (days / 40) * (x1 - x0)
    Y = lambda vv: y0 + (vv - 1.9) / (3.1 - 1.9) * (y1 - y0)
    for d in range(0, 41, 5):
        xx = x0 + d / 40 * (x1 - x0)
        ax.plot([xx, xx], [y0, y1], color=INK, lw=0.6, alpha=0.12)
        note(ax, xx, y0 - 0.45, f"{d}", INK, 9, ha="center")
    for vv in (2.0, 2.5, 3.0):
        ax.plot([x0, x1], [Y(vv), Y(vv)], color=INK, lw=0.6, alpha=0.12)
        note(ax, x0 - 0.2, Y(vv) - 0.07, f"{vv:.1f} V", INK, 9, ha="right")
    ax.fill_between(X, Y(v_load), Y(v), color=ROSE, alpha=0.55, lw=0)
    ax.plot(X, Y(v), color=NAVY, lw=3.2)
    ax.plot([x0, x1], [Y(2.0), Y(2.0)], color=ROSE, lw=1.4, ls=(0, (5, 4)))
    note(ax, x1, Y(2.0) + 0.15, "CUTOFF", ROSE, 9, ha="right")
    note(ax, x1, y0 - 0.85, "DAYS ON ONE COIN CELL", INK, 9, ha="right")
    note(ax, x0, y1 + 0.35, "1 TASK / HOUR  ·  4 ELECTRODES / TASK  ·  ≈ 40 DAYS", INK, 10, weight="bold")
    save(fig, "ubistat-battery")


# 3. UbiStat — the six requirements as coloured tiles
def plate_ubistat_requirements():
    fig, ax = canvas(INK)
    reqs = [("AFFORDABLE", ROSE), ("SMALL", ORANGE), ("UNTETHERED", OLIVE), ("SEALED", TEAL), ("MULTI-SENSOR", PURPLE), ("REMOTE", NAVY)]
    tw, th, gap = 4.9, 3.9, 0.25
    for i, (lab, col) in enumerate(reqs):
        r, c = divmod(i, 3)
        x = 0.4 + c * (tw + gap); y = 9 - 0.4 - (r + 1) * th - r * gap
        ax.add_patch(patches.Rectangle((x, y), tw, th, fc=col, zorder=2))
        note(ax, x + 0.3, y + 0.35, lab, "#ffffff", 17, weight="bold", family=SANS)
        gx, gy = x + tw - 1.0, y + th - 1.0  # a small glyph per requirement
        if lab == "AFFORDABLE":
            ax.add_patch(patches.Circle((gx, gy), 0.45, fill=False, ec="#ffffff", lw=3, zorder=3))
        elif lab == "SMALL":
            ax.add_patch(patches.Rectangle((gx - 0.2, gy - 0.2), 0.4, 0.4, fc="#ffffff", zorder=3))
        elif lab == "UNTETHERED":
            ax.plot([gx - 0.5, gx - 0.1], [gy, gy], color="#ffffff", lw=3); ax.plot([gx + 0.1, gx + 0.5], [gy, gy], color="#ffffff", lw=3)
        elif lab == "SEALED":
            ax.add_patch(patches.Rectangle((gx - 0.45, gy - 0.35), 0.9, 0.7, fill=False, ec="#ffffff", lw=3, zorder=3))
        elif lab == "MULTI-SENSOR":
            for k in range(4):
                ax.add_patch(patches.Circle((gx - 0.45 + k * 0.3, gy), 0.11, fc="#ffffff", zorder=3))
        else:
            for k, rr in enumerate((0.15, 0.35, 0.55)):
                ax.add_patch(patches.Arc((gx - 0.3, gy - 0.3), 2 * rr, 2 * rr, theta1=0, theta2=90, ec="#ffffff", lw=3, zorder=3))
    save(fig, "ubistat-requirements")


# 4. UbiStat — future direction: distributed water-quality sensing across terraced paddies
def plate_ubistat_water():
    fig, ax = canvas(LIGHT)
    for i in range(9):
        y = 0.6 + i * 0.95 + 0.25 * np.sin(np.linspace(0, 3 * np.pi, 200) + i)
        xs = np.linspace(-0.2, 16.2, 200)
        ax.fill_between(xs, y, y + 0.62, color=TEAL, alpha=0.25 + 0.06 * (i % 3), lw=0)
        ax.plot(xs, y, color=GREEN, lw=1.4, alpha=0.8)
    nodes = [(2.1, 1.4), (5.3, 2.5), (8.8, 1.6), (12.4, 2.8), (3.6, 4.3), (7.2, 5.1), (10.9, 4.6), (14.1, 5.6), (5.0, 7.0), (9.6, 7.4), (13.2, 7.9)]
    for (x, y) in nodes:
        for rr, a in ((0.55, 0.25), (0.35, 0.45)):
            ax.add_patch(patches.Circle((x, y), rr, fill=False, ec=NAVY, lw=1.2, alpha=a, zorder=4))
        ax.add_patch(patches.Circle((x, y), 0.14, fc=ORANGE, ec=NAVY, lw=1.2, zorder=5))
    for a, b in ((0, 1), (1, 2), (2, 3), (1, 4), (4, 5), (5, 6), (6, 7), (5, 8), (8, 9), (9, 10), (6, 3)):
        (x0, y0), (x1, y1) = nodes[a], nodes[b]
        ax.plot([x0, x1], [y0, y1], color=NAVY, lw=1.0, ls=(0, (2, 3)), alpha=0.6, zorder=3)
    note(ax, 0.4, 8.5, "NODE MAP  ·  ONE READING / HOUR / NODE", NAVY, 9)
    save(fig, "ubistat-water")


# 5. CPAP-PI — contact-pressure map inside a pediatric nasal-mask outline
def plate_cpap():
    fig, ax = canvas(PAPER)
    t = np.linspace(0, 2 * np.pi, 400)
    mx = 8.0 + 3.1 * np.sin(t) * (1 - 0.18 * np.cos(t))
    my = 4.4 + 3.3 * np.cos(t) - 0.55 * np.cos(2 * t)
    xx, yy = np.meshgrid(np.linspace(4, 12, 400), np.linspace(0.4, 8.6, 400))
    p = (np.exp(-(((xx - 8.0) / 1.0) ** 2 + ((yy - 7.0) / 0.8) ** 2)) * 1.0 +
         np.exp(-(((xx - 5.9) / 0.9) ** 2 + ((yy - 3.0) / 1.2) ** 2)) * 0.8 +
         np.exp(-(((xx - 10.1) / 0.9) ** 2 + ((yy - 3.0) / 1.2) ** 2)) * 0.75 +
         0.18 * np.sin(xx * 2.1) * np.cos(yy * 1.7))
    from matplotlib.path import Path
    inside = Path(np.c_[mx, my]).contains_points(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    rim = Path(np.c_[8.0 + 2.2 * np.sin(t), 4.4 + 2.3 * np.cos(t) - 0.4 * np.cos(2 * t)]).contains_points(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    band = inside & ~rim
    pm = np.ma.array(p, mask=~band)
    from matplotlib.colors import LinearSegmentedColormap
    cmap = LinearSegmentedColormap.from_list("p", [PAPER, "#f0c9b4", ORANGE, ROSE, NAVY])
    ax.contourf(xx, yy, pm, levels=14, cmap=cmap, zorder=2)
    ax.contour(xx, yy, pm, levels=14, colors=INK, linewidths=0.5, alpha=0.35, zorder=3)
    ax.plot(mx, my, color=INK, lw=2.4, zorder=4)
    ax.plot(8.0 + 2.2 * np.sin(t), 4.4 + 2.3 * np.cos(t) - 0.4 * np.cos(2 * t), color=INK, lw=1.4, zorder=4)
    for k in range(16):  # sensor sites around the cushion
        a = 2 * np.pi * k / 16
        sx = 8.0 + 2.7 * np.sin(a) * (1 - 0.18 * np.cos(a)); sy = 4.4 + 2.85 * np.cos(a) - 0.5 * np.cos(2 * a)
        ax.add_patch(patches.Circle((sx, sy), 0.1, fc="#ffffff", ec=INK, lw=1.2, zorder=5))
    for i in range(60):
        ax.add_patch(patches.Rectangle((13.3, 1.2 + i * 0.1), 0.35, 0.1, color=cmap(i / 59), lw=0))
    note(ax, 13.9, 1.2, "LOW", INK, 9); note(ax, 13.9, 7.0, "HIGH", INK, 9)
    note(ax, 13.3, 7.6, "CONTACT PRESSURE", INK, 9)
    note(ax, 0.4, 0.4, "SENSING MASK  ·  BLE  ·  TABLET VIEW", INK, 9)
    save(fig, "cpap-pressure")


# 6. Phantom limb pain — five ERM motors on a strap around a transtibial residual limb
def plate_plp():
    fig, ax = canvas(DARK_PLUM)
    cx, cy = 7.2, 4.5
    ax.add_patch(patches.Ellipse((cx, cy), 6.0, 5.2, fc="#2b2236", ec="#ffffff", lw=1.2, alpha=1, zorder=2))
    ax.add_patch(patches.Ellipse((cx + 0.6, cy + 0.2), 1.3, 1.0, fc="#3a3048", ec="#ffffff", lw=0.8, zorder=3))
    ax.add_patch(patches.Ellipse((cx - 1.2, cy - 0.4), 0.7, 0.55, fc="#3a3048", ec="#ffffff", lw=0.8, zorder=3))
    ax.add_patch(patches.Ellipse((cx, cy), 6.7, 5.9, fill=False, ec=OLIVE, lw=7, alpha=0.9, zorder=4))
    for k in range(5):
        a = np.pi / 2 + 2 * np.pi * k / 5
        mx_, my_ = cx + 3.35 * np.cos(a), cy + 2.95 * np.sin(a)
        for r in np.arange(0.45, 3.2, 0.32):
            ax.add_patch(patches.Circle((mx_, my_), r, fill=False, ec=TEAL, lw=1.1, alpha=max(0.05, 0.6 - r * 0.18), zorder=3))
        box = patches.FancyBboxPatch((mx_ - 0.32, my_ - 0.22), 0.64, 0.44, boxstyle="square,pad=0", fc=ORANGE, ec="#ffffff", lw=1.2, zorder=6)
        ax.add_patch(box)
        note(ax, mx_ + 0.6 * np.cos(a) * 1.9, my_ + 0.6 * np.sin(a) * 1.9 - 0.08, f"M{k + 1}", "#ffffff", 10, ha="center")
    tt = np.linspace(0, 1, 800)
    wave = 0.35 * np.sin(2 * np.pi * 26 * tt) * (np.sin(2 * np.pi * 2 * tt) > 0)
    ax.plot(11.6 + tt * 4.0, 7.6 + wave, color=TEAL, lw=1.4)
    note(ax, 11.6, 8.3, "DRIVE PATTERN", "#ffffff", 9)
    note(ax, 11.6, 1.0, "5 × ERM  ·  9,000 RPM  ·  3.0 G", "#ffffff", 10, weight="bold")
    note(ax, 11.6, 0.55, "ESP32-C3  ·  3.3 V", "#ffffff", 9)
    save(fig, "plp-vibration")


# 7. Frequency-encoded control — each module listens to its own band
def plate_robots():
    fig, ax = canvas(DARK_NAVY)
    cols = [ROSE, ORANGE, OLIVE, TEAL, PURPLE]
    f = np.linspace(0, 16, 3000)
    base = 0.25 + 0.08 * rng.standard_normal(f.size).cumsum() / 40
    spec = base.copy()
    centers = [2.6, 5.4, 8.1, 10.9, 13.6]
    for c, col in zip(centers, cols):
        peak = 4.6 * np.exp(-((f - c) / 0.07) ** 2)
        spec += peak
    ax.fill_between(f, 3.4, 3.4 + spec * 1.0, color="#ffffff", alpha=0.08, lw=0)
    ax.plot(f, 3.4 + spec, color="#ffffff", lw=1.2, alpha=0.8)
    for c, col in zip(centers, cols):
        m = np.abs(f - c) < 0.35
        ax.fill_between(f[m], 3.4, 3.4 + spec[m], color=col, lw=0, zorder=4)
    ax.plot([0, 16], [3.4, 3.4], color="#ffffff", lw=1, alpha=0.4)
    for i, (c, col) in enumerate(zip(centers, cols)):
        note(ax, c, 8.55, f"f{i + 1}", "#ffffff", 11, ha="center", weight="bold")
        x = 1.6 + i * 2.75
        for j in range(3):  # a chain of modules, coloured by the band each listens to
            ax.add_patch(patches.Rectangle((x + j * 0.62, 1.2), 0.54, 0.54, fc=col if j == 1 else "none", ec=col, lw=2, zorder=5))
        ax.plot([c, x + 0.62 + 0.27], [3.35, 1.8], color=col, lw=1, ls=(0, (2, 3)), zorder=3)
    note(ax, 0.4, 0.45, "FREQUENCY-ENCODED CONTROL  ·  UNTETHERED MODULES", "#ffffff", 9)
    save(fig, "robots-frequency")


# 8. Battery-free biohybrid actuation — light in, twitch out
def plate_biohybrid():
    fig, ax = canvas(PAPER)
    yy = np.linspace(0, 9, 900)
    for k in range(70):  # sarcomere striations
        x = 0.2 + k * 0.23
        ax.plot(x + 0.06 * np.sin(yy * 1.3 + k * 0.4), yy, color=ROSE, lw=3.2 if k % 3 == 0 else 1.0, alpha=0.18)
    t = np.linspace(0, 16, 4000)
    sun = 1.9 * np.clip(np.sin(np.pi * (t - 0.6) / 14.8), 0, None) ** 1.4
    ax.fill_between(t, 6.2, 6.2 + sun, color=OLIVE, alpha=0.85, lw=0, zorder=3)
    note(ax, 0.4, 8.5, "IRRADIANCE", INK, 9)
    tw = np.zeros_like(t)
    for s in np.arange(2.0, 14.6, 0.9):
        d = t - s
        tw += np.where(d > 0, (d / 0.08) * np.exp(1 - d / 0.08), 0) * (0.4 + 0.6 * np.interp(s, t, sun) / 1.9)
    ax.plot(t, 2.0 + tw * 1.8, color=NAVY, lw=2.6, zorder=4)
    ax.plot([0, 16], [2.0, 2.0], color=INK, lw=0.8, alpha=0.4)
    note(ax, 0.4, 4.9, "TWITCH FORCE", INK, 9)
    for i in range(6):  # solar cell grid
        for j in range(3):
            ax.add_patch(patches.Rectangle((11.4 + i * 0.68, 0.35 + j * 0.42), 0.62, 0.36, fc=NAVY, ec="#ffffff", lw=0.8, zorder=5))
    note(ax, 11.4, 1.75, "PV  ·  NO BATTERY", INK, 9)
    save(fig, "biohybrid")


# 9. Care ecology — an abstract network (no claims about the framework)
def plate_dice():
    fig, ax = canvas(PAPER)
    for r in (1.4, 2.6, 3.8):
        ax.add_patch(patches.Circle((8, 4.5), r, fill=False, ec=INK, lw=1.0, alpha=0.25))
    pts = [(8, 4.5, 0.42, ROSE)]
    cols = [NAVY, TEAL, ORANGE, PURPLE, GREEN, OLIVE]
    for ring, n in ((1.4, 5), (2.6, 8), (3.8, 12)):
        off = rng.uniform(0, 2 * np.pi)
        for k in range(n):
            a = off + 2 * np.pi * k / n + rng.uniform(-0.15, 0.15)
            pts.append((8 + ring * np.cos(a) * 1.55, 4.5 + ring * np.sin(a), rng.uniform(0.12, 0.3) * (1.25 - ring / 6), cols[rng.integers(0, 6)]))
    P = np.array([(p[0], p[1]) for p in pts])
    for i in range(1, len(pts)):
        d = np.hypot(*(P - P[i]).T); d[i] = 1e9
        for j in np.argsort(d)[:2]:
            ax.plot([P[i, 0], P[j, 0]], [P[i, 1], P[j, 1]], color=INK, lw=0.9, alpha=0.45, zorder=2)
        if rng.random() < 0.45:
            ax.plot([P[i, 0], 8], [P[i, 1], 4.5], color=ROSE, lw=1.2, alpha=0.5, zorder=2)
    for x, y, r, c in pts:
        ax.add_patch(patches.Circle((x, y), r, fc=c, ec=INK, lw=1.0, zorder=4))
    note(ax, 0.4, 0.4, "CARE ECOLOGY  ·  ACTORS AND TIES OVER TIME", INK, 9)
    save(fig, "dice-ecology")


if __name__ == "__main__":
    for fn in [plate_ubistat_cv, plate_ubistat_battery, plate_ubistat_requirements, plate_ubistat_water,
               plate_cpap, plate_plp, plate_robots, plate_biohybrid, plate_dice]:
        fn()
