// Lists every "TODO" left in the site content and pages.
// Run with: npm run todos
import fs from 'node:fs';
import path from 'node:path';

const roots = ['src/content', 'src/pages', 'src/site.config.ts'];
const exts = new Set(['.md', '.mdx', '.astro', '.ts']);
const found = [];

function walk(p) {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) return fs.readdirSync(p).forEach((f) => walk(path.join(p, f)));
  if (!exts.has(path.extname(p))) return;
  fs.readFileSync(p, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (line.includes('TODO:') && !line.includes('import.meta.env.DEV') && !line.includes('Lines that start with')) found.push(`${p.replace(/\\/g, '/')}:${i + 1}  ${line.trim()}`);
    });
}

roots.filter((r) => fs.existsSync(r)).forEach(walk);
if (!fs.existsSync('public/resume.pdf')) found.push('public/resume.pdf  missing (add your resume here)');
if (!['jpg', 'jpeg', 'png', 'webp'].some((e) => fs.existsSync(`src/assets/profile.${e}`))) found.push('src/assets/profile.jpg  missing (add your photo here)');

console.log(found.length ? found.join('\n') : 'No TODOs left.');
console.log(`\n${found.length} item(s).`);
