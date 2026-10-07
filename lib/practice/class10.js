import { gcd, lcm, ord, m, sg, fr, cpi, dec, pstr, mcq, num } from './util';

// Each chapter has three lists of templates (Easy, Medium, Hard). A template takes the random generator R and returns { q, o, a, w }.
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
const cm = x => `${x} cm`;
const pt = (x, y) => `(${x}, ${y})`;
const coprime = (R, lo, hi) => { let a, b; do { a = R.int(lo, hi); b = R.int(lo, hi); } while (a === b || gcd(a, b) !== 1); return [a, b]; };
const co = n => (n === 1 ? '' : n === -1 ? '-' : n);
const lin = (a, b) => `${co(a)}x ${b < 0 ? '-' : '+'} ${co(Math.abs(b))}y`;

/* ---------------- Real Numbers ---------------- */
const realNumbers = {
  slug: 'real-numbers', label: 'Real Numbers', levels: [
    [
      R => { const g = R.int(2, 9), [p, q] = coprime(R, 2, 9), a = g * p, b = g * q;
        return num(R, `Find the HCF of ${a} and ${b}.`, g, [g * p * q, p * q, Math.abs(a - b)], `${a} = ${g} × ${p} and ${b} = ${g} × ${q}, and ${p}, ${q} have no common factor, so the HCF is ${g}.`); },
      R => { const g = R.int(2, 7), [p, q] = coprime(R, 2, 8), a = g * p, b = g * q;
        return num(R, `Find the LCM of ${a} and ${b}.`, g * p * q, [a * b, g * p, g * q], `LCM = (${a} × ${b}) ÷ HCF = ${a * b} ÷ ${g} = ${g * p * q}.`); },
      R => { const p = R.pick([2, 3, 5, 6, 7, 10, 11, 13]), ks = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9]);
        return mcq(R, 'Which of these is an irrational number?', m(`\\sqrt{${p}}`), [m(`\\sqrt{${ks[0] ** 2}}`), m(`\\frac{${ks[1]}}{${ks[2]}}`), m(`0.${ks[3]}${ks[3]}`)], `${p} is not a perfect square, so $\\sqrt{${p}}$ cannot be written as p/q. The others are rational.`); },
    ],
    [
      R => { const g = R.int(2, 8), [p, q] = coprime(R, 2, 7), a = g * p, b = g * q;
        return num(R, `The HCF of two numbers is ${g} and their LCM is ${g * p * q}. If one number is ${a}, the other number is`, b, [p * q, g * q * q, a + g], `HCF × LCM = product of the numbers, so the other number = (${g} × ${g * p * q}) ÷ ${a} = ${b}.`); },
      R => { const a = R.int(1, 4), b = R.int(1, 4) === a ? R.int(5, 6) : R.int(1, 4), n = R.pick([3, 7, 9, 11, 13, 17, 19, 21, 23, 27]), ans = Math.max(a, b);
        return num(R, `After how many decimal places does the decimal expansion of ${m(`\\frac{${n}}{2^{${a}}\\times 5^{${b}}}`)} terminate?`, ans, [a + b, Math.min(a, b), a * b], `For a denominator of the form 2^a × 5^b, the decimal ends after max(a, b) places. Here max(${a}, ${b}) = ${ans}.`); },
      R => { const a = R.int(1, 4), b = R.int(1, 4), c = R.int(1, 4), d = R.int(1, 4), useH = R.chance(0.5);
        const val = useH ? 2 ** Math.min(a, c) * 3 ** Math.min(b, d) : 2 ** Math.max(a, c) * 3 ** Math.max(b, d);
        return num(R, `If $x = 2^{${a}} \\times 3^{${b}}$ and $y = 2^{${c}} \\times 3^{${d}}$, find the ${useH ? 'HCF' : 'LCM'} of x and y.`, val,
          [useH ? 2 ** Math.max(a, c) * 3 ** Math.max(b, d) : 2 ** Math.min(a, c) * 3 ** Math.min(b, d), 2 ** (a + c) * 3 ** (b + d), 2 ** a * 3 ** b],
          useH ? 'HCF takes the smallest power of each prime.' : 'LCM takes the greatest power of each prime.'); },
    ],
    [
      R => { const r = R.int(1, 7), g = R.int(r + 1, r + 12), [p, q] = coprime(R, 2, 9), a = g * p + r, b = g * q + r;
        return num(R, `Find the largest number that divides ${a} and ${b} leaving remainder ${r} in each case.`, g, [g + r, Math.abs(a - b), g * p], `The number divides ${a} − ${r} = ${a - r} and ${b} − ${r} = ${b - r} exactly, so it is their HCF = ${g}.`); },
      R => { const set = R.pick([[6, 8, 12], [12, 15, 20], [10, 12, 15], [8, 12, 16], [9, 12, 18], [15, 20, 25], [12, 18, 24]]), r = R.int(1, 5), L = lcm(lcm(set[0], set[1]), set[2]);
        return num(R, `Find the smallest number which leaves remainder ${r} when divided by ${set[0]}, ${set[1]} and ${set[2]}.`, L + r, [L, L - r, 2 * L + r], `The LCM of ${set.join(', ')} is ${L}. The required number is LCM + remainder = ${L} + ${r} = ${L + r}.`); },
      R => { const set = R.pick([[6, 8, 12], [10, 15, 20], [12, 16, 24], [9, 12, 15], [18, 24, 30]]), L = lcm(lcm(set[0], set[1]), set[2]);
        return num(R, `Three bells toll at intervals of ${set[0]}, ${set[1]} and ${set[2]} minutes. They toll together at 9:00 am. After how many minutes will they next toll together?`, L, [gcd(gcd(set[0], set[1]), set[2]), L * 2, set[0] + set[1] + set[2]], `They ring together again after the LCM of ${set.join(', ')} minutes = ${L} minutes.`); },
    ],
  ],
};

/* ---------------- Polynomials ---------------- */
const polynomials = {
  slug: 'polynomials', label: 'Polynomials', levels: [
    [
      R => { const d = R.int(3, 6), ex = R.shuffle([...Array(d).keys()]).slice(0, 2).concat(d).sort((x, y) => y - x);
        const co = ex.map(() => R.sign() * R.int(1, 9)); const text = ex.map((e, i) => `${i && co[i] > 0 ? '+ ' : co[i] < 0 ? (i ? '- ' : '-') : ''}${Math.abs(co[i]) === 1 && e > 0 ? '' : Math.abs(co[i])}${e === 0 ? '' : 'x' + (e === 1 ? '' : `^{${e}}`)}`).join(' ');
        return num(R, `The degree of the polynomial ${m(text)} is`, d, [d - 1, d + 1, ex.length], 'The degree is the highest power of the variable.'); },
      R => { const a = R.int(1, 3), b = R.sign() * R.int(1, 6), c = R.sign() * R.int(1, 8), k = R.pick([-2, -1, 1, 2, 3]), v = a * k * k + b * k + c;
        return num(R, `If $p(x) = ${pstr([a, b, c])}$, find $p(${k})$.`, v, [a * k + b + c, a * k * k - b * k + c, v + 2 * c], `p(${k}) = ${a}(${k})^2 + (${b})(${k}) + (${c}) = ${v}.`); },
      R => { const a = R.int(2, 6), z = R.sign() * R.int(1, 9), b = -a * z;
        return num(R, `The zero of the polynomial $${pstr([a, b])}$ is`, z, [-z, b, a], `Put ${pstr([a, b])} = 0, so x = ${-b}/${a} = ${z}.`); },
    ],
    [
      R => { const a = R.int(1, 4), b = R.sign() * R.int(1, 9), c = R.sign() * R.int(1, 9), s = R.chance(0.5);
        return mcq(R, `For the quadratic polynomial $${pstr([a, b, c])}$, the ${s ? 'sum' : 'product'} of the zeros is`, m(s ? fr(-b, a) : fr(c, a)),
          [m(s ? fr(b, a) : fr(-c, a)), m(s ? fr(c, a) : fr(-b, a)), m(s ? fr(-c, a) : fr(b, a)), m(s ? fr(a, b) : fr(a, c))].filter(x => x), s ? `Sum of zeros = −b/a = ${-b}/${a}.` : `Product of zeros = c/a = ${c}/${a}.`); },
      R => { const s = R.sign() * R.int(1, 9), p = R.sign() * R.int(1, 12);
        return mcq(R, `A quadratic polynomial has zeros whose sum is ${s} and product is ${p}. The polynomial is`, m(pstr([1, -s, p])),
          [m(pstr([1, s, p])), m(pstr([1, -s, -p])), m(pstr([1, s, -p]))], `x² − (sum)x + (product) = ${pstr([1, -s, p]).replace(/\^\{2\}/, '²')}.`); },
      R => { const al = R.int(1, 4), b = R.int(-6, 6), k = -(al * al + b * al);
        return num(R, `If $x = ${al}$ is a zero of $${pstr([1, b, 0])} + k$, find k.`, k, [-k, al * al, b * al], `Put x = ${al}: ${al * al} + (${b})(${al}) + k = 0, so k = ${k}.`); },
    ],
    [
      R => { const B = R.sign() * R.int(1, 8), C = R.sign() * R.int(1, 8), v = B * B - 2 * C;
        return num(R, `If $\\alpha$ and $\\beta$ are the zeros of $${pstr([1, B, C])}$, find $\\alpha^2 + \\beta^2$.`, v, [B * B + 2 * C, B * B - C, C * C - 2 * B], `α + β = ${-B}, αβ = ${C}. α² + β² = (α + β)² − 2αβ = ${B * B} − ${2 * C} = ${v}.`); },
      R => { const B = R.sign() * R.int(1, 9), C = R.sign() * R.int(2, 9);
        return mcq(R, `If $\\alpha$ and $\\beta$ are the zeros of $${pstr([1, B, C])}$, find $\\frac{1}{\\alpha} + \\frac{1}{\\beta}$.`, m(fr(-B, C)), [m(fr(B, C)), m(fr(C, -B)), m(fr(-B, 1) === fr(-B, C) ? '0' : fr(-B, 1)), m(fr(-C, B))],
          `1/α + 1/β = (α + β)/αβ = (${-B})/(${C}).`); },
      R => { const a = R.int(1, 5), b = R.int(-5, 5), s = a + b, p = a * b, third = R.chance(0.5);
        if (third) return num(R, `If $\\alpha + \\beta = ${s}$ and $\\alpha\\beta = ${p}$, find $\\alpha^3 + \\beta^3$.`, s ** 3 - 3 * s * p, [s ** 3 + 3 * s * p, s ** 3 - 3 * p, s * s - 2 * p], `α³ + β³ = (α + β)³ − 3αβ(α + β) = ${s ** 3} − (${3 * s * p}) = ${s ** 3 - 3 * s * p}.`);
        return num(R, `If the zeros of $${pstr([1, -s, p])}$ are $\\alpha$ and $\\beta$, find $|\\alpha - \\beta|$.`, Math.abs(a - b), [Math.abs(a + b), Math.abs(a * b), s * s - 4 * p], `(α − β)² = (α + β)² − 4αβ = ${s * s} − ${4 * p} = ${(a - b) ** 2}, so |α − β| = ${Math.abs(a - b)}.`); },
    ],
  ],
};

