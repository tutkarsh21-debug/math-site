// Builds ../lib/tests.json (the online chapter tests) from the text files in tests/.
//
//   node tests.mjs
//
// One file per chapter: tests/<class>/<chapter slug>.txt, for example tests/class-10/real-numbers.txt
//   @minutes 15       time allowed (optional; the default is one and a half minutes per question)
//   Q: question       then exactly four options, one per line:
//   - a wrong option
//   * the right option (exactly one line starts with *)
//   W: why            a one-line explanation shown after the test is submitted
// Inside any text: $...$ is maths (LaTeX) and **...** is bold. The website draws the maths in the browser.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, 'tests'), out = path.join(here, '..', 'lib', 'tests.json');
// Every formula is drawn once here, so a typing mistake stops the build instead of reaching a student.
const check = (s, where) => { for (const m of s.matchAll(/\$([^$]+)\$/g)) katex.renderToString(m[1].replace(/°/g, '^\\circ'), { throwOnError: true, strict: 'ignore' }); if ((s.match(/\$/g) || []).length % 2) throw new Error(`${where}: unmatched $`); return s; };

const tests = {};
for (const f of fs.readdirSync(dir, { recursive: true }).map(String).filter(f => f.endsWith('.txt')).map(f => f.replace(/\\/g, '/')).sort()) {
  const qs = []; let minutes = 0;
  fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/).forEach((raw, n) => {
    const line = raw.trim(), where = `${f}:${n + 1}`, q = qs.at(-1);
    if (!line) return;
    if (line.startsWith('@minutes ')) minutes = +line.slice(9);
    else if (line.startsWith('Q: ')) qs.push({ q: check(line.slice(3), where), o: [], a: -1, w: '' });
    else if (!q) throw new Error(`${where}: text before the first "Q:"`);
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (line[0] === '*') { if (q.a >= 0) throw new Error(`${where}: two right options`); q.a = q.o.length; }
      q.o.push(check(line.slice(2), where));
    }
    else if (line.startsWith('W: ')) q.w = check(line.slice(3), where);
    else throw new Error(`${where}: unrecognised line: ${line.slice(0, 40)}`);
  });
  qs.forEach((q, i) => {
    if (q.o.length !== 4 || q.a < 0 || !q.w) throw new Error(`${f}: question ${i + 1} needs four options, one marked *, and a "W:" line`);
    if (new Set(q.o).size !== 4) throw new Error(`${f}: question ${i + 1} has two identical options`);
  });
  if (!qs.length) throw new Error(`${f}: no questions`);
  tests[f.slice(0, -4)] = { minutes: minutes || Math.ceil(qs.length * 1.5), qs };
}
fs.writeFileSync(out, JSON.stringify(tests) + '\n');
console.log('wrote lib/tests.json:', Object.keys(tests).length, 'tests,', Object.values(tests).reduce((n, t) => n + t.qs.length, 0), 'questions');
