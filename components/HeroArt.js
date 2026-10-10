// The picture beside the home page headline: a clean card with a worked equation, and three small notes floating around it.
export default function HeroArt() {
  return (<div className="hero5-art" aria-hidden="true">
    <svg className="h5-rays" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="h5g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd566" stopOpacity=".95" /><stop offset="1" stopColor="#ffd566" stopOpacity="0" /></linearGradient></defs>
      <path d="M200 40 L40 300 L120 300 Z" fill="url(#h5g)" opacity=".55" /><path d="M200 40 L280 300 L360 300 Z" fill="url(#h5g)" opacity=".55" /><path d="M200 40 L150 300 L250 300 Z" fill="url(#h5g)" opacity=".8" />
      <circle cx="200" cy="52" r="26" fill="#faac00" />
      <g stroke="#faac00" strokeWidth="5" strokeLinecap="round"><path d="M200 12v-4M164 24l-3-3M236 24l3-3M154 52h-5M251 52h5" /></g>
    </svg>
    <div className="h5-board">
      <span className="h5-tag">Class 10 · Quadratic equations</span>
      <p className="h5-eq">x² − 5x + 6 = 0</p>
      <p className="h5-step">(x − 2)(x − 3) = 0</p>
      <p className="h5-ans">x = 2 or x = 3 <b>✓</b></p>
    </div>
    <span className="h5-pill p1"><i /> Live 1-to-1 class</span>
    <span className="h5-pill p2">Doubt solved on a whiteboard</span>
    <span className="h5-pill p3">A new practice test, every time</span>
  </div>);
}
