// Generates every brand asset from scripts/brand/geometry.mjs:
//   assets/brand/*.svg            source logo and icon
//   assets/icon.png               512px Play Store icon (also used by the website)
//   assets/feature-graphic*.png   1024x500 Play Store feature graphics (EN / HE)
//   src/assets/images/*.png       in-app logo and app icon
//   android/app/src/main/res/...  adaptive / themed / legacy launcher icons,
//                                 notification icon and splash
// Raster images are rendered with a local Chrome or Edge in headless mode
// (set CHROME=/path/to/chrome to override).
// Run: node scripts/brand/generate.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { circlePath, flower, holePath, palette as c } from './geometry.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const res = path.join(root, 'android/app/src/main/res');
const out = (...p) => {
  const file = path.join(root, ...p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
};

// ---------------------------------------------------------------------------
// SVG

function flowerSvg(cx, cy, radius, { id = 'f', shadow = true, widthRatio, gap = true } = {}) {
  const f = flower(cx, cy, radius, widthRatio);
  const grads = f.petals
    .map(
      (p, i) => `
    <linearGradient id="${id}p${i}" gradientUnits="userSpaceOnUse" x1="${p.axis.x1}" y1="${p.axis.y1}" x2="${p.axis.x2}" y2="${p.axis.y2}">
      <stop offset="0.3" stop-color="${c.petalInner}"/>
      <stop offset="0.8" stop-color="${c.petalOuter}"/>
    </linearGradient>`,
    )
    .join('');
  const { cx: x, cy: y, r } = f.center;
  const box = `x="${cx - radius * 1.5}" y="${cy - radius * 1.5}" width="${radius * 3}" height="${radius * 3}"`;
  return `
  <defs>${grads}
    <radialGradient id="${id}c" cx="${x}" cy="${y - r * 0.3}" r="${r * 1.3}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${c.goldLight}"/>
      <stop offset="1" stop-color="${c.gold}"/>
    </radialGradient>
    <radialGradient id="${id}ci" cx="${x}" cy="${y + r * 0.2}" r="${r * 0.6}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${c.goldDeep}"/>
      <stop offset="1" stop-color="${c.gold}"/>
    </radialGradient>
    <mask id="${id}m" maskUnits="userSpaceOnUse" ${box}>
      <rect ${box} fill="#fff"/>
      <circle cx="${x}" cy="${y}" r="${f.gapR}" fill="#000"/>
    </mask>
    <filter id="${id}s" filterUnits="userSpaceOnUse" ${box}>
      <feDropShadow dx="0" dy="${radius * 0.05}" stdDeviation="${radius * 0.06}" flood-color="${c.night}" flood-opacity="0.45"/>
    </filter>
  </defs>
  <g${gap ? ` mask="url(#${id}m)"` : ''}>
    <g${shadow ? ` filter="url(#${id}s)"` : ''}>
      ${f.petals.map((p, i) => `<path d="${p.d}" fill="url(#${id}p${i})"/>`).join('\n      ')}
    </g>
  </g>
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}c)"/>
  <circle cx="${x}" cy="${y}" r="${r * 0.48}" fill="url(#${id}ci)"/>`;
}

function backgroundSvg(size, id = 'bg') {
  const s = size;
  return `
  <defs>
    <linearGradient id="${id}l" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="${c.night}"/>
      <stop offset="0.55" stop-color="${c.indigo}"/>
      <stop offset="1" stop-color="${c.periwinkle}"/>
    </linearGradient>
    <radialGradient id="${id}g" cx="0.5" cy="0.5" r="0.45">
      <stop offset="0" stop-color="${c.glow}" stop-opacity="0.6"/>
      <stop offset="1" stop-color="${c.glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${s}" height="${s}" fill="url(#${id}l)"/>
  <rect width="${s}" height="${s}" fill="url(#${id}g)"/>`;
}

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}\n</svg>\n`;

/** Logo mark only, transparent background. */
const logoSvg = svg(512, 512, flowerSvg(256, 256, 218));

/** Full-bleed square icon (Play Store, website). */
const iconSvg = svg(512, 512, backgroundSvg(512) + flowerSvg(256, 256, 166));

/** Legacy launcher icon (API < 26): rounded square or circle with the artwork. */
function legacySvg(round) {
  const s = 192;
  const m = s * 0.04;
  const shape = round
    ? `<circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - m}"/>`
    : `<rect x="${m}" y="${m}" width="${s - 2 * m}" height="${s - 2 * m}" rx="${s * 0.22}"/>`;
  return svg(
    s,
    s,
    `<defs><clipPath id="clip">${shape}</clipPath></defs>
  <g clip-path="url(#clip)">${backgroundSvg(s)}${flowerSvg(s / 2, s / 2, s * 0.3)}</g>`,
  );
}