/* ---------------- Pair of Linear Equations ---------------- */
const pairLinear = {
  slug: 'pair-of-linear-equations', label: 'Pair of Linear Equations', levels: [
    [
      R => { const a1 = R.int(1, 6), b1 = R.int(1, 6), c1 = R.int(1, 9), t = R.pick(['unique', 'none', 'inf']), mm = R.int(2, 3);
        let a2, b2, c2;
        if (t === 'unique') { do { a2 = R.int(1, 6); b2 = R.int(1, 6); } while (a1 * b2 === a2 * b1); c2 = R.int(1, 9); }
        else { a2 = mm * a1; b2 = mm * b1; c2 = t === 'inf' ? mm * c1 : mm * c1 + R.int(1, 4); }
        const ans = { unique: 'Exactly one solution', none: 'No solution', inf: 'Infinitely many solutions' }[t];
        return mcq(R, `The pair of equations $${lin(a1, b1)} = ${c1}$ and $${lin(a2, b2)} = ${c2}$ has`, ans, ['Exactly one solution', 'No solution', 'Infinitely many solutions', 'Exactly two solutions'].filter(x => x !== ans),
          t === 'unique' ? `a₁/a₂ ≠ b₁/b₂, so the lines intersect at one point.` : t === 'none' ? 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂, so the lines are parallel.' : 'a₁/a₂ = b₁/b₂ = c₁/c₂, so the lines coincide.'); },
      R => { const x = R.int(3, 12), y = R.int(1, x - 1), askX = R.chance(0.5);
        return num(R, `If $x + y = ${x + y}$ and $x - y = ${x - y}$, then ${askX ? 'x' : 'y'} =`, askX ? x : y, [askX ? y : x, x + y, x - y], `Adding the equations: 2x = ${2 * x}, so x = ${x}; then y = ${y}.`); },
    ],
    [
      R => { const x = R.int(1, 6), y = R.int(1, 6); let a1, b1, a2, b2; do { a1 = R.int(1, 5); b1 = R.int(1, 5); a2 = R.int(1, 5); b2 = R.int(1, 5); } while (a1 * b2 === a2 * b1);
        const ask = R.pick(['x', 'y', 'x + y']), v = ask === 'x' ? x : ask === 'y' ? y : x + y;
        return num(R, `Solve $${lin(a1, b1)} = ${a1 * x + b1 * y}$ and $${lin(a2, b2)} = ${a2 * x + b2 * y}$. The value of $${ask}$ is`, v, [ask === 'x' ? y : x, x * y, x + y + 1], `Solving by elimination gives x = ${x} and y = ${y}.`); },
      R => { const a1 = R.int(1, 5), b1 = R.int(1, 5), c1 = R.int(1, 6), mm = R.int(2, 4), inf = R.chance(0.5), c2 = inf ? mm * c1 : mm * c1 + R.int(1, 5);
        return num(R, `For what value of k does the pair $${lin(a1, b1)} = ${c1}$ and $${mm * a1}x + ky = ${c2}$ have ${inf ? 'infinitely many solutions' : 'no solution'}?`, mm * b1, [b1, mm * a1, mm * c1],
          `For parallel or coincident lines, a₁/a₂ = b₁/b₂, so ${b1}/k = 1/${mm} and k = ${mm * b1}. (c₁/c₂ ${inf ? 'also equals this ratio' : 'is different'}.)`); },
      R => { const p = R.int(6, 16), q = R.int(2, 9); let a1, b1, a2, b2; do { a1 = R.int(1, 5); b1 = R.int(1, 5); a2 = R.int(1, 5); b2 = R.int(1, 5); } while (a1 * b2 === a2 * b1);
        return num(R, `${a1} pen${a1 > 1 ? 's' : ''} and ${b1} pencil${b1 > 1 ? 's' : ''} cost Rs ${a1 * p + b1 * q}. ${a2} pen${a2 > 1 ? 's' : ''} and ${b2} pencil${b2 > 1 ? 's' : ''} cost Rs ${a2 * p + b2 * q}. Find the cost of one pen (in Rs).`, p, [q, p + q, p - 1], `Let a pen cost x and a pencil cost y. Solving ${a1}x + ${b1}y = ${a1 * p + b1 * q} and ${a2}x + ${b2}y = ${a2 * p + b2 * q} gives x = ${p}.`); },
    ],
    [
      R => { const x = R.int(2, 9), y = R.int(1, x - 1);
        return num(R, `The sum of the digits of a two-digit number is ${x + y}. If the digits are reversed, the new number is ${9 * (x - y)} less than the original number. Find the original number.`, 10 * x + y, [10 * y + x, 11 * (x + y) / 1, 10 * x + y + 9], `Let the digits be x and y. x + y = ${x + y} and 9(x − y) = ${9 * (x - y)}, so x − y = ${x - y}. Hence x = ${x}, y = ${y} and the number is ${10 * x + y}.`); },
      R => { const a1 = R.int(1, 4), b1 = R.int(1, 5), mm = R.int(2, 4), c = R.int(1, 7);
        return mcq(R, `The pair $${lin(a1, b1)} = ${c}$ and $${mm * a1}x + ky + 3 = 0$ has a unique solution if`, m(`k \\neq ${mm * b1}`), [m(`k = ${mm * b1}`), m(`k \\neq ${b1}`), m(`k = ${b1}`)],
          `A unique solution needs a₁/a₂ ≠ b₁/b₂, i.e. 1/${mm} ≠ ${b1}/k, so k ≠ ${mm * b1}.`); },
      R => { const u = R.int(6, 12), v = R.int(1, u - 3), D = u * u - v * v, askV = R.chance(0.5);
        return num(R, `A boat goes ${D} km downstream in ${u - v} hours and returns the same ${D} km upstream in ${u + v} hours. Find the speed of the ${askV ? 'stream' : 'boat in still water'} (km/h).`, askV ? v : u, [askV ? u : v, u + v, u - v],
          `Downstream speed = ${D}/${u - v} = ${u + v} km/h, upstream speed = ${D}/${u + v} = ${u - v} km/h. Boat = (${u + v} + ${u - v})/2 = ${u}, stream = (${u + v} − ${u - v})/2 = ${v}.`); },
    ],
  ],
};

/* ---------------- Quadratic Equations ---------------- */
const quadratic = {
  slug: 'quadratic-equations', label: 'Quadratic Equations', levels: [
    [
      R => { let p, q; do { p = R.sign() * R.int(1, 7); q = R.sign() * R.int(1, 7); } while (Math.abs(p) === Math.abs(q));
        const f = r => `(x ${r < 0 ? '+' : '-'} ${Math.abs(r)})`;
        return mcq(R, `The roots of $${f(p)}${f(q)} = 0$ are`, m(`${p} \\text{ and } ${q}`), [m(`${-p} \\text{ and } ${-q}`), m(`${p} \\text{ and } ${-q}`), m(`${-p} \\text{ and } ${q}`)], `A product is zero when a factor is zero: x = ${p} or x = ${q}.`); },
      R => { const a = R.int(1, 4), b = R.int(-9, 9), c = R.int(-8, 8) || 3, D = b * b - 4 * a * c;
        return num(R, `The discriminant of $${pstr([a, b, c])} = 0$ is`, D, [b * b + 4 * a * c, b * b - 2 * a * c, -b], `D = b² − 4ac = ${b * b} − ${4 * a * c} = ${D}.`); },
      R => { const t = R.pick(['two', 'eq', 'none']); let a, b, c;
        if (t === 'eq') { const pp = R.int(1, 3), qq = R.sign() * R.int(1, 4); a = pp * pp; b = 2 * pp * qq; c = qq * qq; }
        else if (t === 'two') { do { a = R.int(1, 4); b = R.sign() * R.int(3, 9); c = R.sign() * R.int(1, 4); } while (b * b - 4 * a * c <= 0); }
        else { do { a = R.int(1, 4); b = R.sign() * R.int(0, 4); c = R.int(2, 8); } while (b * b - 4 * a * c >= 0); }
        const ans = { two: 'Two distinct real roots', eq: 'Two equal real roots', none: 'No real roots' }[t];
        return mcq(R, `The nature of the roots of $${pstr([a, b, c])} = 0$ is`, ans, ['Two distinct real roots', 'Two equal real roots', 'No real roots', 'Three real roots'].filter(x => x !== ans), `D = b² − 4ac = ${b * b - 4 * a * c}, which is ${t === 'two' ? 'positive' : t === 'eq' ? 'zero' : 'negative'}: ${ans.toLowerCase()}.`); },
    ],
    [
      R => { let p, q; do { p = R.sign() * R.int(1, 8); q = R.sign() * R.int(1, 8); } while (p === q);
        return num(R, `The larger root of $${pstr([1, -(p + q), p * q])} = 0$ is`, Math.max(p, q), [Math.min(p, q), -Math.max(p, q), p + q], `Split the middle term: the factors are (x ${p < 0 ? '+' : '-'} ${Math.abs(p)})(x ${q < 0 ? '+' : '-'} ${Math.abs(q)}), so the roots are ${p} and ${q}.`); },
      R => { const mm = R.int(2, 9);
        return num(R, `The positive value of k for which $x^2 + kx + ${mm * mm} = 0$ has equal roots is`, 2 * mm, [mm, 4 * mm, mm * mm], `Equal roots need D = 0: k² − 4(${mm * mm}) = 0, so k² = ${4 * mm * mm} and k = ${2 * mm}.`); },
      R => { const n = R.int(4, 20);
        return num(R, `The product of two consecutive positive integers is ${n * (n + 1)}. The smaller integer is`, n, [n + 1, n - 1, n * n], `x(x + 1) = ${n * (n + 1)} gives x² + x − ${n * (n + 1)} = 0, i.e. (x − ${n})(x + ${n + 1}) = 0. The positive root is ${n}.`); },
    ],
    [
      R => { let p, q, r, s; do { p = R.int(1, 3); r = R.int(1, 3); q = R.int(1, 6); s = R.int(1, 6); } while (q / p === s / r);
        const big = q / p > s / r ? [q, p] : [s, r], small = q / p > s / r ? [s, r] : [q, p];
        return mcq(R, `The larger root of $${pstr([p * r, -(p * s + q * r), q * s])} = 0$ is`, m(fr(...big)), [m(fr(...small)), m(fr(-big[0], big[1])), m(fr(big[1], big[0])), m(fr(-small[0], small[1]))],
          `The equation factors as (${p === 1 ? '' : p}x − ${q})(${r === 1 ? '' : r}x − ${s}) = 0, so the roots are ${q}/${p} and ${s}/${r}.`); },
      R => { const s = R.pick([5, 10, 15, 20]), k = R.int(2, 5), v = s * k, t = R.int(1, 2), D = t * k * (v + s);
        return num(R, `A train travels ${D} km at a uniform speed. If its speed had been ${s} km/h more, it would have taken ${t} hour${t > 1 ? 's' : ''} less. Find its speed (km/h).`, v, [v + s, v - s, s], `${D}/x − ${D}/(x + ${s}) = ${t} leads to x² + ${s}x − ${D * s / t} = 0, so x = ${v}.`); },
      R => { const mm = R.int(2, 6), no = R.chance(0.5), b = 2 * mm, k = mm * mm;
        return mcq(R, `The equation $x^2 + ${b}x + k = 0$ has ${no ? 'no real roots' : 'two distinct real roots'} when`, m(no ? `k > ${k}` : `k < ${k}`), [m(no ? `k < ${k}` : `k > ${k}`), m(`k = ${k}`), m(no ? `k \\ge ${k}` : `k \\le ${k}`)],
          `D = ${b}² − 4k = ${b * b} − 4k. ${no ? 'No real roots needs D < 0, so k > ' : 'Two distinct roots need D > 0, so k < '}${k}.`); },
    ],
  ],
};

/* ---------------- Arithmetic Progression ---------------- */
const ap = {
  slug: 'arithmetic-progression', label: 'Arithmetic Progressions', levels: [
    [
      R => { const a = R.int(-8, 20), d = R.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6, 7]), t = [0, 1, 2, 3].map(i => a + i * d);
        return num(R, `The common difference of the AP ${m(`${t.join(', ')}, \\ldots`)} is`, d, [-d, a, d + 1], `d = second term − first term = ${t[1]} − (${t[0]}) = ${d}.`); },
      R => { const a = R.int(1, 15), d = R.int(2, 6), n = R.int(10, 25);
        return num(R, `Find the ${ord(n)} term of the AP ${m(`${a}, ${a + d}, ${a + 2 * d}, \\ldots`)}`, a + (n - 1) * d, [a + n * d, a + (n - 2) * d, n * d], `aₙ = a + (n − 1)d = ${a} + ${n - 1} × ${d} = ${a + (n - 1) * d}.`); },
      R => { const a = R.int(-6, 18), d = R.pick([-4, -3, 3, 4, 5, 6]);
        return num(R, `The next term of the AP ${m(`${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, \\ldots`)} is`, a + 4 * d, [a + 5 * d, a + 3 * d + 1, a + 4 * d + d / Math.abs(d)], `Add the common difference ${d} to the last term.`); },
    ],
    [
      R => { const a = R.int(1, 12), d = R.int(2, 6), n = R.int(8, 20), S = n * (2 * a + (n - 1) * d) / 2;
        return num(R, `Find the sum of the first ${n} terms of the AP ${m(`${a}, ${a + d}, ${a + 2 * d}, \\ldots`)}`, S, [S + n, n * (a + (n - 1) * d), S - d * n], `Sₙ = n/2 [2a + (n − 1)d] = ${n}/2 × [${2 * a} + ${(n - 1) * d}] = ${S}.`); },
      R => { const a = R.int(2, 15), d = R.int(3, 8), n = R.int(8, 30), X = a + (n - 1) * d;
        return num(R, `Which term of the AP ${m(`${a}, ${a + d}, ${a + 2 * d}, \\ldots`)} is ${X}?`, n, [n + 1, n - 1, X - a], `${X} = ${a} + (n − 1) × ${d} gives n − 1 = ${n - 1}, so n = ${n}.`); },
      R => { const a = R.int(3, 20), d = R.int(2, 7), n = R.int(9, 40), l = a + (n - 1) * d;
        return num(R, `How many terms are there in the AP ${m(`${a}, ${a + d}, ${a + 2 * d}, \\ldots, ${l}`)}?`, n, [n - 1, n + 1, l - a], `n = (l − a)/d + 1 = (${l} − ${a})/${d} + 1 = ${n}.`); },
    ],
    [
      R => { const a = R.int(-5, 12), d = R.int(2, 6), p = R.int(2, 5), q = p + R.int(2, 5), r = q + R.int(1, 5);
        return num(R, `In an AP, the ${ord(p)} term is ${a + (p - 1) * d} and the ${ord(q)} term is ${a + (q - 1) * d}. Find the ${ord(r)} term.`, a + (r - 1) * d, [a + r * d, a + (r - 2) * d, a + (q - 1) * d + d], `d = (${a + (q - 1) * d} − ${a + (p - 1) * d})/${q - p} = ${d}. Then aₙ for n = ${r} is ${a + (p - 1) * d} + ${r - p} × ${d} = ${a + (r - 1) * d}.`); },
      R => { const k = R.int(3, 9), first = Math.ceil(10 / k) * k, last = Math.floor(99 / k) * k, n = (last - first) / k + 1, S = n * (first + last) / 2;
        return num(R, `Find the sum of all two-digit numbers that are divisible by ${k}.`, S, [S + first, S - last, n * last], `The first is ${first}, the last is ${last}, so n = ${n}. S = n/2 (a + l) = ${n}/2 × ${first + last} = ${S}.`); },
      R => { const p = R.int(1, 4), q = R.int(-3, 6), n = R.int(5, 12), qs = q === 0 ? '' : q > 0 ? ` + ${q}n` : ` - ${-q}n`;
        return num(R, `The sum of the first n terms of an AP is $S_n = ${p === 1 ? '' : p}n^2${qs}$. Find its ${ord(n)} term.`, p * (2 * n - 1) + q, [p * n * n + q * n, p * (2 * n + 1) + q, 2 * p], `aₙ = Sₙ − Sₙ₋₁ = ${p}(2n − 1)${q ? ` + ${q}` : ''} = ${p * (2 * n - 1) + q} for n = ${n}.`); },
    ],
  ],
};

/* ---------------- Coordinate Geometry ---------------- */
const coord = {
  slug: 'coordinate-geometry', label: 'Coordinate Geometry', levels: [
    [
      R => { const [a, b, c] = R.pick(TRI), k = R.pick([1, 1, 2]), x1 = R.int(-5, 5), y1 = R.int(-5, 5), sx = R.sign(), sy = R.sign(), sw = R.chance(0.5), [dx, dy] = sw ? [b, a] : [a, b];
        return num(R, `Find the distance between the points ${m(pt(x1, y1))} and ${m(pt(x1 + sx * dx * k, y1 + sy * dy * k))}.`, c * k, [(dx + dy) * k, dx * dy * k, c * k + 1], `d = √[(${dx * k})² + (${dy * k})²] = √${(dx * dx + dy * dy) * k * k} = ${c * k}.`); },
      R => { const x1 = R.int(-8, 8), y1 = R.int(-8, 8), x2 = x1 + 2 * R.int(1, 6) * R.sign(), y2 = y1 + 2 * R.int(1, 6) * R.sign(), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        return mcq(R, `The mid-point of the line segment joining ${m(pt(x1, y1))} and ${m(pt(x2, y2))} is`, m(pt(mx, my)), [m(pt(my, mx)), m(pt(x2 - x1, y2 - y1)), m(pt(x1 + x2, y1 + y2)), m(pt((x2 - x1) / 2, (y2 - y1) / 2))],
          `Mid-point = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ${pt(mx, my)}.`); },
      R => { const [a, b, c] = R.pick(TRI), k = R.pick([1, 2]), x = R.sign() * a * k, y = R.sign() * b * k;
        return num(R, `The distance of the point ${m(pt(x, y))} from the origin is`, c * k, [(a + b) * k, a * k, c * k + 2], `d = √(x² + y²) = √(${x * x} + ${y * y}) = ${c * k}.`); },
    ],
    [
      R => { const [mm, n] = R.pick([[1, 2], [2, 1], [2, 3], [3, 2], [1, 3], [3, 1]]), x1 = R.int(-6, 4), y1 = R.int(-6, 4), u = R.int(1, 3), v = R.int(-3, 3), x2 = x1 + (mm + n) * u, y2 = y1 + (mm + n) * v, px = x1 + mm * u, py = y1 + mm * v;
        return mcq(R, `Find the point which divides the line segment joining ${m(pt(x1, y1))} and ${m(pt(x2, y2))} internally in the ratio ${mm} : ${n}.`, m(pt(px, py)), [m(pt(x1 + n * u, y1 + n * v)), m(pt((x1 + x2) / 2, (y1 + y2) / 2)), m(pt(x2 - mm * u, y2 - mm * v)), m(pt(px + 1, py))].filter(s => s),
          `P = ((${mm}×${x2} + ${n}×(${x1}))/${mm + n}, (${mm}×${y2} + ${n}×(${y1}))/${mm + n}) = ${pt(px, py)}.`); },
      R => { const x1 = R.int(-5, 6), y1 = R.int(-5, 6), x2 = R.int(-5, 6), y2 = R.int(-5, 6); let x3 = R.int(-5, 6), y3 = R.int(-5, 6);
        x3 += (3 - ((x1 + x2 + x3) % 3 + 3) % 3) % 3; y3 += (3 - ((y1 + y2 + y3) % 3 + 3) % 3) % 3;
        const gx = (x1 + x2 + x3) / 3, gy = (y1 + y2 + y3) / 3;
        return mcq(R, `The centroid of the triangle with vertices ${m(pt(x1, y1))}, ${m(pt(x2, y2))} and ${m(pt(x3, y3))} is`, m(pt(gx, gy)), [m(pt(gy, gx)), m(pt(x1 + x2 + x3, y1 + y2 + y3)), m(pt(gx + 1, gy)), m(pt(gx, gy - 1))],
          `Centroid = ((x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3) = ${pt(gx, gy)}.`); },
      R => { const ax = R.int(-6, 6), ay = R.int(-6, 6), bx = R.int(-6, 6), by = R.int(-6, 6), mx = (ax + bx) / 2;
        const Mx = ax + bx, My = ay + by;   // the given mid-point is (Mx/2, My/2) so use even sums
        const ex = Mx % 2 ? bx + 1 : bx, ey = My % 2 ? by + 1 : by, cx = (ax + ex) / 2, cy = (ay + ey) / 2;
        return mcq(R, `The mid-point of AB is ${m(pt(cx, cy))}. If A is ${m(pt(ax, ay))}, the coordinates of B are`, m(pt(ex, ey)), [m(pt(cx - ax, cy - ay)), m(pt(ay, ax)), m(pt(2 * ax - ex, 2 * ay - ey)), m(pt(ex + 1, ey))],
          `B = (2 × ${cx} − ${ax}, 2 × ${cy} − ${ay}) = ${pt(ex, ey)}.`); },
    ],
    [
      R => { const mm = R.int(-3, 4) || 2, c = R.int(-5, 5), xs = R.shuffle([-3, -2, -1, 0, 1, 2, 3, 4]).slice(0, 3), y = x => mm * x + c;
        return num(R, `If the points ${m(pt(xs[0], y(xs[0])))}, ${m(pt(xs[1], y(xs[1])))} and ${m(pt(xs[2], 'k'))} are collinear, find k.`, y(xs[2]), [y(xs[2]) + mm, y(xs[2]) - mm, -y(xs[2])], `The slope between the first two points is ${mm}. The line is y = ${mm}x + ${c}; at x = ${xs[2]}, k = ${y(xs[2])}.`); },
      R => { const [a, b] = coprime(R, 1, 8), x1 = R.int(-5, 5), x2 = R.int(-5, 5), r = (u, v) => { const g = gcd(u, v); return `${u / g} : ${v / g}`; };
        return mcq(R, `The x-axis divides the line segment joining ${m(pt(x1, a))} and ${m(pt(x2, -b))} in the ratio`, r(a, b), [r(b, a), r(a, a + b), r(a + b, b)],
          `On the x-axis y = 0. If the ratio is k : 1, then (k×(−${b}) + ${a})/(k + 1) = 0, so k = ${a}/${b}. The ratio is ${r(a, b)}.`); },
      R => { let x1, y1, x2, y2, x3, y3, A2; do { [x1, y1, x2, y2, x3, y3] = Array.from({ length: 6 }, () => R.int(-5, 7)); A2 = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)); } while (A2 === 0 || A2 > 40);
        return num(R, `Find the area (in square units) of the triangle with vertices ${m(pt(x1, y1))}, ${m(pt(x2, y2))} and ${m(pt(x3, y3))}.`, A2 / 2, [A2, A2 / 2 + 0.5, A2 / 2 + 1, Math.abs(A2 / 2 - 1)], `Area = ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)| = ½ × ${A2} = ${dec(A2 / 2)}.`); },
    ],
  ],
};

