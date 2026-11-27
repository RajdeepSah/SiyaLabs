/**
 * Founder portrait: crop the original studio photo to 4:5 and render the
 * warm monochrome version used on the site (keeps the natural crop too).
 * Source: design/founder/profile-original.jpg (from rajdeep.officialework.com)
 * Run: node scripts/build-portrait.mjs
 */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'design/founder/profile-original.jpg');
const OUT = path.join(ROOT, 'src/assets/founder');

const { width: W, height: H } = await sharp(SRC).metadata();
const cropW = Math.round(H * 0.8);
const centreX = Math.round(W * 0.512); // subject sits just right of centre
const crop = sharp(SRC)
  .extract({ left: Math.round(centreX - cropW / 2), top: 0, width: cropW, height: H })
  .resize(1600, 2000, { kernel: 'lanczos3' });

await crop.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(OUT, 'rajdeep-sah.jpg'));

// Warm monochrome: shadows → deep pine-black, highlights → brand ivory, gentle S-curve.
const { data, info } = await crop.clone().grayscale().raw().toBuffer({ resolveWithObject: true });
const SHADOW = [17, 26, 24];
const LIGHT = [247, 243, 234];
const K = 1.35;
const curve = (t) => {
  const x = t - 0.5;
  return Math.min(1, Math.max(0, 0.5 + (x * K) / (1 + Math.abs(x) * (K - 1) * 2)));
};
const out = Buffer.alloc(info.width * info.height * 3);
for (let i = 0; i < info.width * info.height; i++) {
  const t = curve(data[i] / 255);
  for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(SHADOW[c] + (LIGHT[c] - SHADOW[c]) * t);
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(OUT, 'rajdeep-sah-mono.jpg'));

console.log('portrait written to', path.relative(ROOT, OUT));
