'use client';
import { useEffect, useState } from 'react';
import { YT_CHANNEL_ID } from '@/lib/studio';

// The live studio's player. If a live class with its own YouTube video link is on now (or about to start), that stream is shown;
// otherwise the live stream of the MathSetu channel, which YouTube shows by itself whenever the channel is live.
export default function LivePlayer() {
  const [items, setItems] = useState(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    const load = () => fetch('/api/timetable?scope=live').then(r => r.json()).then(d => { setItems(d.items); setNow(d.now); }).catch(() => setItems([]));
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);
  const current = items?.find(i => i.status !== 'cancelled' && i.link && now >= i.starts_at - 900 && now <= i.starts_at + i.minutes * 60 + 900);
  const src = current ? `https://www.youtube.com/embed/${current.link}?rel=0` : `https://www.youtube.com/embed/live_stream?channel=${YT_CHANNEL_ID}&rel=0`;
  return (<div className="player-wrap">
    <div className="player"><iframe key={src} src={src} title="MathSetu live class" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen loading="lazy" /></div>
    <p className="muted small player-note">{current ? `Now showing: ${current.title}. ` : 'Showing the MathSetu channel\'s live stream. When no class is live, YouTube says so here. '}
      <a href={`https://www.youtube.com/channel/${YT_CHANNEL_ID}/live`} target="_blank" rel="noopener">Open on YouTube</a></p>
  </div>);
}
