import { gcd, m, sg, fr, dec, pstr, mcq, num } from './util';

// Class 8 generators. Each chapter has three lists of templates (Easy, Medium, Hard).
const D = '°';
const rs = x => `Rs ${x}`;
const coprime = (R, lo, hi) => { let a, b; do { a = R.int(lo, hi); b = R.int(lo, hi); } while (a === b || gcd(a, b) !== 1); return [a, b]; };

/* ---------------- Squares, Cubes and Roots ---------------- */
const roots = {
  slug: 'squares-cubes-and-roots', label: 'Squares, Cubes and Roots', levels: [
    [
      R => { const n = R.int(11, 35), cube = R.chance(0.4), c = R.int(2, 9);
        return cube ? num(R, `The cube of ${c} is`, c ** 3, [c * c, c * 3, c ** 3 + c], `${c}³ = ${c} × ${c} × ${c} = ${c ** 3}.`) : num(R, `The square of ${n} is`, n * n, [n * 2, n * n + n, (n - 1) * (n - 1)], `${n}² = ${n} × ${n} = ${n * n}.`); },
      R => { const n = R.int(12, 40);
        return num(R, `The square root of ${n * n} is`, n, [n * 2, n + 1, n - 1, n * n / 2], `${n} × ${n} = ${n * n}, so √${n * n} = ${n}.`); },
      R => { const c = R.int(2, 12);
        return num(R, `The cube root of ${c ** 3} is`, c, [c + 1, c - 1, c * 3, c * c], `${c} × ${c} × ${c} = ${c ** 3}, so the cube root is ${c}.`); },
    ],
    [
      R => { const s = R.int(2, 9), q = R.pick([2, 3, 5, 6, 7]), n = s * s * q;
        return num(R, `By what smallest number must ${n} be multiplied to get a perfect square?`, q, [q + 1, s, n, q * 2], `${n} = ${s}² × ${q}. The factor ${q} is unpaired, so multiply by ${q}.`); },
      R => { const n = R.int(5, 40);
        return num(R, `How many natural numbers lie between ${n}² and ${n + 1}²?`, 2 * n, [n, 2 * n + 1, 2 * n - 1, n + 1], `Between n² and (n + 1)² there are 2n numbers: 2 × ${n} = ${2 * n}.`); },
      R => { const q = R.pick([2, 3, 4, 5, 6, 9]), c = R.int(2, 5), n = c ** 3 * q;
        return num(R, `By what smallest number must ${n} be divided to get a perfect cube?`, q, [q + 1, c, n, q * 2], `${n} = ${c}³ × ${q}. Dividing by ${q} leaves ${c ** 3}, a perfect cube.`); },
    ],
    [
      R => { const mm = R.int(3, 9), a = 2 * mm;
        return mcq(R, `If the smallest member of a Pythagorean triplet is ${a}, the other two members are`, m(`${mm * mm - 1}, ${mm * mm + 1}`), [m(`${mm * mm}, ${mm * mm + 2}`), m(`${mm * mm - 2}, ${mm * mm + 2}`), m(`${a + 1}, ${a + 2}`)], `For 2m = ${a}, m = ${mm}. The triplet is (2m, m² − 1, m² + 1) = (${a}, ${mm * mm - 1}, ${mm * mm + 1}).`); },
      R => { const s = R.int(11, 49), sq = (s * s / 10000).toFixed(4);
        return mcq(R, `The square root of ${sq} is`, String(s / 100), [String(s / 10), String(s / 1000), String(s * s / 100), String((s + 1) / 100)], `${sq} = ${s * s}/10000, so the square root is ${s}/100 = ${s / 100}.`); },
      R => { const d = R.int(3, 8);
        return num(R, `A perfect square has ${d} digits. How many digits does its square root have?`, Math.ceil(d / 2), [Math.floor(d / 2) + 2, d, Math.ceil(d / 2) + 1, Math.max(1, Math.ceil(d / 2) - 1)], `For an n-digit perfect square the root has n/2 digits (if n is even) or (n + 1)/2 digits (if n is odd).`); },
    ],
  ],
};