/* ---------------- Trigonometry ---------------- */
const VAL = { '0': '0', 'h': '\\frac{1}{2}', 'r2': '\\frac{1}{\\sqrt{2}}', 'r3h': '\\frac{\\sqrt{3}}{2}', '1': '1', 'r3i': '\\frac{1}{\\sqrt{3}}', 'r3': '\\sqrt{3}' };
const TABLE = [['\\sin', 30, 'h'], ['\\sin', 45, 'r2'], ['\\sin', 60, 'r3h'], ['\\cos', 30, 'r3h'], ['\\cos', 45, 'r2'], ['\\cos', 60, 'h'], ['\\tan', 30, 'r3i'], ['\\tan', 45, '1'], ['\\tan', 60, 'r3'], ['\\sin', 90, '1'], ['\\cos', 90, '0'], ['\\tan', 0, '0']];
const IDS = [['1 - \\sin^2\\theta', '\\cos^2\\theta'], ['1 + \\tan^2\\theta', '\\sec^2\\theta'], ['1 + \\cot^2\\theta', '\\operatorname{cosec}^2\\theta'], ['\\sec^2\\theta - \\tan^2\\theta', '1'], ['\\operatorname{cosec}^2\\theta - \\cot^2\\theta', '1'], ['\\frac{\\sin\\theta}{\\cos\\theta}', '\\tan\\theta'], ['\\sin\\theta \\cdot \\operatorname{cosec}\\theta', '1'], ['1 - \\cos^2\\theta', '\\sin^2\\theta']];
const IDPOOL = ['\\cos^2\\theta', '\\sec^2\\theta', '\\operatorname{cosec}^2\\theta', '1', '\\tan\\theta', '\\sin^2\\theta', '\\cot\\theta', '0'];
const HARD = [['(1 - \\sin^2\\theta)(1 + \\tan^2\\theta)', '1'], ['(1 + \\tan^2\\theta)(1 - \\sin\\theta)(1 + \\sin\\theta)', '1'], ['(\\sec\\theta + \\tan\\theta)(\\sec\\theta - \\tan\\theta)', '1'], ['\\cos^2\\theta(1 + \\tan^2\\theta)', '1'], ['(1 - \\cos^2\\theta)(1 + \\cot^2\\theta)', '1'], ['(\\sin\\theta + \\cos\\theta)^2 + (\\sin\\theta - \\cos\\theta)^2', '2'], ['\\frac{\\tan\\theta}{\\sec\\theta}', '\\sin\\theta'], ['\\frac{\\cot\\theta}{\\operatorname{cosec}\\theta}', '\\cos\\theta'], ['\\cot^2\\theta - \\operatorname{cosec}^2\\theta', '-1'], ['\\sin^4\\theta - \\cos^4\\theta', '\\sin^2\\theta - \\cos^2\\theta']];
const HPOOL = ['1', '2', '0', '-1', '\\sin\\theta', '\\cos\\theta', '\\sin^2\\theta - \\cos^2\\theta', '\\tan\\theta'];
const trig = {
  slug: 'trigonometry', label: 'Introduction to Trigonometry', levels: [
    [
      R => { const [a, b, c] = R.pick(TRI), k = R.int(1, 2), fn = R.pick(['sin', 'cos', 'tan']), s = { sin: [b, c], cos: [a, c], tan: [b, a] }[fn];
        return mcq(R, `In triangle ABC, right-angled at B, AB = ${a * k} cm, BC = ${b * k} cm and AC = ${c * k} cm. Find ${m(`\\${fn} A`)}.`, m(fr(...s)), [m(fr(s[1], s[0])), m(fr(a, c)), m(fr(b, c)), m(fr(a, b))].filter(x => x !== m(fr(...s))),
          `For angle A: opposite side = BC = ${b * k}, adjacent side = AB = ${a * k}, hypotenuse = AC = ${c * k}. ${fn} A = ${fn === 'sin' ? 'opposite/hypotenuse' : fn === 'cos' ? 'adjacent/hypotenuse' : 'opposite/adjacent'}.`); },
      R => { const [fn, ang, key] = R.pick(TABLE), others = R.shuffle(Object.keys(VAL).filter(k => k !== key)).slice(0, 3);
        return mcq(R, `The value of ${m(`${fn} ${ang}^\\circ`)} is`, m(VAL[key]), others.map(k => m(VAL[k])), 'This is a standard value from the trigonometric ratio table.'); },
      R => { const [e, ans] = R.pick(IDS);
        return mcq(R, `${m(e)} is equal to`, m(ans), IDPOOL.filter(x => x !== ans).map(m), 'This follows from the identity sin²θ + cos²θ = 1 and its forms.'); },
    ],
    [
      R => { const [p, q, h] = R.pick(TRI), sw = R.chance(0.5), [t, u] = sw ? [p, q] : [q, p], ask = R.pick(['sin', 'cos', 'sec']),
          ans = { sin: fr(t, h), cos: fr(u, h), sec: fr(h, u) }[ask], pool = [fr(t, h), fr(u, h), fr(h, u), fr(h, t), fr(t, u)];
        return mcq(R, `If $\\tan A = ${fr(t, u)}$ (A is acute), then ${m(`\\${ask} A`)} =`, m(ans), pool.filter(x => x !== ans).map(m), `Draw a right triangle with opposite = ${t}, adjacent = ${u}; the hypotenuse is ${h}. ${ask} A = ${m(ans)}.`); },
      R => { const half = [['\\sin 30^\\circ', 1], ['\\cos 60^\\circ', 1], ['\\tan 45^\\circ', 2], ['\\sin 90^\\circ', 2], ['\\cos 0^\\circ', 2], ['\\cos 90^\\circ', 0], ['\\tan 0^\\circ', 0]],
          a = R.int(2, 6), b = R.int(2, 6), f1 = R.pick(half), f2 = R.pick(half), f3 = R.pick(half), v = a * f1[1] + b * f2[1] - f3[1];
        return mcq(R, `Evaluate: ${m(`${a}${f1[0]} + ${b}${f2[0]} - ${f3[0]}`)}`, m(fr(v, 2)), [m(fr(v + 1, 2)), m(fr(v - 2, 2)), m(fr(v + 2, 2)), m(fr(a + b - 1, 1))], 'Use sin 30° = cos 60° = 1/2, tan 45° = sin 90° = cos 0° = 1 and cos 90° = tan 0° = 0.'); },
      R => { const t = R.int(10, 80), kind = R.int(0, 4), forms = [[`\\sin ${t}^\\circ - \\cos ${90 - t}^\\circ`, '0'], [`\\frac{\\sin ${t}^\\circ}{\\cos ${90 - t}^\\circ}`, '1'], [`\\tan ${t}^\\circ \\cdot \\tan ${90 - t}^\\circ`, '1'], [`\\sin^2 ${t}^\\circ + \\sin^2 ${90 - t}^\\circ`, '1'], [`\\sec ${t}^\\circ - \\operatorname{cosec} ${90 - t}^\\circ`, '0']],
          [e, ans] = forms[kind];
        return mcq(R, `The value of ${m(e)} is`, m(ans), ['0', '1', '2', '\\frac{1}{2}'].filter(x => x !== ans).map(m), 'Use sin(90° − θ) = cos θ, cos(90° − θ) = sin θ and tan(90° − θ) = cot θ.'); },
    ],
    [
      R => { const [e, ans] = R.pick(HARD);
        return mcq(R, `Simplify: ${m(e)}`, m(ans), HPOOL.filter(x => x !== ans).map(m), 'Use the identities 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ and sin²θ + cos²θ = 1.'); },
      R => { const x = R.int(2, 9), sec = R.chance(0.5), nm = sec ? ['\\sec\\theta', '\\tan\\theta'] : ['\\operatorname{cosec}\\theta', '\\cot\\theta'];
        return mcq(R, `If ${m(`${nm[0]} + ${nm[1]} = ${x}`)}, then ${m(`${nm[0]} - ${nm[1]}`)} equals`, m(`\\frac{1}{${x}}`), [m(`${x}`), m(`-${x}`), m(`\\frac{-1}{${x}}`), m(`${x * x}`)],
          `${m(sec ? '\\sec^2\\theta - \\tan^2\\theta = 1' : '\\operatorname{cosec}^2\\theta - \\cot^2\\theta = 1')}, so ${m(`(${nm[0]} + ${nm[1]})(${nm[0]} - ${nm[1]}) = 1`)} and the answer is 1/${x}.`); },
      R => { let p, q, a, b, c, d, den; do { [p, q] = R.pick([[3, 4], [4, 3], [5, 12], [12, 5], [1, 2], [2, 1], [3, 2], [5, 3]]); a = R.int(1, 5); b = R.int(1, 5); c = R.int(1, 5); d = R.int(1, 5); den = c * p - d * q; } while (den === 0);
        const num_ = a * p + b * q;
        return mcq(R, `If $\\tan\\theta = ${fr(p, q)}$, find the value of $\\frac{${a}\\sin\\theta + ${b}\\cos\\theta}{${c}\\sin\\theta - ${d}\\cos\\theta}$.`, m(fr(num_, den)), [m(fr(num_, -den)), m(fr(a * q + b * p, c * q - d * p === 0 ? 1 : c * q - d * p)), m(fr(a + b, c - d === 0 ? 1 : c - d)), m(fr(den, num_))],
          `Divide the numerator and the denominator by cosθ: (${a}tanθ + ${b})/(${c}tanθ − ${d}) = (${a}×${p}/${q} + ${b})/(${c}×${p}/${q} − ${d}) = ${fr(num_, den).replace(/\\frac\{(-?\d+)\}\{(\d+)\}/, '$1/$2')}.`); },
    ],
  ],
};

