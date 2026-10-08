// The "Don't Forget Me" mark: a forget-me-not flower (the flower is literally named
// "forget me not") whose five petals are hearts, around a warm golden center.
// Everything is built from this one definition so the logo, launcher icons,
// notification icon and store graphics always match.

export const palette = {
  night: '#0B0E3A',
  indigo: '#2A31A6',
  periwinkle: '#7183FF',
  glow: '#9FB0FF',
  petalInner: '#D9DFFF',
  petalOuter: '#FFFFFF',
  goldLight: '#FFE49A',
  gold: '#FFB938',
  goldDeep: '#F08A1C',
};

const r = n => Math.round(n * 1000) / 1000;

function rotate([x, y], deg, [cx, cy]) {
  const a = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/**
 * A heart whose tip sits on the flower center and whose lobes point outwards.
 * Coordinates are in a unit space: x in [-0.5, 0.5] (times width), y from 0 (tip)
 * to -1 (top of the lobes, times length).
 */
const HEART = [
  ['M', [0, 0]],
  ['C', [-0.1, -0.1], [-0.5, -0.4], [-0.5, -0.68]],
  ['C', [-0.5, -0.9], [-0.34, -1.0], [-0.24, -1.0]],
  ['C', [-0.12, -1.0], [-0.04, -0.92], [0, -0.8]],
  ['C', [0.04, -0.92], [0.12, -1.0], [0.24, -1.0]],
  ['C', [0.34, -1.0], [0.5, -0.9], [0.5, -0.68]],
  ['C', [0.5, -0.4], [0.1, -0.1], [0, 0]],
];

/** SVG / Android pathData for one petal. */
export function petalPath({ cx, cy, length, width, angle }) {
  const pt = ([ux, uy]) => {
    const p = rotate([cx + ux * width, cy + uy * length], angle, [cx, cy]);
    return `${r(p[0])},${r(p[1])}`;
  };
  return HEART.map(([cmd, ...pts]) => cmd + pts.map(pt).join(' ')).join(' ') + ' Z';
}

/** Start/end of a petal's gradient (from the flower center outwards). */
export function petalAxis({ cx, cy, length, angle }) {
  const [x2, y2] = rotate([cx, cy - length], angle, [cx, cy]);
  return { x1: r(cx), y1: r(cy), x2: r(x2), y2: r(y2) };
}

/**
 * Flower centered at (cx, cy) whose petals reach `radius`.
 * Returns petals and the golden center disc.
 */
export function flower(cx, cy, radius, widthRatio = 0.74) {
  const length = radius;
  const width = radius * widthRatio;
  const petals = [0, 72, 144, 216, 288].map(angle => {
    const p = { cx, cy, length, width, angle };
    return { d: petalPath(p), axis: petalAxis(p) };
  });
  return { petals, center: { cx, cy, r: r(radius * 0.27) }, gapR: r(radius * 0.34) };
}

/** Circle as a path, counter-clockwise (used to punch holes with the nonzero rule). */
export function holePath(cx, cy, rad) {
  return `M${r(cx)},${r(cy - rad)} A${r(rad)},${r(rad)} 0 1 0 ${r(cx)},${r(cy + rad)} A${r(rad)},${r(rad)} 0 1 0 ${r(cx)},${r(cy - rad)} Z`;
}

export function circlePath(cx, cy, rad) {
  return `M${r(cx)},${r(cy - rad)} A${r(rad)},${r(rad)} 0 1 1 ${r(cx)},${r(cy + rad)} A${r(rad)},${r(rad)} 0 1 1 ${r(cx)},${r(cy - rad)} Z`;
}
