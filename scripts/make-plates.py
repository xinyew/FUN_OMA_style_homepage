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


# 1. Phantom limb pain — five ERM motors on a strap around a transtibial residual limb
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


# 2. Frequency-encoded control — each module listens to its own band
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


# 3. Battery-free biohybrid actuation — light in, twitch out
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


# 4. Care ecology — an abstract network (no claims about the framework)
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
    for fn in [plate_plp, plate_robots, plate_biohybrid, plate_dice]:
        fn()
