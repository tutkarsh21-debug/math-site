import Link from 'next/link';
import { waLink } from '@/lib/contact';

const MESSAGE = 'Hello MathSetu, I would like to know about 1-to-1 Maths tuition. My child is in Class __ (CBSE / ICSE).';

// The one button for 1-to-1 tuition: a WhatsApp chat once the number is set in lib/data.js (SITE.whatsapp), otherwise the enquiry form.
export default function TalkToUs({ children = 'Ask about a trial class', className = 'btn btn-sun', text = MESSAGE }) {
  const wa = waLink(text);
  return wa
    ? <a className={className} href={wa} target="_blank" rel="noopener">{children}</a>
    : <Link className={className} href="/enquiry">{children}</Link>;
}

// A round WhatsApp button at the corner of every page, shown only once the number is set.
export function WhatsAppFloat() {
  const wa = waLink('Hello MathSetu, I have a question about Maths classes.');
  if (!wa) return null;
  return (<a className="wa-float" href={wa} target="_blank" rel="noopener" aria-label="Chat with MathSetu on WhatsApp">
    <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11.1 19.7L3 29l6.5-1.8A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.8 1 1-3.7-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7a.6.6 0 0 0 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.4 3.4 14.6 14.6 0 0 0 5.6 4.9c2.1.9 2.9.9 3.9.8a3.3 3.3 0 0 0 2.2-1.6 2.7 2.7 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.4Z" /></svg>
  </a>);
}