/* ---------------- Applications of Trigonometry ---------------- */
const apps = {
  slug: 'applications-of-trigonometry', label: 'Some Applications of Trigonometry', levels: [
    [
      R => { const d = R.int(5, 60);
        return mcq(R, `From a point on the ground ${d} m away from the foot of a tower, the angle of elevation of the top of the tower is $45^\\circ$. The height of the tower is`, `${d} m`, [`${d} $\\sqrt{3}$ m`, `${2 * d} m`, `$\\frac{${d}}{\\sqrt{3}}$ m`], 'tan 45° = 1, so height = distance = ' + d + ' m.'); },
      R => { const k = R.int(2, 15), t = R.pick(['45', '60', '30']), h = t === '45' ? [k, k] : t === '60' ? [`${k}\\sqrt{3}`, k] : [k, `${k}\\sqrt{3}`];
        return mcq(R, `A pole of height ${m(h[0])} m casts a shadow of length ${m(h[1])} m on level ground. The angle of elevation of the sun is`, `${t}°`, ['30°', '45°', '60°', '90°'].filter(x => x !== `${t}°`),
          `tan θ = height/shadow = ${t === '45' ? '1' : t === '60' ? '√3' : '1/√3'}, so θ = ${t}°.`); },
    ],
    [
      R => { const up = R.chance(0.5), k = R.int(2, 12), d = up ? k : 3 * k, ang = up ? 60 : 30, ans = up ? `${k}\\sqrt{3}` : `${k}\\sqrt{3}`;
        return mcq(R, `The angle of elevation of the top of a tower from a point ${d} m from its foot is $${ang}^\\circ$. The height of the tower is`, m(`${ans}`) + ' m', [m(`${3 * k}`) + ' m', m(`\\frac{${k}}{\\sqrt{3}}`) + ' m', m(`${2 * k}`) + ' m'],
          up ? `h = d tan 60° = ${d}√3 m.` : `h = d tan 30° = ${d}/√3 = ${k}√3 m.`); },
      R => { const ang = R.pick([30, 45, 60]), L = R.int(2, 15) * 2, h = ang === 30 ? `${L / 2}` : ang === 45 ? `${L / 2}\\sqrt{2}` : `${L / 2}\\sqrt{3}`;
        return mcq(R, `A ${L} m long ladder leans against a vertical wall and makes an angle of $${ang}^\\circ$ with the ground. How high up the wall does it reach?`, m(h) + ' m', [m(`${L}`) + ' m', m(`${L / 2}`) + ' m', m(`${L / 2}\\sqrt{2}`) + ' m', m(`${L / 2}\\sqrt{3}`) + ' m', m(`${L}\\sqrt{3}`) + ' m'].filter(x => x !== m(h) + ' m'),
          `Height = ladder × sin ${ang}° = ${L} × ${ang === 30 ? '1/2' : ang === 45 ? '1/√2' : '√3/2'}.`); },
      R => { const ang = R.pick([30, 45, 60]), k = R.int(2, 10), H = 3 * k, ans = ang === 45 ? `${H}` : ang === 30 ? `${H}\\sqrt{3}` : `${k}\\sqrt{3}`;
        return mcq(R, `From the top of a cliff ${H} m high, the angle of depression of a boat is $${ang}^\\circ$. How far is the boat from the foot of the cliff?`, m(ans) + ' m', [m(`${H}`) + ' m', m(`${H}\\sqrt{3}`) + ' m', m(`${k}\\sqrt{3}`) + ' m', m(`${2 * H}`) + ' m'].filter(x => x !== m(ans) + ' m'),
          `Distance = H / tan ${ang}° = ${ang === 45 ? H : ang === 30 ? `${H} × √3` : `${H}/√3 = ${k}√3`} m.`); },
    ],
    [
      R => { const x = R.int(2, 20) * 2;
        return mcq(R, `The angle of elevation of the top of a tower from a point on the ground is $30^\\circ$. After walking ${x} m towards the tower, the angle becomes $60^\\circ$. The height of the tower is`, m(`${x / 2}\\sqrt{3}`) + ' m', [m(`${x}\\sqrt{3}`) + ' m', m(`${x}`) + ' m', m(`\\frac{${x}}{\\sqrt{3}}`) + ' m', m(`${x / 2}`) + ' m'],
          `With height h, the two distances are h√3 and h/√3. Their difference is 2h/√3 = ${x}, so h = ${x / 2}√3 m.`); },
      R => { const k = R.int(2, 12), d = 3 * k;
        return mcq(R, `A flagstaff stands on top of a tower. From a point ${d} m from the foot of the tower, the angles of elevation of the bottom and top of the flagstaff are $30^\\circ$ and $45^\\circ$. Find the height of the flagstaff.`, m(`${k}(3 - \\sqrt{3})`) + ' m', [m(`${k}(3 + \\sqrt{3})`) + ' m', m(`${k}\\sqrt{3}`) + ' m', m(`${d}`) + ' m'],
          `Tower = ${d}/√3 = ${k}√3. Top of flagstaff = ${d}. Flagstaff = ${d} − ${k}√3 = ${k}(3 − √3) m.`); },
      R => { const k = R.int(2, 10), H = 3 * k;
        return mcq(R, `From the top of a ${H} m high tower, the angles of depression of two cars on the same side of the tower are $45^\\circ$ and $60^\\circ$. The distance between the cars is`, m(`${k}(3 - \\sqrt{3})`) + ' m', [m(`${k}(3 + \\sqrt{3})`) + ' m', m(`${H}`) + ' m', m(`${k}\\sqrt{3}`) + ' m'],
          `Nearer car (60°): ${H}/√3 = ${k}√3. Farther car (45°): ${H}. Distance = ${H} − ${k}√3 = ${k}(3 − √3) m.`); },
    ],
  ],
};

