"""Generate the 1200x630 social preview images in public/og/.

Needs Pillow and the Inter font (https://rsms.me/inter/). Run from the repo root:

    bunx tsx scripts/og-pages.ts > /tmp/og-pages.json
    python3 scripts/generate-og-images.py /tmp/og-pages.json [path/to/Inter/dir]

Re-run after adding a department or campus, then commit the new images.
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
GREEN = (11, 138, 69)  # logo green
MINT = (0, 255, 163)  # site --primary
INK = (17, 24, 39)
MUTED = (75, 85, 99)
GRID = (236, 238, 240)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
LOGO = ROOT / "public" / "logo.png"


def font(dir_: Path, weight: str, size: int):
    return ImageFont.truetype(str(dir_ / f"Inter-{weight}.otf"), size)


def wrap(draw, text, fnt, width, max_lines):
    words, lines, line = text.split(), [], ""
    for w in words:
        trial = f"{line} {w}".strip()
        if draw.textlength(trial, font=fnt) <= width:
            line = trial
        else:
            lines.append(line)
            line = w
    lines.append(line)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while draw.textlength(lines[-1] + "…", font=fnt) > width:
            lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] += "…"
    return lines


def render(page, fonts: Path):
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=GRID)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=GRID)
    d.rectangle([0, 0, 16, H], fill=MINT)

    d.rounded_rectangle([64, 48, 192, 176], radius=20, fill="white", outline=GRID, width=2)
    logo = Image.open(LOGO).convert("RGBA").resize((112, 112), Image.LANCZOS)
    img.paste(logo, (72, 56), logo)
    d.text((216, 82), "Tech Faculty NG", font=font(fonts, "Bold", 34), fill=INK)
    d.text((216, 126), "Train · Certify · Employ", font=font(fonts, "Medium", 22), fill=MUTED)

    x, width = 72, W - 144
    y = 232
    d.text((x, y), page["eyebrow"].upper(), font=font(fonts, "Bold", 24), fill=GREEN)
    y += 46

    size = 72
    title_font = font(fonts, "ExtraBold", size)
    lines = wrap(d, page["title"], title_font, width, 2)
    if len(lines) == 2 and size == 72:
        title_font = font(fonts, "ExtraBold", 60)
        lines = wrap(d, page["title"], title_font, width, 2)
    for line in lines:
        d.text((x, y), line, font=title_font, fill=INK)
        y += title_font.size + 12

    sub_font = font(fonts, "Medium", 30)
    for line in wrap(d, page["subtitle"], sub_font, width, 2):
        y += 6
        d.text((x, y), line, font=sub_font, fill=MUTED)
        y += sub_font.size + 4

    d.text((x, H - 70), "techfaculty.ng", font=font(fonts, "SemiBold", 26), fill=GREEN)

    dest = OUT / page["file"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "JPEG", quality=85, optimize=True, progressive=True)


def main():
    pages = json.loads(Path(sys.argv[1]).read_text())
    fonts = Path(sys.argv[2] if len(sys.argv) > 2 else "/usr/share/fonts/opentype/inter")
    for page in pages:
        render(page, fonts)
    print(f"Wrote {len(pages)} images to {OUT}")


if __name__ == "__main__":
    main()
