'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Tells the site which page a LOGGED-IN student has opened, so that the student's, the parent's and the owner's dashboards can show it.
// Visitors who are not logged in are never recorded: nothing is sent for them at all. The header button announces who is logged in
// with the "ms-user" event (see AccountButton). The same page is recorded at most once in 30 minutes.
const SKIP = /^\/(api|admin|account|parent|login|_next)(\/|$)/;

export function send(kind, target) {
  fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind, target }), keepalive: true }).catch(() => {});
}
// For a click on a PDF button. Does nothing unless a student is logged in.
export function trackPdf(path) { if (window.__msUser) send('pdf', path); }

export default function Tracker() {
  const path = usePathname();
  const last = useRef('');
  const log = p => {
    if (!window.__msUser || !p || SKIP.test(p)) return;
    try {
      const seen = JSON.parse(sessionStorage.getItem('ms-seen') || '{}'), t = Date.now();
      if (seen[p] && t - seen[p] < 1800000) return;
      seen[p] = t; sessionStorage.setItem('ms-seen', JSON.stringify(seen));
    } catch {}
    send('view', p);
  };
  useEffect(() => { last.current = path; log(path); }, [path]);
  useEffect(() => {
    const onUser = e => { window.__msUser = !!e.detail; log(last.current); };
    window.addEventListener('ms-user', onUser);
    return () => window.removeEventListener('ms-user', onUser);
  }, []);
  return null;
}