/* ---------------- Exponents and Powers ---------------- */
const exponents = {
  slug: 'exponents-and-powers', label: 'Exponents and Powers', levels: [
    [
      R => { const b = R.int(2, 6), e = R.int(2, 4);
        return num(R, `The value of ${m(`${b}^{${e}}`)} is`, b ** e, [b * e, b ** (e + 1), b ** e - b, e ** b], `${b}^${e} = ${Array(e).fill(b).join(' × ')} = ${b ** e}.`); },
      R => { const b = R.int(2, 7), x = R.int(2, 6), y = R.int(2, 6);
        return mcq(R, `${m(`${b}^{${x}} \\times ${b}^{${y}}`)} is equal to`, m(`${b}^{${x + y}}`), [m(`${b}^{${x * y}}`), m(`${b * b}^{${x + y}}`), m(`${b}^{${x + y + 1}}`), m(`${b}^{${Math.abs(x - y) || 1}}`)], 'When the bases are the same, add the powers: a^m × a^n = a^(m+n).'); },
      R => { const b = R.int(2, 5), t = R.int(0, 2);
        return mcq(R, t === 0 ? `The value of ${m(`${b}^{0}`)} is` : `The value of ${m(`${b}^{-${t}}`)} is`, t === 0 ? '1' : m(fr(1, b ** t)), t === 0 ? ['0', `${b}`, '-1'] : [m(`-${b * t}`), m(fr(1, b * t)), m(`${b ** t}`)], t === 0 ? 'Any non-zero number raised to the power 0 is 1.' : `a^(−n) = 1/a^n = 1/${b ** t}.`); },
    ],
    [
      R => { const b = R.pick([2, 3, 5]), mm = R.int(2, 6), n = R.int(mm + 2, mm + 7);
        return num(R, `If ${m(`${b}^{x} \\times ${b}^{${mm}} = ${b}^{${n}}`)}, then x =`, n - mm, [n + mm, n, n - mm + 1, mm], `x + ${mm} = ${n}, so x = ${n - mm}.`); },
      R => { const mant = R.pick([1.2, 2.5, 3.4, 4.5, 6.7, 7.8, 8.1, 9.3]), k = R.int(3, 8), small = R.chance(0.5), ds = String(mant).replace('.', '');
        const val = small ? `0.${'0'.repeat(k - 1)}${ds}` : `${ds}${'0'.repeat(k - 1)}`, f = e => m(`${mant} \\times 10^{${e}}`);
        return mcq(R, `Express ${val} in standard form.`, f(small ? -k : k), [f(small ? k : -k), f(small ? -(k - 1) : k - 1), f(small ? -(k + 1) : k + 1)], small ? `Move the decimal point ${k} places to the right: ${mant} × 10^(−${k}).` : `Move the decimal point ${k} places to the left: ${mant} × 10^${k}.`); },
      R => { const b = R.pick([2, 3, 5]), x = R.int(1, 3), y = R.int(1, 3), z = R.int(1, 2), e = x + y - z; if (e < 1) return null;
        return num(R, `Find the value of ${m(`\\frac{${b}^{${x}} \\times ${b}^{${y}}}{${b}^{${z}}}`)}.`, b ** e, [b ** (e + 1), b ** (x + y), b ** (e - 1), b * e], `Powers: ${x} + ${y} − ${z} = ${e}, so the value is ${b}^${e} = ${b ** e}.`); },
    ],
    [
      R => { const b = R.pick([2, 3, 5]), p = R.int(2, 3), q = R.int(-2, 3), x = R.int(1, 4), e = p * x + q; if (e < 1) return null;
        return num(R, `If ${m(`${b}^{${p}x ${q < 0 ? '-' : '+'} ${Math.abs(q)}} = ${b ** e}`)}, find x.`, x, [e, x + 1, x - 1 || 5, p], `${b ** e} = ${b}^${e}, so ${p}x ${q < 0 ? '−' : '+'} ${Math.abs(q)} = ${e}, giving x = ${x}.`); },
      R => { const b = R.pick([2, 3, 5]), x = R.int(1, 3), y = R.int(x + 1, 4), top = b ** x + b ** y, bot = b ** (x + y);
        return mcq(R, `Find the value of ${m(`${b}^{-${x}} + ${b}^{-${y}}`)}.`, m(fr(top, bot)), [m(fr(1, b ** (x + y))), m(fr(2, b ** y)), m(fr(top, bot * b)), m(fr(b ** x * b ** y, top))], `${b}^(−${x}) + ${b}^(−${y}) = 1/${b ** x} + 1/${b ** y} = (${b ** y} + ${b ** x})/${bot}.`); },
      R => { const bb = R.int(2, 9), c = R.int(2, 6);
        return num(R, `Find the value of ${m(`(${bb}^{0} + ${c}^{-1}) \\times ${c}^{2}`)}.`, c * c + c, [c * c, c + 1, c * c + 1, c * 2], `(1 + 1/${c}) × ${c * c} = ${c * c} + ${c} = ${c * c + c}.`); },
    ],
  ],
};

/* ---------------- Percentages, Profit and Loss ---------------- */
const percent = {
  slug: 'percentages-profit-loss', label: 'Percentages, Profit and Loss', levels: [
    [
      R => { const p = R.pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), N = R.int(1, 15) * 40;
        return num(R, `Find ${p}% of ${N}.`, p * N / 100, [p * N / 10, N - p * N / 100, p + N / 10, p * N / 100 + 10], `${p}% of ${N} = (${p}/100) × ${N} = ${p * N / 100}.`); },
      R => { const p = R.pick([10, 20, 25, 40, 50, 60, 75, 80]), b = R.pick([20, 40, 50, 80, 100, 200, 400]), a = p * b / 100;
        return num(R, `What percent of ${b} is ${a}?`, p, [100 - p, p + 10, a, b / a], `(${a}/${b}) × 100 = ${p}%.`, x => `${x}%`); },
      R => { const cp = R.int(5, 60) * 10, d = R.int(1, 8) * 10, loss = R.chance(0.5), sp = loss ? cp - d : cp + d;
        return num(R, `A shopkeeper buys an article for ${rs(cp)} and sells it for ${rs(sp)}. The ${loss ? 'loss' : 'profit'} is`, d, [cp, sp, d + 10, d * 2], `${loss ? 'Loss = CP − SP' : 'Profit = SP − CP'} = ${Math.max(cp, sp)} − ${Math.min(cp, sp)} = ${d}.`, rs); },
    ],
    [
      R => { const g = R.pick([5, 10, 20, 25, 40, 50]), cp = R.int(1, 10) * 100, loss = R.chance(0.4), sp = cp * (100 + (loss ? -g : g)) / 100;
        return num(R, `An article bought for ${rs(cp)} is sold for ${rs(sp)}. The ${loss ? 'loss' : 'profit'} percent is`, g, [g + 5, g * 2, 100 - g, g - 5 || 10], `${loss ? 'Loss' : 'Profit'} = ${Math.abs(sp - cp)}. Percent = (${Math.abs(sp - cp)}/${cp}) × 100 = ${g}%.`, x => `${x}%`); },
      R => { const g = R.pick([10, 20, 25, 50]), cp = R.int(2, 20) * 100, sp = cp * (100 + g) / 100;
        return num(R, `A radio costing ${rs(cp)} is sold at a profit of ${g}%. The selling price is`, sp, [cp + g, cp - cp * g / 100, sp + g, cp * g / 100], `Profit = ${g}% of ${cp} = ${cp * g / 100}. SP = ${cp} + ${cp * g / 100} = ${sp}.`, rs); },
      R => { const MP = R.pick([200, 400, 500, 800, 1000, 1200, 2000]), d = R.pick([5, 10, 15, 20, 25, 30]), sp = MP * (100 - d) / 100;
        return num(R, `The marked price of a shirt is ${rs(MP)}. A discount of ${d}% is given. The selling price is`, sp, [MP * d / 100, MP - d, MP + MP * d / 100, sp + 50], `Discount = ${d}% of ${MP} = ${MP * d / 100}. SP = ${MP} − ${MP * d / 100} = ${sp}.`, rs); },
    ],
    [
      R => { const g = R.pick([10, 20, 25, 50]), cp = R.int(2, 30) * 10, sp = cp * (100 + g) / 100;
        return num(R, `A trader sells an article for ${rs(sp)} and makes a profit of ${g}%. The cost price is`, cp, [sp - g, sp * (100 - g) / 100, sp + sp * g / 100, cp + g], `SP = ${100 + g}% of CP, so CP = ${sp} × 100/${100 + g} = ${cp}.`, rs); },
      R => { const [a, b] = R.pick([[10, 20], [20, 25], [10, 10], [50, 20], [20, 20], [10, 30], [25, 20]]), t = a + b - a * b / 100;
        return num(R, `Two successive discounts of ${a}% and ${b}% are equal to a single discount of`, t, [a + b, Math.abs(a - b), t + 2, a * b / 100], `After ${a}% the price is ${100 - a}%. After ${b}% more it is ${100 - a}% × ${100 - b}% = ${dec((100 - a) * (100 - b) / 100)}%. Discount = ${dec(t)}%.`, x => `${x}%`); },
      R => { let mk, d, r; for (let i = 0; i < 60; i++) { mk = R.pick([20, 30, 40, 50, 60]); d = R.pick([10, 20, 25, 50]); r = (100 + mk) * (100 - d) / 100 - 100; if (Number.isInteger(r) && r > 0) break; r = null; }
        if (r === null) return null;
        return num(R, `A shopkeeper marks an article ${mk}% above its cost price and then gives a discount of ${d}%. The gain percent is`, r, [mk - d, mk, r + 5, mk + d], `Let CP = 100. MP = ${100 + mk}. SP = ${100 + mk} × ${100 - d}/100 = ${dec((100 + mk) * (100 - d) / 100)}. Gain = ${r}%.`, x => `${x}%`); },
    ],
  ],
};

