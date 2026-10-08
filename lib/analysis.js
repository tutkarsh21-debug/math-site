// The analysis shown after a test: topic by topic, level by level, and a few plain observations. No AI is used here: it is arithmetic on
// the answers, so it is instant, free and always the same. (The optional AI report is a separate button; see components/AiReport.js.)
// No imports, so that it can be run and tested on its own.

// A topic is called strong or weak only when the test had at least this many questions on it.
export const MIN_TOPIC = 3;
const pct = (c, n) => (n ? Math.round((100 * c) / n) : 0);
const LEVELS = ['Easy', 'Medium', 'Hard'];

// items: [{ ch, label, lv (0, 1, 2 or undefined), ok, skipped }], one for each question of the whole test.
// meta: { minutes (0 if there was no timer), secs (time used) }.
export function analyse(items, meta = {}) {
  const total = items.length, right = items.filter(i => i.ok).length, skipped = items.filter(i => i.skipped).length;
  const wrong = total - right - skipped;

  const by = {};
  items.forEach(i => { const e = by[i.ch] || (by[i.ch] = { ch: i.ch, label: i.label, n: 0, c: 0, skipped: 0 }); e.n++; if (i.ok) e.c++; if (i.skipped) e.skipped++; });
  const topics = Object.values(by).map(e => ({ ...e, pct: pct(e.c, e.n), enough: e.n >= MIN_TOPIC })).sort((a, b) => a.pct - b.pct || b.n - a.n);

  const levels = LEVELS.map((name, lv) => {
    const rows = items.filter(i => i.lv === lv);
    return { name, lv, n: rows.length, c: rows.filter(i => i.ok).length, pct: pct(rows.filter(i => i.ok).length, rows.length) };
  }).filter(l => l.n > 0);

  const allowed = (meta.minutes || 0) * 60, used = meta.secs || 0;
  const per = total ? Math.round(used / total) : 0;
  const weak = topics.filter(t => t.enough && t.pct < 60);
  const strong = topics.filter(t => t.enough && t.pct >= 80);

  // Plain observations, most useful first, at most four.
  const notes = [];
  const acc = pct(right, total);
  if (weak.length) notes.push({ kind: 'weak', text: `Focus on ${weak.slice(0, 3).map(t => t.label).join(', ')}. ${weak.length > 1 ? 'These are' : 'This is'} where most marks were lost (${weak.slice(0, 3).map(t => `${t.c} of ${t.n}`).join(', ')}).` });
  const easy = levels.find(l => l.lv === 0), hard = levels.find(l => l.lv === 2);
  if (easy && easy.n >= 4 && easy.pct < 70) notes.push({ kind: 'basics', text: `You missed ${easy.n - easy.c} of ${easy.n} Easy questions. Basics need work first: read the short notes of the weak topics before you try harder questions.` });
  else if (hard && hard.n >= 4 && hard.pct >= 70 && (!easy || easy.pct >= 70)) notes.push({ kind: 'good', text: `You solved ${hard.c} of ${hard.n} Hard questions. You are ready for harder sets and mixed-level tests.` });
  if (skipped > 0 && skipped >= Math.max(2, Math.round(total * 0.2))) notes.push({ kind: 'skip', text: `You left ${skipped} of ${total} questions blank. There is no negative marking, so always make your best guess. If you were short of time, practise a timed set again.` });
  else if (allowed && used >= allowed * 0.97 && acc < 90) notes.push({ kind: 'time', text: 'You used almost all of the time. Practise the faster methods in the notes, and move on from a question that takes more than two minutes.' });
  else if (allowed && used > 0 && used <= allowed * 0.4 && acc < 60 && total >= 5) notes.push({ kind: 'rush', text: `You finished in ${Math.max(1, Math.round(used / 60))} min of ${meta.minutes}, but missed many questions. Slow down and read each question twice.` });
  if (strong.length && notes.length < 4) notes.push({ kind: 'good', text: `Strong in ${strong.slice(0, 3).map(t => t.label).join(', ')}. Keep these fresh with a short test every week.` });
  if (!weak.length && !strong.length && topics.every(t => !t.enough)) notes.push({ kind: 'info', text: `There were too few questions on each topic to judge strengths and weaknesses. Make a test with 4 or fewer chapters and 20 or more questions for a clearer picture.` });
  if (acc === 100 && notes.length < 4) notes.unshift({ kind: 'good', text: 'Full marks. Try the Hard level, or add more chapters.' });

  return { total, right, wrong, skipped, acc, topics, levels, weak, strong, used, allowed, per, notes: notes.slice(0, 4) };
}

// What is sent to the AI report: the figures above and the text of some missed questions. Never a name or a mobile number.
// items may also carry q (the question), yours and right (the option texts) for the missed ones.
export function reportPayload(items, meta, a) {
  const missed = items.filter(i => !i.ok && i.q).slice(0, 8).map(i => ({ label: i.label, q: String(i.q).slice(0, 300), yours: i.skipped ? '' : String(i.yours || '').slice(0, 80), right: String(i.right || '').slice(0, 80) }));
  return {
    cls: meta.cls || '', kind: meta.kind || 'practice', title: String(meta.title || '').slice(0, 120), total: a.total, score: a.right, skipped: a.skipped, minutes: meta.minutes || 0, secs: a.used,
    topics: a.topics.map(t => ({ label: String(t.label).slice(0, 80), n: t.n, c: t.c })),
    levels: a.levels.map(l => ({ lv: l.name, n: l.n, c: l.c })),
    missed,
  };
}
