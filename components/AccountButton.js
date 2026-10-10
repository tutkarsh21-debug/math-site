'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// The button at the right of the header: "Login" for a visitor, the student's first name once logged in.
export default function AccountButton() {
  const [user, setUser] = useState(null);
  const [resolved, setResolved] = useState(0);     // answered doubts the student has not seen yet
  useEffect(() => {
    const load = () => fetch('/api/me').then(r => r.json()).then(d => { setUser(d.user); window.__msUser = !!d.user; window.dispatchEvent(new CustomEvent('ms-user', { detail: d.user })); }).catch(() => {});
    load();
    // The login and account pages announce a change so the header updates without a reload.
    window.addEventListener('ms-auth', load);
    return () => window.removeEventListener('ms-auth', load);
  }, []);
  // "Doubt resolved" notifications: checked when the page opens, every minute while it is open, and when the doubts page has marked them seen.
  useEffect(() => {
    if (!user) { setResolved(0); return; }
    const check = () => { if (!document.hidden) fetch('/api/notifications').then(r => r.json()).then(d => setResolved(d.count || 0)).catch(() => {}); };
    check();
    const t = setInterval(check, 60000);
    window.addEventListener('ms-notif', check);
    document.addEventListener('visibilitychange', check);
    return () => { clearInterval(t); window.removeEventListener('ms-notif', check); document.removeEventListener('visibilitychange', check); };
  }, [user]);
  return user
    ? (<>
        {resolved > 0 && <Link className="bell" href="/doubts" aria-label={`${resolved} doubt${resolved > 1 ? 's' : ''} resolved. Open them.`} title="Your doubt is resolved">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" /></svg>
          <b>{resolved}</b>
        </Link>}
        <Link className="btn btn-sm btn-outline" href="/account">{user.name.split(' ')[0]}</Link>
      </>)
    : <Link className="btn btn-sm btn-outline" href="/login">Login</Link>;
}
