// Illustrations drawn for MathSetu as inline SVG, so they are sharp at any size and need no image files.
// They are decoration: each is hidden from screen readers. Movement is added in globals.css (see "art and motion").
const O = '#f15d22', B = '#5e91ff', P = '#9795f0', Y = '#ffc533', G = '#3fbf7f', INK = '#413930', SKIN = '#f6c9a3', HAIR = '#3a2a22';
const Svg = ({ box, className, children }) => <svg viewBox={box} className={className} aria-hidden="true" focusable="false">{children}</svg>;

// A child's face: used by the larger pictures. (cx, cy) is the centre of the head and r its radius.
const Face = ({ cx, cy, r = 30, smile = true }) => (<g>
  <circle cx={cx} cy={cy} r={r} fill={SKIN} />
  <path d={`M${cx - r} ${cy - 2}a${r} ${r} 0 0 1 ${2 * r} 0c${-r * .25} ${-r * .45} ${-r * .7} ${-r * .55} ${-r} ${-r * .55}s${-r * .75} ${r * .1} ${-r} ${r * .55}z`} fill={HAIR} />
  <g className="blink"><circle cx={cx - r * .33} cy={cy + r * .08} r={r * .1} fill={INK} /><circle cx={cx + r * .33} cy={cy + r * .08} r={r * .1} fill={INK} /></g>
  <circle cx={cx - r * .55} cy={cy + r * .38} r={r * .15} fill="#f29b8b" opacity=".6" /><circle cx={cx + r * .55} cy={cy + r * .38} r={r * .15} fill="#f29b8b" opacity=".6" />
  <path d={smile ? `M${cx - r * .3} ${cy + r * .4}q${r * .3} ${r * .3} ${r * .6} 0` : `M${cx - r * .25} ${cy + r * .55}q${r * .25} ${-r * .22} ${r * .5} 0`} fill="none" stroke={INK} strokeWidth={r * .08} strokeLinecap="round" />
</g>);

// Clouds and maths symbols that drift behind the hero.
export function Sky() {
  const cloud = 'M20 45h78a17 17 0 0 0 2-34 24 24 0 0 0-45-6 20 20 0 0 0-35 14A13 13 0 0 0 20 45z';
  return (<div className="sky" aria-hidden="true">
    {[1, 2, 3, 4].map(n => <svg key={n} viewBox="0 0 120 50" className={`cloud c${n}`}><path d={cloud} fill="#fff" /></svg>)}
    {['+', '÷', 'π', '√', '%', '×', '=', '∑'].map((s, i) => <span key={s} className={`doodle d${i + 1}`}>{s}</span>)}
  </div>);
}

// A child peeking over the top of the demo form.
export const Peek = () => (<>
  <Svg box="0 0 120 80" className="peek"><Face cx={60} cy={52} r={34} /></Svg>
  <Svg box="0 0 120 20" className="peek-hands"><rect x="14" y="2" width="26" height="16" rx="8" fill={SKIN} /><rect x="80" y="2" width="26" height="16" rx="8" fill={SKIN} /></Svg>
</>);

// A child studying at a laptop, with an idea lighting up.
export const KidStudy = ({ className = '' }) => (<Svg box="0 0 320 230" className={`art ${className}`}>
  <ellipse cx="160" cy="214" rx="130" ry="10" fill={INK} opacity=".08" />
  <g className="float-slow"><circle cx="232" cy="46" r="20" fill={Y} /><rect x="225" y="64" width="14" height="9" rx="2" fill={INK} />
    <path d="M232 14v-9M258 22l7-6M206 22l-7-6M268 46h9M187 46h9" stroke={Y} strokeWidth="4" strokeLinecap="round" /></g>
  <text x="52" y="52" fontSize="26" fontWeight="700" fill={B} className="float-a">+</text>
  <text x="282" y="118" fontSize="24" fontWeight="700" fill={P} className="float-b">π</text>
  <text x="30" y="122" fontSize="22" fontWeight="700" fill={O} className="float-b">√</text>
  <rect x="78" y="118" width="78" height="76" rx="30" fill={O} />
  <Face cx={117} cy={88} r={32} />
  <rect x="28" y="184" width="264" height="14" rx="7" fill="#c98a5b" /><rect x="52" y="198" width="10" height="20" fill="#a86f45" /><rect x="258" y="198" width="10" height="20" fill="#a86f45" />
  <rect x="170" y="106" width="100" height="70" rx="8" fill={INK} /><rect x="177" y="113" width="86" height="56" rx="4" fill="#eef4ff" />
  <rect x="186" y="146" width="10" height="16" rx="2" fill={B} /><rect x="202" y="136" width="10" height="26" rx="2" fill={P} /><rect x="218" y="126" width="10" height="36" rx="2" fill={O} /><rect x="234" y="120" width="10" height="42" rx="2" fill={G} />
  <rect x="158" y="176" width="124" height="8" rx="4" fill="#8b8fa3" />
  <path d="M148 150q16 8 26 24" fill="none" stroke={O} strokeWidth="15" strokeLinecap="round" /><circle cx="176" cy="176" r="8" fill={SKIN} />
</Svg>);

