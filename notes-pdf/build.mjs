// Builds the PDFs of each chapter (short notes, formula bank, DPP sheet, and PYQ questions and solutions
// where there are any) from the text files in content/.
//
//   npm install            (once, inside notes-pdf/)
//   node build.mjs         (all chapters)   or   node build.mjs class-10/real-numbers
//
// Output: ../public/pdf/<class>/<slug>/{notes,formulas,dpp,pyq,pyq-solutions}.pdf, and ../lib/pdfs.json listing what exists
// (the website reads that list). Needs Chrome or Edge installed (or set CHROME_PATH).
//
// Content file format (see content/class-10/real-numbers.txt):
//   @key value        chapter details: class, board, book, chapter, title, summary
//   # Topic           a topic heading
//   - text            a bullet point
//   !tip text         a "Remember" box
//   ?eg text          an example question, followed by
//   = text            its solution steps, and
//   => text           its final answer
//   $ ... $         a formula on its own line
//   | a | b | c |     a table row (first row is the heading); works in a topic, an example question or its solution
//   !fig ...          a diagram (see figure.mjs); works in a topic, an example question or its solution
//   @@formulas        starts the formula bank; then one "Name | formula" per line
//   @@dpp             starts the DPP sheet; then "Q: question" lines, each followed by "A: answer"
//   @@pyq             starts the previous year questions; "T: topic", then "Q: [CBSE 2024, 1 mark] question"
//                     followed by one or more "S: solution step" lines
// Beside a chapter file there can also be <chapter>.pyq-2024.txt (one per year) and <chapter>.ncert.txt
// (textbook exercise solutions: "T: Exercise 1.1", "Q: [Q1] question", "S: step"), both in the @@pyq format.
// A file with "@paper yes" is a sample paper, not a chapter: it needs @class, @board, @title, @marks, @time and
// optionally "@instructions first; second; third", followed by @@pyq with "T: Section A", "Q: [1 mark] ..." and "S:" lines.
// Inside any text: $...$ is maths (LaTeX) and **...** is bold.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import katex from 'katex';
import { figure } from './figure.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(here, 'content');
const outDir = path.join(here, '..', 'public', 'pdf');
const manifest = path.join(here, '..', 'lib', 'pdfs.json');
const tmpDir = path.join(here, '.tmp');
const SITE = 'mathsetu.in', TELEGRAM = 't.me/MathSetu';

const chrome = [process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => p && fs.existsSync(p));
if (!chrome) throw new Error('Chrome or Edge not found. Set CHROME_PATH.');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// A degree sign typed inside maths becomes a proper superscript circle.
const tex = (src, displayMode) => katex.renderToString(src.replace(/°/g, '^\\circ'), { displayMode, throwOnError: true, strict: 'ignore' });
// Inline text: $maths$ and **bold**. Bold may run across maths, so each ** simply switches bold on or off.
const inline = s => {
  let bold = false;
  const html = s.split(/(\$[^$]+\$)/).map(part =>
    part.startsWith('$') && part.endsWith('$') && part.length > 2
      ? tex(part.slice(1, -1), false)
      : esc(part).replace(/\*\*/g, () => (bold = !bold) ? '<strong>' : '</strong>')).join('');
  return bold ? html + '</strong>' : html;
};

