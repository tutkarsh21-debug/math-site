// Helpers for the live question generators. Questions are text with $maths$ in KaTeX, as in the rest of the site.

// A small seeded random generator, so a test can be rebuilt from its seed.
export function makeRng(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const R = {
    next,
    int: (a, b) => a + Math.floor(next() * (b - a + 1)),
    pick: arr => arr[Math.floor(next() * arr.length)],
    chance: p => next() < p,
    shuffle: arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    // an integer in a..b other than the ones in `not`
    intNot: (a, b, ...not) => { let v; let n = 0; do { v = R.int(a, b); } while (not.includes(v) && ++n < 200); return v; },
    sign: () => (next() < 0.5 ? -1 : 1),
  };
  return R;
}

export const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
export const ord = n => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10 > 3 ? 0 : n % 10]}`;
export const m = s => `$${s}$`;                       // wrap in maths
export const sg = n => (n < 0 ? `- ${-n}` : `+ ${n}`); // " + 5" or " - 5"

// A fraction in lowest terms, as maths text without the dollar signs.
export function fr(n, d = 1) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  if (d === 1) return String(n);
  return n < 0 ? `-\\frac{${-n}}{${d}}` : `\\frac{${n}}{${d}}`;
}
// A multiple of pi: cpi(1, 4) is \frac{1}{4}\pi
export function cpi(n, d = 1) {
  const g = gcd(n, d) || 1;
  n /= g; d /= g;
  if (d === 1) return n === 1 ? '\\pi' : `${n}\\pi`;
  return `\\frac{${n === 1 ? '' : n}\\pi}{${d}}`.replace('{\\pi}', '{\\pi}');
}
// A decimal with at most two places and no trailing zeros.
export const dec = x => String(Number((+x).toFixed(2)));

// A polynomial from coefficients, highest power first: pstr([2, -3, 1]) is 2x^2 - 3x + 1
export function pstr(coefs, v = 'x') {
  const deg = coefs.length - 1;
  let out = '';
  coefs.forEach((c, i) => {
    if (!c) return;
    const p = deg - i;
    const a = Math.abs(c);
    const body = p === 0 ? String(a) : `${a === 1 ? '' : a}${v}${p === 1 ? '' : `^{${p}}`}`;
    out += out ? ` ${c < 0 ? '-' : '+'} ${body}` : `${c < 0 ? '-' : ''}${body}`;
  });
  return out || '0';
}

// Last resort for wrong answers: change one number in the right answer a little (not exponents or units).
function nudge(ans) {
  const out = [];
  for (const mt of ans.matchAll(/\d+/g)) {
    if (/\^\{?$/.test(ans.slice(0, mt.index))) continue;
    const v = +mt[0];
    for (const d of [1, -1, 2, -2, 3, 10]) {
      const n = v + d;
      if (n < 0 || (v > 0 && n === 0)) continue;
      out.push(ans.slice(0, mt.index) + n + ans.slice(mt.index + mt[0].length));
    }
  }
  return out;
}

// Build a question from the right answer and some wrong ones. `wrong` may hold more than three; extras are dropped.
// If there are too few distinct wrong answers, `fill` supplies more (a function from the random generator).
export function mcq(R, q, ans, wrong, why, fill) {
  const seen = new Set([ans]);
  const bad = [];
  for (const w of R.shuffle(wrong.map(String))) if (!seen.has(w)) { seen.add(w); bad.push(w); }
  if (bad.length < 3 && fill) for (const w of R.shuffle(fill())) { const s = String(w); if (!seen.has(s)) { seen.add(s); bad.push(s); } }
  if (bad.length < 3) for (const w of R.shuffle(nudge(ans))) if (!seen.has(w)) { seen.add(w); bad.push(w); }
  if (bad.length < 3) throw new Error(`not enough distinct options for: ${q}`);
  const o = R.shuffle([ans, ...bad.slice(0, 3)]);
  return { q, o, a: o.indexOf(ans), w: why };
}

// A numeric question: nearby numbers fill in when wrong answers are missing. fmt turns a number into option text.
export function num(R, q, ans, wrong, why, fmt = x => String(x)) {
  const near = () => {
    const out = [ans + 1, ans - 1, ans + 2, ans - 2, ans * 2, ans + 10, ans - 10, ans + 5, ans - 5, ans + 3, ans - 3, ans * 3, ans / 2]
      .filter(x => Number.isFinite(x) && (ans < 0 || x >= 0) && (Number.isInteger(ans) ? Number.isInteger(x) : Number.isInteger(x * 100)));
    return out;
  };
  const f = x => fmt(Number.isInteger(x) ? x : dec(x));
  return mcq(R, q, f(ans), wrong.filter(x => Number.isFinite(x) && (ans < 0 || x >= 0) && (!Number.isInteger(ans) || Number.isInteger(x))).map(f), why, () => near().map(f));
}

export const LEVELS = ['Easy', 'Medium', 'Hard'];

// Build a test: items = [{ cls, slug, level }] (level is 0, 1 or 2), count questions in total, spread over the chosen chapters.
export function buildTest(chapters, level, count, seed) {
  const R = makeRng(seed);
  const qs = [];
  const used = new Set();
  const pickLevel = () => (level === 'mixed' ? R.pick([0, 0, 1, 1, 1, 2, 2]) : level);
  let guard = 0;
  let turn = R.int(0, chapters.length - 1);
  while (qs.length < count && guard++ < count * 40) {
    const ch = chapters[turn++ % chapters.length];
    const lv = pickLevel();
    const pool = ch.levels[lv];
    const t = R.pick(pool);
    let item;
    try { item = t(R); } catch { continue; }
    if (!item) continue;
    if (used.has(item.q)) continue;
    used.add(item.q);
    qs.push({ ...item, ch: ch.slug, cls: ch.cls, label: ch.label, lv });
  }
  return qs;
}
