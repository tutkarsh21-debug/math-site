// The numbers behind the three dashboards: a student's own, the parent's view of one student, and the owner's view of everyone.
// Server only. Every function here returns plain data; who may call it is decided by the route that uses it.
import { db, now } from '@/lib/auth';
import { CLASSES } from '@/lib/data';
import { chapterName, describe } from '@/lib/labels';

const DAY = 86400, IST = 19800;                       // days are counted in Indian time (UTC + 5:30)
const dayKey = t => new Date((t + IST) * 1000).toISOString().slice(0, 10);
const pct = (c, n) => (n ? Math.round((100 * c) / n) : null);
const LV = { 0: 'Easy', 1: 'Medium', 2: 'Hard', mixed: 'Mixed' };

// The last n days as 'YYYY-MM-DD', oldest first.
const lastDays = n => Array.from({ length: n }, (_, i) => dayKey(now() - (n - 1 - i) * DAY));

// Everything about one student. `limit` is how many recent items to list.
export async function studentOverview(userId, limit = 25) {
  const d = db(), t = now(), since = t - 14 * DAY;
  const user = await d.prepare('SELECT id, name, cls, board, created_at, parent_code_at FROM users WHERE id = ?').bind(userId).first();
  if (!user) return null;
  const [tests, practice, recent, kinds, chapters, stamps] = (await d.batch([
    d.prepare('SELECT test, score, total, taken_at FROM results WHERE user_id = ? ORDER BY taken_at DESC LIMIT 100').bind(userId),
    d.prepare('SELECT id, cls, level, score, total, secs, minutes, skipped, items, taken_at FROM practice_results WHERE user_id = ? ORDER BY taken_at DESC LIMIT 100').bind(userId),
    d.prepare('SELECT kind, target, created_at FROM events WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').bind(userId, limit),
    d.prepare('SELECT kind, COUNT(*) AS n FROM events WHERE user_id = ? GROUP BY kind').bind(userId),
    d.prepare("SELECT COUNT(DISTINCT target) AS n FROM events WHERE user_id = ? AND kind = 'view' AND target LIKE '/class-%/%'").bind(userId),
    d.prepare('SELECT created_at FROM events WHERE user_id = ? AND created_at > ? LIMIT 3000').bind(userId, since),
  ])).map(r => r.results);

  // Chapter tests: one line for each attempt, with the chapter's real name.
  const chapterTests = tests.map(r => ({ test: r.test, title: chapterName(r.test), score: r.score, total: r.total, pct: pct(r.score, r.total), at: r.taken_at }));

  // Practice tests: the chapters they covered, added up into a strength for each chapter.
  const topics = {};
  const practiceList = practice.map(r => {
    let items = []; try { items = JSON.parse(r.items) || []; } catch {}
    for (const i of items) {
      const k = `${r.cls}|${i.ch}`, e = topics[k] || (topics[k] = { cls: r.cls, ch: i.ch, label: i.label, n: 0, c: 0, last: 0 });
      e.n += i.n; e.c += i.c; e.last = Math.max(e.last, r.taken_at);
    }
    return { id: r.id, cls: r.cls, clsLabel: CLASSES[r.cls]?.label || (r.cls === 'olympiad' ? 'Olympiad' : r.cls), level: LV[r.level] || r.level, score: r.score, total: r.total, pct: pct(r.score, r.total),
      minutes: r.minutes, secs: r.secs, skipped: r.skipped, chapters: items.map(i => i.label), at: r.taken_at };
  });
  const topicList = Object.values(topics).map(e => ({ ...e, pct: pct(e.c, e.n) })).sort((a, b) => a.pct - b.pct);

  // Everything marked right or wrong, from both kinds of test.
  const right = tests.reduce((s, r) => s + r.score, 0) + practice.reduce((s, r) => s + r.score, 0);
  const asked = tests.reduce((s, r) => s + r.total, 0) + practice.reduce((s, r) => s + r.total, 0);

  // Days with any activity in the last 14 days, for the small chart.
  const per = {};
  stamps.forEach(r => { const k = dayKey(r.created_at); per[k] = (per[k] || 0) + 1; });
  [...tests, ...practice].forEach(r => { if (r.taken_at > since) { const k = dayKey(r.taken_at); per[k] = (per[k] || 0) + 1; } });
  const days = lastDays(14).map(k => ({ day: k, n: per[k] || 0 }));
  const kind = Object.fromEntries(kinds.map(r => [r.kind, r.n]));

  return {
    user: { name: user.name, cls: user.cls, clsLabel: CLASSES[user.cls]?.label || user.cls, board: user.board, joined: user.created_at, hasParentCode: !!user.parent_code_at, parentCodeAt: user.parent_code_at },
    summary: {
      testsTaken: tests.length + practice.length, chapterTests: tests.length, practiceTests: practice.length,
      avgPct: pct(right, asked), right, questions: asked, chaptersOpened: chapters[0]?.n || 0, pdfsOpened: kind.pdf || 0, pageViews: kind.view || 0,
      activeDays: days.filter(x => x.n > 0).length,
    },
    topics: topicList, chapterTests: chapterTests.slice(0, 30), practice: practiceList.slice(0, 20), days,
    recent: recent.map(r => ({ ...describe(r.kind, r.target), kind: r.kind, path: r.target, at: r.created_at })),
  };
}

