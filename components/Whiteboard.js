'use client';
import { useEffect, useRef, useState } from 'react';
import { BOARD_H, BOARD_W, drawEvents, drawSegment, prep, visibleStrokes } from '@/components/boardDraw';
import { Lines } from '@/components/Doubts';
import SolutionPlayer from '@/components/SolutionPlayer';

const COLORS = ['#1a1a1a', '#d32f2f', '#1565c0', '#2e7d32'], COLOR_NAMES = ['Black', 'Red', 'Blue', 'Green'];
const SIZES = [2, 3.5, 6], SIZE_NAMES = ['Thin', 'Medium', 'Thick'];
const MAX_MS = 6 * 60 * 1000, MAX_POINTS = 55000, MAX_VOICE = 1900000;
const clock = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const pickMime = () => ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || '';
const toBase64 = blob => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = rej; r.readAsDataURL(blob); });
// How loud the recorded voice really is (0 to 1), found by decoding the recording; -1 if the browser cannot decode it.
const loudness = async blob => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext, ac = new Ctx();
    const buf = await ac.decodeAudioData(await blob.arrayBuffer()); ac.close();
    let m = 0; for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i += 4) m = Math.max(m, Math.abs(d[i])); }
    return m;
  } catch { return -1; }
};
const pressure = e => (e.pointerType === 'mouse' ? 0.5 : e.pressure > 0 ? e.pressure : 0.5);

