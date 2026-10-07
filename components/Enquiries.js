'use client';
import { useEffect, useState } from 'react';

// The enquiries received through the site, for admin accounts. classLabels: { 'class-8': 'Class 8' }.
export default function Enquiries({ classLabels }) {
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    (async () => {
      const r = await fetch('/api/enquiry').catch(() => null);
      if (r?.status === 401) { window.location.href = '/login'; return; }
      if (!r?.ok) { setState({ error: r?.status === 403 ? 'This page is only for the site owner.' : 'Could not load the enquiries. Please try again.' }); return; }
      setState(await r.json());
    })();
  }, []);

  if (state.loading) return <p className="muted">Loading…</p>;
  if (state.error) return <p className="error">{state.error}</p>;
  const list = state.enquiries;
  if (!list.length) return <p className="muted">No enquiries yet.</p>;
  return (<>
    <p className="muted">{list.length} {list.length === 1 ? 'enquiry' : 'enquiries'}, newest first.</p>
    <div className="scroll-x"><table className="scores"><thead><tr><th>Date</th><th>Name</th><th>Mobile</th><th>Class</th><th>Board</th><th>Message</th></tr></thead><tbody>
      {list.map(e => (<tr key={e.id}>
        <td>{new Date(e.created_at * 1000).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</td>
        <td>{e.name}</td>
        <td><a href={`tel:${e.mobile}`}>{e.mobile}</a></td>
        <td>{classLabels[e.cls] || e.cls}</td>
        <td>{e.board}</td>
        <td>{e.message === 'FREE DEMO CLASS REQUEST' ? <span className="badge live">DEMO REQUEST</span> : e.message}</td>
      </tr>))}
    </tbody></table></div>
  </>);
}
