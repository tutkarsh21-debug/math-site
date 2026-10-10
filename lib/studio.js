// The studios (live class, recorded lectures, 1-to-1): shared rules and helpers. Safe for the browser and the server.

// The YouTube channel of MathSetu (youtube.com/@MathSetu2026). The live studio shows this channel's live stream.
export const YT_CHANNEL_ID = 'UCkkc4fAcTvOlD-rYqSiv1MQ';
// The 1-to-1 video room is a Jitsi Meet room, opened inside the site.
export const JITSI_DOMAIN = 'meet.jit.si';
// A student may enter the 1-to-1 room from this long before the class starts, until this long after it ends (seconds).
export const EARLY = 15 * 60, LATE = 30 * 60;

// A YouTube video id from a link or an id ("https://youtu.be/abc...", "...watch?v=...", "...live/..."), or '' if there is none.
export function videoId(text) {
  const s = String(text || '').trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|\/live\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}
// A YouTube playlist id from a link ("...playlist?list=PL...") or an id, or '' if there is none.
export function playlistId(text) {
  const s = String(text || '').trim();
  if (/^[A-Za-z0-9_-]{12,64}$/.test(s) && /^(PL|UU|OLAK|FL|RD)/.test(s)) return s;
  const m = s.match(/[?&]list=([A-Za-z0-9_-]{12,64})/);
  return m ? m[1] : '';
}

// Is a class open to this student right now? Used by the server; the owner is always let in.
export const roomOpen = (row, now) => now >= row.starts_at - EARLY && now <= row.starts_at + row.minutes * 60 + LATE;

export const kindLabel = k => (k === 'one' ? '1-to-1 class' : 'Live class');
export const when = t => new Date(t * 1000).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
export const clock = t => new Date(t * 1000).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
// "in 2 hours", "starts in 14 min", "live now": for a class that starts at `start` and lasts `minutes`.
export function until(start, minutes, now) {
  const end = start + minutes * 60;
  if (now >= end) return 'finished';
  if (now >= start) return 'live now';
  const m = Math.round((start - now) / 60);
  if (m < 60) return `starts in ${m} min`;
  const h = Math.round(m / 60);
  return h < 24 ? `in ${h} hour${h > 1 ? 's' : ''}` : `in ${Math.round(h / 24)} day${Math.round(h / 24) > 1 ? 's' : ''}`;
}