/* ---------------- Statistics ---------------- */
const classes = (start, w, n) => Array.from({ length: n }, (_, i) => [start + i * w, start + (i + 1) * w]);
const stats = {
  slug: 'statistics', label: 'Statistics', levels: [
    [
      R => { const mean = R.int(10, 40), v = Array.from({ length: 4 }, () => mean + R.int(-8, 8)), last = 5 * mean - v.reduce((s, x) => s + x, 0), all = R.shuffle([...v, last]);
        return num(R, `Find the mean of ${all.join(', ')}.`, mean, [mean + 1, mean - 1, all[0]], `Sum = ${5 * mean}, number of observations = 5, so mean = ${mean}.`); },
      R => { const base = R.shuffle(Array.from({ length: 30 }, (_, i) => i + 5)).slice(0, 7), sorted = base.slice().sort((a, b) => a - b);
        return num(R, `Find the median of ${base.join(', ')}.`, sorted[3], [sorted[2], sorted[4], base[3] === sorted[3] ? sorted[0] : base[3]], `Arranged in order: ${sorted.join(', ')}. The middle (4th) value is ${sorted[3]}.`); },
      R => { const pool = R.shuffle(Array.from({ length: 25 }, (_, i) => i + 3)), mode = pool[0], others = pool.slice(1, 6), data = R.shuffle([mode, mode, mode, ...others, others[0]]);
        if (R.chance(0.5)) return num(R, `Find the mode of ${data.join(', ')}.`, mode, [others[0], others[1], Math.max(...data)], `${mode} occurs 3 times, more often than any other value.`);
        return num(R, `Find the range of ${data.join(', ')}.`, Math.max(...data) - Math.min(...data), [Math.max(...data), Math.min(...data), mode], `Range = largest − smallest = ${Math.max(...data)} − ${Math.min(...data)} = ${Math.max(...data) - Math.min(...data)}.`); },
    ],
    [
      R => { let x, f, N, S, tries = 0; do { x = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20]).slice(0, 4).sort((a, b) => a - b); f = x.map(() => R.int(2, 9)); N = f.reduce((s, v) => s + v, 0); S = x.reduce((s, v, i) => s + v * f[i], 0); } while (S % N !== 0 && ++tries < 3000);
        const mean = S / N;
        return num(R, `The values ${x.join(', ')} occur with frequencies ${f.join(', ')} respectively. The mean is`, mean, [mean + 1, mean - 1, x.reduce((s, v) => s + v, 0) / 4], `Mean = Σfx / Σf = ${S} / ${N} = ${dec(mean)}.`); },
      R => { const mean = R.int(10, 30), v = Array.from({ length: 4 }, () => mean + R.int(-6, 6)), miss = 5 * mean - v.reduce((s, x) => s + x, 0);
        return num(R, `The mean of five observations is ${mean}. Four of them are ${v.join(', ')}. The fifth observation is`, miss, [miss + 5, miss - 5, mean], `Total = 5 × ${mean} = ${5 * mean}. Fifth = ${5 * mean} − ${v.reduce((s, x) => s + x, 0)} = ${miss}.`); },
      R => { const md = R.int(10, 40), mn = md + R.int(-4, 4) || md - 1, mode = 3 * md - 2 * mn;
        return num(R, `For a moderately skewed distribution, the median is ${md} and the mean is ${mn}. Using the empirical relation, the mode is`, mode, [2 * md - 3 * mn < 0 ? mode + 4 : 2 * md - 3 * mn, 3 * mn - 2 * md, md + mn], `Mode = 3 Median − 2 Mean = ${3 * md} − ${2 * mn} = ${mode}.`); },
    ],
    [
      R => { let cl, f, med, tries = 0, cum, n, i; const w = R.pick([10, 5, 20]), s0 = R.pick([0, 10, 20]);
        do { cl = classes(s0, w, 5); f = cl.map(() => R.int(3, 14)); n = f.reduce((a, b) => a + b, 0); cum = 0; i = 0; while (cum + f[i] < n / 2) cum += f[i++]; med = cl[i][0] + ((n / 2 - cum) / f[i]) * w; } while (Math.abs(med * 10 - Math.round(med * 10)) > 1e-9 && ++tries < 5000);
        const wrong = [cl[i][0] + ((n - cum) / f[i]) * w, cl[i][0] + w / 2, cl[i][0] + ((n / 2 - cum + f[i]) / f[i]) * w, cl[i][1]].map(Number);
        return num(R, `Find the median of this data: ${cl.map((c, j) => `${c[0]}-${c[1]} (f = ${f[j]})`).join(', ')}.`, med, wrong, `n = ${n}, n/2 = ${n / 2}. The median class is ${cl[i][0]}-${cl[i][1]} with cumulative frequency before it = ${cum}, f = ${f[i]}. Median = l + [(n/2 − cf)/f] × h = ${cl[i][0]} + [(${n / 2} − ${cum})/${f[i]}] × ${w} = ${dec(med)}.`); },
      R => { let cl, f, md, tries = 0, j; const w = R.pick([10, 5, 20]), s0 = R.pick([0, 10, 20]);
        do { cl = classes(s0, w, 5); f = cl.map(() => R.int(2, 15)); const mx = Math.max(...f); j = f.indexOf(mx); if (j === 0 || j === 4 || f.filter(v => v === mx).length > 1) continue; md = cl[j][0] + ((f[j] - f[j - 1]) / (2 * f[j] - f[j - 1] - f[j + 1])) * w; } while ((md === undefined || Math.abs(md * 10 - Math.round(md * 10)) > 1e-9) && ++tries < 8000);
        const wrong = [cl[j][0] + ((f[j] - f[j + 1]) / (2 * f[j] - f[j - 1] - f[j + 1])) * w, cl[j][0] + w / 2, cl[j][0] + ((f[j] - f[j - 1]) / (f[j] - f[j + 1] + 1)) * w, cl[j][1]].map(Number);
        return num(R, `Find the mode of this data: ${cl.map((c, i) => `${c[0]}-${c[1]} (f = ${f[i]})`).join(', ')}.`, md, wrong, `The modal class is ${cl[j][0]}-${cl[j][1]} (f₁ = ${f[j]}, f₀ = ${f[j - 1]}, f₂ = ${f[j + 1]}). Mode = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] × h = ${cl[j][0]} + [${f[j] - f[j - 1]}/${2 * f[j] - f[j - 1] - f[j + 1]}] × ${w} = ${dec(md)}.`); },
      R => { const n = R.pick([5, 8, 10, 20]), mean = R.int(10, 40), kind = R.int(0, 1);
        if (kind) { const t = R.int(2, 4), a = R.int(1, 9); return num(R, `The mean of ${n} observations is ${mean}. Each observation is multiplied by ${t} and then ${a} is added to it. The new mean is`, mean * t + a, [mean * t, mean + a, mean * t + a * n], 'The mean is multiplied by the same number and increased by the same amount: new mean = ' + `${mean} × ${t} + ${a}.`); }
        const y = R.int(10, 60), x = y + n * R.int(1, 4); return num(R, `The mean of ${n} observations was found to be ${mean}. Later it was found that one observation ${y} was wrongly copied as ${x}. The correct mean is`, mean - (x - y) / n, [mean + (x - y) / n, mean - (x - y), mean], `Correct total = ${n * mean} − ${x} + ${y}. Divide by ${n} to get ${dec(mean - (x - y) / n)}.`); },
    ],
  ],
};

