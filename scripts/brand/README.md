# Brand assets

The logo is a forget-me-not flower (the flower literally named "forget me not")
whose five petals are hearts, around a golden center, on a night-indigo
background.

## Logo, icons and store graphics

`node scripts/brand/generate.mjs` builds everything from the geometry in
`geometry.mjs`, using a local Chrome or Edge to render PNGs:

| Output | What |
| --- | --- |
| `assets/brand/logo.svg`, `assets/brand/icon.svg` | Source vector logo and square icon |
| `assets/icon.png` | 512px Play Store icon (copied to `website/public/icon.png`) |
| `assets/feature-graphic.png`, `assets/feature-graphic-he.png` | 1024x500 Play Store feature graphics |
| `src/assets/images/logo*.png`, `app-icon*.png` | In-app logo and icon |
| `android/app/src/main/res/mipmap-*` | Legacy and adaptive launcher icons |
| `android/app/src/main/res/drawable/ic_launcher_*.xml` | Adaptive icon background and themed (monochrome) icon |
| `android/app/src/main/res/drawable/ic_notification.xml` | Status bar icon |

## Icon font

UI icons come from Material Symbols Rounded, subset to the glyphs listed in
`src/ui/Icon.tsx`. After adding an icon there:

```sh
pip install fonttools
python scripts/brand/subset-icons.py
```

## Illustrations

`src/assets/images/hero-*.jpg` and `test-banner.jpg` were generated with Gemini 3
Pro Image on Vertex AI. `hero-loop.webp` and `test-loop.webp` are seamless 8 s
loops of the same pictures, generated with Veo 3.1 (image to video, with the
picture as both the first and the last frame) and converted with:

```sh
ffmpeg -i loop.mp4 -vf "scale=720:-2:flags=lanczos,fps=15" -c:v libwebp_anim -loop 0 -quality 60 -compression_level 6 -an loop.webp
```

The still picture is shown underneath each loop, so the screen never flashes
while the animation loads.

## Reminder sounds

`android/app/src/main/res/raw/alert_*.ogg` were composed with Lyria 2 on Vertex AI
(one prompt per instrument), then the liveliest 7-second window of each was cut,
faded and loudness-normalized (about -12 dB RMS, peaks below -1 dB) so they are
clearly audible on phone speakers:

```sh
ffmpeg -ss <start> -t 7 -i take.wav -ac 1 -af "afade=t=in:st=0:d=0.02,afade=t=out:st=6.2:d=0.8,loudnorm=I=-11:TP=-1.5:LRA=9,aresample=44100,alimiter=limit=0.75:level=false:attack=1:release=50,volume=0.98" tmp.wav
ffmpeg -i tmp.wav -c:a libvorbis -q:a 4 alert_<name>.ogg
```

The sound ids are listed in `AlertSound.kt` and `src/ui/SoundSheet.tsx`.
