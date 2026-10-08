import { mcq, num, ord } from './util';

// Olympiad practice (SOF IMO style): Mental Ability and Everyday Mathematics. Each chapter has three lists of templates
// (Easy, Medium, Hard). A template takes the random generator R and returns { q, o, a, w }. Every answer is worked out by
// the template itself, so a question can never disagree with its explanation.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const shiftWord = (w, k) => [...w].map(c => ALPHA[(((ALPHA.indexOf(c) + k) % 26) + 26) % 26]).join('');
const WORDS = ['MATH', 'CODE', 'STAR', 'BOOK', 'LAMP', 'TREE', 'PLAN', 'GAME', 'FISH', 'RAIN', 'MILK', 'DESK', 'KITE', 'BELL', 'CAKE'];
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]];
const rs = x => `Rs ${x}`;
const NAMES = ['Ravi', 'Sita', 'Anil', 'Meena', 'Karan', 'Priya', 'Arjun', 'Neha'];

/* ---------------- Mental Ability ---------------- */
const mental = {
  slug: 'mental-ability', label: 'Mental Ability', levels: [
    [
      R => { const a = R.int(2, 20), d = R.int(2, 9), s = [0, 1, 2, 3, 4].map(i => a + i * d), ans = a + 5 * d;
        return num(R, `Find the next number in the series: ${s.join(', ')}, ?`, ans, [ans + d, ans - d, ans + 1, a + 6 * d],
          `The numbers go up by ${d} each time, so the next number is ${s[4]} + ${d} = ${ans}.`); },
      R => { const k = R.pick([3, 4, 5, 6, 7, 8, 9]), ms = R.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 3).map(x => x * k), odd = k * R.int(2, 12) + R.int(1, k - 1);
        return mcq(R, 'Which number is the odd one out?', String(odd), ms.map(String), `${ms.join(', ')} are all multiples of ${k}. ${odd} is not a multiple of ${k}, so it is the odd one out.`); },
      R => { const letters = R.shuffle('ABCDEFGHI'.split('')).slice(0, 3), vals = letters.map(c => ALPHA.indexOf(c) + 1), ans = vals.reduce((a, b) => a + b, 0);
        return num(R, `If A = 1, B = 2, C = 3 and so on, what is the sum of the values of the letters in ${letters.join('')}?`, ans, [ans + 1, ans - 1, ans + 2, vals[0] * vals[1] * vals[2]],
          `${letters.map((c, i) => `${c} = ${vals[i]}`).join(', ')}. The sum is ${vals.join(' + ')} = ${ans}.`); },
    ],
    [
      R => { const a = R.int(1, 9), d = R.int(1, 4), s = [a]; for (let i = 0; i < 5; i++) s.push(s[i] + d + i);
        const shown = s.slice(0, 5), ans = s[5], diffs = shown.slice(1).map((x, i) => x - shown[i]);
        return num(R, `Find the next number in the series: ${shown.join(', ')}, ?`, ans, [ans + 1, ans - 1, shown[4] + d + 3, ans + 2],
          `The gaps are ${diffs.join(', ')}, and each gap is 1 more than the one before. The next gap is ${d + 4}, so the next number is ${shown[4]} + ${d + 4} = ${ans}.`); },
      R => { const w = R.pick(WORDS), k = R.int(1, 4), ans = shiftWord(w, k), s = k > 1 ? 's' : '';
        return mcq(R, `In a certain code, each letter is replaced by the letter ${k} place${s} after it in the alphabet. How is ${w} written in this code?`, ans,
          [shiftWord(w, k + 1), shiftWord(w, k - 1), shiftWord(w, k + 2), shiftWord(w, -k)], `Move every letter ${k} step${s} forward: ${[...w].map((c, i) => `${c} becomes ${ans[i]}`).join(', ')}.`,
          () => [shiftWord(w, k + 3), shiftWord(w, k + 4), shiftWord(w, 5)]); },
      R => { const [a, b, c] = R.pick(TRI), name = R.pick(NAMES), t = R.pick([1, 1, 2]);
        const A = a * t, B = b * t, C = c * t;
        return num(R, `${name} walks ${A} m towards the east and then ${B} m towards the north. How far is ${name} from the starting point, in a straight line?`, C, [A + B, B - A, Math.round((A + B) / 2), C + t],
          `The two walks make the sides of a right-angled triangle. The distance is the longest side: the square root of ${A}² + ${B}² = ${A * A + B * B}, which is ${C} m.`); },
      R => { const h = R.int(1, 11), ang = Math.min(30 * h, 360 - 30 * h);
        return num(R, `What is the angle between the hour hand and the minute hand of a clock at ${h}:00?`, ang, [ang + 30, Math.max(0, ang - 30), 360 - ang, ang + 60].filter(x => x !== ang),
          `Each hour mark is 30° apart, and at ${h}:00 the minute hand is at 12. The angle is ${h <= 6 ? `${h} × 30° = ${ang}°` : `360° − ${h} × 30° = ${ang}°`}.`, x => `${x}°`); },
    ],
    [
      R => { const a = R.int(1, 12), b = R.int(30, 60), d1 = R.int(2, 5), d2 = R.int(6, 9), s = [a, b, a + d1, b + d2, a + 2 * d1, b + 2 * d2], ans = a + 3 * d1;
        return num(R, `Find the next number in the series: ${s.join(', ')}, ?`, ans, [b + 3 * d2, ans + d1, ans - 1, ans + 1],
          `Two series are mixed. Numbers in 1st, 3rd, 5th places go up by ${d1}: ${a}, ${a + d1}, ${a + 2 * d1}. The 7th number continues this: ${a + 2 * d1} + ${d1} = ${ans}. (The other series goes up by ${d2}.)`); },
      R => { const idx = R.int(0, 6), N = R.int(20, 100), ans = DAYS[(idx + N) % 7];
        return mcq(R, `Today is ${DAYS[idx]}. What day of the week will it be after ${N} days?`, ans, [DAYS[(idx + N + 1) % 7], DAYS[(idx + N + 6) % 7], DAYS[(idx + N + 2) % 7]],
          `A week has 7 days. ${N} ÷ 7 leaves remainder ${N % 7}, so move ${N % 7} day${N % 7 === 1 ? '' : 's'} forward from ${DAYS[idx]}. That is ${ans}.`, () => DAYS); },
      R => { const p = R.int(5, 20), q = R.int(5, 20), n = R.pick(NAMES);
        return num(R, `In a row of students, ${n} is ${ord(p)} from the left and ${ord(q)} from the right. How many students are there in the row?`, p + q - 1, [p + q, p + q - 2, Math.abs(p - q), p * q % 50 + 5],
          `${n} is counted twice, once from each side. So the total is ${p} + ${q} − 1 = ${p + q - 1}.`); },
      R => { const c = R.int(1, 3), t = n => n * n + c * n, shown = [1, 2, 3, 4, 5].map(t), ans = t(6);
        return num(R, `Find the next number in the series: ${shown.join(', ')}, ?`, ans, [ans + 2, ans - 2, shown[4] + 12 + c, ans + c],
          `The terms follow the rule n² + ${c === 1 ? '' : c}n (for 1, 2, 3 ...). For the 6th term: 36 + ${6 * c} = ${ans}.`); },
    ],
  ],
};