/* ---------------- Simple and Compound Interest ---------------- */
const interest = {
  slug: 'simple-and-compound-interest', label: 'Simple and Compound Interest', levels: [
    [
      R => { const P = R.int(1, 20) * 100, r = R.int(2, 12), t = R.int(1, 5), si = P * r * t / 100;
        return num(R, `Find the simple interest on ${rs(P)} for ${t} year${t > 1 ? 's' : ''} at ${r}% per year.`, si, [P * r / 100, si + P, si * 2, P + r * t], `SI = PRT/100 = ${P} × ${r} × ${t}/100 = ${si}.`, rs); },
      R => { const P = R.int(1, 20) * 100, r = R.int(2, 12), t = R.int(1, 5), si = P * r * t / 100;
        return num(R, `A sum of ${rs(P)} is lent for ${t} year${t > 1 ? 's' : ''} at ${r}% simple interest. The amount to be repaid is`, P + si, [si, P + si * 2, P - si, P + r * t], `Amount = P + SI = ${P} + ${si} = ${P + si}.`, rs); },
      R => { const P = R.int(1, 20) * 100, r = R.int(2, 12), t = R.int(2, 5), si = P * r * t / 100;
        return num(R, `A sum of ${rs(P)} earns simple interest of ${rs(si)} in ${t} years. The rate percent per year is`, r, [r + 1, r * t, si / P, r - 1 || 13], `R = SI × 100/(P × T) = ${si} × 100/(${P} × ${t}) = ${r}%.`, x => `${x}%`); },
    ],
    [
      R => { const r = R.pick([5, 10, 20]), P = R.int(1, 8) * 400, A = P * (100 + r) * (100 + r) / 10000;
        return num(R, `Find the compound interest on ${rs(P)} for 2 years at ${r}% per year, compounded yearly.`, A - P, [P * r * 2 / 100, A, A - P + P * r / 100, P * r / 100], `A = P(1 + r/100)² = ${P} × ${(100 + r) / 100}² = ${A}. CI = ${A} − ${P} = ${A - P}.`, rs); },
      R => { const r = R.pick([5, 10, 20]), P = R.int(1, 8) * 400, diff = P * r * r / 10000;
        return num(R, `What is the difference between the compound interest and the simple interest on ${rs(P)} for 2 years at ${r}% per year?`, diff, [diff * 2, P * r / 100, diff + 10, diff / 2], `For 2 years, CI − SI = P(r/100)² = ${P} × ${r * r}/10000 = ${diff}.`, rs); },
      R => { const P = R.int(1, 8) * 2400, r = R.pick([6, 8, 10, 12]), mo = R.pick([3, 6, 9]), si = P * r * mo / 1200;
        return num(R, `Find the simple interest on ${rs(P)} for ${mo} months at ${r}% per year.`, si, [si * 4, si * 12 / mo, P * r * mo / 100, si + P / 100], `Time = ${mo}/12 year. SI = ${P} × ${r} × ${mo}/1200 = ${si}.`, rs); },
    ],
    [
      R => { const r = R.pick([5, 10, 12.5, 20, 25]);
        return num(R, `At simple interest, in how many years will a sum of money double itself at ${r}% per year?`, 100 / r, [r, 200 / r, 100 / r + 1, 50 / r], `SI must equal the principal: P × ${r} × T/100 = P, so T = 100/${r} = ${100 / r} years.`); },
      R => { const r = R.pick([10, 20]), P = R.int(1, 5) * 1000, A = Math.round(P * ((100 + r) / 100) ** 3);
        return num(R, `Find the amount on ${rs(P)} after 3 years at ${r}% per year, compounded yearly.`, A, [P + P * r * 3 / 100, A - P, Math.round(P * ((100 + r) / 100) ** 2), A + 100], `A = ${P} × (${(100 + r) / 100})³ = ${A}.`, rs); },
      R => { const r = R.pick([5, 10, 20]), P = R.int(1, 6) * 4000, diff = P * r * r / 10000;
        return num(R, `The difference between the compound interest and the simple interest for 2 years at ${r}% per year is ${rs(diff)}. Find the sum.`, P, [P / 2, P * 2, diff * 100, P + diff], `P(r/100)² = ${diff}, so P = ${diff} × (100/${r})² = ${P}.`, rs); },
    ],
  ],
};

