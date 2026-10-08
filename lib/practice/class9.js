import { gcd, m, sg, fr, cpi, dec, pstr, mcq, num } from './util';

// Class 9 generators. Each chapter has three lists of templates (Easy, Medium, Hard).
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
const NONSQ = [2, 3, 5, 6, 7, 10, 11, 13];
const PRIMES = [2, 3, 5, 7, 11];
const D = '°';
const coprime = (R, lo, hi) => { let a, b; do { a = R.int(lo, hi); b = R.int(lo, hi); } while (a === b || gcd(a, b) !== 1); return [a, b]; };
const pt = (x, y) => `(${x}, ${y})`;
const fac = a => `(x ${a < 0 ? '-' : '+'} ${Math.abs(a)})`;
const cm2 = c => `$${c}\\ \\text{cm}^2$`, cm3 = c => `$${c}\\ \\text{cm}^3$`;

/* ---------------- Number Systems ---------------- */
const numberSystems = {
  slug: 'number-systems', label: 'Number Systems', levels: [
    [
      R => { const k = R.int(2, 9), bad = R.shuffle(NONSQ).slice(0, 3);
        return mcq(R, 'Which of these is a rational number?', m(`\\sqrt{${k * k}}`), bad.map(p => m(`\\sqrt{${p}}`)), `$\\sqrt{${k * k}} = ${k}$, which is a rational number. The others are not perfect squares.`); },
      R => { if (R.chance(0.5)) { const d = R.int(1, 8);
          return mcq(R, `Express $0.\\overline{${d}}$ in the form p/q.`, m(fr(d, 9)), [m(fr(d, 10)), m(fr(d, 99)), m(fr(d + 1, 9)), m(fr(9, d))], `Let x = 0.${d}${d}${d}... Then 10x − x = ${d}, so 9x = ${d} and x = ${d}/9.`); }
        let ab; do { ab = R.int(12, 98); } while (ab % 11 === 0);
        return mcq(R, `Express $0.\\overline{${ab}}$ in the form p/q.`, m(fr(ab, 99)), [m(fr(ab, 90)), m(fr(ab, 100)), m(fr(ab, 9)), m(fr(ab + 1, 99))], `Let x = 0.${ab}${ab}... Then 100x − x = ${ab}, so x = ${ab}/99.`); },
      R => { const b = R.int(2, 7), x = R.int(2, 6), y = R.int(2, 6), t = R.int(0, 2), big = x + y + 3 + (x > y ? 0 : 0);
        const q = [`${b}^{${x}} \\times ${b}^{${y}}`, `${b}^{${x + y}} \\div ${b}^{${y}}`, `(${b}^{${x}})^{${y}}`][t], a = [x + y, x, x * y][t];
        return mcq(R, `Simplify: ${m(q)} (write as a power of ${b})`, m(`${b}^{${a}}`), [m(`${b}^{${a + 1}}`), m(`${b}^{${a + x}}`), m(`${b}^{${Math.max(1, a - 1)}}`), m(`${b * b}^{${a}}`)], 'Use the laws of exponents: a^m × a^n = a^(m+n), a^m ÷ a^n = a^(m−n), (a^m)^n = a^(mn).'); },
    ],
    [
      R => { let p, q; do { p = R.pick(NONSQ); q = R.pick(NONSQ); } while (p <= q); const d = p - q, ans = d === 1 ? `\\sqrt{${p}} + \\sqrt{${q}}` : `\\frac{\\sqrt{${p}} + \\sqrt{${q}}}{${d}}`;
        return mcq(R, `Rationalise the denominator of $\\frac{1}{\\sqrt{${p}} - \\sqrt{${q}}}$.`, m(ans), [m(`\\frac{\\sqrt{${p}} - \\sqrt{${q}}}{${d}}`), m(`\\frac{\\sqrt{${p}} + \\sqrt{${q}}}{${p + q}}`), m(`\\frac{\\sqrt{${p}} + \\sqrt{${q}}}{${d + 1}}`), m(`\\sqrt{${p}} - \\sqrt{${q}}`)],
          `Multiply top and bottom by $\\sqrt{${p}} + \\sqrt{${q}}$. The denominator becomes ${p} − ${q} = ${d}.`); },
      R => { const r = R.int(2, 5), n = R.pick([2, 3, 4]), mm = R.int(1, 3), b = r ** n; if (b > 700) return null;
        return num(R, `Find the value of ${m(`${b}^{\\frac{${mm}}{${n}}}`)}.`, r ** mm, [r * mm, r ** mm + 1, b / n, r ** (mm + 1)], `${b} = ${r}^${n}, so ${b}^(${mm}/${n}) = ${r}^${mm} = ${r ** mm}.`); },
      R => { const [a, b] = coprime(R, 2, 5), n = R.int(1, 3);
        return mcq(R, `Find the value of ${m(`\\left(\\frac{${a}}{${b}}\\right)^{-${n}}`)}.`, m(fr(b ** n, a ** n)), [m(fr(a ** n, b ** n)), m(`-${fr(b ** n, a ** n)}`), m(fr(b * n, a * n)), m(fr(b ** n + 1, a ** n))], `A negative power flips the fraction: (a/b)^(−n) = (b/a)^n = ${b ** n}/${a ** n}.`); },
    ],
    [
      R => { if (R.chance(0.5)) { const a = R.pick(PRIMES);
          let b; do { b = R.pick(PRIMES); } while (b === a);
          return mcq(R, `Simplify ${m(`(\\sqrt{${a}} + \\sqrt{${b}})^2`)}.`, m(`${a + b} + 2\\sqrt{${a * b}}`), [m(`${a + b}`), m(`${a + b} + \\sqrt{${a * b}}`), m(`${a + b} - 2\\sqrt{${a * b}}`), m(`${a * b} + 2\\sqrt{${a + b}}`)], `(√a + √b)² = a + b + 2√(ab) = ${a + b} + 2√${a * b}.`); }
        const a = R.int(5, 40), b = R.int(2, a - 1);
        return num(R, `Find the value of ${m(`(\\sqrt{${a}} + \\sqrt{${b}})(\\sqrt{${a}} - \\sqrt{${b}})`)}.`, a - b, [a + b, a * b, Math.abs(a - b) + 1], `(√a + √b)(√a − √b) = a − b = ${a} − ${b} = ${a - b}.`); },
      R => { const s = R.int(2, 6), n = s * s - 1;
        return num(R, `Find the value of ${m(`\\frac{1}{1+\\sqrt{2}} + \\frac{1}{\\sqrt{2}+\\sqrt{3}} + \\cdots + \\frac{1}{\\sqrt{${n}}+\\sqrt{${n + 1}}}`)}.`, s - 1, [s, n, s + 1, n - 1],
          `Each term 1/(√k + √(k+1)) = √(k+1) − √k, so the sum telescopes to √${n + 1} − √1 = ${s} − 1 = ${s - 1}.`); },
      R => { const [a, b, c] = R.pick([[3, 2, 2], [2, 1, 3], [5, 2, 6], [9, 4, 5], [4, 1, 15]]), sq = R.chance(0.5), xs = `${a} + ${b === 1 ? '' : b}\\sqrt{${c}}`;
        return num(R, `If $x = ${xs}$, find ${sq ? '$x^2 + \\frac{1}{x^2}$' : '$x + \\frac{1}{x}$'}.`.replace('$$', '$'), sq ? 4 * a * a - 2 : 2 * a, sq ? [2 * a, 4 * a * a, 4 * a * a + 2, 2 * a * a] : [a, 4 * a, 2 * a + 1, a * a],
          `Since ${a}² − ${b * b}×${c} = 1, 1/x = ${a} − ${b === 1 ? '' : b}√${c}. So x + 1/x = ${2 * a}${sq ? `, and x² + 1/x² = (x + 1/x)² − 2 = ${4 * a * a - 2}` : ''}.`); },
    ],
  ],
};

