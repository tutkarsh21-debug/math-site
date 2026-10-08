'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Tex } from '@/components/Tex';

// The "Get an AI report" box. payload: the figures of a test or of all the tests (see lib/analysis.js reportPayload).
// The AI is only called when the student presses the button, and only for a logged-in student.
export default function AiReport({ payload, title = 'AI report' }) {
  const [lang, setLang] = useState('en');
  const [state, setState] = useState({});             // { busy } | { report } | { error, login, off }
  const [left, setLeft] = useState(null);

  async function ask() {
    setState({ busy: true });
    try {
      const r = await fetch('/api/analyze', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, lang }) });
      const d = await r.json();
      if (!r.ok) { setState({ error: d.error || 'Something went wrong. Please try again.', login: !!d.login, off: !!d.off }); return; }
      setLeft(d.left); setState({ report: d.report });
    } catch { setState({ error: 'Could not reach the server. Please check your connection and try again.' }); }
  }

  const { busy, report, error } = state;
  return (<section className="ai-box">
    <div className="ai-head"><span className="new-pill">AI</span><h3>{title}</h3></div>
    {!report && <>
      <p className="muted small">An AI reads your result and writes what you did well, where you are losing marks, and what to do next. It takes about ten seconds.</p>
      <div className="cta-row">
        <div className="chips" role="group" aria-label="Language of the report">
          <button type="button" className={`chip${lang === 'en' ? ' on' : ''}`} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>English</button>
          <button type="button" className={`chip${lang === 'hinglish' ? ' on' : ''}`} onClick={() => setLang('hinglish')} aria-pressed={lang === 'hinglish'}>Hinglish</button>
        </div>
        <button type="button" className="btn" disabled={busy} onClick={ask}>{busy ? 'Writing your report…' : 'Get my AI report'}</button>
      </div>
      {error && <p className={state.off ? 'muted small' : 'error'} role="alert">{error}{state.login && <> <Link href="/login">Log in or register</Link>, it is free.</>}</p>}
    </>}
    {report && <div className="ai-out" role="status">
      {report.summary && <p className="ai-sum"><Tex text={report.summary} /></p>}
      {report.strengths.length > 0 && <><h4>What went well</h4><ul>{report.strengths.map((s, i) => <li key={i}><b>{s.topic}.</b> <Tex text={s.note} /></li>)}</ul></>}
      {report.weak.length > 0 && <><h4>Where marks are being lost</h4><ul>{report.weak.map((w, i) => <li key={i}><b>{w.topic}.</b> <Tex text={w.why} />{w.fix && <> <span className="ai-fix">Fix: <Tex text={w.fix} /></span></>}</li>)}</ul></>}
      {report.plan.length > 0 && <><h4>Your plan</h4><ol>{report.plan.map((p, i) => <li key={i}><Tex text={p} /></li>)}</ol></>}
      <p className="muted small">Written by an AI from your result, so check it against your notes. {left != null && `${left} more report${left === 1 ? '' : 's'} today.`}</p>
    </div>}
  </section>);
}
