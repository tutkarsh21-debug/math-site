'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TEACHER_SIGNUP } from '@/lib/flags';

// Login and registration in one card. classes: [[key, label]], boards: ['CBSE', 'ICSE'].
export default function AuthForm({ classes, boards }) {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const teacher = mode === 'teacher';
  const register = mode === 'register' || teacher;
  useEffect(() => { if (TEACHER_SIGNUP && window.location.hash === '#teacher') setMode('teacher'); }, []);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    const body = Object.fromEntries(new FormData(e.target));
    if (teacher) body.role = 'teacher';
    try {
      const r = await fetch(register ? '/api/register' : '/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Something went wrong. Please try again.'); return; }
      window.dispatchEvent(new Event('ms-auth'));
      window.location.href = '/account';
    } catch { setError('Could not reach the server. Check your connection and try again.'); }
    finally { setBusy(false); }
  }

  return (<div className="card auth">
    <div className="chips">
      <button type="button" className={`chip${mode === 'login' ? ' on' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Login</button>
      <button type="button" className={`chip${mode === 'register' ? ' on' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Register</button>
      {TEACHER_SIGNUP && <button type="button" className={`chip${teacher ? ' on' : ''}`} onClick={() => { setMode('teacher'); setError(''); }}>I am a teacher</button>}
    </div>
    <form onSubmit={submit}>
      {register && <label>Full name<input name="name" required minLength={2} maxLength={60} autoComplete="name" /></label>}
      <label>Mobile number<input name="mobile" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} title="10-digit mobile number" autoComplete="tel-national" /></label>
      {teacher && <p className="muted small">Teachers: create your account here. The site owner approves it before you can see any student doubts. After approval, a Teacher desk button appears in My Account.</p>}
      {mode === 'register' && <div className="row">
        <label>Class<select name="cls" required defaultValue="">
          <option value="" disabled>Choose</option>
          {classes.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select></label>
        <label>Board<select name="board" required defaultValue="">
          <option value="" disabled>Choose</option>
          {boards.map(b => <option key={b} value={b}>{b}</option>)}
        </select></label>
      </div>}
      <label>Password<input name="password" type="password" required minLength={8} maxLength={72} autoComplete={register ? 'new-password' : 'current-password'} /></label>
      {register && <p className="muted small">At least 8 characters. By registering you agree to the <Link href="/privacy">privacy policy</Link>. If you are under 18, ask a parent before registering.</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Please wait…' : teacher ? 'Send teacher request' : register ? 'Create account' : 'Login'}</button>
    </form>
    {!register && <p className="muted small">Forgot your password? Message us on Telegram from your registered number.</p>}
  </div>);
}
