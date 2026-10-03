'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// The student's own page: profile and saved test scores. titles: { 'class-10/real-numbers': 'Real Numbers (Class 10 CBSE)' }.
export default function Account({ titles, classLabels }) {
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    (async () => {
      const { user } = await fetch('/api/me').then(r => r.json()).catch(() => ({}));
      if (!user) { window.location.href = '/login'; return; }
      const { results = [] } = await fetch('/api/results').then(r => r.json()).catch(() => ({}));
      setState({ user, results });
    })();
  }, []);

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.dispatchEvent(new Event('ms-auth'));
    window.location.href = '/';
  }

  if (state.loading) return <p className="muted">Loading…</p>;
  const { user, results } = state;
  return (<>
    <div className="card auth">
      <h2>{user.name}</h2>
      <p className="muted">{classLabels[user.cls] || user.cls} · {user.board} · {user.mobile}</p>
      <div className="cta-row">
        <Link className="btn" href="/tests">Take a test</Link>
        <Link className="btn btn-outline" href={`/${user.cls}`}>My class chapters</Link>
        <button className="btn btn-outline" onClick={logout}>Logout</button>
      </div>
    </div>
    <h2 style={{marginTop:'2rem'}}>My tests</h2>
    {results.length === 0
      ? <p className="muted">No tests taken yet. Your scores will appear here after you finish a test while logged in.</p>
      : <table className="scores"><thead><tr><th>Test</th><th>Score</th><th>Date</th></tr></thead><tbody>
        {results.map((r, i) => (<tr key={i}>
          <td><Link href={`/tests/${r.test}`}>{titles[r.test] || r.test}</Link></td>
          <td>{r.score} / {r.total}</td>
          <td>{new Date(r.taken_at * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        </tr>))}
      </tbody></table>}
  </>);
}
