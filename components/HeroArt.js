// The picture at the top of the home page: a child standing at a bridge. "Setu" means bridge, and the arch of the bridge is the arch in the
// MathSetu logo. Drawn for MathSetu as inline SVG: not a photograph, and not of any real child.
const O = '#f15d22', B = '#5e91ff', P = '#9795f0', G = '#3fbf7f', SKIN = '#f6c9a3', HAIR = '#3a2a22';
const sky = { focusable: 'false', 'aria-hidden': 'true' };

// The arch and the two river banks, behind the child. The scene is 1000 wide and 520 high; the bridge deck is at height 430.
export function BridgeBack() {
  const ARCH = { x0: 215, x1: 785, y: 432, c: -340 };                          // a quadratic arch: both ends on the deck, the control point far above
  const yAt = x => { const t = (x - ARCH.x0) / (ARCH.x1 - ARCH.x0); return (1 - t) * (1 - t) * ARCH.y + 2 * t * (1 - t) * ARCH.c + t * t * ARCH.y; };
  const hangers = [];
  for (let x = 265; x <= 735; x += 45) if (Math.abs(x - 500) > 20) hangers.push(<line key={x} x1={x} y1={yAt(x) + 4} x2={x} y2={ARCH.y} />);
  return (<svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMax slice" className="bridge-back" {...sky}>
    <path d="M0 520V396Q70 372 150 384Q205 392 225 424V520Z" fill="#cfe8d5" />
    <path d="M1000 520V396Q930 372 850 384Q795 392 775 424V520Z" fill="#cfe8d5" />
    <path d="M0 424Q70 400 150 412Q205 420 225 448V520H0Z" fill="#b6dcc0" />
    <path d="M1000 424Q930 400 850 412Q795 420 775 448V520H1000Z" fill="#b6dcc0" />
    <g fill="none" stroke="#7aa7ff" strokeWidth="4" strokeLinecap="round" opacity=".55" className="waves">
      <path d="M250 470q20-10 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" />
      <path d="M270 495q20-10 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0" />
    </g>
    <path d={`M${ARCH.x0} ${ARCH.y}Q500 ${ARCH.c} ${ARCH.x1} ${ARCH.y}`} fill="none" stroke="#f0a21b" strokeWidth="11" strokeLinecap="round" />
    <path d={`M${ARCH.x0} ${ARCH.y}Q500 ${ARCH.c + 22} ${ARCH.x1} ${ARCH.y}`} fill="none" stroke="#ffd98a" strokeWidth="4" strokeLinecap="round" opacity=".9" />
    <g stroke="#f0a21b" strokeWidth="3.5" strokeLinecap="round">{hangers}</g>
    <path d="M205 432H795" stroke="#d98a12" strokeWidth="12" strokeLinecap="round" />
  </svg>);
}

// The wall of the bridge in front of the child, so that the child seems to stand behind it.
export function BridgeFront() {
  const posts = [];
  for (let x = 222; x < 790; x += 36) posts.push(<rect key={x} x={x} y="448" width="7" height="72" rx="3" fill="#e8873a" />);
  return (<svg viewBox="0 0 1000 520" preserveAspectRatio="xMidYMax slice" className="bridge-front" {...sky}>
    <rect x="205" y="436" width="590" height="84" fill="#f8bd7a" />
    <rect x="198" y="430" width="604" height="14" rx="7" fill={O} />
    {posts}
  </svg>);
}

// A big, friendly child looking up with a wide smile.
export const HeroKid = () => (<svg viewBox="0 0 440 470" className="hero-kid" {...sky}>
  <defs><clipPath id="hk-mouth"><path d="M186 286 Q222 340 258 286 Q222 276 186 286Z" /></clipPath></defs>
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

// A small paper note on one river bank: the child before the bridge (worried) or after it (happy).
export function HeroNote({ happy = false, children, label, className = '' }) {
  return (<div className={`note ${happy ? 'note-after' : 'note-before'} ${className}`}>
    <svg viewBox="0 0 40 40" width="38" height="38" {...sky}>
      <circle cx="20" cy="20" r="18" fill="#ffc533" />
      <circle cx="13.5" cy="17" r="2.4" fill="#413930" /><circle cx="26.5" cy="17" r="2.4" fill="#413930" />
      {happy ? <path d="M12 24q8 9 16 0" fill="none" stroke="#413930" strokeWidth="2.6" strokeLinecap="round" />
        : <><path d="M12 11l5 2M28 11l-5 2" stroke="#413930" strokeWidth="2" strokeLinecap="round" /><path d="M13 29q7-7 14 0" fill="none" stroke="#413930" strokeWidth="2.6" strokeLinecap="round" /></>}
    </svg>
    <small>{label}</small>
    <p>{children}</p>
  </div>);
}
