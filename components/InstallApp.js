'use client';
import { useEffect, useState } from 'react';

// Registers the service worker (needed before a phone offers to install the site as an app), and, with `button`,
// shows an "Install the app" button on phones and browsers that support installing.
export default function InstallApp({ button = false }) {
  const [prompt, setPrompt] = useState(null);
  const [state, setState] = useState('');   // '', 'installed'

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    if (!button) return;
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) setState('installed');
    // The browser offers its install prompt once; it is kept so the button can show it when tapped.
    const ready = e => { e.preventDefault(); setPrompt(e); };
    const done = () => { setPrompt(null); setState('installed'); };
    window.addEventListener('beforeinstallprompt', ready);
    window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', ready); window.removeEventListener('appinstalled', done); };
  }, [button]);

  if (!button) return null;
  if (state === 'installed') return <p className="muted">The app is installed on this device. Open it from your home screen.</p>;
  if (!prompt) return <p className="muted">If you do not see an install button here, follow the steps for your phone below.</p>;
  return <button className="btn btn-sun" onClick={async () => { prompt.prompt(); await prompt.userChoice; setPrompt(null); }}>Install the app</button>;
}