/* ---------------- Everyday Mathematics ---------------- */
const everyday = {
  slug: 'everyday-mathematics', label: 'Everyday Mathematics', levels: [
    [
      R => { const P = R.int(5, 60) * 20, d = R.pick([10, 15, 20, 25, 30, 40, 50]), ans = P * (100 - d) / 100;
        return num(R, `A shirt is marked at ${rs(P)}. A shop gives a discount of ${d}%. What is the price after the discount?`, ans, [P * d / 100, P - d, P + P * d / 100], `The discount is ${d}% of ${P} = ${P * d / 100}. The price is ${P} − ${P * d / 100} = ${rs(ans)}.`, x => rs(x)); },
      R => { const n = R.int(5, 7), a = R.int(15, 30), diff = R.int(1, 3), b = a - diff, x = a + (n - 1) * diff;
        return num(R, `The average of ${n} numbers is ${a}. When one number, ${x}, is removed, what is the average of the remaining ${n - 1} numbers?`, b, [a, b - 1, b + 1, a + 1],
          `The total of the ${n} numbers is ${n} × ${a} = ${n * a}. Without ${x}, the total is ${n * a - x}. The average is ${n * a - x} ÷ ${n - 1} = ${b}.`); },
      R => { const s = R.int(3, 8) * 10, t = R.int(2, 6), back = R.chance(0.5);
        return back ? num(R, `A car covers ${s * t} km in ${t} hours at a steady speed. What is its speed in km per hour?`, s, [s + 10, s - 10, s * t, s / 2], `Speed = distance ÷ time = ${s * t} ÷ ${t} = ${s} km per hour.`)
          : num(R, `A bus travels at ${s} km per hour for ${t} hours. How far does it go, in km?`, s * t, [s + t, s * (t + 1), s * (t - 1), s * t + 10], `Distance = speed × time = ${s} × ${t} = ${s * t} km.`); },
    ],
    [
      R => { const CP = R.int(5, 50) * 20, p = R.pick([5, 10, 15, 20, 25]), ans = CP + CP * p / 100;
        return num(R, `A shopkeeper buys an article for ${rs(CP)} and sells it at a profit of ${p}%. At what price does he sell it?`, ans, [CP * p / 100, CP - CP * p / 100, CP + p], `Profit = ${p}% of ${CP} = ${CP * p / 100}. Selling price = ${CP} + ${CP * p / 100} = ${rs(ans)}.`, x => rs(x)); },
      R => { const [x, y, t] = R.pick([[12, 24, 8], [10, 15, 6], [20, 30, 12], [6, 12, 4], [15, 30, 10], [12, 12, 6], [18, 36, 12], [30, 60, 20]]);
        return num(R, `Asha can do a piece of work in ${x} days and Bela can do it in ${y} days. Working together, in how many days will they finish it?`, t, [(x + y) / 2, x + y, Math.abs(x - y) + 1],
          `In one day they do 1/${x} + 1/${y} = ${(x + y)}/${x * y} of the work. So they finish in ${x * y} ÷ ${x + y} = ${t} days.`); },
      R => { const a = R.int(2, 7), b = R.pick([3, 4, 5, 6, 7, 8]), k = R.int(20, 90); if (a === b) throw new Error('same');
        return num(R, `${rs(k * (a + b))} is divided between Ravi and Sita in the ratio ${a} : ${b}. How much does Sita get?`, k * b, [k * a, k * (a + b) / 2, k * (b + 1), k * b + k], `There are ${a} + ${b} = ${a + b} equal parts, and each part is ${rs(k)}. Sita gets ${b} parts = ${rs(k * b)}.`, x => rs(x)); },
      R => { const P = R.int(2, 20) * 500, r = R.int(4, 10), t = R.int(2, 5), ans = P * r * t / 100;
        return num(R, `Find the simple interest on ${rs(P)} for ${t} years at ${r}% per year.`, ans, [ans + P, P * r / 100, ans * 2, P * r * t / 10], `Simple interest = (P × R × T) ÷ 100 = (${P} × ${r} × ${t}) ÷ 100 = ${rs(ans)}.`, x => rs(x)); },
    ],
    [
      R => { const [a, b] = R.pick([[20, -10], [10, 10], [20, -20], [50, -20], [-10, -10], [25, -20]]), net = Math.round((100 + a) * (100 + b) / 100) - 100;
        const f = x => (x > 0 ? `${x}% increase` : x < 0 ? `${-x}% decrease` : 'no change'), word = x => (x > 0 ? `rises by ${x}%` : `falls by ${-x}%`);
        return mcq(R, `The price of an article first ${word(a)} and then ${word(b)}. What is the net change in the price?`, f(net), [f(a + b), f(net + 2), f(net - 2), f(net * 2 || 4)],
          `Take the price as 100. After the first change it is ${100 + a}. After the second it is ${100 + a} × ${100 + b} ÷ 100 = ${100 + net}. So the net change is ${f(net)}. (Adding the two percentages is the usual mistake.)`, () => [f(net + 5), f(net - 5), f(net + 4)]); },
      R => { const [u, v, avg] = R.pick([[30, 60, 40], [40, 60, 48], [20, 30, 24], [60, 90, 72], [50, 75, 60], [12, 24, 16], [40, 120, 60]]);
        return num(R, `A man goes from A to B at ${u} km per hour and comes back by the same road at ${v} km per hour. What is his average speed for the whole journey, in km per hour?`, avg, [(u + v) / 2, u + v - avg, avg + 2, avg - 2],
          `For equal distances, average speed = 2uv ÷ (u + v) = (2 × ${u} × ${v}) ÷ ${u + v} = ${avg} km per hour. (It is not the simple average ${(u + v) / 2}.)`); },
      R => { const [kmh, v] = R.pick([[18, 5], [36, 10], [54, 15], [72, 20], [90, 25]]), t = R.int(Math.ceil(200 / v), 40), tot = v * t, L = R.pick([100, 120, 150].filter(x => x < tot - 40)), P = tot - L;
        return num(R, `A train ${L} m long runs at ${kmh} km per hour. How many seconds does it take to cross a platform ${P} m long?`, t, [t + 5, t - 5, Math.round(P / v), t * 2],
          `${kmh} km per hour = ${kmh} × 5 ÷ 18 = ${v} m per second. The train must cover its own length and the platform: ${L} + ${P} = ${tot} m. Time = ${tot} ÷ ${v} = ${t} seconds.`); },
      R => { const s = R.int(8, 16), k = R.pick([3, 4]), n = R.int(4, 10), T = (k + 1) * s + 2 * n;
        return num(R, `A father is ${k} times as old as his son. After ${n} years, the sum of their ages will be ${T} years. What is the son's present age, in years?`, s, [s + 1, s - 1, k * s, s + n],
          `Let the son be x years, so the father is ${k}x. After ${n} years: (${k}x + ${n}) + (x + ${n}) = ${T}. So ${k + 1}x = ${T - 2 * n} and x = ${s}.`); },
    ],
  ],
};

export const OLYMPIAD = [mental, everyday].map(c => ({ ...c, cls: 'olympiad' }));
