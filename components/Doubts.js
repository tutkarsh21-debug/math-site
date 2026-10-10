'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SolutionPlayer from '@/components/SolutionPlayer';
import { Tex } from '@/components/Test';

const MAX_PHOTO = 800000;   // the same limit as in lib/doubts.js (base64 characters)
const when = t => new Date(t * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Several lines of text with $maths$ and **bold**, one paragraph per line.
export const Lines = ({ text }) => text.split('\n').filter(l => l.trim()).map((l, i) => <p key={i}><Tex text={l} /></p>);

// Makes a phone photo small enough to store: a JPEG at most 1400 pixels wide or tall, returned as base64.
async function shrink(file) {
  const img = await createImageBitmap(file);
  for (let side = 1400, quality = 0.8; side > 400; side *= 0.8, quality -= 0.1) {
    const k = Math.min(1, side / Math.max(img.width, img.height)), canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * k); canvas.height = Math.round(img.height * k);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/jpeg', quality).split(',')[1];
    if (data.length <= MAX_PHOTO) return data;
  }
  throw new Error('too large');
}

// The Ask a Doubt page for a logged-in student: the form and the student's own doubts with the answers.
// chapters: { 'class-10': [{ id: 'class-10/real-numbers', title, boards }] }.
export default function Doubts({ chapters }) {
  const [state, setState] = useState({ loading: true });
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [fresh, setFresh] = useState([]);      // answered doubts the student had not seen when the page opened
  const [watch, setWatch] = useState({});      // solutions opened, by doubt id

  async function load() {
    const { user } = await fetch('/api/me').then(r => r.json()).catch(() => ({}));
    if (!user) { setState({}); return; }
    const { doubts = [] } = await fetch('/api/doubts').then(r => r.json()).catch(() => ({}));
    setState({ user, doubts });
    const unseen = doubts.filter(d => d.answered_at && !d.seen_at).map(d => d.id);
    if (unseen.length) {
      setFresh(f => [...new Set([...f, ...unseen])]);
      // They count as seen once they have been on screen for a moment; the bell in the header then goes away.
      setTimeout(() => fetch('/api/notifications', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ all: true }) }).then(() => window.dispatchEvent(new Event('ms-notif'))).catch(() => {}), 2500);
    }
  }
  useEffect(() => { load(); }, []);

  async function pick(e) {
    setError(''); setPhoto('');
    const file = e.target.files[0];
    if (!file) return;
    try { setPhoto(await shrink(file)); }
    catch { e.target.value = ''; setError('This photo could not be used. Please choose a JPG or PNG photo.'); }
  }
  async function submit(e) {
    e.preventDefault();
    const form = e.target;
    setError(''); setBusy(true); setSent(false);
    try {
      const r = await fetch('/api/doubts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: form.question.value, chapter: form.chapter.value, photo }) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Something went wrong. Please try again.'); return; }
      form.reset(); setPhoto(''); setSent(true);
      await load();
    } catch { setError('Could not reach the server. Check your connection and try again.'); }
    finally { setBusy(false); }
  }

  if (state.loading) return <p className="muted">Loading…</p>;
  const { user, doubts } = state;
  if (!user) return (<div className="card auth">
    <h2>Log in to ask a doubt</h2>
    <p className="muted">Doubts are answered on your own account page, so you need to log in first. Registering is free.</p>
    <div className="cta-row" style={{marginTop:'1rem'}}><Link className="btn" href="/login">Login or Register</Link></div>
  </div>);

  const list = (chapters[user.cls] || []).filter(ch => ch.boards.includes(user.board));
  const titles = Object.fromEntries(Object.values(chapters).flat().map(ch => [ch.id, ch.title]));
  return (<>
    <div className="card auth">
      <h2>Ask your doubt</h2>
      <form onSubmit={submit}>
        <label>Chapter (optional)<select name="chapter" defaultValue="">
          <option value="">Not sure or other</option>
          {list.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}
        </select></label>
        <label>Your doubt<textarea name="question" rows={5} required minLength={10} maxLength={1000} placeholder="Write the question and tell us where you are stuck." /></label>
        <label>Photo of the question (optional)<input type="file" accept="image/*" onChange={pick} /></label>
        {photo && <img className="doubt-photo" src={`data:image/jpeg;base64,${photo}`} alt="The photo you chose" />}
        <p className="muted small">Only you and your teacher can see your doubts. Do not put faces or personal details in the photo, and send only your own question, not whole pages of a book. See the <Link href="/privacy">privacy policy</Link> and the <Link href="/copyright">copyright note</Link>.</p>
        {error && <p className="error" role="alert">{error}</p>}
        {sent && <p className="muted" role="status">Your doubt has been sent. The answer will appear below once your teacher has replied.</p>}
        <button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Send doubt'}</button>
      </form>
    </div>
    <h2 style={{marginTop:'2rem'}}>My doubts</h2>
    {doubts.length === 0
      ? <p className="muted">You have not asked a doubt yet.</p>
      : doubts.map(d => (<div key={d.id} className={`card doubt${fresh.includes(d.id) ? ' fresh' : ''}`}>
          <p className="muted small">{when(d.created_at)}{titles[d.chapter] ? ` · ${titles[d.chapter]}` : ''} · <span className={`tag${d.answered_at ? ' ready' : ''}`}>{d.answered_at ? 'Doubt resolved' : 'Waiting for an answer'}</span>{fresh.includes(d.id) && <span className="new-pill">NEW</span>}</p>
          <div className="doubt-q"><Lines text={d.question} /></div>
          {!!d.has_photo && <img className="doubt-photo" src={`/api/doubts/photo?id=${d.id}`} alt="Photo attached to the doubt" loading="lazy" />}
          {!!d.has_solution && (watch[d.id]
            ? <SolutionPlayer doubtId={d.id} photo={d.has_photo ? `/api/doubts/photo?id=${d.id}` : ''} />
            : <p><button type="button" className="btn btn-sun watch-btn" onClick={() => setWatch(w => ({ ...w, [d.id]: true }))}>▶ Watch your teacher's solution</button></p>)}
          {!!d.answered_at && <div className="why"><b>{d.has_solution ? 'Note from your teacher' : 'Answer'}</b><Lines text={d.answer} /></div>}
        </div>))}
  </>);
}