/* ---------------- Linear Equations in One Variable ---------------- */
const linear1 = {
  slug: 'linear-equations-one-variable', label: 'Linear Equations in One Variable', levels: [
    [
      R => { const x = R.int(1, 20), a = R.int(2, 15);
        return num(R, `Solve: $x + ${a} = ${x + a}$`, x, [x + a, x + 1, a, x - 1], `Subtract ${a} from both sides: x = ${x + a} − ${a} = ${x}.`); },
      R => { const x = R.int(2, 12), a = R.int(2, 9);
        return num(R, `Solve: $${a}x = ${a * x}$`, x, [a * x, a, x + 1, x - 1], `Divide both sides by ${a}: x = ${x}.`); },
      R => { const x = R.int(-5, 12), a = R.int(2, 7), b = R.int(1, 15);
        return num(R, `Solve: $${a}x + ${b} = ${a * x + b}$`, x, [a * x, x + 1, x - 1, a * x + b - a], `${a}x = ${a * x + b} − ${b} = ${a * x}, so x = ${x}.`); },
    ],
    [
      R => { let x, a, c; do { x = R.int(-4, 9); a = R.int(2, 9); c = R.int(1, 8); } while (a === c); const b = R.int(1, 10), d = a * x + b - c * x;
        return num(R, `Solve: $${a}x + ${b} = ${c}x ${d < 0 ? '-' : '+'} ${Math.abs(d)}$`, x, [-x, x + 1, d, x - 1], `Collect x terms: ${a - c}x = ${d} − ${b} = ${d - b}, so x = ${x}.`); },
      R => { const a = R.int(2, 8), b = R.int(1, 9), x = a * R.int(2, 9), c = x / a + b;
        return num(R, `Solve: $\\frac{x}{${a}} + ${b} = ${c}$`, x, [c - b, x + a, a * c, x - a], `x/${a} = ${c} − ${b} = ${c - b}, so x = ${a} × ${c - b} = ${x}.`); },
      R => { const kind = R.int(0, 1);
        if (kind) { const n = R.int(4, 40), S = 3 * n + 3; return num(R, `The sum of three consecutive integers is ${S}. The smallest of them is`, n, [n + 1, n + 2, S / 3 + 1, n - 1], `Let the integers be x, x + 1, x + 2. Then 3x + 3 = ${S}, so x = ${n}.`); }
        const son = R.int(5, 20), k = R.int(2, 4), S = son * (k + 1);
        return num(R, `A father is ${k} times as old as his son. The sum of their ages is ${S} years. The son's age is (in years)`, son, [son * k, S - son, son + 1, S / 2], `x + ${k}x = ${S}, so ${k + 1}x = ${S} and x = ${son}.`); },
    ],
    [
      R => { let x, c, d, a, b, t = 0; do { x = R.int(1, 12); c = R.int(1, 5); d = R.int(2, 6); b = R.int(1, 9); const top = c * (x + b); a = top / d - x; t++; } while ((!Number.isInteger(a) || a < 1 || c >= d) && t < 400);
        if (!Number.isInteger(a)) return null;
        return num(R, `Solve: $\\frac{x + ${a}}{x + ${b}} = \\frac{${c}}{${d}}$`, x, [x + 1, a + b, c + d, x - 1 || 7], `Cross-multiply: ${d}(x + ${a}) = ${c}(x + ${b}), so ${d - c}x = ${c * b - d * a}... giving x = ${x}.`.replace(`${c * b - d * a}... giving`, `${c * b - d * a}, giving`)); },
      R => { const b = R.int(3, 14), k = R.int(2, 3), c = R.int(1, 5), P = 2 * ((k + 1) * b + c);
        return num(R, `The length of a rectangle is ${c} more than ${k} times its breadth. The perimeter is ${P} cm. The breadth is (in cm)`, b, [b * k + c, P / 2, b + c, b + 1], `Let breadth = x. Length = ${k}x + ${c}. Perimeter 2(x + ${k}x + ${c}) = ${P} gives ${k + 1}x = ${P / 2 - c}, so x = ${b}.`); },
      R => { const B = R.int(9, 25), A = 3 * (B - 5) + 5;
        return num(R, `Five years ago A was 3 times as old as B. Now the sum of their ages is ${A + B} years. B's present age is (in years)`, B, [A, B - 5, B + 5, (A + B) / 2], `A − 5 = 3(B − 5) and A + B = ${A + B}. So ${A + B} − B − 5 = 3B − 15, giving 4B = ${A + B + 10}... B = ${B}.`.replace('... B =', ', so B =')); },
    ],
  ],
};

