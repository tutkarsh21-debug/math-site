// Pictures for the top of the home page. Drawn for MathSetu as inline SVG: not photographs, and not of any real child.
const O = '#f15d22', B = '#5e91ff', P = '#9795f0', G = '#3fbf7f', SKIN = '#f6c9a3', HAIR = '#3a2a22';

// A big, friendly child looking up with a wide smile.
export const HeroKid = () => (<svg viewBox="0 0 440 470" className="hero-kid" aria-hidden="true" focusable="false">
  <defs><clipPath id="hk-mouth"><path d="M186 286 Q222 340 258 286 Q222 276 186 286Z" /></clipPath></defs>
  <circle cx="220" cy="470" r="215" fill={B} />
  <circle cx="220" cy="470" r="150" fill="#7aa7ff" opacity=".55" />
  <text x="46" y="150" fontSize="42" fontWeight="700" fill={B} className="float-a">+</text>
  <text x="372" y="118" fontSize="44" fontWeight="700" fill={P} className="float-b">π</text>
  <text x="38" y="330" fontSize="38" fontWeight="700" fill={O} className="float-b">√</text>
  <text x="378" y="300" fontSize="34" fontWeight="700" fill={G} className="float-a">%</text>
  <g className="hero-kid-bob">
    <rect x="196" y="312" width="48" height="56" rx="22" fill="#e6b088" />
    <path d="M62 470 C62 400 104 360 168 350 L272 350 C336 360 378 400 378 470 Z" fill={O} />
    <path d="M182 350 L220 414 L258 350 Z" fill="#25344f" />
    <path d="M168 350 L204 350 L186 394 Z M272 350 L236 350 L254 394 Z" fill="#d94a12" />
    <path d="M220 414 L220 470" stroke="#d94a12" strokeWidth="5" strokeLinecap="round" />
    <g transform="rotate(-5 220 235)">
      <circle cx="132" cy="244" r="17" fill={SKIN} /><circle cx="308" cy="244" r="17" fill={SKIN} />
      <circle cx="132" cy="246" r="8" fill="#eaa57f" /><circle cx="308" cy="246" r="8" fill="#eaa57f" />
      <circle cx="166" cy="128" r="36" fill={HAIR} /><circle cx="274" cy="124" r="36" fill={HAIR} />
      <path d="M155 120q10-16 24-8M263 116q10-16 24-8" fill="none" stroke="#6b4a38" strokeWidth="5" strokeLinecap="round" />
      <circle cx="220" cy="236" r="90" fill={SKIN} />
      <path d="M130 228 C124 152 168 112 222 112 C276 112 318 152 310 228 C302 196 282 172 244 166 C208 170 160 176 130 228Z" fill={HAIR} />
      <path d="M186 148q22-12 46-6" fill="none" stroke="#6b4a38" strokeWidth="5" strokeLinecap="round" />
      <path d="M166 206 q24-17 46-3 M228 203 q22-14 46 3" fill="none" stroke={HAIR} strokeWidth="6" strokeLinecap="round" />
      <g className="blink">
        <ellipse cx="190" cy="238" rx="16" ry="18" fill="#fff" /><ellipse cx="250" cy="238" rx="16" ry="18" fill="#fff" />
        <circle cx="193" cy="230" r="9" fill="#2a1d17" /><circle cx="253" cy="230" r="9" fill="#2a1d17" />
        <circle cx="196" cy="226" r="3" fill="#fff" /><circle cx="256" cy="226" r="3" fill="#fff" />
      </g>
      <path d="M220 254 q-7 14 5 16" fill="none" stroke="#d99a72" strokeWidth="4" strokeLinecap="round" />
      <circle cx="158" cy="278" r="15" fill="#f29b8b" opacity=".55" /><circle cx="284" cy="278" r="15" fill="#f29b8b" opacity=".55" />
      <path d="M186 286 Q222 340 258 286 Q222 276 186 286Z" fill="#7a2a1c" />
      <g clipPath="url(#hk-mouth)"><rect x="180" y="280" width="84" height="13" fill="#fff" /><ellipse cx="222" cy="322" rx="22" ry="12" fill="#ef7a6e" /></g>
      <path d="M186 286 Q222 340 258 286" fill="none" stroke="#7a2a1c" strokeWidth="4" strokeLinecap="round" />
    </g>
  </g>
</svg>);

// A gold laurel wreath with three lines of text inside: a badge such as "FREE" or "8 · 9 · 10".
// Two branches rise from the bottom, one on each side, and stop short of meeting at the top.
export function Laurel({ top, big, bottom, className = '' }) {
  const N = 8, R = 84, leaves = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1), deg = 112 + t * 128;                       // from the bottom up the left side, to near the top
    const th = (deg * Math.PI) / 180, x = 115 + R * Math.cos(th), y = 108 + R * Math.sin(th);
    const along = deg + 90 + 8;                                          // the direction of travel up the branch
    const size = 1 - t * 0.28;                                           // leaves get smaller towards the tip
    // one leaf on the outside and one on the inside of the stem, both leaning in the direction of travel
    [[-34, 1], [34, -1]].forEach(([lean, side]) => {
      const cx = x + side * 5 * Math.cos(th), cy = y + side * 5 * Math.sin(th);
      leaves.push(<ellipse key={`${i}${lean}`} cx={cx} cy={cy} rx={15 * size} ry={6 * size} transform={`rotate(${along + lean} ${cx} ${cy})`} />);
    });
  }
  const p = d => [115 + R * Math.cos((d * Math.PI) / 180), 108 + R * Math.sin((d * Math.PI) / 180)];
  const [x0, y0] = p(112), [x1, y1] = p(240);
  const branch = (<g fill="#f0a21b"><path d={`M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke="#d98a12" strokeWidth="3" strokeLinecap="round" />{leaves}</g>);
  return (<div className={`laurel ${className}`}>
    <svg viewBox="0 0 230 220" aria-hidden="true" focusable="false">{branch}<g transform="translate(230 0) scale(-1 1)">{branch}</g></svg>
    <div className="lt"><small>{top}</small><b>{big}</b><span>{bottom}</span></div>
  </div>);
}
