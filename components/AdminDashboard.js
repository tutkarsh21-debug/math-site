'use client';
import Link from 'next/link';
import { TEACHER_SIGNUP } from '@/lib/flags';
import { useEffect, useMemo, useState } from 'react';
import DashboardView, { Cards, band, dateOnly, when } from '@/components/Dashboard';

const dayShort = k => new Date(`${k}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

// The owner's dashboard: how many students, who joined when, what is read most, and each student's own picture.
export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true });
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('');
  const [sort, setSort] = useState('last');
  const [one, setOne] = useState(null);              // { loading } or { data } for the student whose page is open

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/admin/overview').catch(() => null);
      if (r?.status === 401) { window.location.href = '/login'; return; }
      if (!r?.ok) { setState({ error: r?.status === 403 ? 'This page is only for the site owner.' : 'Could not load the dashboard. Please try again.' }); return; }
      setState({ data: await r.json() });
    })();
  }, []);

  const rows = useMemo(() => {
    if (!state.data) return [];
    const text = q.trim().toLowerCase();
    return state.data.students
      .filter(s => (!cls || s.cls === cls) && (!text || s.name.toLowerCase().includes(text) || s.mobile.includes(text)))
      .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'joined' ? b.joined - a.joined : sort === 'tests' ? b.tests - a.tests : sort === 'views' ? b.views - a.views : b.last - a.last);
  }, [state.data, q, cls, sort]);

  async function open(id) {
    setOne({ loading: true });
    const r = await fetch(`/api/admin/student?id=${id}`).catch(() => null);
    setOne(r?.ok ? { data: await r.json() } : { error: true });
    window.scrollTo({ top: 0 });
  }

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.error) return <p className="error">{state.error}</p>;

  if (one) return (<>
    <p><button className="btn btn-outline btn-sm" onClick={() => setOne(null)}>← Back to all students</button></p>
    {one.loading && <p className="muted">Loading…</p>}
    {one.error && <p className="error">Could not load this student.</p>}
    {one.data && <>
      <div className="card auth dash-head" style={{ maxWidth: 'none' }}>
        <div><h2>{one.data.user.name}</h2>
          <p className="muted">{one.data.user.clsLabel} · {one.data.user.board} · <a href={`tel:${one.data.user.mobile}`}>{one.data.user.mobile}</a> · joined {dateOnly(one.data.user.joined)}</p></div>
      </div>
      <DashboardView data={one.data} mode="admin" />
    </>}
  </>);

  const { totals: t, byClass, signups, top, students } = state.data;
  const peak = Math.max(1, ...signups.map(d => d.n));
  const classes = [...new Set(students.map(s => s.cls))].sort();
  return (<div className="dash">
    <Cards items={[
      [t.students, 'Students registered', `${t.today} today · ${t.week} this week · ${t.month} in 30 days`],
      [t.active7, 'Active in 7 days', t.students ? `${Math.round((100 * t.active7) / t.students)}% of students` : ''],
      [t.testsTaken, 'Tests taken', t.avgPct == null ? 'No score yet' : `average ${t.avgPct}%`],
      [t.views30, 'Pages opened', 'by students, last 30 days'],
      [t.demoRequests, 'Demo requests', `${t.enquiries} enquiries in all · ${t.enquiriesWeek} this week`],
      [t.doubts, 'Doubts asked', `${t.doubtsOpen} waiting for an answer`],
    ]} />
    <div className="cta-row" style={{ margin: '1rem 0' }}>
      <Link className="btn btn-outline btn-sm" href="/admin/enquiries">Enquiries and demo requests</Link>
      <Link className="btn btn-outline btn-sm" href="/admin/doubts">Doubts</Link>
      {TEACHER_SIGNUP && <Link className="btn btn-outline btn-sm" href="/admin/teachers">Teachers</Link>}
    </div>
    <p className="muted small">"Registered" means a student account was created. Only pages opened while logged in are counted here. For visitors who did not log in, see Web Analytics in your Cloudflare dashboard.</p>

    <section className="dash-sec">
      <h2>New students, last 30 days</h2>
      <div className="dash-chart tall" role="img" aria-label={`${t.month} students registered in the last 30 days`}>
        {signups.map(d => (<div key={d.day} className="dash-col" title={`${dayShort(d.day)}: ${d.n}`}>
          <span className="dash-bar" style={{ height: `${d.n ? Math.max(8, (100 * d.n) / peak) : 3}%` }} />
          <small>{new Date(`${d.day}T00:00:00`).getDate()}</small>
        </div>))}
      </div>
    </section>

    <section className="dash-sec">
      <h2>Students by class and board</h2>
      {byClass.length === 0 ? <p className="muted">No student yet.</p> : (
        <div className="dash-cards">{byClass.map(c => <div key={c.cls + c.board} className="dash-card"><b>{c.n}</b><span>{c.clsLabel} {c.board}</span></div>)}</div>)}
    </section>

    <section className="dash-sec">
      <h2>Most opened content, last 30 days</h2>
      {top.length === 0 ? <p className="muted">Nothing yet. Pages and PDFs opened by logged-in students will be counted here.</p> : (
        <div className="scroll-x"><table className="scores"><thead><tr><th>Content</th><th>Type</th><th>Opens</th><th>Students</th></tr></thead><tbody>
          {top.map(r => (<tr key={r.kind + r.path}><td>{r.label}</td><td><span className="badge soon">{r.group}</span></td><td>{r.views}</td><td>{r.students}</td></tr>))}
        </tbody></table></div>)}
    </section>

    <section className="dash-sec">
      <h2>All students ({rows.length}{rows.length !== students.length ? ` of ${students.length}` : ''})</h2>
      <div className="dash-filter">
        <input type="search" placeholder="Search by name or mobile number" value={q} onChange={e => setQ(e.target.value)} aria-label="Search students" />
        <select value={cls} onChange={e => setCls(e.target.value)} aria-label="Class"><option value="">All classes</option>{classes.map(c => <option key={c} value={c}>{students.find(s => s.cls === c).clsLabel}</option>)}</select>
        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort by">
          <option value="last">Recently active</option><option value="joined">Newest first</option><option value="tests">Most tests</option><option value="views">Most pages opened</option><option value="name">Name</option>
        </select>
      </div>
      {rows.length === 0 ? <p className="muted">No student matches.</p> : (
        <div className="scroll-x"><table className="scores"><thead><tr><th>Name</th><th>Class</th><th>Mobile</th><th>Joined</th><th>Last active</th><th>Pages</th><th>Tests</th><th>Average</th></tr></thead><tbody>
          {rows.map(s => (<tr key={s.id}>
            <td><button type="button" className="pr-link" onClick={() => open(s.id)}>{s.name}</button></td>
            <td>{s.clsLabel} {s.board}</td>
            <td><a href={`tel:${s.mobile}`}>{s.mobile}</a></td>
            <td>{dateOnly(s.joined)}</td>
            <td>{when(s.last)}</td>
            <td>{s.views}</td>
            <td>{s.tests}</td>
            <td>{s.avgPct == null ? '–' : <span className={`pill ${band(s.avgPct)}`}>{s.avgPct}%</span>}</td>
          </tr>))}
        </tbody></table></div>)}
    </section>
  </div>);
}