/** Adaptive icon foreground: 108dp canvas, artwork inside the 66dp safe zone. */
const foregroundSvg = svg(108, 108, flowerSvg(54, 54, 29));

// ---------------------------------------------------------------------------
// Android vector drawables

const aapt = 'xmlns:aapt="http://schemas.android.com/aapt"';

const vectorBackground = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by scripts/brand/generate.mjs -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    ${aapt}
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:pathData="M0,0h108v108h-108z">
        <aapt:attr name="android:fillColor">
            <gradient android:type="linear" android:startX="32" android:startY="0" android:endX="76" android:endY="108">
                <item android:offset="0" android:color="${c.night}" />
                <item android:offset="0.55" android:color="${c.indigo}" />
                <item android:offset="1" android:color="${c.periwinkle}" />
            </gradient>
        </aapt:attr>
    </path>
    <path android:pathData="M0,0h108v108h-108z">
        <aapt:attr name="android:fillColor">
            <gradient android:type="radial" android:centerX="54" android:centerY="54" android:gradientRadius="48">
                <item android:offset="0" android:color="#99${c.glow.slice(1)}" />
                <item android:offset="1" android:color="#00${c.glow.slice(1)}" />
            </gradient>
        </aapt:attr>
    </path>
</vector>
`;

/** Single-color flower, center separated from the petals by a ring. */
function monoVector(size, cx, radius, color, comment) {
  const f = flower(cx, cx, radius);
  const rect = `M0,0H${size}V${size}H0Z`;
  return `<?xml version="1.0" encoding="utf-8"?>
<!-- ${comment} Generated by scripts/brand/generate.mjs -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="${size}dp"
    android:height="${size}dp"
    android:viewportWidth="${size}"
    android:viewportHeight="${size}">
    <group>
        <clip-path android:pathData="${rect} ${holePath(cx, cx, f.gapR)}" />
        <path android:fillColor="${color}" android:pathData="${f.petals.map(p => p.d).join(' ')}" />
    </group>
    <path android:fillColor="${color}" android:pathData="${circlePath(cx, cx, f.center.r)}" />
</vector>
`;
}

// ---------------------------------------------------------------------------
// Rendering

function findChrome() {
  const candidates = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  const found = candidates.find(p => p && fs.existsSync(p));
  if (!found) throw new Error('Chrome / Edge not found. Set CHROME=/path/to/chrome');
  return found;
}

const chrome = findChrome();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dfm-brand-'));
let n = 0;

/** Renders an HTML document (or an SVG string) to a PNG of exactly w x h pixels. */
export function render(markup, w, h, file, { opaque = false } = {}) {
  const page = path.join(tmp, `page${n++}.html`);
  const body = markup.trimStart().startsWith('<svg')
    ? `<!doctype html><html><head><style>html,body{margin:0;background:transparent;overflow:hidden}svg{display:block;width:${w}px;height:${h}px}</style></head><body>${markup}</body></html>`
    : markup;
  fs.writeFileSync(page, body);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--default-background-color=${opaque ? 'ffffffff' : '00000000'}`,
    `--window-size=${w},${h}`,
    `--screenshot=${file}`,
    '--virtual-time-budget=2000',
    pathToFileURL(page).href,
  ], { stdio: 'ignore' });
}

// ---------------------------------------------------------------------------
// Play Store feature graphic (1024x500). In Hebrew the layout is mirrored.

const featureText = {
  en: {
    title: "Don't Forget Me",
    tagline: 'A reminder to check the back seat every time you leave the car.',
    badges: 'Free · No ads · No sign-up',
  },
  he: {
    title: 'אל תשכח אותי',
    tagline: 'תזכורת לבדוק את המושב האחורי בכל פעם שיוצאים מהרכב.',
    badges: 'חינם · ללא פרסומות · ללא הרשמה',
  },
};