// The road from "I can't" to "I can": a dotted path with flags, and a star that travels along it.
const ROAD = 'M40 118C200 118 230 44 400 72S640 128 770 62 920 26 960 30';
export const Journey = () => (<Svg box="0 0 1000 150" className="art journey">
  <path d={ROAD} fill="none" stroke={B} strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
  {[[250, 82], [520, 96], [770, 62]].map(([x, y], i) => (<g key={x} className="flag" style={{ animationDelay: `${i * .4}s` }}>
    <path d={`M${x} ${y}v-34`} stroke={INK} strokeWidth="3" strokeLinecap="round" /><path d={`M${x} ${y - 34}l22 7-22 8z`} fill={[O, P, G][i]} /></g>))}
  <g><circle cx="40" cy="118" r="20" fill={Y} /><circle cx="33" cy="114" r="2.6" fill={INK} /><circle cx="47" cy="114" r="2.6" fill={INK} /><path d="M33 128q7-7 14 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" /></g>
  <g className="float-slow"><circle cx="960" cy="30" r="22" fill={Y} /><circle cx="952" cy="25" r="2.8" fill={INK} /><circle cx="968" cy="25" r="2.8" fill={INK} /><path d="M950 33q10 11 20 0" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" /></g>
  <path d="M0-11l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L0 5.5-6.5 8.9l1.3-7.2-5.3-5.1 7.3-1z" fill={O} stroke="#fff" strokeWidth="1.5">
    <animateMotion dur="8s" repeatCount="indefinite" path={ROAD} rotate="auto" /></path>
</Svg>);

// One picture for each point of the teaching approach, in the order of APPROACH in lib/data.js.
export function ApproachIcon({ i }) {
  const pics = [
    <g key="0"><circle cx="32" cy="27" r="14" fill={Y} /><rect x="26" y="40" width="12" height="8" rx="2" fill={INK} /><path d="M32 6v-4M50 12l3-3M14 12l-3-3M56 27h4M4 27h4" stroke={Y} strokeWidth="3.4" strokeLinecap="round" /><path d="M27 28l4 4 7-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>,
    <g key="1"><rect x="8" y="40" width="16" height="16" rx="3" fill={B} /><rect x="24" y="28" width="16" height="28" rx="3" fill={P} /><rect x="40" y="14" width="16" height="42" rx="3" fill={O} /><path d="M10 30l12-12 8 8 14-16" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>,
    <g key="2"><rect x="10" y="14" width="44" height="42" rx="7" fill="#fff" stroke={INK} strokeWidth="3" /><path d="M10 26h44" stroke={INK} strokeWidth="3" /><rect x="10" y="14" width="44" height="12" rx="6" fill={O} /><path d="M21 8v10M43 8v10" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      {[[20, 35], [32, 35], [44, 35], [20, 46], [32, 46]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="3.4" fill={G} />)}<circle cx="44" cy="46" r="3.4" fill="#e7ded5" /></g>,
    <g key="3"><circle cx="32" cy="36" r="20" fill="#fff" stroke={INK} strokeWidth="3" /><rect x="27" y="6" width="10" height="8" rx="2" fill={INK} /><path className="tick-hand" d="M32 36V22" stroke={O} strokeWidth="3.6" strokeLinecap="round" /><circle cx="32" cy="36" r="3" fill={INK} /><circle cx="50" cy="50" r="10" fill={G} /><path d="M45.5 50l3 3 6-6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></g>,
    <g key="4"><path d="M8 14h40a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H26l-12 10V46H8a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" fill={B} /><text x="28" y="38" fontSize="22" fontWeight="700" fill="#fff" textAnchor="middle">?</text><rect x="42" y="36" width="18" height="15" rx="4" fill={Y} /><path d="M46 36v-4a5 5 0 0 1 10 0v4" fill="none" stroke={INK} strokeWidth="2.6" /></g>,
    <g key="5"><path d="M6 10h32a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H22l-9 8v-8H6a6 6 0 0 1-6-6V16a6 6 0 0 1 6-6z" fill={O} /><text x="22" y="29" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">Hi!</text><path d="M30 34h26a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-2v7l-8-7H30a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6z" fill={P} /><text x="43" y="50" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">Aa</text></g>,
  ];
  return <Svg box="0 0 64 64" className="art pic">{pics[i % pics.length]}</Svg>;
}