function parse(text, file) {
  const meta = {}, topics = [], formulas = [], dpp = [], pyqAll = [], ncert = [];
  let topic = null, eg = null, mode = 'notes', group = null, q = null;
  const fail = (n, msg) => { throw new Error(`${file}:${n + 1}: ${msg}`); };
  text.split(/\r?\n/).forEach((raw, n) => {
    const line = raw.trim();
    if (!line) return;
    if (line === '@@formulas' || line === '@@dpp' || line === '@@pyq' || line === '@@ncert') { mode = line.slice(2); group = q = null; return; }
    if (mode === 'pyq' || mode === 'ncert') {
      const pyq = mode === 'ncert' ? ncert : pyqAll;
      // The same topic can appear in several year files; its questions are collected under one heading.
      if (line.startsWith('T: ')) {
        const name = line.slice(3);
        group = pyq.find(g => g.topic === name) || (pyq.push({ topic: name, qs: [] }), pyq.at(-1)); q = null;
      }
      else if (line.startsWith('Q: ')) {
        const m = line.slice(3).match(/^\[(.+?)\]\s*(.*)$/) || fail(n, 'PYQ question needs a tag: "Q: [CBSE 2024, 1 mark] ..."');
        q = { tag: m[1], text: m[2], extra: [], steps: [] };
        (group || fail(n, 'PYQ question before the first "T: topic"')).qs.push(q);
      }
      else if (!q) fail(n, 'PYQ lines must start with "T: topic" and "Q: [tag] question"');
      else if (line.startsWith('S: ')) q.steps.push(line.slice(3));
      else if (line.startsWith('!fig ')) (q.steps.length ? q.steps : q.extra).push({ type: 'fig', fig: line.slice(5) });
      else if (line.startsWith('|')) {
        const row = line.split('|').slice(1, line.endsWith('|') ? -1 : undefined).map(c => c.trim()), list = q.steps.length ? q.steps : q.extra;
        if (list.at(-1)?.rows) list.at(-1).rows.push(row); else list.push({ type: 'table', rows: [row] });
      }
      else fail(n, 'unrecognised PYQ line: ' + line.slice(0, 40));
      return;
    }
    if (mode === 'formulas') {
      const i = line.indexOf('|'); if (i < 0) fail(n, 'formula line needs "Name | formula"');
      formulas.push({ name: line.slice(0, i).trim(), formula: line.slice(i + 1).trim() }); return;
    }
    if (mode === 'dpp') {
      if (line.startsWith('Q: ')) dpp.push({ q: line.slice(3), a: '' });
      else if (line.startsWith('A: ') && dpp.length && !dpp.at(-1).a) dpp.at(-1).a = line.slice(3);
      else fail(n, 'DPP lines must be "Q: ..." followed by "A: ..."');
      return;
    }
    if (line.startsWith('!fig ')) {
      (eg ? (eg.steps.length ? eg.steps : eg.qTables) : (topic || fail(n, 'figure before the first "# Topic"')).items).push({ type: 'fig', fig: line.slice(5) });
      return;
    }
    if (line.startsWith('|')) {
      const row = line.split('|').slice(1, line.endsWith('|') ? -1 : undefined).map(c => c.trim());
      const list = eg ? (eg.steps.length ? eg.steps : eg.qTables) : (topic || fail(n, 'table before the first "# Topic"')).items;
      if (list.at(-1)?.rows) list.at(-1).rows.push(row); else list.push({ type: 'table', rows: [row] });
      return;
    }
    if (line.startsWith('@')) { const [k, ...v] = line.slice(1).split(' '); meta[k] = v.join(' '); return; }
    if (line.startsWith('# ')) { topic = { title: line.slice(2), items: [] }; topics.push(topic); eg = null; return; }
    if (!topic) fail(n, 'text before the first "# Topic"');
    if (line.startsWith('?eg ')) { eg = { type: 'eg', q: line.slice(4), qTables: [], steps: [], answer: '' }; topic.items.push(eg); return; }
    if (line.startsWith('=> ')) { if (!eg) fail(n, '"=>" without "?eg"'); eg.answer = line.slice(3); eg = null; return; }
    if (line.startsWith('= ')) { if (!eg) fail(n, '"=" without "?eg"'); eg.steps.push(line.slice(2)); return; }
    eg = null;
    if (line.startsWith('- ')) topic.items.push({ type: 'li', text: line.slice(2) });
    else if (line.startsWith('!tip ')) topic.items.push({ type: 'tip', text: line.slice(5) });
    else if (line.startsWith('$$') && line.endsWith('$$')) topic.items.push({ type: 'math', text: line.slice(2, -2).trim() });
    else fail(n, 'unrecognised line: ' + line.slice(0, 40));
  });
  for (const k of meta.paper ? ['class', 'board', 'title', 'marks', 'time'] : ['class', 'board', 'book', 'chapter', 'title']) if (!meta[k]) throw new Error(`${file}: missing @${k}`);
  for (const d of dpp) if (!d.a) throw new Error(`${file}: DPP question without an answer: ${d.q.slice(0, 40)}`);
  for (const g of [...pyqAll, ...ncert]) for (const q of g.qs) if (!q.steps.length) throw new Error(file + ': PYQ question without a solution: ' + q.text.slice(0, 40));
  return { meta, topics, formulas, dpp, pyq: pyqAll, ncert };
}

