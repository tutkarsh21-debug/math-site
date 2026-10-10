// The picture at the top of the home page: a graph that draws itself, and sample screens of the MathSetu tools.
// Everything here is decoration made for MathSetu (inline SVG and HTML); the screens are SAMPLES, not real students' results.

// The graph of y = (x - 2)(x - 3): a Class 10 quadratic, with its two roots marked. It draws itself, and a point travels along it.
// Maths units are mapped to the picture: x = 0 is at 120, y = 0 is at 330, and one unit is 70.
const X = x => 120 + 70 * x, Y = y => 330 - 70 * y;
const POINTS = [];
for (let i = 0; i <= 60; i++) { const x = 0.34 + (4.66 - 0.34) * (i / 60); POINTS.push(`${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(x * x - 5 * x + 6).toFixed(1)}`); }
const CURVE = POINTS.join('');

export function HeroGraph() {
  const lines = [];
  for (let i = 0; i <= 8; i++) lines.push(<line key={`v${i}`} x1={50 + i * 70} y1="10" x2={50 + i * 70} y2="450" />);
  for (let j = 0; j <= 6; j++) lines.push(<line key={`h${j}`} x1="20" y1={40 + j * 70} x2="590" y2={40 + j * 70} />);
  return (<svg viewBox="0 0 600 460" preserveAspectRatio="xMaxYMid meet" className="hero-graph" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="hg-line" x1="0" x2="1"><stop offset="0" stopColor="#faac00" /><stop offset="1" stopColor="#f8cc6b" /></linearGradient>
      <filter id="hg-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    <g stroke="#ffffff" strokeOpacity=".07" strokeWidth="1">{lines}</g>
    <g stroke="#ffffff" strokeOpacity=".28" strokeWidth="1.6" strokeLinecap="round"><path d="M20 330H590M120 440V20" /></g>
    <g fill="#ffffff" fillOpacity=".5" fontSize="13" fontWeight="600"><text x="578" y="350">x</text><text x="130" y="30">y</text></g>
    <path d={CURVE} fill="none" stroke="url(#hg-line)" strokeWidth="5" strokeLinecap="round" filter="url(#hg-glow)" className="hg-curve" pathLength="1" />
    <g className="hg-roots">
      <circle cx={X(2)} cy={Y(0)} r="7" fill="#f8cc6b" /><circle cx={X(3)} cy={Y(0)} r="7" fill="#f8cc6b" />
      <circle cx={X(2)} cy={Y(0)} r="14" fill="none" stroke="#f8cc6b" strokeOpacity=".6" className="hg-ring" />
      <circle cx={X(3)} cy={Y(0)} r="14" fill="none" stroke="#f8cc6b" strokeOpacity=".6" className="hg-ring r2" />
      <text x={X(2) - 22} y={Y(0) + 30} fill="#fff3c7" fontSize="14" fontWeight="700">x = 2</text>
      <text x={X(3) - 4} y={Y(0) + 30} fill="#fff3c7" fontSize="14" fontWeight="700">x = 3</text>
    </g>
    <circle r="7" fill="#fff" filter="url(#hg-glow)" className="hg-dot"><animateMotion dur="7s" repeatCount="indefinite" path={CURVE} /></circle>
  </svg>);
}

// Sample screens of the tools, laid over each other: a test question, the strong and weak topics, a formula and a live-class tag.
export function HeroShowcase() {
  return (<div className="show" aria-hidden="true">
    <div className="mk mk-test">
      <div className="mk-head"><div><small>Chapter test</small><b>Quadratic Equations</b></div><span className="mk-timer">◷ 12:48</span></div>
      <div className="mk-dots">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < 4 ? 'on' : ''} />)}</div>
      <p className="mk-q"><b>Q4.</b> The roots of x² − 5x + 6 = 0 are</p>
      <div className="mk-opt"><span>A</span>1 and 6</div>
      <div className="mk-opt mk-ok"><span>B</span>2 and 3<em>✓</em></div>
      <div className="mk-opt"><span>C</span>−2 and −3</div>
      <div className="mk-opt"><span>D</span>−1 and 6</div>
      <p className="mk-why">(x − 2)(x − 3) = 0, so x = 2 or x = 3</p>
    </div>
    <div className="mk mk-topics">
      <div className="mk-head"><div><small>Your topics</small><b>Weakest first</b></div><span className="mk-tag">Sample</span></div>
      <div className="mk-row"><span>Trigonometry</span><i><u className="low" style={{ '--w': '46%' }} /></i><b>46%</b></div>
      <div className="mk-row"><span>Quadratic Equations</span><i><u className="mid" style={{ '--w': '78%' }} /></i><b>78%</b></div>
      <div className="mk-row"><span>Probability</span><i><u className="good" style={{ '--w': '91%' }} /></i><b>91%</b></div>
      <p className="mk-note">Read the notes on Trigonometry next</p>
    </div>
    <div className="mk mk-formula">
      <small>Formula bank</small>
      <div className="mk-f">x = <span className="frac"><span>−b ± √(b² − 4ac)</span><span>2a</span></span></div>
    </div>
    <div className="mk mk-live"><i /> 1-to-1 live classes</div>
    <span className="mk-orb o1">π</span><span className="mk-orb o2">∑</span>
  </div>);
}