// The teacher's whiteboard for one doubt. The student's question (and photo) are shown; the teacher writes the solution with a pen
// tablet (or a mouse or touch screen) and speaks into the microphone. Recording starts by itself at the first pen stroke.
// "Finish" shows a preview; "Send to the student" saves it and the student is told that the doubt is resolved.
// doubt: { id, name, question, has_photo, ... }.
export default function Whiteboard({ doubt, onSent, onCancel }) {
  const canvas = useRef(null), events = useRef([]), cur = useRef(null), points = useRef(0);
  const t0 = useRef(0), done = useRef(false), timer = useRef(0), rec = useRef(null), chunks = useRef([]), stream = useRef(null), mime = useRef('');
  const [phase, setPhase] = useState('write');                 // write, then review
  const [tool, setTool] = useState('pen'), [color, setColor] = useState(COLORS[0]), [size, setSize] = useState(SIZES[1]);
  const [penOnly, setPenOnly] = useState(true);
  const [voice, setVoice] = useState(true), [mic, setMic] = useState('idle'), [micTry, setMicTry] = useState(0);   // mic: idle, ready, blocked, none
  const [started, setStarted] = useState(false), [elapsed, setElapsed] = useState(0), [alive, setAlive] = useState(0);
  const [review, setReview] = useState(null), [sendVoice, setSendVoice] = useState(true);
  const [devices, setDevices] = useState([]), [deviceId, setDeviceId] = useState(() => { try { return localStorage.getItem('ms-mic') || ''; } catch { return ''; } });
  const [level, setLevel] = useState(0), peak = useRef(0), meter = useRef(null);   // how loud the microphone hears, 0 to 1
  const [note, setNote] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const photo = doubt.has_photo ? `/api/doubts/photo?id=${doubt.id}` : '';

  const stopMeter = () => { try { meter.current?.stop(); } catch {} meter.current = null; setLevel(0); };
  const stopStream = () => { stopMeter(); stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; };
  // A small level bar, so the teacher can see that the microphone is really hearing the voice.
  function startMeter(s) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext, ac = new Ctx(), an = ac.createAnalyser(), src = ac.createMediaStreamSource(s), buf = new Uint8Array(512);
      an.fftSize = 512; src.connect(an); ac.resume?.();
      let on = true, last = 0;
      const tick = () => {
        if (!on) return;
        an.getByteTimeDomainData(buf);
        let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v - 128));
        const l = Math.min(1, m / 64);
        if (l > peak.current) peak.current = l;
        const t = performance.now(); if (t - last > 120) { last = t; setLevel(l); }
        requestAnimationFrame(tick);
      };
      tick();
      meter.current = { resume() { try { ac.resume(); } catch {} }, stop() { on = false; try { src.disconnect(); ac.close(); } catch {} } };
    } catch {}
  }
  useEffect(() => () => { stopStream(); clearInterval(timer.current); if (rec.current && rec.current.state !== 'inactive') try { rec.current.stop(); } catch {} }, []);

  // The microphone is asked for as soon as the board opens, so the browser's permission question does not come in the middle of writing.
  useEffect(() => {
    if (phase !== 'write') return;
    if (!voice) { stopStream(); setMic('idle'); return; }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setMic('none'); return; }
    let dead = false;
    navigator.mediaDevices.getUserMedia({ audio: { ...(deviceId ? { deviceId: { exact: deviceId } } : {}), echoCancellation: true, noiseSuppression: true } })
      .then(s => {
        if (dead) { s.getTracks().forEach(t => t.stop()); return; }
        stream.current = s; setMic('ready'); startMeter(s);
        navigator.mediaDevices.enumerateDevices().then(l => { if (!dead) setDevices(l.filter(x => x.kind === 'audioinput')); }).catch(() => {});
        s.getAudioTracks().forEach(t => { t.onended = () => { if (stream.current === s) { stopStream(); setMic('blocked'); } }; });
      })
      .catch(() => { if (!dead) { if (deviceId) { setDeviceId(''); try { localStorage.removeItem('ms-mic'); } catch {} } else setMic('blocked'); } });
    return () => { dead = true; };
  }, [voice, micTry, phase, deviceId]);

  // The board is drawn again if the window changes size.
  useEffect(() => {
    if (phase !== 'write' || !canvas.current) return;
    const ro = new ResizeObserver(() => drawEvents(canvas.current, events.current));
    ro.observe(canvas.current);
    return () => ro.disconnect();
  }, [phase]);

  const redraw = () => { drawEvents(canvas.current, events.current); setAlive(visibleStrokes(events.current).length); };
  const now = () => performance.now() - t0.current;

  function startRecording() {
    if (t0.current) return;
    t0.current = performance.now(); setStarted(true);
    if (voice && stream.current) {
      try {
        mime.current = pickMime();
        const r = new MediaRecorder(stream.current, { ...(mime.current ? { mimeType: mime.current } : {}), audioBitsPerSecond: 24000 });
        chunks.current = []; r.ondataavailable = e => { if (e.data && e.data.size) chunks.current.push(e.data); };
        r.start(1000); rec.current = r; peak.current = 0;
      } catch { rec.current = null; }
    }
    timer.current = setInterval(() => { const ms = now(); setElapsed(ms); if (ms >= MAX_MS) finish(); }, 250);
  }

  function commit() {
    const s = cur.current; cur.current = null;
    if (!s) return;
    events.current.push(s); setAlive(visibleStrokes(events.current).length);
  }

  function down(e) {
    if (phase !== 'write' || done.current) return;
    if (penOnly && e.pointerType === 'touch') return;          // a resting hand is ignored
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (points.current >= MAX_POINTS || events.current.length >= 3900) { setError('The board is full. Please finish and send this solution.'); return; }
    if (!t0.current && voice && !stream.current && (mic === 'idle' || mic === 'asking')) { setError('The microphone is still starting. Allow it if the browser asks, wait a moment, then start writing.'); return; }
    setError('');
    e.preventDefault();
    const cv = canvas.current;
    try { cv.setPointerCapture(e.pointerId); } catch {}     // keeps the stroke going if the pen leaves the board
    meter.current?.resume();
    startRecording();
    const eraser = tool === 'eraser' || (e.buttons & 32) !== 0;    // the eraser end of a pen sets button 32
    const r = cv.getBoundingClientRect();
    const p = [(e.clientX - r.left) / r.width * BOARD_W, (e.clientY - r.top) / r.height * BOARD_H, now(), pressure(e)];
    cur.current = { k: 's', c: color, w: eraser ? size * 3 : size, e: eraser ? 1 : 0, p: [p] };
    drawSegment(prep(cv), cur.current, p, p);
    points.current++;
  }
  function move(e) {
    const s = cur.current;
    if (!s) return;
    const cv = canvas.current, ctx = prep(cv), r = cv.getBoundingClientRect();
    const list = e.nativeEvent.getCoalescedEvents?.() || [];
    for (const ev of list.length ? list : [e.nativeEvent]) {
      const last = s.p[s.p.length - 1];
      const x = (ev.clientX - r.left) / r.width * BOARD_W, y = (ev.clientY - r.top) / r.height * BOARD_H;
      if (Math.hypot(x - last[0], y - last[1]) < 1.2 || points.current >= MAX_POINTS) continue;
      const q = [x, y, Math.max(last[2], ev.timeStamp - t0.current), pressure(ev)];
      s.p.push(q); points.current++;
      drawSegment(ctx, s, last, q);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function up() { commit(); }

  function undo() {
    if (!t0.current || done.current || !alive) return;
    events.current.push({ k: 'u', t: Math.round(now()) }); redraw();
  }
  function clearBoard() {
    if (!t0.current || done.current || !alive) return;
    events.current.push({ k: 'x', t: Math.round(now()) }); redraw();
  }
  useEffect(() => {
    const key = e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && phase === 'write') { e.preventDefault(); undo(); } };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });

  async function finish() {
    if (done.current || !t0.current) return;
    done.current = true; clearInterval(timer.current); commit();
    const duration = Math.round(now());
    let blob = null;
    const r = rec.current;
    if (r && r.state !== 'inactive') blob = await new Promise(res => { r.onstop = () => res(chunks.current.length ? new Blob(chunks.current, { type: r.mimeType || mime.current || 'audio/webm' }) : null); r.stop(); });
    stopStream();
    const heard = blob ? await loudness(blob) : 0;
    const audio = blob ? await toBase64(blob).catch(() => '') : '';
    setSendVoice(!!audio && audio.length <= MAX_VOICE);
    setReview({ voiceWanted: voice, quiet: !!audio && (heard >= 0 ? heard < 0.02 : peak.current < 0.03), heard, events: events.current.slice(), duration, audio, mime: blob?.type || '', audioUrl: blob ? URL.createObjectURL(blob) : '' });
    setPhase('review');
  }

  function again() {
    if (review?.audioUrl) URL.revokeObjectURL(review.audioUrl);
    events.current = []; cur.current = null; points.current = 0; t0.current = 0; done.current = false; rec.current = null;
    setReview(null); setStarted(false); setElapsed(0); setAlive(0); setError(''); setMicTry(n => n + 1); setPhase('write');
  }

  async function send() {
    setError(''); setBusy(true);
    const voiceOk = review.audio && sendVoice && review.audio.length <= MAX_VOICE;
    try {
      const r = await fetch('/api/teacher/solution', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: doubt.id, events: review.events, duration: review.duration, audio: voiceOk ? review.audio : '', mime: voiceOk ? review.mime : '', note }) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'The solution was not sent. Please try again.'); return; }
      onSent();
    } catch { setError('Could not reach the server. Check the connection and try again.'); }
    finally { setBusy(false); }
  }

  if (phase === 'review' && review) {
    const tooBig = review.audio && review.audio.length > MAX_VOICE;
    return (<div className="wb">
      <div className="card wb-q"><p className="muted small">{doubt.name}</p><Lines text={doubt.question} /></div>
      <h3>Check your solution</h3>
      <SolutionPlayer events={review.events} duration={review.duration} audioSrc={review.audioUrl} photo={photo} />
      <label className="doubt-edit">A short written note for the student (optional; maths between $ signs)
        <textarea rows={3} maxLength={4000} value={note} onChange={e => setNote(e.target.value)} /></label>
      {tooBig && <p className="muted small">The voice recording is too large to send, so only the writing will be sent. Next time, keep the explanation shorter.</p>}
      {review.voiceWanted && !review.audio && <p className="error" role="alert">No voice was recorded for this solution. Check that the microphone is allowed and shows a moving level bar while you speak, then choose Record again.</p>}
      {review.audio && !review.quiet && review.heard >= 0 && <p className="muted small">Your voice was recorded (loudness {Math.round(review.heard * 100)}%). If you cannot hear it when you press Play, check the laptop volume, that the browser tab is not muted, and the sound output device in Windows.</p>}
      {review.quiet && <p className="error" role="alert">The microphone barely heard any sound. Play the preview to check your voice. If it is silent, choose Record again and speak closer to the microphone.</p>}
      {review.audio && !tooBig && <label className="pr-check"><input type="checkbox" checked={sendVoice} onChange={e => setSendVoice(e.target.checked)} /> Send my voice with the solution</label>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="cta-row">
        <button type="button" className="btn" disabled={busy} onClick={send}>{busy ? 'Sending…' : 'Send to the student'}</button>
        <button type="button" className="btn btn-outline" disabled={busy} onClick={again}>Record again</button>
        <button type="button" className="btn btn-outline" disabled={busy} onClick={onCancel}>Cancel</button>
      </div>
    </div>);
  }

  return (<div className="wb">
    <div className="card wb-q"><p className="muted small">{doubt.name}{doubt.cls ? ` · ${doubt.cls.replace('class-', 'Class ')} ${doubt.board}` : ''}</p><Lines text={doubt.question} /></div>
    <div className="wb-tools" role="toolbar" aria-label="Whiteboard tools">
      <div className="wb-group">
        <button type="button" className={`chip${tool === 'pen' ? ' on' : ''}`} onClick={() => setTool('pen')}>Pen</button>
        <button type="button" className={`chip${tool === 'eraser' ? ' on' : ''}`} onClick={() => setTool('eraser')}>Eraser</button>
      </div>
      <div className="wb-group" role="group" aria-label="Colour">
        {COLORS.map((c, i) => <button key={c} type="button" className={`wb-swatch${color === c && tool === 'pen' ? ' on' : ''}`} style={{ background: c }} aria-label={COLOR_NAMES[i]} aria-pressed={color === c} onClick={() => { setColor(c); setTool('pen'); }} />)}
      </div>
      <div className="wb-group" role="group" aria-label="Thickness">
        {SIZES.map((s, i) => <button key={s} type="button" className={`chip${size === s ? ' on' : ''}`} onClick={() => setSize(s)}>{SIZE_NAMES[i]}</button>)}
      </div>
      <div className="wb-group">
        <button type="button" className="chip" disabled={!alive} onClick={undo}>Undo</button>
        <button type="button" className="chip" disabled={!alive} onClick={clearBoard}>Clear</button>
      </div>
    </div>
    <div className="wb-status">
      <span className={`wb-rec${started ? ' live' : ''}`}><i />{started ? `Recording ${clock(elapsed)} / ${clock(MAX_MS)}` : 'Ready. Recording starts when you first touch the board with the pen.'}</span>
      <label className="pr-check" style={{ margin: 0 }}><input type="checkbox" checked={voice} disabled={started} onChange={e => setVoice(e.target.checked)} /> Record my voice</label>
      {voice && mic === 'ready' && <span className="muted small wb-mic">Microphone ready <span className="wb-meter" aria-hidden="true"><i style={{ width: `${Math.round(level * 100)}%` }} /></span></span>}
      {voice && mic === 'ready' && devices.length > 0 && !started && (<label className="small wb-pick">Microphone <select value={deviceId || devices.find(d => d.deviceId === 'default')?.deviceId || devices[0].deviceId} onChange={e => { setDeviceId(e.target.value); try { localStorage.setItem('ms-mic', e.target.value); } catch {} }}>{devices.map((d, i) => <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Microphone ${i + 1}`}</option>)}</select></label>)}
      {voice && mic === 'ready' && !started && <span className="muted small">Speak now. If the bar stays flat, choose another microphone from the list.</span>}
      {voice && mic === 'idle' && <span className="muted small">Starting the microphone. Please allow it if the browser asks.</span>}
      {voice && mic === 'blocked' && <span className="small error">Microphone blocked. Allow it in the browser address bar, then <button type="button" className="pr-link" onClick={() => setMicTry(n => n + 1)}>try again</button>. You can also send the writing without voice.</span>}
      {voice && mic === 'none' && <span className="muted small">This browser cannot record voice. The writing will be recorded.</span>}
      <label className="pr-check" style={{ margin: 0 }}><input type="checkbox" checked={penOnly} onChange={e => setPenOnly(e.target.checked)} /> Ignore finger touches (pen and mouse only)</label>
    </div>
    <div className="wb-board">
      {photo && <img className="wb-bg" src={photo} alt="The photo the student sent" />}
      <canvas ref={canvas} className="wb-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onContextMenu={e => e.preventDefault()} aria-label="Whiteboard. Write the solution with the pen." />
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="cta-row">
      <button type="button" className="btn" disabled={!started || !alive} onClick={finish}>Finish and preview</button>
      <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
    </div>
  </div>);
}
