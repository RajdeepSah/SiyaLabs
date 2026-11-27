/**
 * One-off brand pipeline, step 1: vectorize the Siya Labs "S" mark.
 *
 * The only logo source we have is a raster brand sheet
 * (design/siya-labs-brand-reference.png). This script:
 *   1. crops the mark, upscales it 8x (Lanczos) and thresholds it,
 *   2. traces it with potrace,
 *   3. normalizes the path into a clean viewBox and splits it into the
 *      two interlocking halves (needed for the hero animation),
 *   4. checks fidelity against the source (IoU) and writes an overlay image.
 *
 * Output: src/components/brand/mark.json (committed). Re-run only if the
 * source artwork changes:  npm run brand:trace
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import potrace from 'potrace';
import { Resvg } from '@resvg/resvg-js';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'design/siya-labs-brand-reference.png');
const OUT_JSON = path.join(ROOT, 'src/components/brand/mark.json');
const REPORT_DIR = path.join(ROOT, 'design/trace-report');

// Mark sits at roughly x 90–306, y 401–630 in the 1536x1024 sheet; pad it.
const CROP = { left: 70, top: 380, width: 260, height: 272 };
const SCALE = Number(process.env.TRACE_SCALE ?? 2);
const CHECK_SCALE = 4;

/* ------------------------------------------------------------------ */
/* 1. Prepare a crisp, high-resolution bitmap                          */
/* ------------------------------------------------------------------ */
const bitmap = await sharp(SRC)
  .extract(CROP)
  .grayscale()
  .resize(CROP.width * SCALE, CROP.height * SCALE, { kernel: 'lanczos3' })
  .threshold(128)
  .png()
  .toBuffer();

/* ------------------------------------------------------------------ */
/* 2. Trace                                                            */
/* ------------------------------------------------------------------ */
const tracer = new potrace.Potrace();
tracer.setParameters({
  turdSize: 400, // drop speckles
  alphaMax: Number(process.env.TRACE_ALPHA ?? 0.9), // lower = more corners kept (keeps the 45° cuts crisp)
  optCurve: true,
  optTolerance: Number(process.env.TRACE_TOL ?? 0.8),
  threshold: 128,
  blackOnWhite: true,
  turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
});
await new Promise((resolve, reject) =>
  tracer.loadImage(bitmap, (err) => (err ? reject(err) : resolve())),
);
const rawD = /\sd="([^"]+)"/.exec(tracer.getPathTag())[1];