/* ---------------- Algebraic Expressions and Identities ---------------- */
const algebra8 = {
  slug: 'algebraic-expressions-identities', label: 'Algebraic Expressions and Identities', levels: [
    [
      R => { const a = R.int(1, 9), b = R.int(-9, 9) || 4, c = R.int(1, 9), d = R.int(-9, 9) || 3;
        return mcq(R, `Add: $(${pstr([a, b])}) + (${pstr([c, d])})$`, m(pstr([a + c, b + d])), [m(pstr([a - c, b - d])), m(pstr([a + c, b - d])), m(pstr([a * c, b * d]))], 'Add the like terms: the x terms together and the numbers together.'); },
      R => { const a = R.int(1, 5), b = R.int(-6, 6), k = R.int(-3, 4), v = a * k * k + b * k + 2;
        return num(R, `Find the value of $${pstr([a, b, 2])}$ when $x = ${k}$.`, v, [a * k + b + 2, v + 2 * b, a * k * k + 2, -v], `Substitute x = ${k}: ${a}(${k * k}) + (${b})(${k}) + 2 = ${v}.`); },
      R => { const n = R.int(1, 4), terms = n + 1, name = ['monomial', 'binomial', 'trinomial', 'a polynomial with four terms', 'a polynomial with five terms'][n - 1 < 0 ? 0 : n - 1],
          co = [3, -5, 7, 2, 4].slice(0, n), ex = [3, 2, 1, 0, 4].slice(0, n), s = co.map((c, i) => `${i && c > 0 ? '+ ' : c < 0 ? (i ? '- ' : '-') : ''}${Math.abs(c)}${ex[i] === 0 ? '' : 'x' + (ex[i] === 1 ? '' : `^{${ex[i]}}`)}`).join(' ');
        return mcq(R, `The expression ${m(s)} is`, name, ['monomial', 'binomial', 'trinomial', 'a polynomial with four terms', 'a polynomial with five terms'].filter(z => z !== name), `It has ${n} term${n > 1 ? 's' : ''}.`); },
    ],
    [
      R => { const p = R.int(1, 4), q = R.int(1, 6); return mcq(R, `Expand $(${p === 1 ? '' : p}x + ${q})^2$`, m(pstr([p * p, 2 * p * q, q * q])), [m(pstr([p * p, p * q, q * q])), m(pstr([p * p, 2 * p * q, -q * q])), m(pstr([p, 2 * p * q, q]))], `(a + b)² = a² + 2ab + b² with a = ${p}x, b = ${q}.`); },
      R => { const p = R.int(1, 5), q = R.int(1, 8); return mcq(R, `Expand $(${p === 1 ? '' : p}x + ${q})(${p === 1 ? '' : p}x - ${q})$`, m(pstr([p * p, 0, -q * q])), [m(pstr([p * p, 0, q * q])), m(pstr([p * p, 2 * p * q, -q * q])), m(pstr([p * p, -2 * p * q, q * q]))], `(a + b)(a − b) = a² − b² = ${p * p === 1 ? '' : p * p}x² − ${q * q}.`); },
      R => { const a = R.int(2, 6), b = R.int(-7, 7) || 3, c = R.int(2, 6), mm = a * c; return mcq(R, `Multiply: $${a}x(${c}x ${b < 0 ? '-' : '+'} ${Math.abs(b)})$`, m(pstr([mm, a * b, 0])), [m(pstr([mm, b, 0])), m(pstr([a + c, a * b, 0])), m(pstr([mm, -a * b, 0]))], `${a}x × ${c}x = ${mm}x² and ${a}x × (${b}) = ${a * b}x.`); },
    ],
    [
      R => { const a = R.pick([53, 97, 98, 102, 103, 104, 52, 48, 47, 96]), d = a > 75 ? 100 - a : 50 - a; const lo = a > 75 ? a : a, hi = a > 75 ? 200 - a : 100 - a, base = a > 75 ? 100 : 50, e = Math.abs(base - a);
        return num(R, `Using an identity, find ${base - e} × ${base + e}.`, base * base - e * e, [base * base + e * e, base * base, base * base - 2 * e], `(${base} − ${e})(${base} + ${e}) = ${base}² − ${e}² = ${base * base} − ${e * e}.`); },
      R => { const a = R.int(2, 9), b = R.int(1, a - 1), s = a + b, q = a * a + b * b;
        return num(R, `If $a + b = ${s}$ and $a^2 + b^2 = ${q}$, find $ab$.`, a * b, [(s * s + q) / 2, s * s - q, a + b, a * b + 1], `(a + b)² = a² + b² + 2ab, so ${s * s} = ${q} + 2ab and ab = ${a * b}.`); },
      R => { const p = R.int(1, 6), q = R.int(1, 9), f = (x, y) => `(${x === 1 ? '' : x}x ${y < 0 ? '-' : '+'} ${Math.abs(y)})`;
        return mcq(R, `Factorise $${pstr([p * p, 0, -q * q])}$.`, m(`${f(p, -q)}${f(p, q)}`), [m(`${f(p, -q)}${f(p, -q)}`), m(`${f(p, q)}${f(p, q)}`), m(`${f(p * p, -q)}${f(1, q)}`)], `a² − b² = (a − b)(a + b) with a = ${p}x, b = ${q}.`); },
    ],
  ],
};

