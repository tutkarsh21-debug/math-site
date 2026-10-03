// Draws a geometry diagram as inline SVG from a one-line description, used by "!fig" lines in content files.
//
//   !fig w=340 h=220; P A 170 20 t; P B 40 200 bl; P C 300 200 br; L A B; L A C; L B C; cap Triangle ABC
//
// Commands are separated by ";". Coordinates are in pixels, with y increasing downwards.
//   w=.. h=..            size of the drawing
//   P name x y [pos]     a labelled point; pos is where the label goes: t b l r tl tr bl br, or "-" for no label
//   Q name x y           a point with no dot and no label (for construction)
//   L a b                a line segment        H a b   a highlighted (blue) segment      D a b   a dashed segment
//   C o r                a circle, centre o    ARC o r a1 a2   an arc from angle a1 to a2 (degrees, anticlockwise)
//   SEC o r a1 a2        a filled sector       SEG o r a1 a2   a filled segment (between the chord and the arc)
//   F a b c ...          a filled polygon
//   R a b c              a right-angle mark at b
//   A a b c text         an angle arc at b, with a label
//   M a b text           a label beside the middle of segment ab (N a b text puts it on the other side)
//   T x y text           free text
//   cap text             the caption under the drawing
const INK = '#10182b', BLUE = '#1557d6', SOFT = 'rgba(21,87,214,.14)', SUN = 'rgba(255,197,51,.5)';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r1 = n => Math.round(n * 10) / 10;
const OFFSET = { t: [0, -8, 'middle'], b: [0, 17, 'middle'], l: [-9, 5, 'end'], r: [9, 5, 'start'],
  tl: [-7, -7, 'end'], tr: [7, -7, 'start'], bl: [-7, 15, 'end'], br: [7, 15, 'start'] };

export function figure(spec) {
  const pts = {}, under = [], lines = [], marks = [], labels = [];
  let w = 340, h = 220, cap = '';
  const pt = name => pts[name] || (() => { throw new Error(`figure: unknown point "${name}" in: ${spec.slice(0, 60)}`); })();
  const polar = (o, r, deg) => [o[0] + r * Math.cos(deg * Math.PI / 180), o[1] - r * Math.sin(deg * Math.PI / 180)];
  const unit = (from, to) => { const dx = to[0] - from[0], dy = to[1] - from[1], d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d]; };
  const text = (x, y, s, anchor = 'middle', cls = 'lbl') => labels.push(`<text class="${cls}" x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}">${esc(s)}</text>`);
  const seg = (a, b, attrs) => lines.push(`<line x1="${r1(pt(a)[0])}" y1="${r1(pt(a)[1])}" x2="${r1(pt(b)[0])}" y2="${r1(pt(b)[1])}" ${attrs}/>`);
  const arcPath = (o, r, a1, a2) => { const p = polar(o, r, a1), q = polar(o, r, a2); return `M${r1(p[0])} ${r1(p[1])} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${r1(q[0])} ${r1(q[1])}`; };

  for (const cmd of spec.split(';').map(c => c.trim()).filter(Boolean)) {
    const [op, ...a] = cmd.split(/\s+/);
    if (op.startsWith('w=') || op.startsWith('h=')) { for (const kv of [op, ...a]) { const [k, v] = kv.split('='); if (k === 'w') w = +v; if (k === 'h') h = +v; } }
    else if (op === 'P' || op === 'Q') {
      pts[a[0]] = [+a[1], +a[2]];
      if (op === 'P') {
        marks.push(`<circle cx="${a[1]}" cy="${a[2]}" r="2.6" fill="${INK}"/>`);
        const o = OFFSET[a[3] || 't'];
        if (o) text(+a[1] + o[0], +a[2] + o[1], a[0], o[2], 'pt');
      }
    }
    else if (op === 'L') seg(a[0], a[1], `stroke="${INK}" stroke-width="1.5"`);
    else if (op === 'H') seg(a[0], a[1], `stroke="${BLUE}" stroke-width="2.4"`);
    else if (op === 'D') seg(a[0], a[1], `stroke="${INK}" stroke-width="1.1" stroke-dasharray="5 4"`);
    else if (op === 'C') lines.push(`<circle cx="${pt(a[0])[0]}" cy="${pt(a[0])[1]}" r="${a[1]}" fill="none" stroke="${INK}" stroke-width="1.5"/>`);
    else if (op === 'ARC') lines.push(`<path d="${arcPath(pt(a[0]), +a[1], +a[2], +a[3])}" fill="none" stroke="${INK}" stroke-width="1.5"/>`);
    else if (op === 'SEC') { const o = pt(a[0]); under.push(`<path d="M${o[0]} ${o[1]} L${arcPath(o, +a[1], +a[2], +a[3]).slice(1)} Z" fill="${SOFT}"/>`); }
    else if (op === 'SEG') under.push(`<path d="${arcPath(pt(a[0]), +a[1], +a[2], +a[3])} Z" fill="${SUN}"/>`);
    else if (op === 'F') under.push(`<polygon points="${a.map(n => pt(n).map(r1).join(',')).join(' ')}" fill="${SOFT}"/>`);
    else if (op === 'R') {
      const b = pt(a[1]), u = unit(b, pt(a[0])), v = unit(b, pt(a[2])), s = 9;
      marks.push(`<path d="M${r1(b[0] + u[0] * s)} ${r1(b[1] + u[1] * s)} L${r1(b[0] + (u[0] + v[0]) * s)} ${r1(b[1] + (u[1] + v[1]) * s)} L${r1(b[0] + v[0] * s)} ${r1(b[1] + v[1] * s)}" fill="none" stroke="${INK}" stroke-width="1"/>`);
    }
    else if (op === 'A') {
      const b = pt(a[1]), u = unit(b, pt(a[0])), v = unit(b, pt(a[2])), r = 17;
      const sweep = u[0] * v[1] - u[1] * v[0] > 0 ? 1 : 0;
      marks.push(`<path d="M${r1(b[0] + u[0] * r)} ${r1(b[1] + u[1] * r)} A${r} ${r} 0 0 ${sweep} ${r1(b[0] + v[0] * r)} ${r1(b[1] + v[1] * r)}" fill="none" stroke="${BLUE}" stroke-width="1.3"/>`);
      const m = unit([0, 0], [u[0] + v[0], u[1] + v[1]]), label = a.slice(3).join(' ');
      if (label) text(b[0] + m[0] * 31, b[1] + m[1] * 31 + 4, label, 'middle', 'ang');
    }
    else if (op === 'M' || op === 'N') {
      const p = pt(a[0]), q = pt(a[1]), u = unit(p, q), side = op === 'M' ? 1 : -1;
      text((p[0] + q[0]) / 2 + u[1] * 13 * side, (p[1] + q[1]) / 2 - u[0] * 13 * side + 4, a.slice(2).join(' '));
    }
    else if (op === 'T') text(+a[0], +a[1], a.slice(2).join(' '));
    else if (op === 'cap') cap = a.join(' ');
    else throw new Error(`figure: unknown command "${op}" in: ${spec.slice(0, 60)}`);
  }
  return `<figure class="fig"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:${r1(w * 0.2646)}mm">`
    + under.join('') + lines.join('') + marks.join('') + labels.join('') + '</svg>'
    + (cap ? `<figcaption>${esc(cap)}</figcaption>` : '') + '</figure>';
}