const table = t => '<table class="data"><tbody>' + t.rows.map((r, i) => '<tr>' + r.map(c => i ? `<td>${inline(c)}</td>` : `<th>${inline(c)}</th>`).join('') + '</tr>').join('') + '</tbody></table>';
const block = b => b.fig ? figure(b.fig) : table(b);
const step = s => typeof s !== 'string' ? block(s) : s.startsWith('$$') && s.endsWith('$$') ? `<div class="step">${tex(s.slice(2, -2).trim(), true)}</div>` : `<div class="step">${inline(s)}</div>`;

function topicHtml(t, i) {
  // A short topic with no examples is kept on one page.
  const compact = t.items.length <= 8 && t.items.every(it => it.type === 'li' || it.type === 'tip');
  let html = `<section class="topic${compact ? ' compact' : ''}"><h2><span class="no">${i + 1}</span>${inline(t.title)}</h2>`, egNo = 0, open = false;
  const closeList = () => { if (open) { html += '</ul>'; open = false; } };
  for (const it of t.items) {
    if (it.type === 'li') { if (!open) { html += '<ul>'; open = true; } html += `<li>${inline(it.text)}</li>`; continue; }
    closeList();
    if (it.type === 'tip') html += `<div class="tip"><b>Remember</b>${inline(it.text)}</div>`;
    else if (it.type === 'table' || it.type === 'fig') html += block(it);
    else if (it.type === 'math') html += `<div class="display">${tex(it.text, true)}</div>`;
    else html += `<div class="eg"><div class="q"><b>Example ${i + 1}.${++egNo}</b>${inline(it.q)}${it.qTables.map(block).join('')}</div>`
      + `<div class="sol"><i>Solution</i>${it.steps.map(step).join('')}`
      + (it.answer ? `<div class="ans">${inline(it.answer)}</div>` : '') + '</div></div>';
  }
  closeList();
  return html + '</section>';
}

// The three documents made from one chapter file: [file name, label, subtitle, body].
const DOCS = {
  notes: ({ meta, topics }) => ['Short Notes', 'Topic-wise short notes with solved examples',
    (meta.summary ? `<p class="summary">${inline(meta.summary)}</p>` : '') + topics.map(topicHtml).join('\n')],
  formulas: ({ formulas }) => ['Formula Bank', 'Every formula and result of the chapter on one sheet',
    `<table class="formulas"><tbody>${formulas.map((f, i) => `<tr><td class="n">${i + 1}</td><td class="name">${inline(f.name)}</td><td class="f">${inline(f.formula)}</td></tr>`).join('')}</tbody></table>`],
  dpp: ({ dpp }) => ['DPP Sheet', `Daily practice problems: ${dpp.length} questions with an answer key`,
    `<p class="summary">Try every question on your own first. The answer key is on the last page.</p>`
    + `<ol class="dpp">${dpp.map(d => `<li>${inline(d.q)}</li>`).join('')}</ol>`
    + `<section class="key"><h2 class="key-title">Answer Key</h2><ol class="answers">${dpp.map(d => `<li>${inline(d.a)}</li>`).join('')}</ol></section>`],
  pyq: ({ pyq }) => ['PYQ', `Previous year board questions, topic-wise: ${pyq.reduce((n, g) => n + g.qs.length, 0)} questions`,
    `<p class="summary">The tag after each question gives the board examination year and the marks. Solutions are in a separate PDF with the same question numbers.</p>` + pyqHtml(pyq, false) + PYQ_NOTE],
  'pyq-solutions': ({ pyq }) => ['PYQ Solutions', 'Step-by-step solutions to the previous year questions',
    `<p class="summary">The question numbers match the PYQ question sheet.</p>` + pyqHtml(pyq, true) + PYQ_NOTE],
  ncert: ({ ncert }) => ['NCERT Solutions', `Step-by-step solutions to the textbook exercises: ${ncert.reduce((n, g) => n + g.qs.length, 0)} questions`,
    `<p class="summary">Questions are numbered as in the textbook. Try each one yourself before reading the solution.</p>` + pyqHtml(ncert, true, true) + NCERT_NOTE],
  paper: ({ meta, pyq }) => ['Sample Paper', `Time allowed: ${meta.time} · Maximum marks: ${meta.marks}`,
    paperHead(meta) + pyqHtml(pyq, false) + PAPER_NOTE],
  'paper-solutions': ({ pyq }) => ['Sample Paper Solutions', 'Step-by-step solutions with the marks for each question',
    `<p class="summary">The question numbers match the question paper.</p>` + pyqHtml(pyq, true) + PAPER_NOTE],
};
// Which documents a file produces: a sample paper gives a paper and its solutions, a chapter gives the rest.
const wanted = (kind, ch) => ch.meta.paper ? kind.startsWith('paper')
  : kind === 'notes' ? ch.topics.length > 0 : kind === 'formulas' ? ch.formulas.length > 0 : kind === 'dpp' ? ch.dpp.length > 0
  : kind.startsWith('pyq') ? ch.pyq.length > 0 : kind === 'ncert' ? ch.ncert.length > 0 : false;