/* ---------------- Mensuration ---------------- */
const mens8 = {
  slug: 'mensuration', label: 'Mensuration', levels: [
    [
      R => { let a, b, h; do { a = R.int(4, 20); b = R.int(4, 20); h = R.int(3, 14); } while ((a + b) * h % 2);
        return num(R, `The parallel sides of a trapezium are ${a} cm and ${b} cm and the distance between them is ${h} cm. Its area (in cm²) is`, (a + b) * h / 2, [(a + b) * h / 2 + a, (a + b) * h, a * h, (a + b) / 2 + h], `Area = ½(a + b)h = ½ × ${a + b} × ${h} = ${(a + b) * h / 2}.`); },
      R => { const a = R.int(3, 15), t = R.chance(0.5);
        return num(R, `The ${t ? 'surface area (in cm²)' : 'volume (in cm³)'} of a cube of edge ${a} cm is`, t ? 6 * a * a : a ** 3, t ? [a * a, 4 * a * a, 6 * a] : [a * a, 3 * a, 6 * a * a], t ? 'Surface area = 6a².' : 'Volume = a³.'); },
      R => { let d1, d2; do { d1 = R.int(4, 20); d2 = R.int(4, 20); } while ((d1 * d2) % 2);
        return num(R, `The diagonals of a rhombus are ${d1} cm and ${d2} cm. Its area (in cm²) is`, d1 * d2 / 2, [d1 * d2, d1 + d2, d1 * d2 / 4], `Area = ½ × d₁ × d₂ = ½ × ${d1} × ${d2}.`); },
    ],
    [
      R => { const l = R.int(4, 15), b = R.int(3, 12), h = R.int(2, 10), k = R.int(0, 2);
        return num(R, `A cuboid is ${l} cm long, ${b} cm wide and ${h} cm high. Its ${['total surface area', 'lateral surface area', 'volume'][k]} (in ${k === 2 ? 'cm³' : 'cm²'}) is`, [2 * (l * b + b * h + h * l), 2 * h * (l + b), l * b * h][k], [l * b * h, l * b + b * h + h * l, 2 * l * b * h, 2 * (l + b + h)], ['TSA = 2(lb + bh + hl).', 'LSA = 2h(l + b).', 'V = lbh.'][k]); },
      R => { const j = R.int(1, 3), h = R.int(5, 25), csa = R.chance(0.5);
        return num(R, `A cylinder has radius ${7 * j} cm and height ${h} cm. Its ${csa ? 'curved surface area (in cm²)' : 'volume (in cm³)'} is (take π = 22/7)`, csa ? 44 * j * h : 154 * j * j * h, csa ? [22 * j * h, 154 * j * j * h, 88 * j * h] : [44 * j * h, 308 * j * j * h, 154 * j * h], csa ? `CSA = 2πrh = 2 × (22/7) × ${7 * j} × ${h}.` : `V = πr²h = (22/7) × ${49 * j * j} × ${h}.`); },
      R => { const l = R.int(4, 12), b = R.int(3, 10), V = l * b * R.int(2, 9);
        return num(R, `The volume of a cuboid is ${V} cm³ and its base is ${l} cm by ${b} cm. Its height is (in cm)`, V / (l * b), [V / l, V / (l * b) + 1, V - l * b, 2 * V / (l * b)], `Height = volume/(l × b) = ${V}/${l * b}.`); },
    ],
    [
      R => { const l = R.pick([20, 30, 40, 50, 60]), b = R.pick([20, 25, 40, 50]), h = R.pick([10, 20, 30, 40]), L = l * b * h / 1000;
        return num(R, `A tank is ${l} cm long, ${b} cm wide and ${h} cm deep. How many litres of water can it hold? (1 litre = 1000 cm³)`, L, [L * 10, L / 10, l * b * h, 2 * L], `Volume = ${l} × ${b} × ${h} = ${l * b * h} cm³ = ${L} litres.`); },
      R => { const l = R.int(4, 12), b = R.int(3, 8), h = R.int(2, 6), rate = R.pick([5, 10, 20]), A = 2 * (l * b + b * h + h * l);
        return num(R, `A closed box measures ${l} m × ${b} m × ${h} m. The cost of painting its whole outer surface at Rs ${rate} per m² is`, A * rate, [A, l * b * h * rate, A * rate / 2, (A + l * b) * rate], `Surface area = 2(lb + bh + hl) = ${A} m². Cost = ${A} × ${rate} = ${A * rate}.`, rs); },
      R => { const j = R.int(1, 2), h = R.int(3, 15), V = 154 * j * j * h;
        return num(R, `The volume of a cylinder of radius ${7 * j} cm is ${V} cm³. Its height is (in cm) (take π = 22/7)`, h, [h * 7, h + j, V / 154, 2 * h], `V = (22/7) × ${49 * j * j} × h = ${154 * j * j}h, so h = ${h}.`); },
    ],
  ],
};

/* ---------------- Understanding Quadrilaterals ---------------- */
const quad8 = {
  slug: 'understanding-quadrilaterals', label: 'Understanding Quadrilaterals', levels: [
    [
      R => { const a = R.int(60, 110), b = R.int(70, 110), c = R.int(70, 110);
        return num(R, `Three angles of a quadrilateral are ${a}${D}, ${b}${D} and ${c}${D}. The fourth angle is`, 360 - a - b - c, [a + b + c, 180 - a - b, 360 - a - b], 'The angles of a quadrilateral add up to 360°.', x => `${x}${D}`); },
      R => { const n = R.int(5, 12);
        return num(R, `The sum of the interior angles of a polygon with ${n} sides is`, (n - 2) * 180, [n * 180, (n - 1) * 180, (n - 2) * 90, 360], `Sum = (n − 2) × 180° = ${n - 2} × 180°.`, x => `${x}${D}`); },
      R => { const n = R.pick([3, 4, 5, 6, 8, 9, 10, 12]);
        return num(R, `Each exterior angle of a regular polygon with ${n} sides is`, 360 / n, [180 / n, 360 / (n + 1), 180 - 360 / n, 360 - n], 'The exterior angles of any polygon add up to 360°, so each is 360°/n.', x => `${x}${D}`); },
    ],
    [
      R => { const n = R.pick([5, 6, 8, 9, 10, 12, 15]), ang = (n - 2) * 180 / n;
        return num(R, `Each interior angle of a regular polygon with ${n} sides is`, ang, [360 / n, ang + 10, ang - 10, 180 - 360 / n + 20], `Interior angle = (${n} − 2) × 180°/${n} = ${ang}°.`, x => `${x}${D}`); },
      R => { const a = R.int(50, 120), adj = R.chance(0.5);
        return num(R, `One angle of a parallelogram is ${a}${D}. The ${adj ? 'adjacent' : 'opposite'} angle is`, adj ? 180 - a : a, [adj ? a : 180 - a, 360 - a, 90], adj ? 'Adjacent angles of a parallelogram add up to 180°.' : 'Opposite angles of a parallelogram are equal.', x => `${x}${D}`); },
      R => { const e = R.pick([10, 12, 15, 18, 20, 24, 30, 36, 40, 45]);
        return num(R, `Each exterior angle of a regular polygon is ${e}${D}. The number of sides is`, 360 / e, [180 / e, 360 / e + 1, e, 360 - e], 'Number of sides = 360°/exterior angle.'); },
    ],
    [
      R => { const i = R.pick([108, 120, 135, 140, 144, 150, 156]), n = 360 / (180 - i);
        return num(R, `Each interior angle of a regular polygon is ${i}${D}. The number of sides is`, n, [n + 1, n - 1, i / 18, 360 / i], `Exterior angle = 180° − ${i}° = ${180 - i}°. Sides = 360/${180 - i} = ${n}.`); },
      R => { const n = R.int(5, 14);
        return num(R, `How many diagonals does a polygon with ${n} sides have?`, n * (n - 3) / 2, [n * (n - 1) / 2, n * (n - 3), n - 3, n * (n - 2) / 2], `Diagonals = n(n − 3)/2 = ${n} × ${n - 3}/2.`); },
      R => { const d = R.pick([2, 4, 6, 8, 10, 12]), x = (360 - 6 * d) / 4;
        return num(R, `The angles of a quadrilateral are x, x + ${d}, x + ${2 * d} and x + ${3 * d} degrees. The largest angle is`, x + 3 * d, [x, x + 2 * d, 360 - x, x + 3 * d + 10], `4x + ${6 * d} = 360, so x = ${x}. The largest is x + ${3 * d} = ${x + 3 * d}°.`, y => `${y}${D}`); },
    ],
  ],
};

