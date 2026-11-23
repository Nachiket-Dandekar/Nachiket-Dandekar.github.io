// Removes hidden metadata (EXIF, GPS location, camera model, dates, XMP, IPTC, text tags, and
// C2PA "content credentials" such as AI-tool provenance tags)
// from every image under src/ and public/. Runs on its own before `npm run dev` and `npm run build`,
// so a photo straight from a phone is cleaned before it can reach GitHub or the live site.
// Run it by hand with: npm run strip-metadata
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import zlib from 'node:zlib';

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

// PDFs cannot be rewritten here, so just warn if one carries provenance tags or author/app fields.
const pdfs = [];
(function walkPdf(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkPdf(p);
    else if (/\.pdf$/i.test(name)) pdfs.push(p);
  }
})('public');
// Document properties can sit inside compressed sections, so each section is decompressed and searched too.
// A property only counts when it has a value, e.g. /Author (Name). Accessibility tags such as
// /Title /P (Word's 'Title' style mapped to a paragraph) are not document properties.
const PDF_FLAGS = [
  ['c2pa', /c2pa/i],
  ['jumbf', /jumb/i],
  ['anthropic', /anthropic/i],
  ['claude', /claude/i],
  ['xmp metadata', /x:xmpmeta/i],
  ...['Author', 'Creator', 'Producer', 'Title', 'Subject', 'Keywords'].map((k) => [k, new RegExp(`/${k}\\s*[(<]`)]),
];
function pdfTexts(buf) {
  const raw = buf.toString('latin1');
  const parts = [raw];
  const re = /(?<!end)stream\r?\n/g;
  let m;
  while ((m = re.exec(raw))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf('endstream', start);
    if (end < 0) break;
    try {
      parts.push(zlib.inflateSync(buf.subarray(start, end)).toString('latin1'));
    } catch {
      // not a compressed section, or not zlib: the raw search above covers it
    }
    re.lastIndex = end;
  }
  return parts;
}
for (const pdf of pdfs) {
  const parts = pdfTexts(fs.readFileSync(pdf));
  const found = PDF_FLAGS.filter(([, re]) => parts.some((x) => re.test(x))).map(([label]) => label);
  const name = pdf.split(path.sep).join('/');
  if (found.length) console.warn(`strip-metadata: WARNING ${name} contains ${found.join(', ')}. Re-export it without document properties.`);
  else console.log(`strip-metadata: ${name} has no document properties or provenance tags (${parts.length - 1} sections checked).`);
}

