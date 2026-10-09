#!/usr/bin/env python3
"""
The site icon, drawn rather than screenshotted.

A screenshot composites the page onto white in this Chrome, so a browser-made
favicon arrives opaque — a paper square in the tab, which is what Raj asked to
be rid of. The mark is geometry, so it is generated: the masthead's two drums
overprinting into a third colour where they cross, plus the registration ring,
on transparency so it sits on a tab of any colour.

Same grammar as the site: real riso inks, multiply where plates cross, and a
hand-pulled registration error read as the dashed ring.

Run from the repo root, then commit the output:

    python3 scripts/make-icon.py

Requires Pillow and numpy (both present in the environment this was written in).
The generated assets are committed, so this only has to run when the mark or the
palette changes.
"""

import os
import math

import numpy as np
from PIL import Image, ImageDraw

# ── the palette, copied from src/styles/riso.css so the icon matches the sheet ──
PAPER = (0, 0, 0, 0)          # not used as a fill: the icon carries no plate
PINK = (251, 121, 177)
BLUE = (82, 133, 227)
INK = (11, 11, 11)

SIZE = 512
SS = 4                        # supersample factor, for smooth edges at 16px

# The mark, in the 512 coordinate space: two drums and the key ring.
DISC_R = 150
DISC_A = (196, 210)           # pink drum
DISC_B = (316, 300)           # blue drum
RING_R = 238
RING_W = 16
RING_DASH_ON = 30
RING_DASH_OFF = 22

# See build_mark(): the ring reads as a ghost on a dark tab, so the icon ships
# without it.
WITH_RING = False

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public')
OG_DIR = os.path.join(OUT_DIR, 'og')


def disc_mask(size, centre, radius):
    """A boolean mask of a filled circle, supersampled."""
    n = size * SS
    yy, xx = np.mgrid[0:n, 0:n]
    cx, cy = centre[0] * SS, centre[1] * SS
    return (xx - cx) ** 2 + (yy - cy) ** 2 <= (radius * SS) ** 2


def ring_mask(size):
    """The dashed key ring, as arc segments walked around the circumference."""
    layer = Image.new('L', (size * SS, size * SS), 0)
    d = ImageDraw.Draw(layer)
    r = RING_R * SS
    w = RING_W * SS
    cx = cy = 256 * SS
    box = [cx - r, cy - r, cx + r, cy + r]

    circumference = 2 * math.pi * r
    step = RING_DASH_ON + RING_DASH_OFF
    dashes = int(math.ceil(circumference / step))
    for i in range(dashes):
        start = (i * step / circumference) * 360.0
        end = start + (RING_DASH_ON / circumference) * 360.0
        # PIL's zero angle is 3 o'clock; rotate so the dashes read as hand-set
        d.arc(box, start - 90, end - 90, fill=255, width=int(round(w)))

    return np.array(layer) > 127


def build_mark():
    size = SIZE * SS
    yy, xx = np.mgrid[0:size, 0:size]

    a = disc_mask(SIZE, DISC_A, DISC_R)
    b = disc_mask(SIZE, DISC_B, DISC_R)
    ring = ring_mask(SIZE)

    rgb = np.zeros((size, size, 3), dtype=np.float64)
    alpha = np.zeros((size, size), dtype=np.float64)

    # plate one: the pink drum
    rgb[a] = PINK
    alpha[a] = 255

    # plate two: the blue drum, multiplied where the plates cross — which is
    # where the violet comes from, exactly as it does on the site
    only_b = b & ~a
    both = a & b
    rgb[only_b] = BLUE
    alpha[only_b] = 255
    if both.any():
        rgb[both] = (rgb[both] * np.array(BLUE)) / 255.0
        alpha[both] = 255

    # The key plate. Off by default: a near-black dashed ring vanishes on a dark
    # browser tab and is illegible at 16px anyway, so the icon carries the two
    # drums only. Set to True for the large sizes if a registration ring is ever
    # wanted back.
    if WITH_RING:
        over_ink = ring & (alpha > 0)
        over_empty = ring & (alpha == 0)
        rgb[over_ink] = (rgb[over_ink] * np.array(INK)) / 255.0
        rgb[over_empty] = INK
        alpha[over_empty] = 255

    out = np.dstack([rgb.clip(0, 255), alpha.clip(0, 255)]).astype(np.uint8)
    mark = Image.fromarray(out, 'RGBA')
    return mark.resize((SIZE, SIZE), Image.LANCZOS)


def save(img, size, path):
    img.resize((size, size), Image.LANCZOS).save(path)
    px = Image.open(path).convert('RGBA').load()
    print(f'  {os.path.relpath(path, OUT_DIR):24} {size}x{size}  corner_alpha={px[0, 0][3]}  centre_alpha={px[size // 2, size // 2][3]}')


def main():
    os.makedirs(OG_DIR, exist_ok=True)
    mark = build_mark()

    print('icon set:')
    save(mark, 512, os.path.join(OG_DIR, 'mark-512.png'))
    save(mark, 512, os.path.join(OG_DIR, 'icon-512.png'))
    save(mark, 192, os.path.join(OG_DIR, 'favicon.png'))
    save(mark, 180, os.path.join(OG_DIR, 'apple-touch-icon.png'))
    # CRA's own React logos, replaced in place so no stale reference can show them
    save(mark, 192, os.path.join(OUT_DIR, 'logo192.png'))
    save(mark, 512, os.path.join(OUT_DIR, 'logo512.png'))

    ico = os.path.join(OUT_DIR, 'favicon.ico')
    mark.save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
    print(f'  favicon.ico              {sorted(Image.open(ico).info.get("sizes", []))}')


if __name__ == '__main__':
    main()