/* ---------------- Probability ---------------- */
const dice2 = [];
for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) dice2.push([i, j]);
const isPrime = n => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every(d => n % d);
const probOpts = (R, c, t, extra = []) => [fr(t - c, t), fr(c, t + 1), fr(c + 1, t), fr(c > 1 ? c - 1 : c + 2, t), fr(c, t - 1), ...extra].filter(x => !/^\d{2,}$/.test(x));
const pr = (c, t) => { const g = gcd(c, t); return g > 1 ? `${c}/${t} = ${c / g}/${t / g}` : `${c}/${t}`; };
const prob = {
  slug: 'probability', label: 'Probability', levels: [
    [
      R => { const r = R.int(1, 9), b = R.int(1, 9), t = r + b, col = R.pick(['red', 'blue', 'black']), other = R.pick(['white', 'green']);
        return mcq(R, `A bag contains ${r} ${col} balls and ${b} ${other} balls. One ball is drawn at random. The probability that it is ${col} is`, m(fr(r, t)), probOpts(R, r, t).filter(x => x !== fr(r, t)).map(m), `P = favourable / total = ${pr(r, t)}.`); },
      R => { const ev = R.pick([['an even number', x => x % 2 === 0], ['a prime number', x => isPrime(x)], ['a number greater than 4', x => x > 4], ['a multiple of 3', x => x % 3 === 0], ['a number less than 3', x => x < 3], ['an odd number', x => x % 2 === 1]]),
          c = [1, 2, 3, 4, 5, 6].filter(ev[1]).length;
        return mcq(R, `A fair die is thrown once. The probability of getting ${ev[0]} is`, m(fr(c, 6)), probOpts(R, c, 6).filter(x => x !== fr(c, 6)).map(m), `${c} of the 6 equally likely outcomes are favourable.`); },
      R => { const t = R.int(5, 20); let p = R.int(1, t - 1); if (gcd(p, t) !== 1) p = 1;
        return mcq(R, `If the probability of winning a game is ${m(fr(p, t))}, the probability of losing it is`, m(fr(t - p, t)), [m(fr(p, t)), m(fr(1, t)), m(fr(t, t - p)), m(fr(p + 1, t))], 'P(not E) = 1 − P(E).'); },
    ],
    [
      R => { const ev = R.pick([['a king', 4], ['a red card', 26], ['a face card', 12], ['the ace of spades', 1], ['a black queen', 2], ['a diamond', 13], ['a number card (2 to 10)', 36], ['a red king', 2]]);
        return mcq(R, `A card is drawn at random from a well-shuffled deck of 52 cards. The probability that it is ${ev[0]} is`, m(fr(ev[1], 52)), probOpts(R, ev[1], 52, [fr(ev[1], 51)]).filter(x => x !== fr(ev[1], 52)).map(m), `${ev[1]} of the 52 cards ${ev[1] === 1 ? 'is' : 'are'} favourable.`); },
      R => { if (R.chance(0.5)) { const s = R.int(2, 12), c = 6 - Math.abs(7 - s);
          return mcq(R, `Two dice are thrown together. The probability that the sum of the numbers is ${s} is`, m(fr(c, 36)), probOpts(R, c, 36).filter(x => x !== fr(c, 36)).map(m), `There are 36 outcomes and ${c} of them ${c === 1 ? 'has' : 'have'} a sum of ${s}.`); }
        const ev = R.pick([['at least one head', 3], ['exactly one head', 2], ['no head', 1], ['two heads', 1]]);
        return mcq(R, `Two coins are tossed together. The probability of getting ${ev[0]} is`, m(fr(ev[1], 4)), ['\\frac{1}{4}', '\\frac{1}{2}', '\\frac{3}{4}', '1', '\\frac{1}{3}'].filter(x => x !== fr(ev[1], 4)).map(m), `The 4 equally likely outcomes are HH, HT, TH, TT; ${ev[1]} ${ev[1] === 1 ? 'is' : 'are'} favourable.`); },
      R => { const r = R.int(2, 8), b = R.int(2, 8), g = R.int(2, 8), t = r + b + g, c = R.pick([['not green', r + b], ['red or blue', r + b], ['not red', b + g]]);
        return mcq(R, `A bag has ${r} red, ${b} blue and ${g} green balls. A ball is drawn at random. The probability that it is ${c[0]} is`, m(fr(c[1], t)), probOpts(R, c[1], t).filter(x => x !== fr(c[1], t)).map(m), `Favourable outcomes = ${c[1]} out of ${t}.`); },
    ],
    [
      R => { const rd = R.int(3, 8), mul = R.int(2, 4), bl = rd * mul, t = rd + bl;
        return num(R, `A bag contains ${rd} red balls and some blue balls. The probability of drawing a blue ball is ${mul} times the probability of drawing a red ball. Find the number of blue balls.`, bl, [rd + mul, mul, t], `P(blue) = ${mul} × P(red) means the number of blue balls is ${mul} × ${rd} = ${bl}.`); },
      R => { const ev = R.pick([['the sum is a prime number', ([a, b]) => isPrime(a + b)], ['the two numbers are equal (a doublet)', ([a, b]) => a === b], ['the sum is more than 9', ([a, b]) => a + b > 9], ['the product is 12', ([a, b]) => a * b === 12], ['the product is even', ([a, b]) => (a * b) % 2 === 0], ['the sum is a multiple of 4', ([a, b]) => (a + b) % 4 === 0], ['the first number is greater than the second', ([a, b]) => a > b]]),
          c = dice2.filter(ev[1]).length;
        return mcq(R, `Two dice are thrown together. The probability that ${ev[0]} is`, m(fr(c, 36)), probOpts(R, c, 36).filter(x => x !== fr(c, 36)).map(m), `Counting the outcomes out of 36: ${c} ${c === 1 ? 'is' : 'are'} favourable.`); },
      R => { const N = R.pick([20, 30, 40, 50, 60]), sq = n => Number.isInteger(Math.sqrt(n)),
          ev = R.pick([['a perfect square', sq], ['a prime number', isPrime], ['divisible by 3 or 5', n => n % 3 === 0 || n % 5 === 0], ['a multiple of both 2 and 3', n => n % 6 === 0], ['neither a multiple of 3 nor of 5', n => n % 3 && n % 5]]),
          c = Array.from({ length: N }, (_, i) => i + 1).filter(ev[1]).length;
        return mcq(R, `A number is selected at random from 1 to ${N}. The probability that it is ${ev[0]} is`, m(fr(c, N)), probOpts(R, c, N).filter(x => x !== fr(c, N)).map(m), `${c} numbers out of ${N} satisfy the condition.`); },
    ],
  ],
};

