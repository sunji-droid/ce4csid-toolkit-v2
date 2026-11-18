#!/usr/bin/env python3
"""Generate the toolkit share images from the toolkit icon.

The 1200x630 card is what the site publishes as og:image. The 1280x640 file at the repo root is the
one uploaded by hand in GitHub Settings under Social preview.

Usage: python3 tools/build_share_images.py
Requires: cairosvg and Pillow (dev only).
"""
from io import BytesIO
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ICON = ROOT / "assets/images/toolkit-icon.svg"
FONTS = ROOT / "assets/fonts"

TEAL = (4, 73, 83)
SOFT = (51, 98, 107)
BG = (239, 244, 227)
LIME = (211, 247, 129)
BLUE = (70, 203, 222)

DISPLAY = "inter-tight-latin.woff2"
BODY = "inter-latin.woff2"


def font(name, size, weight=None):
    """Load a self-hosted woff2 through a temporary ttf, instancing the weight axis."""
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    tmp = Path("/tmp") / (Path(name).stem + ".ttf")
    f = TTFont(FONTS / name)
    f.flavor = None
    f.save(tmp)
    if weight:
        inst = instantiateVariableFont(TTFont(tmp), {"wght": weight})
        inst.save(tmp)
    return ImageFont.truetype(str(tmp), size)


def icon(px):
    data = cairosvg.svg2png(url=str(ICON), output_width=px, output_height=px)
    return Image.open(BytesIO(data)).convert("RGBA")


def card(w, h, out):
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img, "RGBA")

    # Decorative blobs in brand colours.
    d.ellipse([w - 360, -180, w + 160, 340], fill=(*BLUE, 38))
    d.ellipse([w - 250, h - 230, w + 120, h + 140], fill=(*LIME, 70))
    d.ellipse([-160, h - 200, 180, h + 160], fill=(*TEAL, 16))

    pad = int(w * 0.06)

    # Toolkit icon and wordmark, top left.
    ic = icon(int(h * 0.19))
    img.paste(ic, (pad, pad), ic)
    tx = pad + ic.width + int(w * 0.022)
    d.text((tx, pad + int(h * 0.035)), "CE4CSID", font=font(DISPLAY, int(h * 0.072), 800), fill=TEAL)
    d.text(
        (tx, pad + int(h * 0.125)),
        "Community Engagement Toolkit",
        font=font(BODY, int(h * 0.032)),
        fill=SOFT,
    )

    # Title.
    y = pad + int(h * 0.30)
    title_font = font(DISPLAY, int(h * 0.098), 800)
    d.text((pad, y), "Community engagement", font=title_font, fill=TEAL)
    y += int(h * 0.105)
    d.text((pad, y), "resources for CSID work.", font=title_font, fill=TEAL)
    y += int(h * 0.14)

    d.text(
        (pad, y),
        "Practical, open access guidance for climate sensitive",
        font=font(BODY, int(h * 0.038)),
        fill=SOFT,
    )
    d.text(
        (pad, y + int(h * 0.052)),
        "infectious disease research and programmes.",
        font=font(BODY, int(h * 0.038)),
        fill=SOFT,
    )

    # Footer rule and credit.
    fy = h - int(h * 0.11)
    d.line([pad, fy, w - pad, fy], fill=(*TEAL, 60), width=2)
    d.text(
        (pad, fy + int(h * 0.028)),
        "The CE4CSID Toolkit, supported by the CSID Network",
        font=font(BODY, int(h * 0.030), 600),
        fill=TEAL,
    )
    credit = "Built by Kabo Merapelo Onamile"
    cf = font(BODY, int(h * 0.030))
    cw = d.textlength(credit, font=cf)
    d.text((w - pad - cw, fy + int(h * 0.028)), credit, font=cf, fill=SOFT)

    img.save(out, optimize=True)
    print("wrote", out.relative_to(ROOT), img.size, out.stat().st_size, "bytes")


if __name__ == "__main__":
    card(1200, 630, ROOT / "assets/images/og-image.png")
    card(1280, 640, ROOT / "ce4csid-social-preview.png")
