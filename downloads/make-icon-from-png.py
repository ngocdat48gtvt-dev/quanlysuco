"""Tao Print-Control-PRO.ico tu anh icon (hinh 3)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
SRC = HERE / "printer-icon.png"
ICO = HERE / "Print-Control-PRO.ico"
SIZES = (16, 24, 32, 48, 64, 128, 256)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Thieu file nguon: {SRC}")

    base = Image.open(SRC).convert("RGBA")
    images: list[Image.Image] = []
    for size in SIZES:
        img = base.resize((size, size), Image.Resampling.LANCZOS)
        images.append(img)

    images[0].save(
        ICO,
        format="ICO",
        sizes=[(s, s) for s in SIZES],
        append_images=images[1:],
    )
    print(f"Created {ICO}")


if __name__ == "__main__":
    main()