/* ---------------- Ratio, Proportion and Variation ---------------- */
const ratio8 = {
  slug: 'ratio-proportion-variation', label: 'Ratio, Proportion and Variation', levels: [
    [
      R => { const [a, b] = coprime(R, 1, 9), k = R.int(2, 8);
        return mcq(R, `The ratio ${a * k} : ${b * k} in its simplest form is`, `${a} : ${b}`, [`${b} : ${a}`, `${a * k} : ${b}`, `${a + 1} : ${b + 1}`, `${a} : ${b * 2}`], `Divide both terms by ${k}.`); },
      R => { const a = R.int(2, 9), b = R.int(3, 12), c = R.int(2, 10); return num(R, `Find x if ${a} : ${b} = ${a * c} : x`, b * c, [b, a * c, b + c, a + b], `${a}/${b} = ${a * c}/x, so x = ${b} × ${c} = ${b * c}.`); },
      R => { const [a, b] = coprime(R, 1, 6), u = R.int(2, 15), N = (a + b) * u * 10;
        return num(R, `Rs ${N} is divided between two friends in the ratio ${a} : ${b}. The first friend gets`, a * u * 10, [b * u * 10, N / 2, a * u * 10 + 10, N / (a + b) * 2], `Total parts = ${a + b}. One part = ${N}/${a + b} = ${u * 10}. First share = ${a} × ${u * 10}.`, rs); },
    ],
    [
      R => { const n = R.int(3, 9), p = R.int(8, 30), n2 = R.int(n + 2, 15);
        return num(R, `${n} pens cost Rs ${n * p}. The cost of ${n2} pens is`, n2 * p, [n2 + p, n * p + n2, p * (n2 - n), n2 * p / 2], `One pen costs ${n * p}/${n} = ${p}. ${n2} pens cost ${n2} × ${p} = ${n2 * p}.`, rs); },
      R => { const w = R.pick([6, 8, 10, 12, 15]), d = R.pick([6, 8, 10, 12, 15, 20]), total = w * d, w2 = R.pick([4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60].filter(x => total % x === 0 && x !== w));
        return num(R, `${w} workers can finish a job in ${d} days. In how many days can ${w2} workers finish it?`, total / w2, [d * w2 / w, d + 2, d - 2, total / w2 + 5], `More workers means fewer days (inverse variation) for the same job. Days = ${w} × ${d}/${w2} = ${total / w2}.`); },
      R => { const s1 = R.pick([40, 50, 60, 80]), s2 = R.pick([50, 60, 75, 100]), t = 15 * R.int(1, 3) * s2 / gcd(s2, 15) / 1; const T = (s2 / gcd(s1, s2)) * R.int(1, 2), dist = s1 * T;
        if (dist % s2) return null;
        return num(R, `A car at ${s1} km/h takes ${T} hours for a journey. At ${s2} km/h it will take (in hours)`, dist / s2, [T, dist / s2 + 1, s2 * T / s1 * 2, T * s2 / s1 + 0.5].map(v => +v.toFixed(2)), `Distance = ${s1} × ${T} = ${dist} km. Time at ${s2} km/h = ${dist}/${s2} = ${dec(dist / s2)} hours.`); },
    ],
    [
      R => { let m1, d1, w1, m2, w2, d2, t = 0; do { m1 = R.pick([6, 8, 10, 12, 15]); d1 = R.pick([6, 8, 10, 12]); w1 = R.pick([10, 12, 15, 20]); m2 = R.pick([8, 10, 12, 20, 24, 30]); w2 = R.pick([15, 20, 25, 30, 40]); d2 = m1 * d1 * w2 / (m2 * w1); t++; } while ((!Number.isInteger(d2) || d2 === d1) && t < 500);
        if (!Number.isInteger(d2)) return null;
        return num(R, `${m1} men build ${w1} m of a wall in ${d1} days. In how many days will ${m2} men build ${w2} m of the same wall?`, d2, [d1, d2 + 2, d2 * 2, d2 - 1 || 9], `Men × days is proportional to the length: days = (${m1} × ${d1} × ${w2})/(${m2} × ${w1}) = ${d2}.`); },
      R => { const [a, b, c] = [R.int(1, 5), R.int(2, 7), R.int(3, 9)].sort((x, y) => x - y), u = R.int(2, 12), N = (a + b + c) * u;
        return num(R, `Rs ${N} is divided in the ratio ${a} : ${b} : ${c}. The difference between the largest and the smallest share is`, (c - a) * u, [N / (a + b + c), c * u, (c + a) * u, (c - b) * u], `One part = ${N}/${a + b + c} = ${u}. Difference = (${c} − ${a}) × ${u} = ${(c - a) * u}.`, rs); },
      R => { const [p, q] = coprime(R, 1, 6), [r, s] = coprime(R, 2, 7), n = p * r, d = q * s, g = gcd(n, d);
        return mcq(R, `If a : b = ${p} : ${q} and b : c = ${r} : ${s}, then a : c =`, `${n / g} : ${d / g}`, [`${p} : ${s}`, `${q * r / gcd(q * r, p * s)} : ${p * s / gcd(q * r, p * s)}`, `${p + r} : ${q + s}`, `${n / g + 1} : ${d / g}`], `a : c = (${p} × ${r}) : (${q} × ${s}) = ${n} : ${d} = ${n / g} : ${d / g}.`); },
    ],
  ],
};

