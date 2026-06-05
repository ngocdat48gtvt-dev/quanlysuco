"""Tao icon may in cho Print-Control-PRO.exe (16..256 px)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).resolve().parent
ICO_PATH = OUT_DIR / "Print-Control-PRO.ico"
PNG_PATH = OUT_DIR / "Print-Control-PRO-icon.png"
SIZES = (16, 24, 32, 48, 64, 128, 256)

PURPLE = (91, 33, 182)
PURPLE_DARK = (76, 29, 149)
PURPLE_LIGHT = (167, 139, 250)
WHITE = (255, 255, 255)
PAPER = (248, 250, 252)
GREEN = (34, 197, 94)
SLATE = (30, 41, 59)


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    m = size / 256.0

    # Nen tron
    pad = int(10 * m)
    d.ellipse((pad, pad, size - pad, size - pad), fill=PURPLE)

    # Giay dang in
    px1, py1 = int(78 * m), int(34 * m)
    px2, py2 = int(178 * m), int(118 * m)
    d.rounded_rectangle((px1, py1, px2, py2), radius=int(10 * m), fill=PAPER)
    for i, w in enumerate((0.72, 0.86, 0.64, 0.78)):
        y = int((52 + i * 14) * m)
        d.rounded_rectangle(
            (int(92 * m), y, int(92 * m + 70 * w * m), y + int(6 * m)),
            radius=int(3 * m),
            fill=PURPLE_LIGHT,
        )

    # Than may in
    bx1, by1 = int(52 * m), int(108 * m)
    bx2, by2 = int(204 * m), int(198 * m)
    d.rounded_rectangle((bx1, by1, bx2, by2), radius=int(16 * m), fill=WHITE)
    d.rounded_rectangle(
        (int(68 * m), int(124 * m), int(188 * m), int(168 * m)),
        radius=int(10 * m),
        fill=PURPLE_DARK,
    )

    # Den LED
    d.ellipse(
        (int(168 * m), int(132 * m), int(184 * m), int(148 * m)),
        fill=GREEN,
    )

    # Khay giay
    d.polygon(
        [
            (int(44 * m), int(198 * m)),
            (int(212 * m), int(198 * m)),
            (int(196 * m), int(228 * m)),
            (int(60 * m), int(228 * m)),
        ],
        fill=PURPLE_DARK,
    )
    d.rounded_rectangle(
        (int(72 * m), int(228 * m), int(184 * m), int(242 * m)),
        radius=int(8 * m),
        fill=SLATE,
    )

    return img


def main() -> None:
    images = [draw_icon(s) for s in SIZES]
    images[0].save(
        ICO_PATH,
        format="ICO",
        sizes=[(s, s) for s in SIZES],
        append_images=images[1:],
    )
    draw_icon(256).save(PNG_PATH, format="PNG")
    print(f"Created: {ICO_PATH}")
    print(f"Created: {PNG_PATH}")


if __name__ == "__main__":
    main()