// A picture for each programme: a book, a video and a live class.
export function PlanIcon({ i }) {
  const pics = [
    <g key="0"><path d="M32 16c-8-6-18-6-26-3v36c8-3 18-3 26 3 8-6 18-6 26-3V13c-8-3-18-3-26 3z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" /><path d="M32 16v36" stroke={INK} strokeWidth="3" /><path d="M12 24h12M12 32h12M12 40h9M40 24h12M40 32h12M40 40h9" stroke={O} strokeWidth="3" strokeLinecap="round" /></g>,
    <g key="1"><rect x="6" y="12" width="52" height="36" rx="7" fill={INK} /><rect x="10" y="16" width="44" height="28" rx="4" fill="#eef4ff" /><path d="M27 22l14 8-14 8z" fill={O} /><rect x="22" y="52" width="20" height="5" rx="2.5" fill={INK} /></g>,
    <g key="2"><rect x="6" y="12" width="52" height="36" rx="7" fill={INK} /><rect x="10" y="16" width="44" height="28" rx="4" fill="#fef1d8" /><circle cx="32" cy="27" r="6.5" fill={SKIN} /><path d="M20 44c0-7 5-10 12-10s12 3 12 10z" fill={O} /><circle className="pulse" cx="49" cy="21" r="3.6" fill="#e5322d" /><rect x="22" y="52" width="20" height="5" rx="2.5" fill={INK} /></g>,
  ];
  return <Svg box="0 0 64 64" className="art pic">{pics[i % pics.length]}</Svg>;
}

// A picture for each joining step: fill the form, get a call, attend the class.
export function StepArt({ i }) {
  const pics = [
    <g key="0"><rect x="44" y="6" width="52" height="88" rx="10" fill={INK} /><rect x="49" y="13" width="42" height="74" rx="5" fill="#fff" /><rect x="55" y="22" width="30" height="7" rx="3.5" fill="#eef4ff" /><rect x="55" y="34" width="30" height="7" rx="3.5" fill="#eef4ff" /><rect x="55" y="46" width="30" height="7" rx="3.5" fill="#eef4ff" /><rect className="pulse" x="55" y="62" width="30" height="12" rx="6" fill={O} /><path d="M108 30l10-6M110 46h12M108 62l10 6" stroke={Y} strokeWidth="4" strokeLinecap="round" /></g>,
    <g key="1"><circle cx="70" cy="50" r="30" fill={G} /><path d="M58 38c-2 2-3 5-1 9 3 7 9 13 16 16 4 2 7 1 9-1l2-3-7-5-3 2c-3-1-7-5-8-8l2-3-5-7z" fill="#fff" /><path className="ring r1" d="M104 34a26 26 0 0 1 0 32" fill="none" stroke={G} strokeWidth="4" strokeLinecap="round" /><path className="ring r2" d="M114 26a40 40 0 0 1 0 48" fill="none" stroke={G} strokeWidth="4" strokeLinecap="round" /></g>,
    <g key="2"><rect x="24" y="14" width="92" height="62" rx="8" fill={INK} /><rect x="30" y="20" width="80" height="50" rx="4" fill="#eef4ff" /><circle cx="56" cy="40" r="10" fill={SKIN} /><path d="M40 70c0-11 7-15 16-15s16 4 16 15z" fill={O} /><path d="M80 34h22M80 44h22M80 54h14" stroke={B} strokeWidth="4" strokeLinecap="round" /><rect x="14" y="76" width="112" height="8" rx="4" fill="#8b8fa3" /><g className="float-slow"><circle cx="118" cy="16" r="12" fill={G} /><path d="M112.500 16l4 4 7-8" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g></g>,
  ];
  return <Svg box="0 0 140 100" className="art step-art">{pics[i % pics.length]}</Svg>;
}

// A worried face for the "maths fear" cards.
export const Worry = () => (<Svg box="0 0 40 40" className="art worry">
  <circle cx="20" cy="20" r="18" fill={Y} /><circle cx="13.500" cy="17" r="2.4" fill={INK} /><circle cx="26.500" cy="17" r="2.4" fill={INK} /><path d="M12 11l5 2M28 11l-5 2" stroke={INK} strokeWidth="2" strokeLinecap="round" /><path d="M13 29q7-7 14 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
</Svg>);

// A trophy with confetti, for the closing banners.
export const Trophy = () => (<div className="trophy" aria-hidden="true">
  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <i key={n} className={`bit b${n}`} />)}
  <svg viewBox="0 0 120 120"><path d="M38 20h44v26a22 22 0 0 1-44 0z" fill={Y} /><path d="M38 28H22c0 16 8 24 20 26M82 28h16c0 16-8 24-20 26" fill="none" stroke={Y} strokeWidth="7" strokeLinecap="round" /><rect x="54" y="66" width="12" height="18" fill={Y} /><rect x="40" y="84" width="40" height="12" rx="4" fill="#fff" />
    <path d="M60 28l4 8.300 9.200 1.300-6.600 6.500 1.500 9.100L60 49l-8.100 4.200 1.500-9.100-6.600-6.500 9.200-1.300z" fill="#fff" /></svg>
</div>);
