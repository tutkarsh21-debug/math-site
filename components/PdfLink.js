'use client';
import { trackPdf } from '@/components/Tracker';

// A link to a PDF. The click is counted for a logged-in student; for anyone else it is a plain link.
export default function PdfLink({ href, children, ...rest }) {
  return <a href={href} onClick={() => trackPdf(href)} {...rest}>{children}</a>;
}