const paperHead = meta => `<div class="tip"><b>General instructions</b><ol>${(meta.instructions || '').split(';').map(x => x.trim()).filter(Boolean).map(x => `<li>${inline(x)}</li>`).join('')}</ol></div>`;
const PAPER_NOTE = `<p class="legal">This is a practice paper written by MathSetu on the pattern of the board examination. It is not an official paper of any board. MathSetu is an independent study resource and is not affiliated with or endorsed by CBSE, CISCE, NCERT or any publisher.</p>`;
const NCERT_NOTE = `<p class="legal">The questions are restated in MathSetu's own words and the figures are redrawn; refer to the textbook for the original wording. The solutions are MathSetu's own. MathSetu is an independent study resource and is not affiliated with or endorsed by NCERT, CBSE or any publisher.</p>`;

const PYQ_NOTE = `<p class="legal">These questions are based on questions asked in past board examinations. They have been reworded by MathSetu, the figures are redrawn, and the solutions are MathSetu's own. MathSetu is an independent study resource and is not affiliated with or endorsed by CBSE, CISCE, NCERT or any publisher.</p>`;

// Previous year questions grouped by topic and numbered straight through; with solutions when asked.
// byTag: the tag is the question number itself (textbook exercises), instead of a source shown after the question.
function pyqHtml(groups, solutions, byTag) {
  let no = 0;
  return groups.map((g, i) => `<section class="topic"><h2><span class="no">${i + 1}</span>${inline(g.topic)}</h2>` + g.qs.map(q =>
    `<div class="pyq${solutions ? ' solved' : ''}"><div class="q"><b>${byTag ? esc(q.tag) : ++no + '.'}</b><span>${inline(q.text)}${byTag ? '' : ` <em class="src">${esc(q.tag)}</em>`}${q.extra.map(block).join('')}</span></div>`
    + (solutions ? `<div class="sol"><i>Solution</i>${q.steps.map(step).join('')}</div>` : '') + '</div>').join('') + '</section>').join('\n');
}

const LOGO = `<img class="logo" alt="" src="${pathToFileURL(path.join(here, '..', 'public', 'logo.svg')).href}">`;
const cssUrl = p => pathToFileURL(path.join(here, 'node_modules', p)).href;