function featureGraphicHtml(lang) {
  const rtl = lang === 'he';
  const text = featureText[lang];
  const file = p => pathToFileURL(path.join(root, p)).href;
  const font = (name, weight) =>
    `@font-face{font-family:Rubik;font-weight:${weight};src:url(${file(`android/app/src/main/assets/fonts/Rubik-${name}.ttf`)})}`;
  return `<!doctype html><html><head><style>
  ${font('Regular', 400)}${font('Medium', 500)}${font('ExtraBold', 800)}
  html,body{margin:0;width:1024px;height:500px;overflow:hidden;background:${c.night};font-family:Rubik}
  .art{position:absolute;top:-10px;${rtl ? 'left' : 'right'}:-70px;width:720px;height:520px;
    background:url(${file('src/assets/images/hero-on.jpg')}) center/cover}
  .fade{position:absolute;inset:0;background:linear-gradient(${rtl ? 'to left' : 'to right'},${c.night} 30%,rgba(11,14,58,.85) 46%,rgba(11,14,58,0) 70%)}
  .glow{position:absolute;inset:0;background:radial-gradient(circle at ${rtl ? '85%' : '15%'} 20%,rgba(113,131,255,.35),rgba(113,131,255,0) 45%)}
  .text{position:absolute;top:0;bottom:0;${rtl ? 'right' : 'left'}:64px;width:470px;display:flex;flex-direction:column;justify-content:center;gap:18px}
  .icon{width:84px;height:84px;border-radius:22px;box-shadow:0 12px 30px rgba(0,0,0,.35)}
  h1{margin:0;color:#fff;font-weight:800;font-size:58px;line-height:1.05}
  p{margin:0;color:rgba(255,255,255,.82);font-size:25px;line-height:1.4;font-weight:400}
  .badges{display:inline-flex;align-self:flex-start;padding:9px 18px;border-radius:999px;background:rgba(255,185,56,.16);color:${c.gold};font-size:19px;font-weight:500}
  </style></head><body>
  <div class="art"></div><div class="fade"></div><div class="glow"></div>
  <div class="text" dir="${rtl ? 'rtl' : 'ltr'}">
    <img class="icon" src="${file('assets/icon.png')}">
    <h1>${text.title}</h1><p>${text.tagline}</p><span class="badges">${text.badges}</span>
  </div></body></html>`;
}

// ---------------------------------------------------------------------------

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  fs.writeFileSync(out('assets/brand/logo.svg'), logoSvg);
  fs.writeFileSync(out('assets/brand/icon.svg'), iconSvg);

  render(iconSvg, 512, 512, out('assets/icon.png'), { opaque: true });
  fs.copyFileSync(out('assets/icon.png'), out('website/public/icon.png'));

  // In-app logo (base size 120dp) and app icon (base size 40dp)
  for (const [suffix, scale] of [['', 1], ['@2x', 2], ['@3x', 3]]) {
    render(logoSvg, 120 * scale, 120 * scale, out(`src/assets/images/logo${suffix}.png`));
    render(legacySvg(false), 40 * scale, 40 * scale, out(`src/assets/images/app-icon${suffix}.png`));
  }

  const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [d, scale] of Object.entries(densities)) {
    render(legacySvg(false), 48 * scale, 48 * scale, out(`android/app/src/main/res/mipmap-${d}/ic_launcher.png`));
    render(legacySvg(true), 48 * scale, 48 * scale, out(`android/app/src/main/res/mipmap-${d}/ic_launcher_round.png`));
    render(foregroundSvg, 108 * scale, 108 * scale, out(`android/app/src/main/res/mipmap-${d}/ic_launcher_foreground.png`));
  }

  fs.writeFileSync(path.join(res, 'drawable/ic_launcher_background.xml'), vectorBackground);
  fs.writeFileSync(
    path.join(res, 'drawable/ic_launcher_monochrome.xml'),
    monoVector(108, 54, 29, '#FF000000', 'Themed (monochrome) launcher icon.'),
  );
  fs.writeFileSync(
    path.join(res, 'drawable/ic_notification.xml'),
    monoVector(24, 12, 10.5, '#FFFFFFFF', 'Status bar icon.'),
  );

  render(featureGraphicHtml('en'), 1024, 500, out('assets/feature-graphic.png'), { opaque: true });
  render(featureGraphicHtml('he'), 1024, 500, out('assets/feature-graphic-he.png'), { opaque: true });

  console.log('Brand assets generated.');
}

export { backgroundSvg, flowerSvg, iconSvg, logoSvg, svg };