/* ---------------- Algebraic Identities and Factorisation ---------------- */
const identities = {
  slug: 'algebraic-identities', label: 'Algebraic Identities and Factorisation', levels: [
    [
      R => { const d = R.int(1, 9), up = R.chance(0.5), n = 100 + (up ? d : -d);
        return num(R, `Using an identity, find the value of $${n}^2$.`, n * n, [n * n + 2 * d, n * n - 2 * d, 10000 + d * d, n * 2], `${n}² = (100 ${up ? '+' : '−'} ${d})² = 10000 ${up ? '+' : '−'} ${200 * d} + ${d * d} = ${n * n}.`); },
      R => { let a, b; do { a = R.sign() * R.int(1, 7); b = R.sign() * R.int(1, 7); } while (Math.abs(a) === Math.abs(b));
        return mcq(R, `Expand ${m(`${fac(a)}${fac(b)}`)}.`, m(pstr([1, a + b, a * b])), [m(pstr([1, a + b, -a * b])), m(pstr([1, -(a + b), a * b])), m(pstr([1, a * b, a + b]))], `(x + a)(x + b) = x² + (a + b)x + ab, with a = ${a}, b = ${b}.`); },
      R => { let a, b; do { a = R.sign() * R.int(1, 7); b = R.sign() * R.int(1, 7); } while (Math.abs(a) === Math.abs(b));
        return mcq(R, `Factorise ${m(pstr([1, a + b, a * b]))}.`, m(`${fac(a)}${fac(b)}`), [m(`${fac(-a)}${fac(-b)}`), m(`${fac(a)}${fac(-b)}`), m(`${fac(-a)}${fac(b)}`)], `Find two numbers with sum ${a + b} and product ${a * b}: they are ${a} and ${b}.`); },
    ],
    [
      R => { const a = R.int(1, 9), b = R.int(1, 9), s = a + b, p = a * b;
        return num(R, `If $a + b = ${s}$ and $ab = ${p}$, find $a^2 + b^2$.`, s * s - 2 * p, [s * s + 2 * p, s * s - p, s * s], `a² + b² = (a + b)² − 2ab = ${s * s} − ${2 * p} = ${s * s - 2 * p}.`); },
      R => { if (R.chance(0.5)) { const a = R.int(1, 6), b = R.int(1, 6), s = a + b, p = a * b;
          return num(R, `If $a + b = ${s}$ and $ab = ${p}$, find $a^3 + b^3$.`, s ** 3 - 3 * s * p, [s ** 3 + 3 * s * p, s ** 3 - 3 * p, s * s * s], `a³ + b³ = (a + b)³ − 3ab(a + b) = ${s ** 3} − ${3 * s * p} = ${s ** 3 - 3 * s * p}.`); }
        const a = R.int(3, 10), b = R.int(1, a - 1), d = a - b, p = a * b;
        return num(R, `If $a - b = ${d}$ and $ab = ${p}$, find $a^2 + b^2$.`, d * d + 2 * p, [d * d - 2 * p, d * d + p, d * d], `a² + b² = (a − b)² + 2ab = ${d * d} + ${2 * p} = ${d * d + 2 * p}.`); },
      R => { const c = [R.int(1, 4), R.int(-6, 6), R.int(-6, 6), R.int(-9, 9)], a = R.pick([-3, -2, -1, 1, 2, 3]), r = ((c[0] * a + c[1]) * a + c[2]) * a + c[3];
        return num(R, `Find the remainder when $${pstr(c)}$ is divided by $x ${a < 0 ? '+' : '-'} ${Math.abs(a)}$.`, r, [-r, r + 1, c[3], r - 2 * c[2]], `By the remainder theorem the remainder is p(${a}) = ${r}.`); },
    ],
    [
      R => { const k = R.int(2, 7), sq = R.chance(0.5);
        return num(R, `If $x + \\frac{1}{x} = ${k}$, find $${sq ? 'x^2 + \\frac{1}{x^2}' : 'x^3 + \\frac{1}{x^3}'}$.`, sq ? k * k - 2 : k ** 3 - 3 * k, sq ? [k * k, k * k + 2, 2 * k] : [k ** 3, k ** 3 + 3 * k, k * k - 2],
          sq ? `x² + 1/x² = (x + 1/x)² − 2 = ${k * k} − 2 = ${k * k - 2}.` : `x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x) = ${k ** 3} − ${3 * k} = ${k ** 3 - 3 * k}.`); },
      R => { let a, b, c; do { a = R.sign() * R.int(1, 8); b = R.sign() * R.int(1, 8); c = -(a + b); } while (!c || a === b);
        return num(R, `If $a = ${a}$, $b = ${b}$ and $c = ${c}$, find $a^3 + b^3 + c^3$.`, 3 * a * b * c, [a * b * c, a + b + c, 3 * (a + b + c) + 1], `Here a + b + c = 0, so a³ + b³ + c³ = 3abc = 3 × ${a} × ${b} × ${c} = ${3 * a * b * c}.`); },
      R => { let k, a, b, c; do { k = R.sign() * R.int(1, 5); a = R.int(1, 3); b = R.sign() * R.int(1, 6); c = -(a ** 3 + k * a * a + b * a); } while (!c);
        return num(R, `If $x - ${a}$ is a factor of $x^3 + kx^2 ${sg(b)}x ${sg(c)}$, find k.`, k, [-k, k + 1, a, b], `Put x = ${a}: ${a ** 3} + k(${a * a}) + (${b})(${a}) + (${c}) = 0, so ${a * a}k = ${-(a ** 3 + b * a + c)} and k = ${k}.`); },
    ],
  ],
};

