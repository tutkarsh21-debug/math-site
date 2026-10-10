'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// The header menu: a few grouped links instead of a long row. On a computer a group opens when the pointer rests on it
// or when it is clicked; on a phone the button at the top opens the whole menu with every group listed.
export default function NavMenu({ items }) {
  const path = usePathname();
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setOpen(null); setMobile(false); }, [path]);
  useEffect(() => {
    const away = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(null); setMobile(false); } };
    const esc = e => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    document.addEventListener('click', away); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', away); document.removeEventListener('keydown', esc); };
  }, []);
  const hoverable = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (min-width: 901px)').matches;
  return (
    <div className="navwrap" ref={ref}>
      <button type="button" className="nav-burger" aria-label="Menu" aria-expanded={mobile} onClick={() => setMobile(m => !m)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav className={`nav${mobile ? ' open' : ''}`} aria-label="Main">
        {items.map((g, i) => g.items ? (
          <div key={g.label} className={`nav-group${open === i ? ' open' : ''}`}
            onMouseEnter={() => hoverable() && setOpen(i)} onMouseLeave={() => hoverable() && setOpen(null)}>
            <button type="button" className="nav-btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              {g.label}<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="nav-menu">
              {g.items.map(it => (
                <Link key={it.href} href={it.href}><b>{it.label}{it.hot && <span className="nav-new">NEW</span>}</b>{it.note && <small>{it.note}</small>}</Link>))}
            </div>
          </div>) : <Link key={g.href} href={g.href} className="nav-link">{g.label}{g.hot && <span className="nav-new">NEW</span>}</Link>)}
      </nav>
    </div>);
}
