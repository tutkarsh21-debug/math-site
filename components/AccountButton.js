'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// The button at the right of the header: "Login" for a visitor, the student's first name once logged in.
export default function AccountButton() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const load = () => fetch('/api/me').then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
    load();
    // The login and account pages announce a change so the header updates without a reload.
    window.addEventListener('ms-auth', load);
    return () => window.removeEventListener('ms-auth', load);
  }, []);
  return user
    ? <Link className="btn btn-sm btn-outline" href="/account">{user.name.split(' ')[0]}</Link>
    : <Link className="btn btn-sm" href="/login">Login</Link>;
}
