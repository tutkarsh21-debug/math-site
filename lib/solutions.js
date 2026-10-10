// A doubt solved on the teacher's whiteboard. Server only: used by the routes under app/api/.
//
// The recording is a list of events with times, in whiteboard units (1000 wide, 700 tall), plus the voice if the teacher used the microphone.
//   { k: 's', c: '#1a1a1a', w: 3, e: 0, p: [[x, y, t, pressure], ...] }   a pen stroke (e: 1 for the eraser); t is ms from the start
//   { k: 'u', t }   undo the last stroke          { k: 'x', t }   clear the board
export const BOARD_W = 1000, BOARD_H = 700;
export const MAX_MS = 6 * 60 * 1000 + 15000;        // a solution is at most about six minutes
export const MAX_POINTS = 60000, MAX_EVENTS = 4000;
export const MAX_AUDIO = 1900000;                    // base64 characters of the voice, about 1.4 MB
export const CHUNK = 600000;                         // the voice is stored in pieces of this many characters
export const AUDIO_TYPES = ['audio/webm', 'audio/mp4', 'audio/ogg'];

const num = (v, lo, hi) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : null);

// Checks what the browser sent and rebuilds it in a compact, safe form. Returns { events } or { error }.
export function cleanEvents(list) {
  if (!Array.isArray(list) || list.length > MAX_EVENTS) return { error: 'The recording is too long or not valid.' };
  let points = 0, strokes = 0;
  const events = [];
  for (const ev of list) {
    if (!ev || typeof ev !== 'object') return { error: 'The recording is not valid.' };
    if (ev.k === 's') {
      const c = typeof ev.c === 'string' && /^#[0-9a-f]{6}$/i.test(ev.c) ? ev.c.toLowerCase() : null, w = num(ev.w, 1, 40);
      if (!c || w === null || !Array.isArray(ev.p) || !ev.p.length) return { error: 'The recording is not valid.' };
      const p = [];
      for (const q of ev.p) {
        if (!Array.isArray(q)) return { error: 'The recording is not valid.' };
        const x = num(q[0], 0, BOARD_W), y = num(q[1], 0, BOARD_H), t = num(q[2], 0, MAX_MS), f = num(q[3], 0, 1);
        if (x === null || y === null || t === null || f === null) return { error: 'The recording is not valid.' };
        p.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10, Math.round(t), Math.round(f * 100) / 100]);
      }
      points += p.length; strokes++;
      events.push({ k: 's', c, w: Math.round(w * 10) / 10, e: ev.e ? 1 : 0, p });
    } else if (ev.k === 'u' || ev.k === 'x') {
      const t = num(ev.t, 0, MAX_MS);
      if (t === null) return { error: 'The recording is not valid.' };
      events.push({ k: ev.k, t: Math.round(t) });
    } else return { error: 'The recording is not valid.' };
    if (points > MAX_POINTS) return { error: 'The recording is too long. Please keep a solution under six minutes.' };
  }
  if (!strokes) return { error: 'Please write something on the board first.' };
  return { events };
}