/* ---------------- Surface Areas and Volumes ---------------- */
const unit2 = c => `$${c}\\ \\text{cm}^2$`, unit3 = c => `$${c}\\ \\text{cm}^3$`;
const surface = {
  slug: 'surface-areas-and-volumes', label: 'Surface Areas and Volumes', levels: [
    [
      R => { const r = R.int(2, 12), h = R.int(3, 15);
        return mcq(R, `The curved surface area of a cylinder of radius ${r} cm and height ${h} cm is`, unit2(cpi(2 * r * h)), [unit2(cpi(r * r * h)), unit2(cpi(2 * r * (r + h))), unit2(cpi(r * h))], `CSA = 2πrh = 2π × ${r} × ${h} = ${2 * r * h}π cm².`); },
      R => { const r = R.int(2, 9), h = 3 * R.int(1, 6);
        return mcq(R, `The volume of a cone of radius ${r} cm and height ${h} cm is`, unit3(cpi(r * r * h, 3)), [unit3(cpi(r * r * h)), unit3(cpi(r * h, 3)), unit3(cpi(2 * r * r * h, 3))], `V = ⅓πr²h = ⅓ × π × ${r * r} × ${h} = ${r * r * h / 3}π cm³.`); },
      R => { const r = 3 * R.int(1, 5), area = R.chance(0.5);
        return area ? mcq(R, `The total surface area of a sphere of radius ${r} cm is`, unit2(cpi(4 * r * r)), [unit2(cpi(2 * r * r)), unit2(cpi(4 * r * r * r, 3)), unit2(cpi(3 * r * r))], `TSA = 4πr² = 4π × ${r * r} = ${4 * r * r}π cm².`)
          : mcq(R, `The volume of a sphere of radius ${r} cm is`, unit3(cpi(4 * r ** 3, 3)), [unit3(cpi(4 * r * r)), unit3(cpi(2 * r ** 3, 3)), unit3(cpi(4 * r ** 3))], `V = (4/3)πr³ = (4/3)π × ${r ** 3} = ${4 * r ** 3 / 3}π cm³.`); },
    ],
    [
      R => { const [r, h, l] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 5, 13], [8, 15, 17], [7, 24, 25]]), csa = R.chance(0.5);
        return csa ? mcq(R, `A cone has base radius ${r} cm and height ${h} cm. Its curved surface area is`, unit2(cpi(r * l)), [unit2(cpi(r * h)), unit2(cpi(r * (l + r))), unit2(cpi(r * l, 3))], `Slant height l = √(${r}² + ${h}²) = ${l} cm. CSA = πrl = ${r * l}π cm².`)
          : num(R, `The slant height of a cone with base radius ${r} cm and height ${h} cm is (in cm)`, l, [r + h, h, l * l], `l = √(r² + h²) = √(${r * r} + ${h * h}) = ${l} cm.`); },
      R => { const r = R.int(1, 5), k = R.int(2, 4), melt = R.chance(0.5);
        return melt ? num(R, `A metal sphere of radius ${r * k} cm is melted and recast into small spheres of radius ${r} cm. How many small spheres are formed?`, k ** 3, [k * k, 3 * k, k ** 3 + k], `n = (${r * k}/${r})³ = ${k}³ = ${k ** 3}.`)
          : num(R, `${k ** 3} small spheres, each of radius ${r} cm, are melted to make one large sphere. The radius of the large sphere (in cm) is`, r * k, [r * k * k, r * k ** 3, r + k], `Volumes are equal: R³ = ${k ** 3} r³, so R = ${k} × ${r} = ${r * k} cm.`); },
      R => { const r = 3 * R.int(1, 5), w = R.pick(['curved surface area', 'total surface area', 'volume']),
          ans = w === 'volume' ? unit3(cpi(2 * r ** 3, 3)) : w === 'total surface area' ? unit2(cpi(3 * r * r)) : unit2(cpi(2 * r * r)),
          wrong = w === 'volume' ? [unit3(cpi(4 * r ** 3, 3)), unit3(cpi(2 * r ** 3)), unit3(cpi(r ** 3, 3)), unit3(cpi(4 * r * r))] : [unit2(cpi(4 * r * r)), unit2(cpi(2 * r * r)), unit2(cpi(3 * r * r)), unit2(cpi(r * r))];
        return mcq(R, `The ${w} of a solid hemisphere of radius ${r} cm is`, ans, wrong,
          w === 'volume' ? 'V = (2/3)πr³.' : w === 'total surface area' ? 'TSA = curved surface (2πr²) + flat circle (πr²) = 3πr².' : 'CSA = 2πr².'); },
    ],
    [
      R => { const [d, h, l] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), r = R.int(2, 8), RR = r + d, kind = R.int(0, 1);
        return kind ? mcq(R, `A frustum of a cone has radii ${RR} cm and ${r} cm and height ${h} cm. Its volume is`, unit3(cpi(h * (RR * RR + r * r + RR * r), 3)), [unit3(cpi(h * (RR * RR + r * r), 3)), unit3(cpi(h * (RR + r), 3)), unit3(cpi(h * (RR * RR + r * r + RR * r)))], `V = (πh/3)(R² + r² + Rr) = (π × ${h}/3)(${RR * RR} + ${r * r} + ${RR * r}).`)
          : mcq(R, `A frustum of a cone has radii ${RR} cm and ${r} cm and height ${h} cm. Its curved surface area is`, unit2(cpi(l * (RR + r))), [unit2(cpi(h * (RR + r))), unit2(cpi(l * (RR - r))), unit2(cpi(l * (RR + r) + RR * RR + r * r))], `Slant height l = √(h² + (R − r)²) = √(${h * h} + ${d * d}) = ${l}. CSA = π(R + r)l = ${l * (RR + r)}π cm².`); },
      R => { const [r, h, l] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15]]), cone = R.chance(0.5), H = R.int(3, 12);
        return cone ? mcq(R, `A toy is a cone of radius ${r} cm and height ${h} cm mounted on a hemisphere of the same radius. Its total surface area is`, unit2(cpi(r * l + 2 * r * r)), [unit2(cpi(r * l + 3 * r * r)), unit2(cpi(r * l + r * r)), unit2(cpi(r * l))], `TSA = CSA of cone + CSA of hemisphere = π × ${r} × ${l} + 2π × ${r}² = ${r * l + 2 * r * r}π cm².`)
          : mcq(R, `A capsule is a cylinder of radius ${r} cm and height ${H} cm with a hemisphere attached at each end. Its total surface area is`, unit2(cpi(2 * r * H + 4 * r * r)), [unit2(cpi(2 * r * H + 2 * r * r)), unit2(cpi(2 * r * (H + 2 * r) + 2 * r * r)), unit2(cpi(2 * r * H + 6 * r * r))], `TSA = CSA of cylinder + 2 hemispheres = 2π × ${r} × ${H} + 4π × ${r}² = ${2 * r * H + 4 * r * r}π cm².`); },
      R => { const r = R.pick([3, 6, 12]), h0 = r === 3 ? 4 * R.int(1, 5) : R.int(2, 12), n = (r * r * h0) / 36;
        return num(R, `A solid metal cylinder of radius ${r} cm and height ${h0} cm is melted and recast into spheres of radius 3 cm. How many spheres are formed?`, n, [n * 2, n + 1, n / 2], `Number of spheres = volume of cylinder / volume of one sphere = (π × ${r * r} × ${h0}) / ((4/3)π × 27) = ${r * r * h0} / 36 = ${n}.`); },
    ],
  ],
};

/* ---------------- Areas Related to Circles ---------------- */
const areas = {
  slug: 'areas-related-to-circles', label: 'Areas Related to Circles', levels: [
    [
      R => { const r = R.int(2, 15);
        return mcq(R, `The circumference of a circle of radius ${r} cm is`, `$${cpi(2 * r)}$ cm`, [`$${cpi(r * r)}$ cm`, `$${cpi(r)}$ cm`, `$${cpi(4 * r)}$ cm`], `C = 2πr = 2 × π × ${r} = ${2 * r}π cm.`); },
      R => { const r = R.int(2, 15);
        return mcq(R, `The area of a circle of radius ${r} cm is`, `$${cpi(r * r)}\\ \\text{cm}^2$`, [`$${cpi(2 * r)}\\ \\text{cm}^2$`, `$${cpi(r)}\\ \\text{cm}^2$`, `$${cpi(2 * r * r)}\\ \\text{cm}^2$`], `A = πr² = π × ${r * r} = ${r * r}π cm².`); },
      R => { const d = 2 * R.int(2, 12);
        return mcq(R, `The diameter of a circle is ${d} cm. Its area is`, `$${cpi((d / 2) ** 2)}\\ \\text{cm}^2$`, [`$${cpi(d * d)}\\ \\text{cm}^2$`, `$${cpi(d)}\\ \\text{cm}^2$`, `$${cpi(d * d / 2)}\\ \\text{cm}^2$`], `Radius = ${d / 2} cm, so A = πr² = ${(d / 2) ** 2}π cm².`); },
    ],
    [
      R => { const th = R.pick([30, 45, 60, 90, 120, 180]), r = R.int(3, 12);
        return mcq(R, `The length of an arc of a circle of radius ${r} cm that subtends an angle of ${th}° at the centre is`, `$${cpi(th * 2 * r, 360)}$ cm`, [`$${cpi(th * r * r, 360)}$ cm`, `$${cpi(th * r, 360)}$ cm`, `$${cpi(th * 4 * r, 360)}$ cm`, `$${cpi(th * 2 * r, 720)}$ cm`, `$${cpi(th * 6 * r, 360)}$ cm`].filter(x => x !== `$${cpi(th * 2 * r, 360)}$ cm`), `Arc = (θ/360) × 2πr = (${th}/360) × 2π × ${r}.`); },
      R => { const th = R.pick([30, 45, 60, 90, 120, 180]), r = R.int(3, 12), ans = `$${cpi(th * r * r, 360)}\\ \\text{cm}^2$`;
        return mcq(R, `The area of a sector of a circle of radius ${r} cm with central angle ${th}° is`, ans, [`$${cpi(th * 2 * r, 360)}\\ \\text{cm}^2$`, `$${cpi(th * r * r, 180)}\\ \\text{cm}^2$`, `$${cpi(th * r * r, 720)}\\ \\text{cm}^2$`, `$${cpi(th * r, 360)}\\ \\text{cm}^2$`].filter(x => x !== ans), `Area = (θ/360) × πr² = (${th}/360) × π × ${r * r}.`); },
      R => { const j = R.int(1, 4), C = 44 * j;
        return num(R, `The circumference of a circle is ${C} cm. Find its area in cm² (take π = 22/7).`, 154 * j * j, [22 * j * j, 154 * j, 616 * j * j], `2πr = ${C} gives r = ${7 * j} cm. Area = (22/7) × ${7 * j}² = ${154 * j * j} cm².`); },
    ],
    [
      R => { const r = 2 * R.int(1, 6), ans = `$${r * r / 4 === 1 ? '' : r * r / 4}\\pi - ${r * r / 2}$`;
        return mcq(R, `A chord subtends a right angle at the centre of a circle of radius ${r} cm. The area of the minor segment (in cm²) is`, ans + ' cm$^2$', [`$${cpi(r * r, 4)}$ cm$^2$`, `$${r * r / 4 === 1 ? '' : r * r / 4}\\pi + ${r * r / 2}$ cm$^2$`, `$${r * r / 2}\\pi - ${r * r / 4}$ cm$^2$`],
          `Segment = sector − triangle = (¼)π × ${r * r} − ½ × ${r} × ${r} = ${r * r / 4}π − ${r * r / 2}.`); },
      R => { if (R.chance(0.5)) { const r = R.int(2, 9), RR = r + R.int(2, 6);
          return mcq(R, `Two concentric circles have radii ${RR} cm and ${r} cm. The area of the ring between them is`, `$${cpi(RR * RR - r * r)}\\ \\text{cm}^2$`, [`$${cpi((RR - r) ** 2)}\\ \\text{cm}^2$`, `$${cpi(RR - r)}\\ \\text{cm}^2$`, `$${cpi(RR * RR + r * r)}\\ \\text{cm}^2$`], `Area = π(R² − r²) = π(${RR * RR} − ${r * r}) = ${RR * RR - r * r}π cm².`); }
        const j = R.int(1, 3), n = R.int(10, 60);
        return num(R, `The radius of a wheel is ${7 * j} cm. It covers a distance of ${n * 44 * j} cm. How many complete revolutions does it make? (π = 22/7)`, n, [n * 2, n + 7, Math.round(n / 2)], `One revolution = 2πr = 2 × (22/7) × ${7 * j} = ${44 * j} cm. Revolutions = ${n * 44 * j} / ${44 * j} = ${n}.`); },
      R => { const l = R.pick([6, 10, 12, 14, 21]), t = R.pick([5, 10, 15, 20, 30]), area = R.chance(0.5);
        return area ? mcq(R, `The minute hand of a clock is ${l} cm long. The area swept by it in ${t} minutes is`, `$${cpi(l * l * t, 60)}\\ \\text{cm}^2$`, [`$${cpi(l * t, 30)}\\ \\text{cm}^2$`, `$${cpi(l * l * t, 30)}\\ \\text{cm}^2$`, `$${cpi(l * l * t, 120)}\\ \\text{cm}^2$`].filter(x => x !== `$${cpi(l * l * t, 60)}\\ \\text{cm}^2$`), `In ${t} minutes the hand turns through ${6 * t}°, so the area = (${6 * t}/360) × π × ${l}².`)
          : mcq(R, `The minute hand of a clock is ${l} cm long. The distance travelled by its tip in ${t} minutes is`, `$${cpi(l * t, 30)}$ cm`, [`$${cpi(l * l * t, 60)}$ cm`, `$${cpi(l * t, 60)}$ cm`, `$${cpi(l * t, 15)}$ cm`].filter(x => x !== `$${cpi(l * t, 30)}$ cm`), `In ${t} minutes the hand turns through ${6 * t}°, so the arc = (${6 * t}/360) × 2π × ${l}.`); },
    ],
  ],
};

