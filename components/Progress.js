'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// A student's progress is kept in this browser only: which chapters are marked done, and the last chapter opened.
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

// The button on a chapter page. Opening the page also remembers it as the last chapter.
export function DoneButton({ id, title }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(read('ms-done', []).includes(id));
    write('ms-last', { id, title });
  }, [id, title]);
  function toggle() {
    const list = read('ms-done', []), next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    write('ms-done', next); setDone(next.includes(id));
  }
  return (<button type="button" className={`btn btn-sm ${done ? '' : 'btn-outline'}`} onClick={toggle} aria-pressed={done}>
    {done ? '✓ Chapter done' : 'Mark chapter as done'}
  </button>);
}

// A small tick on a chapter card of the class page.
export function DoneTick({ id }) {
  const [done, setDone] = useState(false);
  useEffect(() => { setDone(read('ms-done', []).includes(id)); }, [id]);
  return done ? <span className="tick" title="Marked as done" aria-label="Marked as done">✓</span> : null;
}

// On the home page: "Continue where you left off".
export function Continue() {
  const [last, setLast] = useState(null);
  useEffect(() => { setLast(read('ms-last', null)); }, []);
  if (!last?.id) return null;
  return (<div className="wrap"><div className="continue">
    <span>Continue where you left off:</span>
    <Link className="btn btn-sm" href={`/${last.id}`}>{last.title} →</Link>
  </div></div>);
}