/* ---------------- Linear Equations in Two Variables ---------------- */
const linear2 = {
  slug: 'linear-equations-two-variables', label: 'Linear Equations in Two Variables', levels: [
    [
      R => { const p = R.int(1, 3), q = R.int(1, 3), x0 = R.int(-4, 6), y0 = R.int(-4, 6), c = p * x0 + q * y0, ok = (x, y) => p * x + q * y === c,
          wrong = [[x0 + 1, y0], [x0, y0 + 1], [y0, x0], [x0 + 2, y0 - 1], [x0 - 1, y0 + 1]].filter(([x, y]) => !ok(x, y));
        return mcq(R, `Which point lies on the line ${m(`${p === 1 ? '' : p}x + ${q === 1 ? '' : q}y = ${c}`)}?`, m(pt(x0, y0)), wrong.map(([x, y]) => m(pt(x, y))), `Put the point in the equation: ${p}(${x0}) + ${q}(${y0}) = ${c}.`); },
      R => { const x = R.sign() * R.int(1, 9), y = R.sign() * R.int(1, 9), q = x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III');
        return mcq(R, `The point ${m(pt(x, y))} lies in`, `Quadrant ${q}`, ['I', 'II', 'III', 'IV'].filter(z => z !== q).map(z => `Quadrant ${z}`), `x is ${x > 0 ? 'positive' : 'negative'} and y is ${y > 0 ? 'positive' : 'negative'}, which is Quadrant ${q}.`); },
      R => { const x = R.int(-3, 6), y = R.int(-4, 6), p = R.int(1, 4), q = R.int(2, 5), c = p * x + q * y;
        return num(R, `In the equation $${p === 1 ? '' : p}x + ${q}y = ${c}$, find y when $x = ${x}$.`, y, [-y, y + 1, c - p * x, x], `${p}(${x}) + ${q}y = ${c}, so ${q}y = ${c - p * x} and y = ${y}.`); },
    ],
    [
      R => { const a = R.int(-4, 5), b = R.int(-4, 5), p = R.int(1, 4), q = R.int(1, 4), k = p * a + q * b;
        return num(R, `If the point ${m(pt(a, b))} lies on the line $${p === 1 ? '' : p}x + ${q === 1 ? '' : q}y = k$, find k.`, k, [-k, k + 1, p * b + q * a, k - 2], `k = ${p}(${a}) + ${q}(${b}) = ${k}.`); },
      R => { const p = R.int(1, 6), q = R.int(1, 6), c = R.int(1, 6) * p * q / gcd(p, q), xi = fr(c, p), yi = fr(c, q), askX = R.chance(0.5);
        return mcq(R, `The line $${p === 1 ? '' : p}x + ${q === 1 ? '' : q}y = ${c}$ cuts the ${askX ? 'x' : 'y'}-axis at the point where ${askX ? 'x' : 'y'} equals`, m(askX ? xi : yi), [m(askX ? yi : xi), m(`-${askX ? xi : yi}`), m(fr(c, p + q)), m(`${c}`)].filter(z => z !== m(askX ? xi : yi)),
          askX ? `Put y = 0: ${p}x = ${c}, so x = ${xi}.` : `Put x = 0: ${q}y = ${c}, so y = ${yi}.`); },
      R => { const a = R.int(-6, 6), b = R.int(-6, 6), t = R.int(0, 2),
          ans = ['y', 'x', 'y'][t] + ' = ' + [b, a, 0][t], q = ['The line parallel to the x-axis through ' + `(${a}, ${b})`, 'The line parallel to the y-axis through ' + `(${a}, ${b})`, 'The x-axis'][t];
        return mcq(R, `${q} has the equation`, m(ans), [m(`x = ${b}`), m(`y = ${a}`), m(`x = ${a}`), m(`y = ${b}`), m('x = 0'), m('y = 0')].filter(z => z !== m(ans)).slice(0, 5), t === 2 ? 'Every point on the x-axis has y = 0.' : t === 0 ? 'A line parallel to the x-axis has a fixed y-value.' : 'A line parallel to the y-axis has a fixed x-value.'); },
    ],
    [
      R => { const a = R.int(1, 5), b = R.sign() * R.int(1, 4), k = R.int(2, 6), c = 3 * a + k * b;
        return num(R, `The point ${m(pt(a, b))} lies on $3x + ky = ${c}$. Find k.`, k, [-k, k + 1, c - 3 * a, a], `3(${a}) + k(${b}) = ${c}, so ${b}k = ${c - 3 * a} and k = ${k}.`); },
      R => { const p = R.int(2, 8), q = R.int(2, 8), pr = p * q, xx = fr(pr * 1, 2);
        return mcq(R, `The line $${q}x + ${p}y = ${pr}$ and the two axes form a triangle. Its area (in square units) is`, m(fr(pr, 2)), [m(`${pr}`), m(fr(p + q, 2)), m(fr(pr, 4)), m(`${p + q}`)].filter(z => z !== m(fr(pr, 2))),
          `The intercepts are x = ${p} and y = ${q}. Area = ½ × ${p} × ${q} = ${pr / 2}.`); },
      R => { let mm, n; do { mm = R.int(-3, 3); n = R.int(-4, 4); } while (!mm || !n); const x1 = R.int(-2, 0), x2 = R.int(1, 3), y = x => mm * x + n, f = (a, b) => `y = ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
        return mcq(R, `The line passes through ${m(pt(x1, y(x1)))} and ${m(pt(x2, y(x2)))}. Its equation is`, m(f(mm, n)), [m(f(mm, -n)), m(f(-mm, n)), m(f(n, mm))], `Slope = (${y(x2)} − (${y(x1)}))/(${x2} − (${x1})) = ${mm}. Using a point, the intercept is ${n}.`); },
    ],
  ],
};

/* ---------------- Lines, Triangles and Quadrilaterals ---------------- */
const angles = {
  slug: 'triangles-and-quadrilaterals', label: 'Triangles and Quadrilaterals', levels: [
    [
      R => { const a = R.int(30, 80), b = R.int(30, 80);
        return num(R, `Two angles of a triangle are ${a}${D} and ${b}${D}. The third angle is`, 180 - a - b, [a + b, 360 - a - b, 180 - a], 'The angles of a triangle add up to 180°.', x => `${x}${D}`); },
      R => { const a = R.int(30, 80), b = R.int(30, 80);
        return num(R, `In a triangle, two interior opposite angles are ${a}${D} and ${b}${D}. The exterior angle is`, a + b, [180 - a - b, 180 + a + b, Math.abs(a - b)], 'An exterior angle equals the sum of the two interior opposite angles.', x => `${x}${D}`); },
      R => { const [a, b, c] = R.pick([[1, 2, 3], [2, 3, 4], [3, 4, 5], [1, 3, 5], [2, 3, 5], [1, 1, 2]]), k = 180 / (a + b + c);
        return num(R, `The angles of a triangle are in the ratio ${a} : ${b} : ${c}. The largest angle is`, k * c, [k * a, k * b, 180 - k * c, 90], `${a} + ${b} + ${c} = ${a + b + c} parts = 180°, so one part = ${k}° and the largest angle = ${c} × ${k}°.`, x => `${x}${D}`); },
    ],
    [
      R => { const a = R.int(50, 120), adj = R.chance(0.5);
        return num(R, `One angle of a parallelogram is ${a}${D}. The ${adj ? 'adjacent' : 'opposite'} angle is`, adj ? 180 - a : a, [adj ? a : 180 - a, 360 - a, 90], adj ? 'Adjacent angles of a parallelogram add up to 180°.' : 'Opposite angles of a parallelogram are equal.', x => `${x}${D}`); },
      R => { const a = R.int(60, 110), b = R.int(70, 110), c = R.int(70, 110);
        return num(R, `Three angles of a quadrilateral are ${a}${D}, ${b}${D} and ${c}${D}. The fourth angle is`, 360 - a - b - c, [a + b + c, 360 - a - b, 180 - (a + b + c) % 180 + 10], 'The angles of a quadrilateral add up to 360°.', x => `${x}${D}`); },
      R => { const x = 2 * R.int(4, 30);
        return num(R, `In triangle ABC, D and E are the mid-points of AB and AC. If BC = ${x} cm, then DE = (in cm)`, x / 2, [x, 2 * x, x / 2 + 1], 'The line joining the mid-points of two sides is parallel to the third side and half of it (mid-point theorem).'); },
    ],
    [
      R => { const iso = R.chance(0.5), v = 2 * R.int(10, 40);
        return iso ? num(R, `The vertex angle of an isosceles triangle is ${v}${D}. Each base angle is`, 90 - v / 2, [v, 180 - v, 90 - v], 'The base angles are equal, so each is (180° − vertex angle)/2.', x => `${x}${D}`)
          : num(R, `Each base angle of an isosceles triangle is ${v}${D}. The vertex angle is`, 180 - 2 * v, [180 - v, 2 * v, 90 - v], 'Vertex angle = 180° − 2 × base angle.', x => `${x}${D}`); },
      R => { const [a, b, c, d] = R.pick([[1, 2, 3, 4], [2, 3, 4, 3], [1, 3, 4, 4], [3, 4, 5, 6], [1, 2, 4, 5], [2, 3, 3, 4]]), s = a + b + c + d;
        if (360 % s) return null; const k = 360 / s;
        return num(R, `The angles of a quadrilateral are in the ratio ${a} : ${b} : ${c} : ${d}. The largest angle is`, k * Math.max(a, b, c, d), [k * Math.min(a, b, c, d), 360 - k * Math.max(a, b, c, d), 90 + k], `One part = 360°/${s} = ${k}°, so the largest angle = ${Math.max(a, b, c, d)} × ${k}°.`, x => `${x}${D}`); },
      R => { const A = 2 * R.int(15, 45);
        return num(R, `In triangle ABC, the bisectors of angles B and C meet at O. If angle A = ${A}${D}, then angle BOC = `, 90 + A / 2, [90 - A / 2, 180 - A, 2 * A], 'Angle BOC = 90° + A/2.', x => `${x}${D}`); },
    ],
  ],
};

/* ---------------- Circles ---------------- */
const circles9 = {
  slug: 'circles', label: 'Circles', levels: [
    [
      R => mcq(R, 'The angle in a semicircle is', `90${D}`, [`45${D}`, `180${D}`, `60${D}`], 'The angle subtended by a diameter on the circle is a right angle.'),
      R => { const a = R.int(20, 70);
        return num(R, `An arc subtends an angle of ${a}${D} at a point on the circle. The angle it subtends at the centre is`, 2 * a, [a, 180 - a, 90 + a], 'The angle at the centre is double the angle at the circumference.', x => `${x}${D}`); },
      R => { const a = 2 * R.int(20, 80);
        return num(R, `An arc subtends ${a}${D} at the centre of a circle. The angle at a point on the remaining part of the circle is`, a / 2, [a, 2 * a, 180 - a / 2], 'The angle at the circumference is half the angle at the centre.', x => `${x}${D}`); },
    ],
    [
      R => { const a = R.int(50, 130);
        return num(R, `ABCD is a cyclic quadrilateral and angle A = ${a}${D}. Angle C is`, 180 - a, [a, 360 - a, 90], 'Opposite angles of a cyclic quadrilateral add up to 180°.', x => `${x}${D}`); },
      R => { const [d, h, r] = R.pick(TRI.map(([a, b, c]) => [a, b, c])), k = R.int(1, 3);
        return num(R, `The radius of a circle is ${r * k} cm. A chord is ${d * k} cm from the centre. The length of the chord is (in cm)`, 2 * h * k, [h * k, 2 * r * k - 2 * d * k, r * k + d * k], `Half the chord = √(${r * k}² − ${d * k}²) = ${h * k} cm, so the chord = ${2 * h * k} cm.`); },
      R => { const a = R.int(30, 70);
        return num(R, `Angles in the same segment of a circle are equal. If one angle is ${a}${D}, another angle in the same segment is`, a, [2 * a, 180 - a, 90 - a], 'Angles in the same segment of a circle are equal.', x => `${x}${D}`); },
    ],
    [
      R => { const a = R.int(60, 110), b = R.int(60, 110);
        return num(R, `ABCD is a cyclic quadrilateral. Side AB is produced to E. If angle ABC = ${a}${D}, then the exterior angle CBE is`, 180 - a, [a, 360 - a, 90], `Angles on a straight line add up to 180°: CBE = 180° − ${a}°. (It also equals the interior opposite angle ADC.)`, x => `${x}${D}`); },
      R => { const [a, b, r] = R.pick(TRI), k = R.int(1, 3), same = R.chance(0.5);
        return num(R, `Two parallel chords of lengths ${2 * a * k} cm and ${2 * b * k} cm are in a circle of radius ${r * k} cm, on ${same ? 'the same side' : 'opposite sides'} of the centre. The distance between them is (in cm)`, same ? Math.abs(a - b) * k : (a + b) * k, [same ? (a + b) * k : Math.abs(a - b) * k, r * k, (a * b) * k], `The chords are ${b * k} cm and ${a * k} cm from the centre (√(${r * k}² − half-chord²)). Distance = ${same ? 'difference' : 'sum'} of these distances.`); },
      R => { const x = 2 * R.int(20, 70);
        return num(R, `O is the centre of a circle and angle AOB = ${x}${D}. The angle ACB at a point C on the minor arc AB is`, 180 - x / 2, [x / 2, 180 - x, 2 * x], 'The angle at the major arc is x/2. A point on the minor arc is the opposite corner of a cyclic quadrilateral, so the angle is 180° − x/2.', y => `${y}${D}`); },
    ],
  ],
};

/* ---------------- Heron's Formula and Mensuration ---------------- */
const HERON = [[3, 4, 5, 6], [5, 12, 13, 30], [13, 14, 15, 84], [7, 15, 20, 42], [9, 10, 17, 36], [8, 15, 17, 60], [6, 25, 29, 60], [10, 13, 13, 60]];
const mensuration9 = {
  slug: 'heron-and-mensuration', label: "Heron's Formula and Mensuration", levels: [
    [
      R => { const [a, b, c, A] = R.pick(HERON);
        return mcq(R, `Find the area of a triangle with sides ${a} cm, ${b} cm and ${c} cm.`, cm2(A), [cm2(A + 6), cm2(A * 2), cm2(a * b / 2 + 1), cm2(Math.max(1, A - 6))], `s = ${(a + b + c) / 2}. Area = √[s(s − a)(s − b)(s − c)] = ${A} cm².`); },
      R => { const a = 2 * R.int(2, 12);
        return mcq(R, `The area of an equilateral triangle of side ${a} cm is`, `$${a * a / 4 === 1 ? '' : a * a / 4}\\sqrt{3}\\ \\text{cm}^2$`, [`$${a * a / 2}\\sqrt{3}\\ \\text{cm}^2$`, `$${a * a / 4}\\sqrt{2}\\ \\text{cm}^2$`, `$${a * a}\\sqrt{3}\\ \\text{cm}^2$`], `Area = (√3/4)a² = (√3/4) × ${a * a}.`); },
      R => { const l = R.int(3, 12), b = R.int(2, 9), h = R.int(2, 8), k = R.int(0, 2);
        return num(R, `A cuboid is ${l} cm long, ${b} cm wide and ${h} cm high. Its ${['volume', 'total surface area', 'lateral surface area'][k]} (in ${k ? 'cm²' : 'cm³'}) is`, [l * b * h, 2 * (l * b + b * h + h * l), 2 * h * (l + b)][k], [l * b * h + b * h, l * b + b * h + h * l, 2 * (l + b + h), 2 * l * b * h], ['V = l × b × h.', 'TSA = 2(lb + bh + hl).', 'LSA = 2h(l + b).'][k]); },
    ],
    [
      R => { const r = R.int(2, 12), h = R.int(3, 15);
        return mcq(R, `A cylinder has radius ${r} cm and height ${h} cm. Its volume is`, cm3(cpi(r * r * h)), [cm3(cpi(2 * r * h)), cm3(cpi(r * h)), cm3(cpi(r * r * h, 3))], `V = πr²h = π × ${r * r} × ${h} = ${r * r * h}π cm³.`); },
      R => { const r = R.int(1, 5) * 3, v = R.chance(0.5);
        return v ? mcq(R, `The volume of a sphere of radius ${r} cm is`, cm3(cpi(4 * r ** 3, 3)), [cm3(cpi(4 * r * r)), cm3(cpi(2 * r ** 3, 3)), cm3(cpi(4 * r ** 3))], `V = (4/3)πr³ = ${4 * r ** 3 / 3}π cm³.`)
          : mcq(R, `The surface area of a sphere of radius ${r} cm is`, cm2(cpi(4 * r * r)), [cm2(cpi(2 * r * r)), cm2(cpi(4 * r ** 3, 3)), cm2(cpi(3 * r * r))], `S = 4πr² = ${4 * r * r}π cm².`); },
      R => { const [r, h, l] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15], [8, 15, 17]]);
        return mcq(R, `A cone has base radius ${r} cm and slant height ${l} cm. Its curved surface area is`, cm2(cpi(r * l)), [cm2(cpi(r * h)), cm2(cpi(r * (l + r))), cm2(cpi(r * l, 3))], `CSA = πrl = π × ${r} × ${l} = ${r * l}π cm².`); },
    ],
    [
      R => { const [l, b, h, d] = R.pick([[2, 3, 6, 7], [1, 2, 2, 3], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11], [1, 4, 8, 9], [8, 9, 12, 17]]), k = R.int(1, 2);
        return num(R, `The dimensions of a cuboid are ${l * k} cm, ${b * k} cm and ${h * k} cm. The length of its longest diagonal is (in cm)`, d * k, [(l + b + h) * k, d * k + 1, (l * b + b * h) * k / 2 + 1], `Diagonal = √(l² + b² + h²) = √(${(l * k) ** 2} + ${(b * k) ** 2} + ${(h * k) ** 2}) = ${d * k} cm.`); },
      R => { const [r, h, l] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15]]);
        return mcq(R, `A cone has base radius ${r} cm and slant height ${l} cm. Its volume is`, cm3(cpi(r * r * h, 3)), [cm3(cpi(r * r * l, 3)), cm3(cpi(r * r * h)), cm3(cpi(r * l, 3))], `Height = √(${l}² − ${r}²) = ${h} cm. V = ⅓πr²h = ⅓ × π × ${r * r} × ${h}.`); },
      R => { const j = R.int(1, 3), h = R.int(3, 20);
        return num(R, `The curved surface area of a cylinder of radius ${7 * j} cm is ${44 * j * h} cm². Its height is (in cm) (take π = 22/7)`, h, [h + j, 2 * h, 44 * j, h - 1], `CSA = 2πrh = 2 × (22/7) × ${7 * j} × h = ${44 * j}h, so h = ${h}.`); },
    ],
  ],
};

/* ---------------- Statistics ---------------- */
const stats9 = {
  slug: 'statistics', label: 'Statistics', levels: [
    [
      R => { const mean = R.int(10, 40), v = Array.from({ length: 5 }, () => mean + R.int(-8, 8)), last = 6 * mean - v.reduce((s, x) => s + x, 0), all = R.shuffle([...v, last]);
        return num(R, `Find the mean of ${all.join(', ')}.`, mean, [mean + 1, mean - 1, all[0]], `Sum = ${6 * mean} and there are 6 observations, so mean = ${mean}.`); },
      R => { const base = R.shuffle(Array.from({ length: 30 }, (_, i) => i + 5)).slice(0, 6), s = base.slice().sort((a, b) => a - b), med = (s[2] + s[3]) / 2;
        return num(R, `Find the median of ${base.join(', ')}.`, med, [s[2], s[3], (s[0] + s[5]) / 2 + 0.5], `Arranged: ${s.join(', ')}. With 6 values, the median is the average of the 3rd and 4th: (${s[2]} + ${s[3]})/2 = ${dec(med)}.`); },
      R => { const pool = R.shuffle(Array.from({ length: 25 }, (_, i) => i + 3)), mode = pool[0], o = pool.slice(1, 6), data = R.shuffle([mode, mode, mode, ...o, o[0]]);
        return num(R, `Find the mode of ${data.join(', ')}.`, mode, [o[0], o[1], Math.max(...data)], `${mode} appears most often (3 times).`); },
    ],
    [
      R => { let x, f, N, S, t = 0; do { x = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15]).slice(0, 4).sort((a, b) => a - b); f = x.map(() => R.int(2, 9)); N = f.reduce((s, v) => s + v, 0); S = x.reduce((s, v, i) => s + v * f[i], 0); } while (S % N && ++t < 3000);
        return num(R, `The values ${x.join(', ')} occur with frequencies ${f.join(', ')} respectively. The mean is`, S / N, [S / N + 1, S / N - 1, x.reduce((s, v) => s + v, 0) / 4], `Mean = Σfx/Σf = ${S}/${N} = ${dec(S / N)}.`); },
      R => { const n = R.int(5, 9), mean = R.int(10, 30), x = mean + R.int(1, 6) * (n + 1), nm = (n * mean + x) / (n + 1);
        return num(R, `The mean of ${n} numbers is ${mean}. A new number ${x} is added. The mean of the ${n + 1} numbers is`, nm, [mean, nm + 1, (mean + x) / 2], `New mean = (${n} × ${mean} + ${x})/${n + 1} = ${dec(nm)}.`); },
      R => { const g = R.int(5, 10), a = R.int(1, 4), b = R.int(1, 4), M = R.int(40, 60), k = R.int(1, 2), n1 = g * a, n2 = g * b, m1 = M + b * k, m2 = M - a * k;
        return num(R, `The mean marks of ${n1} students of section A is ${m1} and of ${n2} students of section B is ${m2}. The mean of all ${n1 + n2} students is`, M, [(m1 + m2) / 2 + 0.5, m1, m2], `Total = ${n1} × ${m1} + ${n2} × ${m2} = ${n1 * m1 + n2 * m2}. Mean = ${n1 * m1 + n2 * m2}/${n1 + n2} = ${M}.`); },
    ],
    [
      R => { const x = R.int(3, 12), step = R.pick([2, 3, 4, 5]), mean = x + 2 * step;
        return num(R, `If the mean of $x, x + ${step}, x + ${2 * step}, x + ${3 * step}, x + ${4 * step}$ is ${mean}, find x.`, x, [mean, x + step, mean - step, x + 1], `The mean of these five values is x + ${2 * step}, so x + ${2 * step} = ${mean} and x = ${x}.`); },
      R => { const n = R.pick([9, 11, 15, 19, 21, 25]), k = R.pick([5, 10]);
        return num(R, `Find the mean of the first ${n} natural numbers.`, (n + 1) / 2, [n / 2, n, (n + 1) / 2 + 1], `Sum = n(n + 1)/2, so mean = (n + 1)/2 = ${(n + 1) / 2}.`); },
      R => { const n = R.int(5, 12), mean = R.int(10, 30), c = R.int(2, 6), mul = R.chance(0.5);
        return mul ? num(R, `The mean of ${n} observations is ${mean}. If every observation is multiplied by ${c}, the new mean is`, mean * c, [mean + c, mean * c + c, mean], 'Multiplying every observation by c multiplies the mean by c.')
          : num(R, `The mean of ${n} observations is ${mean}. If ${c} is subtracted from every observation, the new mean is`, mean - c, [mean + c, mean * c, mean], 'Subtracting c from every observation reduces the mean by c.'); },
    ],
  ],
};

/* ---------------- Probability ---------------- */
const prob9 = {
  slug: 'probability', label: 'Introduction to Probability', levels: [
    [
      R => { const ev = R.pick([['an even number', x => x % 2 === 0], ['a number greater than 4', x => x > 4], ['a multiple of 3', x => x % 3 === 0], ['an odd number', x => x % 2 === 1], ['a number less than 3', x => x < 3]]), c = [1, 2, 3, 4, 5, 6].filter(ev[1]).length;
        return mcq(R, `A die is thrown once. The probability of getting ${ev[0]} is`, m(fr(c, 6)), [m(fr(c + 1, 6)), m(fr(6 - c, 7)), m(fr(c, 5)), m(fr(c, 12))].filter(z => z !== m(fr(c, 6))), `${c} of the 6 outcomes are favourable.`); },
      R => { const h = R.int(30, 70), n = 100;
        return mcq(R, `A coin is tossed ${n} times and head appears ${h} times. The empirical probability of getting a tail is`, m(fr(n - h, n)), [m(fr(h, n)), m(fr(n - h, n + 10)), m(fr(1, 2)), m(fr(n - h + 1, n))].filter(z => z !== m(fr(n - h, n))), `Tails = ${n} − ${h} = ${n - h}. P(tail) = ${n - h}/${n}.`); },
      R => { const r = R.int(2, 9), b = R.int(2, 9);
        return mcq(R, `A bag has ${r} red and ${b} blue balls. The probability of picking a blue ball is`, m(fr(b, r + b)), [m(fr(r, r + b)), m(fr(b, r)), m(fr(b + 1, r + b)), m(fr(b, r + b + 1))].filter(z => z !== m(fr(b, r + b))), `P = ${b}/${r + b}.`); },
    ],
    [
      R => { const p = R.pick([0.1, 0.2, 0.25, 0.35, 0.4, 0.45, 0.6, 0.65, 0.7, 0.85]);
        return num(R, `If the probability of an event E is ${p}, then P(not E) is`, +(1 - p).toFixed(2), [p, +(1 + p).toFixed(2), +(p / 2).toFixed(2), +(1 - p + 0.1).toFixed(2)], 'P(not E) = 1 − P(E).'); },
      R => { const n = R.pick([40, 50, 80, 100, 200]), a = R.int(2, 8) * n / 20, d = n / 10;
        return mcq(R, `In a class test of ${n} students, ${a} scored above 80. A student is chosen at random. The probability that the student scored above 80 is`, m(fr(a, n)), [m(fr(n - a, n)), m(fr(a, n - a)), m(fr(a + d, n)), m(fr(a, n + a))].filter(z => z !== m(fr(a, n))), `P = ${a}/${n}.`); },
      R => { const c = R.int(2, 5), t = R.int(10, 24); if (c >= t) return null;
        return mcq(R, `The probability of an event is ${m(fr(c, t))}. How can this be written as a decimal or percent?`, `${dec(c / t)} (${dec(100 * c / t)}%)`, [`${dec(t / c)} (${dec(100 * t / c)}%)`, `${dec((t - c) / t)} (${dec(100 * (t - c) / t)}%)`, `${dec(c / (t + 1))} (${dec(100 * c / (t + 1))}%)`], 'Divide the numerator by the denominator and multiply by 100 for a percentage.'); },
    ],
    [
      R => { const r = R.int(3, 8), mul = R.int(2, 4);
        return num(R, `A bag has ${r} white balls and some black balls. The probability of picking a black ball is ${mul} times that of a white ball. The number of black balls is`, r * mul, [r + mul, mul, r * mul + r], `P(black) = ${mul} × P(white), so black balls = ${mul} × ${r}.`); },
      R => { const b = R.int(3, 9), t = b + R.int(2, 9), x = R.int(2, 6);
        return mcq(R, `A bag has ${b} blue balls out of ${t}. ${x} more blue balls are added. The new probability of picking blue is`, m(fr(b + x, t + x)), [m(fr(b, t + x)), m(fr(b + x, t)), m(fr(b, t)), m(fr(b + x + 1, t + x))].filter(z => z !== m(fr(b + x, t + x))), `Blue = ${b + x}, total = ${t + x}.`); },
      R => { const N = R.pick([20, 30, 40, 50]), pr = n => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every(d => n % d), c = Array.from({ length: N }, (_, i) => i + 1).filter(pr).length;
        return mcq(R, `A number is chosen at random from 1 to ${N}. The probability that it is prime is`, m(fr(c, N)), [m(fr(c + 1, N)), m(fr(c - 1, N)), m(fr(c, N + 1)), m(fr(N - c, N))].filter(z => z !== m(fr(c, N))), `There are ${c} primes up to ${N}.`); },
    ],
  ],
};

export const CLASS9 = [numberSystems, identities, linear2, angles, circles9, mensuration9, stats9, prob9].map(c => ({ ...c, cls: 'class-9' }));
