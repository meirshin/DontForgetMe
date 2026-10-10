// The "Don't Forget Me" mark: a friendly little car with a golden heart glowing in
// its back window — someone precious in the back seat. Everything is built from
// this one definition so the logo, launcher icons, notification icon and store
// graphics always match.
// (The previous forget-me-not flower mark is kept in assets/brand/archive/flower.)

export const palette = {
  night: '#0B0E3A',
  indigo: '#2A31A6',
  periwinkle: '#7183FF',
  glow: '#9FB0FF',
  bodyTop: '#FFFFFF',
  bodyBottom: '#C9D1FF',
  glass: '#1B2070',
  goldLight: '#FFE49A',
  gold: '#FFB938',
  goldDeep: '#F08A1C',
};

const r = n => Math.round(n * 1000) / 1000;

/*
 * The car in unit space: about 100 wide and 60 tall (wheels included), facing
 * right, centered on (0, 0). y grows downwards, as in SVG.
 * Paths are lists of [command, ...points]; points are [x, y].
 */
const Y = 5; // shifts the drawing so its bounding box is centered on y = 0

const BODY = [
  ['M', [-44, 16]],
  ['C', [-48, 16], [-50, 13], [-50, 9]],
  ['L', [-50, -2]],
  ['C', [-50, -8], [-47, -12], [-44, -16]],
  ['C', [-40, -26], [-36, -35], [-25, -35]],
  ['L', [8, -35]],
  ['C', [16, -35], [20, -32], [24, -26]],
  ['L', [32, -12]],
  ['C', [34, -9], [37, -8], [41, -7]],
  ['C', [48, -5.5], [51, -3], [51, 3]],
  ['L', [51, 9]],
  ['C', [51, 13], [49, 16], [45, 16]],
  ['Z'],
];

const REAR_WINDOW = [
  ['M', [-41, -12]],
  ['C', [-38, -21], [-35, -30.5], [-25, -30.5]],
  ['L', [-8, -30.5]],
  ['L', [-8, -12]],
  ['Z'],
];

const FRONT_WINDOW = [
  ['M', [-3, -30.5]],
  ['L', [7, -30.5]],
  ['C', [13, -30.5], [16, -28.5], [19.5, -24]],
  ['L', [27.5, -12]],
  ['L', [-3, -12]],
  ['Z'],
];

/** A heart 1 wide, centered on (0, 0). */
const HEART = [
  ['M', [0, 0.36]],
  ['C', [-0.06, 0.3], [-0.5, 0.02], [-0.5, -0.23]],
  ['C', [-0.5, -0.41], [-0.36, -0.51], [-0.24, -0.51]],
  ['C', [-0.12, -0.51], [-0.04, -0.44], [0, -0.34]],
  ['C', [0.04, -0.44], [0.12, -0.51], [0.24, -0.51]],
  ['C', [0.36, -0.51], [0.5, -0.41], [0.5, -0.23]],
  ['C', [0.5, 0.02], [0.06, 0.3], [0, 0.36]],
  ['Z'],
];

const HEART_AT = { x: -22.5, y: -20.5, size: 13 };
const WHEELS = [-29, 29];
const WHEEL_Y = 14;
const WHEEL_R = 11;
const ARCH_R = 14;
const HUB_R = 4.6;
const HEADLIGHT = { x: 46.5, y: -1.5, rx: 3.2, ry: 2.4 };

function toPath(cmds, map) {
  return cmds
    .map(([cmd, ...pts]) => cmd + pts.map(p => map(p).map(r).join(',')).join(' '))
    .join(' ');
}

/** Circle as a path; `ccw` draws it counter-clockwise (a hole with the nonzero rule). */
export function circlePath(cx, cy, rad, ccw = false) {
  const s = ccw ? 0 : 1;
  return `M${r(cx)},${r(cy - rad)} A${r(rad)},${r(rad)} 0 1 ${s} ${r(cx)},${r(cy + rad)} A${r(rad)},${r(rad)} 0 1 ${s} ${r(cx)},${r(cy - rad)} Z`;
}

export const holePath = (cx, cy, rad) => circlePath(cx, cy, rad, true);

/**
 * The car centered at (cx, cy), `width` wide. Returns SVG / Android path data
 * for every part, plus the numbers needed for gradients.
 */
export function car(cx, cy, width) {
  const s = width / 101;
  const map = ([x, y]) => [cx + x * s, cy + (y + Y) * s];
  const heart = HEART_AT;
  const heartMap = ([x, y]) => map([heart.x + x * heart.size, heart.y + y * heart.size]);
  const [hx, hy] = map([heart.x, heart.y]);
  const wheels = WHEELS.map(x => {
    const [wx, wy] = map([x, WHEEL_Y]);
    return { cx: r(wx), cy: r(wy), r: r(WHEEL_R * s), arch: r(ARCH_R * s), hub: r(HUB_R * s) };
  });
  const [lx, ly] = map([HEADLIGHT.x, HEADLIGHT.y]);
  const [, top] = map([0, -35]);
  const [, bottom] = map([0, 16]);
  return {
    scale: s,
    body: toPath(BODY, map),
    rearWindow: toPath(REAR_WINDOW, map),
    frontWindow: toPath(FRONT_WINDOW, map),
    heart: toPath(HEART, heartMap),
    heartCenter: { x: r(hx), y: r(hy), size: r(heart.size * s) },
    wheels,
    headlight: { cx: r(lx), cy: r(ly), rx: r(HEADLIGHT.rx * s), ry: r(HEADLIGHT.ry * s) },
    bodyTop: r(top),
    bodyBottom: r(bottom),
  };
}
