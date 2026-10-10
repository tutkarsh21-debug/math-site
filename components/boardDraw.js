// Drawing for the teacher's whiteboard and for the replay the student watches. See lib/solutions.js for the shape of the events.
// The board is 1000 units wide and 700 tall; the canvas is scaled to fit whatever size it is shown at.
export const BOARD_W = 1000, BOARD_H = 700;

// Makes the canvas pixels match its size on screen (sharp on phones too) and returns a context in board units.
export function prep(canvas) {
  const r = canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(canvas.width / BOARD_W, 0, 0, canvas.width / BOARD_W, 0, 0);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return ctx;
}

// The pen gets thicker when pressed harder; the eraser keeps one width.
const widthAt = (s, pr) => (s.e ? s.w : s.w * (0.4 + 1.2 * pr));

// One piece of a stroke, from point a to point b (points are [x, y, t, pressure]).
export function drawSegment(ctx, s, a, b) {
  ctx.globalCompositeOperation = s.e ? 'destination-out' : 'source-over';
  ctx.strokeStyle = ctx.fillStyle = s.c;
  const lw = widthAt(s, (a[3] + b[3]) / 2);
  if (a === b) { ctx.beginPath(); ctx.arc(a[0], a[1], lw / 2, 0, Math.PI * 2); ctx.fill(); return; }
  ctx.lineWidth = lw;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
}

function drawStroke(ctx, s) {
  if (s.p.length === 1) { drawSegment(ctx, s, s.p[0], s.p[0]); return; }
  for (let i = 1; i < s.p.length; i++) drawSegment(ctx, s, s.p[i - 1], s.p[i]);
}

// The strokes that are on the board after the events up to time upTo (ms): undo and clear are applied, and a stroke that is
// still being written shows only the part written so far.
export function visibleStrokes(events, upTo = Infinity) {
  const live = [];
  for (const ev of events) {
    if (ev.k === 's') {
      if (ev.p[0][2] > upTo) break;
      live.push(ev.p[ev.p.length - 1][2] <= upTo ? ev : { ...ev, p: ev.p.filter(q => q[2] <= upTo) });
    } else {
      if (ev.t > upTo) break;
      if (ev.k === 'u') live.pop(); else live.length = 0;
    }
  }
  return live;
}

// Clears the canvas and draws the board as it was at time upTo.
export function drawEvents(canvas, events, upTo = Infinity) {
  const ctx = prep(canvas);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.restore();
  for (const s of visibleStrokes(events, upTo)) drawStroke(ctx, s);
  ctx.globalCompositeOperation = 'source-over';
}
