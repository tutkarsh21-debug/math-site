'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

// Finds a chapter by name. chapters: [{ cls: 'class-10', label: 'Class 10', boards: ['CBSE'], title, slug }].
export default function ChapterSearch({ chapters }) {
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('');
  const [board, setBoard] = useState('');
  const classes = useMemo(() => [...new Map(chapters.map(c => [c.cls, c.label]))], [chapters]);
  const active = q.trim().length >= 2 || cls || board;
  const hits = useMemo(() => {
    if (!active) return [];
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return chapters.filter(c => (!cls || c.cls === cls) && (!board || c.boards.includes(board))
      && words.every(w => c.title.toLowerCase().includes(w)));
  }, [q, cls, board, chapters, active]);

  return (<div className="finder card">
    <label className="finder-box">
      <span className="sr-only">Search for a chapter</span>
      <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search a chapter, for example quadratic, circles, mensuration" autoComplete="off" />
    </label>
    <div className="finder-filters">
      <select value={cls} onChange={e => setCls(e.target.value)} aria-label="Class">
        <option value="">All classes</option>
        {classes.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <select value={board} onChange={e => setBoard(e.target.value)} aria-label="Board">
        <option value="">CBSE and ICSE</option>
        <option value="CBSE">CBSE</option>
        <option value="ICSE">ICSE</option>
      </select>
    </div>
    {active && (hits.length === 0
      ? <p className="muted small" role="status">No chapter matches. Try a shorter word, or choose "All classes".</p>
      : <>
          <p className="muted small" role="status">{hits.length} chapter{hits.length > 1 ? 's' : ''} found{hits.length > 12 ? ', showing the first 12. Add a class or a word to narrow it down.' : ''}</p>
          <ul className="finder-list">
            {hits.slice(0, 12).map(c => (
              <li key={`${c.cls}/${c.slug}`}>
                <Link href={`/${c.cls}/${c.slug}`}>{c.title}</Link>
                <span><span className="tag">{c.label}</span>{c.boards.map(b => <span key={b} className="tag">{b}</span>)}</span>
              </li>))}
          </ul>
        </>)}
  </div>);
}