/* ---------------- Data Handling and Probability ---------------- */
const data8 = {
  slug: 'data-handling-probability', label: 'Data Handling and Probability', levels: [
    [
      R => { const mean = R.int(10, 40), v = Array.from({ length: 4 }, () => mean + R.int(-8, 8)), last = 5 * mean - v.reduce((s, x) => s + x, 0), all = R.shuffle([...v, last]);
        return num(R, `Find the mean of ${all.join(', ')}.`, mean, [mean + 1, mean - 1, all[0]], `Sum = ${5 * mean}, divided by 5 gives ${mean}.`); },
      R => { const base = R.shuffle(Array.from({ length: 30 }, (_, i) => i + 5)).slice(0, 5), s = base.slice().sort((a, b) => a - b);
        return num(R, `Find the median of ${base.join(', ')}.`, s[2], [s[1], s[3], base[2] === s[2] ? s[0] : base[2]], `Arranged: ${s.join(', ')}. The middle value is ${s[2]}.`); },
      R => { const ev = R.pick([['an even number', x => x % 2 === 0], ['a number greater than 4', x => x > 4], ['a multiple of 3', x => x % 3 === 0], ['an odd number', x => x % 2 === 1]]), c = [1, 2, 3, 4, 5, 6].filter(ev[1]).length;
        return mcq(R, `A die is thrown once. The probability of getting ${ev[0]} is`, m(fr(c, 6)), [m(fr(c + 1, 6)), m(fr(6 - c, 7)), m(fr(c, 5)), m(fr(c, 12))].filter(z => z !== m(fr(c, 6))), `${c} of the 6 outcomes are favourable.`); },
    ],
    [
      R => { const N = R.pick([20, 30, 40, 60, 90, 120]), a = R.int(1, 5) * N / 10 | 0 || 1, deg = 360 * a / N;
        if (!Number.isInteger(deg)) return null;
        return num(R, `In a pie chart of ${N} students, ${a} like cricket. The angle of the sector for cricket is`, deg, [a, 360 - deg, deg / 2, deg + 10], `Angle = (${a}/${N}) × 360° = ${deg}°.`, x => `${x}${D}`); },
      R => { const r = R.int(2, 9), b = R.int(2, 9);
        return mcq(R, `A bag has ${r} red and ${b} blue balls. The probability of picking a red ball is`, m(fr(r, r + b)), [m(fr(b, r + b)), m(fr(r, b)), m(fr(r + 1, r + b)), m(fr(r, r + b + 1))].filter(z => z !== m(fr(r, r + b))), `P = ${r}/${r + b}.`); },
      R => { const ev = R.pick([['two heads', 1], ['at least one head', 3], ['exactly one head', 2], ['no head', 1]]);
        return mcq(R, `Two coins are tossed together. The probability of getting ${ev[0]} is`, m(fr(ev[1], 4)), ['\\frac{1}{4}', '\\frac{1}{2}', '\\frac{3}{4}', '1', '\\frac{1}{3}'].filter(z => z !== fr(ev[1], 4)).map(m), `The 4 outcomes are HH, HT, TH, TT. ${ev[1]} favourable.`); },
    ],
    [
      R => { const p = R.pick([0.15, 0.25, 0.35, 0.4, 0.55, 0.6, 0.7, 0.85]);
        return num(R, `The probability that it rains tomorrow is ${p}. The probability that it does not rain is`, +(1 - p).toFixed(2), [p, +(1 + p).toFixed(2), +(p / 2).toFixed(2), +(1 - p + 0.1).toFixed(2)], 'P(not E) = 1 − P(E).'); },
      R => { const n = R.int(5, 9), mean = R.int(10, 30), c = R.int(2, 8);
        return num(R, `The mean of ${n} numbers is ${mean}. If ${c} is added to each number, the new mean is`, mean + c, [mean * c, mean, mean + c * n, mean - c], 'Adding a number to every observation adds it to the mean.'); },
      R => { let x, f, N, S, t = 0; do { x = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 4).sort((a, b) => a - b); f = x.map(() => R.int(2, 8)); N = f.reduce((s, v) => s + v, 0); S = x.reduce((s, v, i) => s + v * f[i], 0); } while (S % N && ++t < 3000);
        return num(R, `The values ${x.join(', ')} occur with frequencies ${f.join(', ')} respectively. The mean is`, S / N, [S / N + 1, S / N - 1, x.reduce((s, v) => s + v, 0) / 4], `Mean = Σfx/Σf = ${S}/${N} = ${dec(S / N)}.`); },
    ],
  ],
};

export const CLASS8 = [roots, exponents, percent, interest, linear1, algebra8, mens8, quad8, ratio8, data8].map(c => ({ ...c, cls: 'class-8' }));
