"""Builds the icon fonts used by src/ui/Icon.tsx.

Downloads Material Symbols Rounded (outlined and filled, weight 500) from Google
Fonts and keeps only the glyphs listed in Icon.tsx, so the app ships a few KB
instead of megabytes.

    pip install fonttools
    python scripts/brand/subset-icons.py
"""
import io
import pathlib
import re
import urllib.request

from fontTools import subset

ROOT = pathlib.Path(__file__).resolve().parents[2]
ICONS = ROOT / 'src/ui/Icon.tsx'
OUT = ROOT / 'android/app/src/main/assets/fonts'
CSS = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,{fill},0'


def fetch(url):
    # A plain user agent makes Google Fonts serve TrueType.
    req = urllib.request.Request(url, headers={'User-Agent': 'curl/8'})
    return urllib.request.urlopen(req, timeout=60).read()


def main():
    codepoints = [int(c, 16) for c in re.findall(r"'\\u([0-9a-f]{4})'", ICONS.read_text(encoding='utf-8'))]
    OUT.mkdir(parents=True, exist_ok=True)
    for fill, name in [(0, 'MaterialSymbolsRounded'), (1, 'MaterialSymbolsRounded-Filled')]:
        css = fetch(CSS.format(fill=fill)).decode()
        full = io.BytesIO(fetch(re.search(r'url\((\S+?)\)', css).group(1)))
        options = subset.Options()
        options.layout_features = []
        options.name_IDs = ['*']
        options.notdef_outline = True
        font = subset.load_font(full, options)
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=codepoints)
        subsetter.subset(font)
        subset.save_font(font, str(OUT / f'{name}.ttf'), options)
        print(f'{name}.ttf: {len(codepoints)} icons, {(OUT / f"{name}.ttf").stat().st_size} bytes')


if __name__ == '__main__':
    main()
