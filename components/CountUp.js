'use client';
import { useEffect, useRef, useState } from 'react';

// A number that counts up from zero when it scrolls into view. Without JavaScript it simply shows the number.
export default function CountUp({ n }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(n);
  useEffect(() => {
    if (typeof n !== 'number' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), ms = 1400;
      const step = t => { const p = Math.min((t - t0) / ms, 1); setShown(Math.round(n * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
      setShown(0); requestAnimationFrame(step);
    }, { threshold: .4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [n]);
  return <b ref={ref}>{shown}</b>;
}