function page(meta, label, subtitle, body) {
  const heading = meta.paper ? meta.title : `Chapter ${meta.chapter}: ${meta.title}`;
  const where = `${meta.class} · ${meta.board} · ${heading} · ${label}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(meta.title)} ${esc(label)} | ${esc(meta.class)} ${esc(meta.board)} | MathSetu</title>
${[400, 500, 600, 700].map(w => `<link rel="stylesheet" href="${cssUrl(`@fontsource/poppins/${w}.css`)}">`).join('')}
<link rel="stylesheet" href="${cssUrl('katex/dist/katex.min.css')}">
<link rel="stylesheet" href="${pathToFileURL(path.join(here, 'style.css')).href}">
<style>@page{@bottom-left{content:"MathSetu  ·  ${SITE}"}@bottom-center{content:"Telegram: ${TELEGRAM}"}@bottom-right{content:"Page " counter(page) " of " counter(pages)}}</style>
</head><body>
<div class="wm">MathSetu</div>
<div class="hdr"><span class="brand">${LOGO}MathSetu</span><span>${esc(where)}</span></div>
<table class="sheet"><thead><tr><td><div class="hdr-space"></div></td></tr></thead><tbody><tr><td>
<header class="title"><div class="kicker">${[meta.class, meta.board, meta.book, label].filter(Boolean).map(esc).join(' · ')}</div>
<h1>${esc(heading)}</h1><p>${esc(subtitle)}</p></header>
${body}
</td></tr></tbody></table></body></html>`;
}

const only = process.argv[2];
const papersList = path.join(here, '..', 'lib', 'papers.json');
const all = fs.readdirSync(contentDir, { recursive: true }).map(String).filter(f => f.endsWith('.txt') && !/\.(pyq-\d+|ncert)\.txt$/.test(f)).map(f => f.replace(/\\/g, '/')).sort();
const files = all.filter(f => !only || f === only + '.txt');
if (!files.length) throw new Error('No content files found' + (only ? ` for ${only}` : ''));
fs.mkdirSync(tmpDir, { recursive: true });
for (const f of files) {
  // A chapter's previous year questions live beside it, one file per year: <chapter>.pyq-2024.txt. Newest year first.
  const name = f.slice(0, -4), dir = path.dirname(path.join(contentDir, f)), base = path.basename(name), sizes = [];
  const years = fs.readdirSync(dir).filter(x => x.startsWith(base + '.pyq-') && x.endsWith('.txt')).sort().reverse();
  const ncertFile = path.join(dir, base + '.ncert.txt');
  const ch = parse(fs.readFileSync(path.join(contentDir, f), 'utf8') + years.map(y => '\n@@pyq\n' + fs.readFileSync(path.join(dir, y), 'utf8')).join('')
    + (fs.existsSync(ncertFile) ? '\n@@ncert\n' + fs.readFileSync(ncertFile, 'utf8') : ''), f);
  for (const [kind, make] of Object.entries(DOCS)) {
    if (!wanted(kind, ch)) continue;
    const html = path.join(tmpDir, `${name.replace(/\//g, '__')}-${kind}.html`), pdf = path.join(outDir, name, kind + '.pdf');
    fs.writeFileSync(html, page(ch.meta, ...make(ch)));
    fs.mkdirSync(path.dirname(pdf), { recursive: true });
    execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files',
      `--user-data-dir=${path.join(tmpDir, 'profile')}`, '--virtual-time-budget=8000', `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: 'ignore' });
    sizes.push(`${kind} ${Math.round(fs.statSync(pdf).size / 1024)} KB`);
  }
  console.log('built', name + ':', sizes.join(', '));
}
// List every PDF that exists, so the website knows which tabs have something to show.
const list = {}, papers = {};
for (const f of all) {
  const name = f.slice(0, -4), kinds = Object.keys(DOCS).filter(k => fs.existsSync(path.join(outDir, name, k + '.pdf')));
  if (kinds.length) list[name] = kinds;
  // Sample papers are also listed with their details, for the Sample Papers page.
  const head = fs.readFileSync(path.join(contentDir, f), 'utf8').split('@@')[0];
  if (/^@paper /m.test(head)) papers[name] = Object.fromEntries(['class', 'board', 'title', 'marks', 'time'].map(k => [k, (head.match(new RegExp(`^@${k} (.*)$`, 'm')) || [])[1]?.trim() || '']));
}
fs.writeFileSync(papersList, JSON.stringify(papers, null, 1) + '\n');
fs.writeFileSync(manifest, JSON.stringify(list, null, 1) + '\n');
console.log('wrote lib/pdfs.json:', Object.keys(list).length, 'chapters');