/* ------------------------------------------------------------------ */
/* 3. Parse → transform → normalize                                    */
/* ------------------------------------------------------------------ */
function parsePath(d) {
  const tokens = d.match(/[MLCZmlcz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  const subpaths = [];
  let current = null;
  let cmd = null;
  for (let i = 0; i < tokens.length; ) {
    const t = tokens[i];
    if (/[MLCZmlcz]/.test(t)) {
      cmd = t;
      i++;
      if (cmd === 'Z' || cmd === 'z') {
        current.push({ cmd: 'Z', pts: [] });
      }
      continue;
    }
    const arity = { M: 2, L: 2, C: 6 }[cmd.toUpperCase()];
    if (!arity) throw new Error(`Unsupported command ${cmd}`);
    if (cmd !== cmd.toUpperCase()) throw new Error('Relative commands not expected from potrace');
    const nums = tokens.slice(i, i + arity).map(Number);
    i += arity;
    const pts = [];
    for (let k = 0; k < nums.length; k += 2) pts.push([nums[k], nums[k + 1]]);
    if (cmd === 'M') {
      current = [];
      subpaths.push(current);
      current.push({ cmd: 'M', pts });
      cmd = 'L'; // implicit lineto after moveto
    } else {
      current.push({ cmd, pts });
    }
  }
  return subpaths;
}

const toImage = ([x, y]) => [x / SCALE + CROP.left, y / SCALE + CROP.top];
let subpaths = parsePath(rawD).map((sp) =>
  sp.map((seg) => ({ ...seg, pts: seg.pts.map(toImage) })),
);

// Precise bbox by sampling the curves.
function sampleSubpath(sp) {
  const out = [];
  let p0 = null;
  for (const seg of sp) {
    if (seg.cmd === 'M' || seg.cmd === 'L') {
      p0 = seg.pts[0];
      out.push(p0);
    } else if (seg.cmd === 'C') {
      const [c1, c2, p3] = seg.pts;
      for (let s = 1; s <= 24; s++) {
        const t = s / 24;
        const mt = 1 - t;
        out.push([
          mt ** 3 * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * p3[0],
          mt ** 3 * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * p3[1],
        ]);
      }
      p0 = p3;
    }
  }
  return out;
}
function bboxOf(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

/**
 * Straighten runs of segments that are really one straight edge (the 45°
 * cuts, the flat top and bottom). potrace approximates them with chains of
 * tiny curves that can wobble when the mark is shown very large.
 * A run is replaced by a single line when every point of it (control points
 * included) lies within EPS px of the chord and the chord is long enough.
 */
const EPS = 0.45;
const MIN_RUN = 12;
function distToChord(p, a, b) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy) || 1;
  return Math.abs(dy * (p[0] - a[0]) - dx * (p[1] - a[1])) / len;
}
function straighten(sp) {
  // Flatten into [start, ...segments] with explicit start points.
  const segs = [];
  let start = sp[0].pts[0];
  const origin = start;
  for (const seg of sp.slice(1)) {
    if (seg.cmd === 'Z') continue;
    const end = seg.pts[seg.pts.length - 1];
    segs.push({ ...seg, from: start, to: end });
    start = end;
  }
  // Close the loop explicitly so the final edge can be straightened too.
  if (Math.hypot(start[0] - origin[0], start[1] - origin[1]) > 1e-6) {
    segs.push({ cmd: 'L', pts: [origin], from: start, to: origin });
  }
  const out = [];
  for (let i = 0; i < segs.length; ) {
    let best = i;
    for (let j = i; j < segs.length; j++) {
      const a = segs[i].from;
      const b = segs[j].to;
      const pts = segs.slice(i, j + 1).flatMap((s) => [s.from, ...s.pts]);
      if (pts.every((p) => distToChord(p, a, b) <= EPS)) best = j;
      else break;
    }
    const chord = Math.hypot(segs[best].to[0] - segs[i].from[0], segs[best].to[1] - segs[i].from[1]);
    if (best > i || (segs[i].cmd === 'C' && chord >= MIN_RUN && best === i && isFlat(segs[i]))) {
      if (chord >= MIN_RUN || best > i) {
        out.push({ cmd: 'L', pts: [segs[best].to] });
        i = best + 1;
        continue;
      }
    }
    out.push({ cmd: segs[i].cmd, pts: segs[i].pts });
    i++;
  }
  return [{ cmd: 'M', pts: [origin] }, ...out, { cmd: 'Z', pts: [] }];
}
function isFlat(seg) {
  return [seg.from, ...seg.pts].every((p) => distToChord(p, seg.from, seg.to) <= EPS);
}
const segmentsBefore = subpaths.reduce((n, sp) => n + sp.length, 0);
subpaths = subpaths.map(straighten);
console.log('straighten:', segmentsBefore, '→', subpaths.reduce((n, sp) => n + sp.length, 0), 'segments');

const allPts = subpaths.flatMap(sampleSubpath);
const bb = bboxOf(allPts);
const W = bb.maxX - bb.minX;
const H = bb.maxY - bb.minY;

const DECIMALS = Number(process.env.TRACE_DECIMALS ?? 1);
const r = (n) => Math.round(n * 10 ** DECIMALS) / 10 ** DECIMALS;
function serialize(sp, dx, dy) {
  return sp
    .map((seg) => {
      if (seg.cmd === 'Z') return 'Z';
      return seg.cmd + seg.pts.map(([x, y]) => `${r(x - dx)} ${r(y - dy)}`).join(' ');
    })
    .join('');
}

// Separate the halves: group subpaths by which half their centre falls in.
const groups = { upper: [], lower: [] };
for (const sp of subpaths) {
  const b = bboxOf(sampleSubpath(sp));
  const area = (b.maxX - b.minX) * (b.maxY - b.minY);
  const cy = (b.minY + b.maxY) / 2;
  groups[cy < (bb.minY + bb.maxY) / 2 ? 'upper' : 'lower'].push({ sp, area });
}

const mark = {
  note: 'Traced from design/siya-labs-brand-reference.png by scripts/trace-logo.mjs. Do not edit by hand.',
  viewBox: [0, 0, r(W), r(H)],
  // Offset of the mark's top-left corner inside the 1536x1024 reference sheet
  // (used by build-brand.mjs to reproduce the reference lockup spacing).
  referenceOrigin: [r(bb.minX), r(bb.minY)],
  paths: {
    upper: groups.upper.map((g) => serialize(g.sp, bb.minX, bb.minY)).join(''),
    lower: groups.lower.map((g) => serialize(g.sp, bb.minX, bb.minY)).join(''),
  },
};

await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
await fs.writeFile(OUT_JSON, JSON.stringify(mark, null, 2) + '\n');

/* ------------------------------------------------------------------ */
/* 4. Fidelity check                                                   */
/* ------------------------------------------------------------------ */
const cw = CROP.width * CHECK_SCALE;
const ch = CROP.height * CHECK_SCALE;
const ox = bb.minX - CROP.left;
const oy = bb.minY - CROP.top;
const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${CROP.width} ${CROP.height}">
  <rect width="100%" height="100%" fill="#fff"/>
  <g transform="translate(${ox} ${oy})" fill="#000"><path d="${mark.paths.upper}"/><path d="${mark.paths.lower}"/></g>
</svg>`;
const traced = new Resvg(checkSvg, { fitTo: { mode: 'width', value: cw } }).render().pixels; // RGBA

const source = await sharp(SRC)
  .extract(CROP)
  .grayscale()
  .resize(cw, ch, { kernel: 'lanczos3' })
  .raw()
  .toBuffer();

let inter = 0;
let union = 0;
const overlay = Buffer.alloc(cw * ch * 3);
for (let i = 0; i < cw * ch; i++) {
  const a = source[i] < 128; // source ink
  const b = traced[i * 4] < 128; // traced ink
  if (a && b) inter++;
  if (a || b) union++;
  const o = i * 3;
  if (a && b) overlay.set([60, 70, 68], o);
  else if (a) overlay.set([230, 40, 40], o); // only in source
  else if (b) overlay.set([40, 90, 230], o); // only in trace
  else overlay.set([250, 248, 242], o);
}
const iou = inter / union;

await fs.mkdir(REPORT_DIR, { recursive: true });
await sharp(overlay, { raw: { width: cw, height: ch, channels: 3 } })
  .png()
  .toFile(path.join(REPORT_DIR, 'mark-overlay.png'));
await fs.writeFile(
  path.join(REPORT_DIR, 'mark-preview.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.viewBox.join(' ')}" width="${r(W * 3)}" height="${r(H * 3)}"><path fill="#173631" d="${mark.paths.upper}"/><path fill="#A74934" d="${mark.paths.lower}"/></svg>\n`,
);

console.log('subpaths:', subpaths.length, `(upper ${groups.upper.length}, lower ${groups.lower.length})`);
console.log('mark bbox in sheet:', mark.referenceOrigin, 'size:', r(W), 'x', r(H));
console.log('path bytes:', mark.paths.upper.length + mark.paths.lower.length, 'segments:', subpaths.reduce((n, sp) => n + sp.length, 0));
console.log(`IoU vs source: ${(iou * 100).toFixed(2)}%`, iou >= 0.97 ? 'PASS' : 'FAIL (< 97%)');
if (iou < 0.97) process.exitCode = 1;