/* ---------------- Triangles ---------------- */
const triangles = {
  slug: 'triangles', label: 'Triangles', levels: [
    [
      R => { const [p, q] = coprime(R, 1, 5), k1 = R.int(1, 4), k2 = R.int(1, 4);
        return num(R, `In triangle ABC, DE ∥ BC with D on AB and E on AC. If AD = ${p * k1} cm, DB = ${q * k1} cm and AE = ${p * k2} cm, then EC = (in cm)`, q * k2, [p * k2 + q * k1, q * k1, p * k1], `By the Basic Proportionality Theorem AD/DB = AE/EC, so EC = ${q * k1} × ${p * k2} / ${p * k1} = ${q * k2} cm.`); },
      R => { const [a, b] = coprime(R, 2, 6), t = R.int(1, 5);
        return num(R, `Triangles ABC and DEF are similar with AB : DE = ${a} : ${b}. If the area of triangle ABC is ${a * a * t} cm², the area of triangle DEF (in cm²) is`, b * b * t, [b * t, a * b * t, (b * b - a * a) * t + a * a * t / 1 - 0 === b * b * t ? b * t + 1 : Math.max(1, (b * b - a * a) * t)], `Areas are in the ratio of the squares of the sides: ${a * a} : ${b * b}. So area = ${b * b} × ${t} = ${b * b * t} cm².`); },
    ],
    [
      R => { const [a, b, c] = R.pick(TRI), k = R.int(1, 3), hyp = R.chance(0.5);
        return hyp ? num(R, `The two sides of a right triangle (other than the hypotenuse) are ${a * k} cm and ${b * k} cm. The hypotenuse is (in cm)`, c * k, [(a + b) * k, c * k + 1, Math.abs(a - b) * k], `h = √(${a * k}² + ${b * k}²) = √${c * c * k * k} = ${c * k} cm.`)
          : num(R, `The hypotenuse of a right triangle is ${c * k} cm and one side is ${a * k} cm. The other side is (in cm)`, b * k, [c * k - a * k, (c + a) * k, b * k + 1], `s = √(${c * k}² − ${a * k}²) = √${b * b * k * k} = ${b * k} cm.`); },
      R => { const [a, b] = coprime(R, 2, 9);
        return mcq(R, `The areas of two similar triangles are ${a * a} cm² and ${b * b} cm². The ratio of their corresponding sides is`, `${a} : ${b}`, [`${a * a} : ${b * b}`, `${b} : ${a}`, `${a + 1} : ${b + 1}`], `The ratio of areas equals the square of the ratio of sides, so the sides are in the ratio √${a * a} : √${b * b} = ${a} : ${b}.`); },
      R => { const [a, b] = coprime(R, 2, 7), u = R.int(2, 6);
        return num(R, `Triangle ABC ~ triangle DEF and AB : DE = ${a} : ${b}. If the perimeter of triangle ABC is ${a * u} cm, the perimeter of triangle DEF (in cm) is`, b * u, [b * b * u, a * b * u / 1 === b * u ? b * u + 1 : a * b * u, a * u + b - a], `Perimeters are in the same ratio as the sides: ${a} : ${b}. Perimeter = ${a * u} × ${b}/${a} = ${b * u} cm.`); },
    ],
    [
      R => { const a = 2 * R.int(1, 10), alt = R.chance(0.5);
        return alt ? mcq(R, `The altitude of an equilateral triangle of side ${a} cm is`, `$${a / 2}\\sqrt{3}$ cm`, [`$${a}\\sqrt{3}$ cm`, `$${a / 2}\\sqrt{2}$ cm`, `$${a / 2}$ cm`], `Altitude = (√3/2) × side = ${a / 2}√3 cm.`)
          : mcq(R, `The area of an equilateral triangle of side ${a} cm is`, `$${a * a / 4 === 1 ? '' : a * a / 4}\\sqrt{3}\\ \\text{cm}^2$`, [`$${a * a / 2}\\sqrt{3}\\ \\text{cm}^2$`, `$${a * a / 4}\\sqrt{2}\\ \\text{cm}^2$`, `$${a * a}\\sqrt{3}\\ \\text{cm}^2$`], `Area = (√3/4) × side² = (√3/4) × ${a * a} = ${a * a / 4}√3 cm².`); },
      R => { const [mm, n] = coprime(R, 1, 6);
        return num(R, `In triangle ABC, right-angled at B, BD is perpendicular to AC. If AD = ${mm * mm} cm and DC = ${n * n} cm, then BD = (in cm)`, mm * n, [mm * mm + n * n, mm + n, Math.abs(mm * mm - n * n)], `BD² = AD × DC = ${mm * mm} × ${n * n}, so BD = ${mm * n} cm.`); },
      R => { const [a, b, c] = R.pick(TRI), k = R.pick([1, 2]), right = [a * k, b * k, c * k], pick = R.int(0, 3);
        const sets = [0, 1, 2, 3].map(i => i === pick ? right : [right[0] + R.int(0, 1), right[1] + R.int(1, 2) * (i + 1), right[2] + i]);
        const text = s => m(`${s.join(', ')}`);
        const isRt = t => { const [x, y, z] = t.slice().sort((p, q) => p - q); return x * x + y * y === z * z; };
        if (new Set(sets.map(String)).size < 4 || sets.filter(isRt).length !== 1) return null;
        return mcq(R, 'Which set of sides (in cm) forms a right-angled triangle?', text(sets[pick]), sets.filter((_, i) => i !== pick).map(text), `Check a² + b² = c² with c the longest side: only ${right.join(', ')} gives ${right[0] ** 2} + ${right[1] ** 2} = ${right[2] ** 2}.`); },
    ],
  ],
};

/* ---------------- Circles ---------------- */
const circles = {
  slug: 'circles', label: 'Circles', levels: [
    [
      R => { const [r, t, o] = R.pick(TRI.map(([a, b, c]) => [a, b, c])), k = R.int(1, 3);
        return num(R, `PT is a tangent to a circle with centre O. If OT = ${r * k} cm and OP = ${o * k} cm, then PT = (in cm)`, t * k, [o * k - r * k, (o + r) * k, t * k + 1], `The radius OT is perpendicular to the tangent PT, so PT = √(OP² − OT²) = √(${o * k}² − ${r * k}²) = ${t * k} cm.`); },
      R => { const w = R.pick([['outside the circle', 2], ['on the circle', 1], ['inside the circle', 0]]);
        return num(R, `How many tangents can be drawn to a circle from a point ${w[0]}?`, w[1], [0, 1, 2, 3, 4].filter(x => x !== w[1]), w[1] === 2 ? 'Two tangents can be drawn from an external point.' : w[1] === 1 ? 'Exactly one tangent touches the circle at a point on it.' : 'No tangent passes through a point inside a circle.'); },
      R => { const x = R.int(3, 15);
        return num(R, `Tangents PA and PB are drawn from an external point P to a circle. If PA = ${x} cm, then PB = (in cm)`, x, [2 * x, x + 1, x - 1], 'Tangents drawn from an external point are equal in length.'); },
    ],
    [
      R => { const th = R.pick([40, 50, 60, 70, 80, 100, 120]);
        return num(R, `PA and PB are tangents from P to a circle with centre O. If ∠APB = ${th}°, then ∠AOB = (in degrees)`, 180 - th, [th, 90 - th / 2, 360 - th], `In quadrilateral OAPB, ∠OAP = ∠OBP = 90°, so ∠AOB = 360° − 90° − 90° − ${th}° = ${180 - th}°.`); },
      R => { const th = 2 * R.int(15, 55);
        return num(R, `PA and PB are tangents from P to a circle and ∠APB = ${th}°. Then ∠PAB = (in degrees)`, 90 - th / 2, [th / 2, 180 - th, 90 - th], `PA = PB, so triangle PAB is isosceles. ∠PAB = (180° − ${th}°)/2 = ${90 - th / 2}°.`); },
      R => { const a = R.int(5, 12), b = R.int(6, 14), c = R.int(5, 12), d = a + c - b; if (d < 1) return null;
        return num(R, `A quadrilateral ABCD is drawn to circumscribe a circle. If AB = ${a} cm, BC = ${b} cm and CD = ${c} cm, then AD = (in cm)`, d, [a + b + c, b + c - a, a + c + b - d], `For a quadrilateral circumscribing a circle, AB + CD = AD + BC. So AD = ${a} + ${c} − ${b} = ${d} cm.`); },
    ],
    [
      R => { const [r, h, RR] = R.pick(TRI), k = R.int(1, 3);
        return num(R, `Two concentric circles have radii ${RR * k} cm and ${r * k} cm. A chord of the larger circle touches the smaller circle. The length of the chord is (in cm)`, 2 * h * k, [h * k, RR * k, 2 * RR * k - 2 * r * k], `Half the chord = √(${RR * k}² − ${r * k}²) = ${h * k} cm, so the chord = ${2 * h * k} cm.`); },
      R => { const [a, b, c] = R.pick(TRI), k = R.int(1, 3), r = (a + b - c) * k / 2; if (!Number.isInteger(r)) return null;
        return num(R, `A circle is inscribed in a right-angled triangle whose sides containing the right angle are ${a * k} cm and ${b * k} cm. The radius of the circle is (in cm)`, r, [r + 1, a * k - r, (a + b + c) * k / 2], `Hypotenuse = ${c * k}. For a right triangle, r = (a + b − c)/2 = (${a * k} + ${b * k} − ${c * k})/2 = ${r} cm.`); },
      R => { const x = R.int(2, 8), y = R.int(2, 8), z = R.int(2, 8);
        return num(R, `A circle touches the sides AB, BC and CA of triangle ABC at F, D and E. If AB = ${x + y} cm, BC = ${y + z} cm and CA = ${z + x} cm, then AF = (in cm)`, x, [y, z, x + y + z], `Let AF = AE = x, BF = BD = y, CD = CE = z. Then x + y = ${x + y}, y + z = ${y + z}, z + x = ${z + x}. Adding gives x + y + z = ${x + y + z}, so AF = ${x}.`); },
    ],
  ],
};

export const CLASS10 = [realNumbers, polynomials, pairLinear, quadratic, ap, coord, trig, apps, stats, prob, surface, areas, triangles, circles]
  .map(c => ({ ...c, cls: 'class-10' }));
