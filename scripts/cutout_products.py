"""Remove the (near-)white photo backdrop from the FMCG product PNGs.

Mirrors scripts/cutout_glasses.py: flood-fills from every border pixel
through background-coloured pixels so only the *connected* background is
cleared. White or near-white pixels enclosed inside the product (Red Bull's
silver, Lay's bag highlights, Aashirvaad's cream label, etc.) stay opaque.

A small feathered band softens the cut edge so each product reads cleanly
when composited over the carousel's coloured backdrops.
"""

import sys
from collections import deque
from PIL import Image

JOBS = [
    ("public/fmcg/product-beverages-raw.png", "public/fmcg/product-beverages.png"),
    ("public/fmcg/product-snacks-raw.png", "public/fmcg/product-snacks.png"),
    ("public/fmcg/product-essentials-raw.png", "public/fmcg/product-essentials.png"),
]

# Euclidean RGB distance thresholds. Wider than the glasses' values because
# the Lay's bag and Aashirvaad pack sit on subtle gradient backdrops, not
# perfectly flat plates.
HARD = 38.0   # <= this from bg  -> definitely background
SOFT = 95.0   # between HARD..SOFT -> feathered (partial alpha)


def dist2(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2


def cutout(src, dst):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()

    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = (
        sum(c[0] for c in corners) / 4.0,
        sum(c[1] for c in corners) / 4.0,
        sum(c[2] for c in corners) / 4.0,
    )

    hard2 = HARD * HARD
    soft2 = SOFT * SOFT

    bgmask = bytearray(w * h)
    q = deque()

    def consider(x, y):
        i = y * w + x
        if bgmask[i]:
            return
        if dist2(px[x, y], bg) <= soft2:
            bgmask[i] = 1
            q.append((x, y))

    for x in range(w):
        consider(x, 0)
        consider(x, h - 1)
    for y in range(h):
        consider(0, y)
        consider(w - 1, y)

    while q:
        x, y = q.popleft()
        if x > 0:
            consider(x - 1, y)
        if x < w - 1:
            consider(x + 1, y)
        if y > 0:
            consider(x, y - 1)
        if y < h - 1:
            consider(x, y + 1)

    removed = 0
    for y in range(h):
        row = y * w
        for x in range(w):
            if not bgmask[row + x]:
                continue
            r, g, b, a = px[x, y]
            d2 = dist2((r, g, b), bg)
            if d2 <= hard2:
                px[x, y] = (r, g, b, 0)
                removed += 1
            else:
                frac = (d2 ** 0.5 - HARD) / (SOFT - HARD)
                px[x, y] = (r, g, b, int(max(0.0, min(1.0, frac)) * a))

    im.save(dst)
    pct = 100.0 * removed / (w * h)
    print(f"{dst}: bg~{tuple(round(c) for c in bg)}  cleared {pct:.1f}%")


if __name__ == "__main__":
    for src, dst in JOBS:
        cutout(src, dst)
    print("done")
    sys.exit(0)
