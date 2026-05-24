"""Remove the flat light background from the brew glass PNGs.

Uses a flood-fill seeded from the image border so only the *connected*
background is removed; white beer foam / glass highlights enclosed by the
glass are kept. A small distance-based feather softens the cut edge so the
glass doesn't show a hard white halo on the colored carousel panels.
"""

import sys
from collections import deque
from PIL import Image

FILES = [
    "public/brewery/brew-1.png",
    "public/brewery/brew-2.png",
    "public/brewery/brew-3.png",
    "public/brewery/brew-4.png",
]

# Euclidean color distance (in RGB) thresholds.
HARD = 60.0   # <= this from bg  -> definitely background
SOFT = 110.0  # between HARD..SOFT -> feathered (partial alpha)


def dist2(a, b):
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2


def cutout(path):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    # Background color = average of the four corners.
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = (
        sum(c[0] for c in corners) / 4.0,
        sum(c[1] for c in corners) / 4.0,
        sum(c[2] for c in corners) / 4.0,
    )

    hard2 = HARD * HARD
    soft2 = SOFT * SOFT

    # Flood fill from every border pixel through background-like pixels.
    bgmask = bytearray(w * h)  # 1 = connected background
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
                # Feather: ramp alpha from 0 (at HARD) to ~full (at SOFT).
                frac = (d2 ** 0.5 - HARD) / (SOFT - HARD)
                px[x, y] = (r, g, b, int(max(0.0, min(1.0, frac)) * a))

    im.save(path)
    pct = 100.0 * removed / (w * h)
    print(f"{path}: bg~{tuple(round(c) for c in bg)}  cleared {pct:.1f}%")


if __name__ == "__main__":
    for f in FILES:
        cutout(f)
    print("done")
    sys.exit(0)
