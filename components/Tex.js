'use client';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Text with $maths$ and **bold**, as in the notes.
export function Tex({ text }) {
  let bold = false;
  const html = text.split(/(\$[^$]+\$)/).map(part =>
    part.startsWith('$') && part.endsWith('$') && part.length > 2
      ? katex.renderToString(part.slice(1, -1).replace(/°/g, '^\\circ'), { throwOnError: false, strict: 'ignore' })
      : part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*/g, () => (bold = !bold) ? '<strong>' : '</strong>')).join('');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
