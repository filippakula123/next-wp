"""Build small local variable fonts from the original Google Fonts sources."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent
source = root / "deployment/performance/font-sources"
destination = root / "public/luzik/fonts"
destination.mkdir(parents=True, exist_ok=True)
# Latin alphabets used by Polish/English/German/Italian; punctuation and Ukrainian
# are retained where the original family supports them. No font shape changes.
unicodes = subset.parse_unicodes("0000-00FF,0104-0107,0118-0119,0131,0141-0144,0152-0153,015A-015B,0178-017C,0300-0304,0308,0329,0400-045F,0490-0491,1E9E,2000-206F,20AC,2122,2190-2193,2212,FEFF,FFFD")
for name in ["Inter", "Lexend"]:
    font = TTFont(source / f"{name}.ttf")
    if name == "Inter":
        font = instantiateVariableFont(font, {"opsz": 14, "wght": (400, 400, 800)}, inplace=True)
    else:
        font = instantiateVariableFont(font, {"wght": (400, 400, 800)}, inplace=True)
    if 'gvar' in font:
        for glyph in font.getGlyphOrder():
            if glyph not in font['gvar'].variations:
                font['gvar'].variations[glyph] = []
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "clig", "calt", "locl", "mark", "mkmk", "rvrn", "ccmp", "tnum"]
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
    options.name_languages = [0x409]
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    font.flavor = "woff2"
    output = destination / f"{name.lower()}-v1.woff2"
    font.save(output)
    print(f"{name}: {output.stat().st_size} bytes")
