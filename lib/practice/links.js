// For each chapter of the practice generator, the chapter pages of the site that teach it (notes, formula bank, DPP and test).
// The generator names its chapters in its own way, and CBSE and ICSE books split a topic differently, so a topic can have
// several pages. A name starting with "icse-" is an ICSE chapter; the others are CBSE.
export const NOTES = {
  'class-8': {
    'squares-cubes-and-roots': ['a-square-and-a-cube', 'icse-squares-and-square-roots', 'icse-cubes-and-cube-roots'],
    'exponents-and-powers': ['power-play', 'icse-exponents-powers'],
    'percentages-profit-loss': ['fractions-in-disguise', 'icse-percent-and-percentage', 'icse-profit-loss-and-discount'],
    'simple-and-compound-interest': ['fractions-in-disguise', 'icse-simple-and-compound-interest'],
    'linear-equations-one-variable': ['algebra-play', 'icse-linear-equations-in-one-variable'],
    'algebraic-expressions-identities': ['we-distribute-yet-things-multiply', 'icse-algebraic-expressions', 'icse-algebraic-identities'],
    'mensuration': ['area', 'icse-area-of-a-trapezium-and-a-polygon', 'icse-surface-area-volume-and-capacity'],
    'understanding-quadrilaterals': ['quadrilaterals', 'icse-special-types-of-quadrilaterals', 'icse-understanding-shapes'],
    'ratio-proportion-variation': ['proportional-reasoning-1', 'proportional-reasoning-2', 'icse-direct-and-inverse-variations'],
    'data-handling-probability': ['tales-by-dots-and-lines', 'icse-data-handling', 'icse-probability'],
  },
  'class-9': {
    'number-systems': ['the-world-of-numbers', 'icse-rational-and-irrational-numbers'],
    'algebraic-identities': ['algebraic-identities', 'icse-expansions', 'icse-factorisation'],
    'linear-equations-two-variables': ['two-variables-one-line', 'icse-simultaneous-linear-equations', 'icse-graphical-solution'],
    'triangles-and-quadrilaterals': ['quadrilaterals', 'icse-triangles-congruency-in-triangles', 'icse-rectilinear-figures', 'icse-mid-point-and-its-converse'],
    'circles': ['up-and-down-round-and-round', 'icse-circle'],
    'heron-and-mensuration': ['perimeter-and-area', 'surface-area-and-volume', 'icse-area-and-perimeter-of-plane-figures', 'icse-solids'],
    'statistics': ['understanding-data', 'icse-statistics', 'icse-mean-and-median'],
    'probability': ['introduction-to-probability'],
  },
  'class-10': {
    'real-numbers': ['real-numbers'],
    'polynomials': ['polynomials', 'icse-remainder-and-factor-theorems'],
    'pair-of-linear-equations': ['pair-of-linear-equations'],
    'quadratic-equations': ['quadratic-equations', 'icse-quadratic-equations', 'icse-solving-problems-based-on-quadratic-equations'],
    'arithmetic-progression': ['arithmetic-progression', 'icse-arithmetic-progression'],
    'coordinate-geometry': ['coordinate-geometry', 'icse-section-and-mid-point-formula', 'icse-equation-of-a-line'],
    'trigonometry': ['trigonometry', 'icse-trigonometrical-identities'],
    'applications-of-trigonometry': ['applications-of-trigonometry', 'icse-heights-and-distances'],
    'statistics': ['statistics', 'icse-measures-of-central-tendency', 'icse-graphical-representation-histograms-and-ogives'],
    'probability': ['probability', 'icse-probability'],
    'surface-areas-and-volumes': ['surface-areas-and-volumes', 'icse-cylinder-cone-and-sphere'],
    'areas-related-to-circles': ['areas-related-to-circles'],
    'triangles': ['triangles', 'icse-similarity'],
    'circles': ['circles', 'icse-circles', 'icse-tangents-and-intersecting-chords'],
  },
};

// The pages to read for a practice chapter: [{ href: '/class-10/real-numbers', label: 'CBSE notes' }, ...].
// For a chapter test, the chapter page itself is given (chapter slug in `slug`, with no practice list needed).
// When a board has more than one page for the topic, each is named by its chapter ("ICSE: Solids"), so that they can be told apart.
const nice = slug => slug.replace(/^icse-/, '').split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
export function notesFor(cls, ch) {
  const slugs = NOTES[cls]?.[ch] || [], count = b => slugs.filter(s => s.startsWith('icse-') === (b === 'ICSE')).length;
  return slugs.map(slug => {
    const board = slug.startsWith('icse-') ? 'ICSE' : 'CBSE';
    return { href: `/${cls}/${slug}`, label: count(board) > 1 ? `${board}: ${nice(slug)}` : `${board} notes` };
  });
}
