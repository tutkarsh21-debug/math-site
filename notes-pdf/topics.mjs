// Builds ../lib/topics.json: the topic headings of every chapter, read from the "# heading" lines of the
// content files. The website lists them on the chapter page, so the page says in words what the PDFs cover.
//
//   node topics.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, 'content'), out = path.join(here, '..', 'lib', 'topics.json');
const topics = {};
for (const f of fs.readdirSync(dir, { recursive: true }).map(String).map(f => f.replace(/\\/g, '/')).sort()) {
  // Year-wise question files, textbook solutions and sample papers are not chapters.
  if (!f.endsWith('.txt') || /\.(pyq-\d+|ncert)\.txt$/.test(f) || f.includes('sample-papers')) continue;
  const text = fs.readFileSync(path.join(dir, f), 'utf8').split('@@')[0];
  const list = [...text.matchAll(/^# (.+)$/gm)].map(m => m[1].trim())
    .filter(h => h !== 'Common mistakes' && !h.includes('$'));   // headings with formulas are left out: the page shows plain text
  if (list.length) topics[f.slice(0, -4)] = list;
}
fs.writeFileSync(out, JSON.stringify(topics, null, 1) + '\n');
console.log('wrote lib/topics.json:', Object.keys(topics).length, 'chapters');
