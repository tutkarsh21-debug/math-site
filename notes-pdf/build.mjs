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
const SITE = 'math-site.tutkarsh21.workers.dev', TELEGRAM = 't.me/MathSetu';

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
  const meta = {}, topics = [], formulas = [], dpp = [], pyq = [];
  let topic = null, eg = null, mode = 'notes';
  const fail = (n, msg) => { throw new Error(`${file}:${n + 1}: ${msg}`); };
  text.split(/\r?\n/).forEach((raw, n) => {
    const line = raw.trim();
    if (!line) return;
    if (line === '@@formulas' || line === '@@dpp' || line === '@@pyq') { mode = line.slice(2); return; }
    if (mode === 'pyq') {
      const q = pyq.at(-1)?.qs.at(-1);
      if (line.startsWith('T: ')) pyq.push({ topic: line.slice(3), qs: [] });
      else if (line.startsWith('Q: ')) {
        const m = line.slice(3).match(/^\[(.+?)\]\s*(.*)$/) || fail(n, 'PYQ question needs a tag: "Q: [CBSE 2024, 1 mark] ..."');
        (pyq.at(-1) || fail(n, 'PYQ question before the first "T: topic"')).qs.push({ tag: m[1], text: m[2], extra: [], steps: [] });
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
  for (const k of ['class', 'board', 'book', 'chapter', 'title']) if (!meta[k]) throw new Error(`${file}: missing @${k}`);
  for (const d of dpp) if (!d.a) throw new Error(`${file}: DPP question without an answer: ${d.q.slice(0, 40)}`);
  for (const g of pyq) for (const q of g.qs) if (!q.steps.length) throw new Error(file + ': PYQ question without a solution: ' + q.text.slice(0, 40));
  return { meta, topics, formulas, dpp, pyq };
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
    `<p class="summary">The tag after each question gives the board paper and the marks. Solutions are in a separate PDF with the same question numbers.</p>` + pyqHtml(pyq, false)],
  'pyq-solutions': ({ pyq }) => ['PYQ Solutions', 'Step-by-step solutions to the previous year questions',
    `<p class="summary">The question numbers match the PYQ question sheet.</p>` + pyqHtml(pyq, true)],
};

// Previous year questions grouped by topic and numbered straight through; with solutions when asked.
function pyqHtml(groups, solutions) {
  let no = 0;
  return groups.map((g, i) => `<section class="topic"><h2><span class="no">${i + 1}</span>${inline(g.topic)}</h2>` + g.qs.map(q =>
    `<div class="pyq${solutions ? ' solved' : ''}"><div class="q"><b>${++no}.</b><span>${inline(q.text)} <em class="src">${esc(q.tag)}</em>${q.extra.map(block).join('')}</span></div>`
    + (solutions ? `<div class="sol"><i>Solution</i>${q.steps.map(step).join('')}</div>` : '') + '</div>').join('') + '</section>').join('\n');
}

const LOGO = `<img class="logo" alt="" src="${pathToFileURL(path.join(here, '..', 'public', 'logo.svg')).href}">`;
const cssUrl = p => pathToFileURL(path.join(here, 'node_modules', p)).href;

function page(meta, label, subtitle, body) {
  const where = `${meta.class} · ${meta.board} · Chapter ${meta.chapter}: ${meta.title} · ${label}`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(meta.title)} ${esc(label)} | ${esc(meta.class)} ${esc(meta.board)} | MathSetu</title>
${[400, 500, 600, 700].map(w => `<link rel="stylesheet" href="${cssUrl(`@fontsource/poppins/${w}.css`)}">`).join('')}
<link rel="stylesheet" href="${cssUrl('katex/dist/katex.min.css')}">
<link rel="stylesheet" href="${pathToFileURL(path.join(here, 'style.css')).href}">
<style>@page{@bottom-left{content:"MathSetu  ·  ${SITE}"}@bottom-center{content:"Telegram: ${TELEGRAM}"}@bottom-right{content:"Page " counter(page) " of " counter(pages)}}</style>
</head><body>
<div class="wm">MathSetu</div>
<div class="hdr"><span class="brand">${LOGO}MathSetu</span><span>${esc(where)}</span></div>
<table class="sheet"><thead><tr><td><div class="hdr-space"></div></td></tr></thead><tbody><tr><td>
<header class="title"><div class="kicker">${esc(meta.class)} · ${esc(meta.board)} · ${esc(meta.book)} · ${esc(label)}</div>
<h1>Chapter ${esc(meta.chapter)}: ${esc(meta.title)}</h1><p>${esc(subtitle)}</p></header>
${body}
</td></tr></tbody></table></body></html>`;
}

const only = process.argv[2];
const all = fs.readdirSync(contentDir, { recursive: true }).map(String).filter(f => f.endsWith('.txt') && !f.endsWith('.pyq.txt')).map(f => f.replace(/\\/g, '/')).sort();
const files = all.filter(f => !only || f === only + '.txt');
if (!files.length) throw new Error('No content files found' + (only ? ` for ${only}` : ''));
fs.mkdirSync(tmpDir, { recursive: true });
for (const f of files) {
  // A chapter's previous year questions live beside it in <chapter>.pyq.txt.
  const name = f.slice(0, -4), pyqFile = path.join(contentDir, name + '.pyq.txt'), sizes = [];
  const ch = parse(fs.readFileSync(path.join(contentDir, f), 'utf8') + (fs.existsSync(pyqFile) ? '\n@@pyq\n' + fs.readFileSync(pyqFile, 'utf8') : ''), f);
  for (const [kind, make] of Object.entries(DOCS)) {
    if (kind === 'formulas' && !ch.formulas.length || kind === 'dpp' && !ch.dpp.length || kind.startsWith('pyq') && !ch.pyq.length) continue;
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
const list = {};
for (const f of all) {
  const name = f.slice(0, -4), kinds = Object.keys(DOCS).filter(k => fs.existsSync(path.join(outDir, name, k + '.pdf')));
  if (kinds.length) list[name] = kinds;
}
fs.writeFileSync(manifest, JSON.stringify(list, null, 1) + '\n');
console.log('wrote lib/pdfs.json:', Object.keys(list).length, 'chapters');
