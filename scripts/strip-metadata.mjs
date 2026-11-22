// Removes hidden metadata (EXIF, GPS location, camera model, dates, XMP, IPTC, text tags, and
// C2PA "content credentials" such as AI-tool provenance tags)
// from every image under src/ and public/. Runs on its own before `npm run dev` and `npm run build`,
// so a photo straight from a phone is cleaned before it can reach GitHub or the live site.
// Run it by hand with: npm run strip-metadata
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Without this, Windows keeps the original file open and refuses to overwrite it.
sharp.cache(false);

const roots = ['src', 'public'];
const exts = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const files = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (exts.test(name)) files.push(p);
  }
}
roots.forEach(walk);

let cleaned = 0;
for (const file of files) {
  const meta = await sharp(file).metadata();
  // sharp does not report C2PA / JUMBF provenance records, so also look for them in the raw bytes.
  const raw = fs.readFileSync(file);
  const provenance = /c2pa|jumb|contentcredentials/i.test(raw.toString('latin1'));
  const dirty = provenance || meta.exif || meta.xmp || meta.iptc || (meta.comments && meta.comments.length > 0);
  if (!dirty) continue;
  // rotate() applies the EXIF orientation first, so phone photos stay the right way up.
  let img = sharp(file).rotate();
  const fmt = meta.format;
  if (fmt === 'jpeg') img = img.jpeg({ quality: 95, mozjpeg: true });
  else if (fmt === 'png') img = img.png({ compressionLevel: 9 });
  else if (fmt === 'webp') img = img.webp({ quality: 95 });
  else if (fmt === 'avif') img = img.avif({ quality: 80 });
  else if (fmt === 'tiff') img = img.tiff();
  const buf = await img.toBuffer(); // sharp writes no metadata unless asked to
  fs.writeFileSync(file, buf);
  cleaned++;
  console.log(`strip-metadata: cleaned ${file.replace(/\\/g, '/')}`);
}
console.log(`strip-metadata: ${files.length} image(s) checked, ${cleaned} cleaned.`);
