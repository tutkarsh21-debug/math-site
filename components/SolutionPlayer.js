'use client';
import { useEffect, useRef, useState } from 'react';
import { drawEvents } from '@/components/boardDraw';

const clock = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

// Plays back a solution written on the whiteboard: the pen strokes appear as the teacher wrote them, with the teacher's voice.
// Either doubtId (the solution is fetched) or events + duration (+ audioSrc), as in the teacher's preview. photo: the picture
// the student sent, shown behind the writing. onPlay is called when the student presses Play.
export default function SolutionPlayer({ doubtId, events: given, duration: givenDuration, audioSrc: givenAudio, photo, onPlay }) {
  const [data, setData] = useState(given ? { events: given, duration: givenDuration, audio: !!givenAudio } : null);
  const [error, setError] = useState('');
  const [t, setT] = useState(0), [playing, setPlaying] = useState(false), [speed, setSpeed] = useState(1);
  const canvas = useRef(null), audio = useRef(null), raf = useRef(0), base = useRef({ at: 0, from: 0 });
  const tRef = useRef(0), playRef = useRef(false), speedRef = useRef(1);

  useEffect(() => {
    if (given || !doubtId) return;
    fetch(`/api/doubts/solution?id=${doubtId}`).then(r => (r.ok ? r.json() : Promise.reject())).then(setData).catch(() => setError('The solution could not be loaded. Please try again.'));
  }, [doubtId]);

  const events = data?.events, duration = data?.duration || 0;
  const src = givenAudio || (data?.audio && doubtId ? `/api/doubts/solution?id=${doubtId}&audio=1` : '');
  const draw = tt => { if (canvas.current && events) drawEvents(canvas.current, events, tt); };

  // The board is drawn again when the solution arrives and when the window changes size.
  useEffect(() => {
    if (!events || !canvas.current) return;
    draw(tRef.current);
    const ro = new ResizeObserver(() => draw(tRef.current));
    ro.observe(canvas.current);
    return () => ro.disconnect();
  }, [events]);
  useEffect(() => () => { playRef.current = false; cancelAnimationFrame(raf.current); }, []);

  // Time runs on our own clock, so the writing carries on even after the voice has ended. The voice is kept in step with it.
  function frame() {
    if (!playRef.current) return;
    const tt = Math.min(duration, base.current.from + (performance.now() - base.current.at) * speedRef.current);
    tRef.current = tt; setT(tt); draw(tt);
    const a = audio.current;
    if (a && !a.paused && Math.abs(a.currentTime * 1000 - tt) > 400) a.currentTime = tt / 1000;
    if (tt >= duration) { pause(); return; }
    raf.current = requestAnimationFrame(frame);
  }
  function play() {
    if (!events) return;
    const from = tRef.current >= duration ? 0 : tRef.current;
    base.current = { at: performance.now(), from }; tRef.current = from;
    playRef.current = true; setPlaying(true);
    const a = audio.current;
    if (a) { a.currentTime = from / 1000; a.playbackRate = speedRef.current; a.play().catch(() => {}); }
    if (onPlay) onPlay();
    raf.current = requestAnimationFrame(frame);
  }
  function pause() { playRef.current = false; setPlaying(false); cancelAnimationFrame(raf.current); audio.current?.pause(); }
  function seek(v) {
    tRef.current = v; setT(v); draw(v);
    if (playRef.current) base.current = { at: performance.now(), from: v };
    if (audio.current) audio.current.currentTime = v / 1000;
  }
  function rate(r) {
    speedRef.current = r; setSpeed(r);
    base.current = { at: performance.now(), from: tRef.current };
    if (audio.current) audio.current.playbackRate = r;
  }

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!data) return <p className="muted">Loading the solution…</p>;
  return (<div className="wb-play">
    <div className="wb-board">
      {photo && <img className="wb-bg" src={photo} alt="The photo of the question" />}
      <canvas ref={canvas} className="wb-canvas" aria-label="The teacher's written solution" />
    </div>
    {src && <audio ref={audio} src={src} preload="auto" />}
    <div className="wb-controls">
      <button type="button" className="btn btn-sm" onClick={playing ? pause : play}>{playing ? 'Pause' : t >= duration && duration ? 'Watch again' : 'Play'}</button>
      <input type="range" min="0" max={Math.max(1, duration)} step="50" value={t} onChange={e => seek(Number(e.target.value))} aria-label="Position in the solution" />
      <span className="muted small wb-time">{clock(t)} / {clock(duration)}</span>
      <select value={speed} onChange={e => rate(Number(e.target.value))} aria-label="Speed">
        <option value={1}>1×</option><option value={1.5}>1.5×</option><option value={2}>2×</option><option value={0.75}>0.75×</option>
      </select>
    </div>
    {!src && <p className="muted small">This solution has no voice, only the writing.</p>}
  </div>);
}
