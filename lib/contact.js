import { SITE } from '@/lib/data';

// A WhatsApp chat link with a ready first message, or '' while SITE.whatsapp is not set.
export function waLink(text) {
  const n = String(SITE.whatsapp || '').replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : '';
}