// The whole site, for the owner.
export async function adminOverview() {
  const d = db(), t = now(), d30 = t - 30 * DAY, d7 = t - 7 * DAY;
  const [users, signups, byClass, active, ct, pt, top, enq, doubts, views, scoreRes, scorePra, lastEv] = (await d.batch([
    d.prepare('SELECT id, name, mobile, cls, board, created_at FROM users WHERE is_admin = 0 ORDER BY created_at DESC LIMIT 1000'),
    d.prepare('SELECT created_at FROM users WHERE is_admin = 0 AND created_at > ?').bind(d30),
    d.prepare('SELECT cls, board, COUNT(*) AS n FROM users WHERE is_admin = 0 GROUP BY cls, board'),
    d.prepare('SELECT COUNT(*) AS n FROM (SELECT user_id FROM events WHERE created_at > ? UNION SELECT user_id FROM results WHERE taken_at > ? UNION SELECT user_id FROM practice_results WHERE taken_at > ?)').bind(d7, d7, d7),
    d.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(score), 0) AS s, COALESCE(SUM(total), 0) AS t FROM results'),
    d.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(score), 0) AS s, COALESCE(SUM(total), 0) AS t FROM practice_results'),
    d.prepare('SELECT kind, target, COUNT(*) AS n, COUNT(DISTINCT user_id) AS u FROM events WHERE created_at > ? GROUP BY kind, target ORDER BY n DESC LIMIT 25').bind(d30),
    d.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(message = 'FREE DEMO CLASS REQUEST'), 0) AS demo, COALESCE(SUM(created_at > ?), 0) AS week FROM enquiries").bind(d7),
    d.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(answered_at = 0), 0) AS open FROM doubts'),
    d.prepare('SELECT user_id, COUNT(*) AS n, MAX(created_at) AS last FROM events GROUP BY user_id'),
    d.prepare('SELECT user_id, COUNT(*) AS n, COALESCE(SUM(score), 0) AS s, COALESCE(SUM(total), 0) AS t, MAX(taken_at) AS last FROM results GROUP BY user_id'),
    d.prepare('SELECT user_id, COUNT(*) AS n, COALESCE(SUM(score), 0) AS s, COALESCE(SUM(total), 0) AS t, MAX(taken_at) AS last FROM practice_results GROUP BY user_id'),
    d.prepare('SELECT COUNT(*) AS n FROM events WHERE created_at > ?').bind(d30),
  ])).map(r => r.results);

  const map = rows => Object.fromEntries(rows.map(r => [r.user_id, r]));
  const ev = map(views), cr = map(scoreRes), pr = map(scorePra);
  const students = users.map(u => {
    const e = ev[u.id], c = cr[u.id], p = pr[u.id];
    const s = (c?.s || 0) + (p?.s || 0), n = (c?.t || 0) + (p?.t || 0);
    return { id: u.id, name: u.name, mobile: u.mobile, cls: u.cls, clsLabel: CLASSES[u.cls]?.label || u.cls, board: u.board, joined: u.created_at,
      views: e?.n || 0, tests: (c?.n || 0) + (p?.n || 0), avgPct: pct(s, n), last: Math.max(u.created_at, e?.last || 0, c?.last || 0, p?.last || 0) };
  });
  const bucket = {};
  signups.forEach(r => { const k = dayKey(r.created_at); bucket[k] = (bucket[k] || 0) + 1; });
  const [c, p] = [ct[0], pt[0]];
  return {
    totals: {
      students: users.length, today: users.filter(u => u.created_at > t - DAY).length, week: users.filter(u => u.created_at > d7).length, month: signups.length,
      active7: active[0].n, testsTaken: c.n + p.n, avgPct: pct(c.s + p.s, c.t + p.t), views30: lastEv[0].n,
      enquiries: enq[0].n, demoRequests: enq[0].demo, enquiriesWeek: enq[0].week, doubts: doubts[0].n, doubtsOpen: doubts[0].open,
    },
    byClass: byClass.map(r => ({ cls: r.cls, clsLabel: CLASSES[r.cls]?.label || r.cls, board: r.board, n: r.n })),
    signups: lastDays(30).map(k => ({ day: k, n: bucket[k] || 0 })),
    top: top.map(r => ({ ...describe(r.kind, r.target), kind: r.kind, path: r.target, views: r.n, students: r.u })),
    students,
  };
}
