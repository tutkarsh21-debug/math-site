'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Timetable from '@/components/Timetable';
import { when } from '@/lib/studio';

// Loads the Jitsi Meet script once.
let scriptPromise;
const loadJitsi = domain => (scriptPromise ||= new Promise((res, rej) => {
  if (window.JitsiMeetExternalAPI) return res();
  const s = document.createElement('script');
  s.src = `https://${domain}/external_api.js`; s.async = true; s.onload = res; s.onerror = () => { scriptPromise = null; rej(new Error('load')); };
  document.head.appendChild(s);
}));

// The 1-to-1 studio: the student's own classes, and the video room they join inside the site.
export default function OneToOneRoom() {
  const [me, setMe] = useState(undefined);
  const [classes, setClasses] = useState([]);
  const [choice, setChoice] = useState(null);
  const [room, setRoom] = useState(null);            // { domain, room, name, link } while joined
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const box = useRef(null), api = useRef(null);

  useEffect(() => {
    (async () => {
      const m = await fetch('/api/me').then(r => r.json()).catch(() => ({}));
      setMe(m.user || null);
      if (!m.user) return;
      const d = await fetch('/api/timetable?scope=mine').then(r => r.json()).catch(() => ({ items: [] }));
      const mine = (d.items || []).filter(i => i.kind === 'one');
      setClasses(mine);
      const want = Number(new URLSearchParams(location.search).get('class'));
      setChoice(mine.find(i => i.id === want)?.id || null);
    })();
    return () => { try { api.current?.dispose(); } catch {} };
  }, []);

  async function join(id) {
    setError(''); setBusy(true);
    try {
      const r = await fetch(`/api/studio/room?id=${id}`), d = await r.json();
      if (!r.ok) { setError(d.error || 'You cannot join this class yet.'); return; }
      await loadJitsi(d.domain);
      setRoom({ ...d, id });
    } catch { setError('The video room could not be opened. Check your connection and try again.'); }
    finally { setBusy(false); }
  }

  // The room is built after its box is on the page.
  useEffect(() => {
    if (!room || !box.current) return;
    try {
      api.current = new window.JitsiMeetExternalAPI(room.domain, {
        roomName: room.room, parentNode: box.current, width: '100%', height: '100%',
        userInfo: { displayName: room.name },
        configOverwrite: { prejoinPageEnabled: false, disableDeepLinking: true, subject: room.title },
        interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false, MOBILE_APP_PROMO: false },
      });
      api.current.addListener('readyToClose', leave);
    } catch { setError('The video room could not be started.'); setRoom(null); }
    return () => { try { api.current?.dispose(); } catch {} api.current = null; };
  }, [room]);
  function leave() { try { api.current?.dispose(); } catch {} api.current = null; setRoom(null); }

  if (me === undefined) return <p className="muted">Loading…</p>;
  if (!me) return (<div className="card auth" style={{ maxWidth: 'none' }}>
    <h3>Log in to join your class</h3>
    <p className="muted">Your 1-to-1 classes, with the time and the Join button, are in your account. Log in with the mobile number you registered with.</p>
    <div className="cta-row"><Link className="btn" href="/login">Login or Register</Link></div>
  </div>);

  if (room) return (<div className="room-wrap">
    <div className="room-bar"><b>{room.title}</b><button type="button" className="btn btn-sm btn-outline" onClick={leave}>Leave class</button></div>
    <div className="room" ref={box} />
    <p className="muted small">If the room says it is waiting for the moderator, the teacher joins first and logs in. {room.link && <>You can also use the <a href={room.link} target="_blank" rel="noopener">meeting link</a>.</>} Allow the camera and microphone when your browser asks.</p>
  </div>);

  const picked = classes.find(c => c.id === choice);
  return (<>
    {error && <p className="error" role="alert">{error}</p>}
    {picked && (<div className="card auth" style={{ maxWidth: 'none', borderColor: 'var(--sun)', marginBottom: '1rem' }}>
      <h3>{picked.title}</h3>
      <p className="muted">{when(picked.starts_at)} · {picked.minutes} minutes{picked.student ? ` · with ${picked.student}` : ''}</p>
      {picked.notes && <p>{picked.notes}</p>}
      {picked.status === 'cancelled' && <p className="error" role="alert">This class has been cancelled{picked.reason ? `: ${picked.reason}` : '.'} Your teacher will tell you the new time.</p>}
      <div className="cta-row">
        {picked.status !== 'cancelled' && <button type="button" className="btn" disabled={busy} onClick={() => join(picked.id)}>{busy ? 'Opening the room…' : 'Join class'}</button>}
        {picked.link && <a className="btn btn-outline" href={picked.link} target="_blank" rel="noopener">Open meeting link</a>}
      </div>
      <p className="muted small" style={{ marginTop: '.8rem' }}>The room opens 15 minutes before the class starts.</p>
    </div>)}
    <Timetable scope="mine" only="one" title="Your 1-to-1 classes" empty="You have no 1-to-1 classes scheduled yet. Once your teacher adds one, it appears here and in your account." />
  </>);
}
