import SUMMARIES from './summaries';

export const SITE = {
  name: 'MathSetu',            // TODO: your brand name
  telegram: 'https://t.me/MathSetu',
  youtube: 'https://www.youtube.com/@MathSetu2026',
  // The site's own address, used in the sitemap, robots.txt and link previews.
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://mathsetu.in' : 'http://localhost:3000'),
};

// Live batches, one per class. Fill these in when a batch is announced; an empty field is shown as "To be announced".
// starts: e.g. '5 April 2027'. days: e.g. 'Mon, Wed, Fri, 6-7 pm'. fee: e.g. 'Rs 999 per month'. enrol: link to the enrolment form.
export const LIVE = {
  'class-8': { starts: '', days: '', fee: '', enrol: '' },
  'class-9': { starts: '', days: '', fee: '', enrol: '' },
  'class-10': { starts: '', days: '', fee: '', enrol: '' },
};

// The three ways to study on this site, used by the header, the home page and the class pages.
export const MODES = [
  { href: '/live-courses', label: 'Live Courses', badge: 'LIVE', kind: 'live', text: 'Online classes with a teacher at a fixed time, with doubts solved in class.' },
  { href: '/recorded-lectures', label: 'Recorded Lectures', badge: 'RECORDED', kind: 'rec', text: 'Chapter-wise video lectures in Hinglish that you can watch any time.' },
  { href: '/self-study', label: 'Self Study', badge: 'FREE', kind: 'self', text: 'Short notes, formula bank, DPP sheets and previous year questions as PDFs.' },
];
// The other links of the header, after the three study modes.
export const MORE = [
  { href: '/tests', label: 'Test Series' },
  { href: '/doubts', label: 'Ask a Doubt' },
  { href: '/blog', label: 'Blog' },
  { href: '/olympiad', label: 'Olympiad' },
];

// boards: 'CBSE', 'ICSE'. youtube = video ID (leave '' until uploaded).
// part (optional): the book or book part a chapter belongs to; shown as a heading on the class page.
// no (optional): chapter number to show when a part does not start from 1.
const GP1 = 'Ganita Prakash Part 1', GP2 = 'Ganita Prakash Part 2';
const NC10 = 'NCERT Mathematics';
const GM1 = 'Ganita Manjari Part 1', GM2 = 'Ganita Manjari Part 2';
export const BOARDS = ['CBSE', 'ICSE'];
export const CLASSES = {
  'class-8': { label: 'Class 8', chapters: [
    { slug: 'a-square-and-a-cube', title: 'A Square and A Cube', hi: 'वर्ग और घन', boards: ['CBSE'], part: GP1 },
    { slug: 'power-play', title: 'Power Play', hi: 'घातों का खेल', boards: ['CBSE'], part: GP1 },
    { slug: 'a-story-of-numbers', title: 'A Story of Numbers', hi: 'संख्याओं की कहानी', boards: ['CBSE'], part: GP1 },
    { slug: 'quadrilaterals', title: 'Quadrilaterals', hi: 'चतुर्भुज', boards: ['CBSE'], part: GP1 },
    { slug: 'number-play', title: 'Number Play', hi: 'संख्याओं का खेल', boards: ['CBSE'], part: GP1 },
    { slug: 'we-distribute-yet-things-multiply', title: 'We Distribute Yet Things Multiply', hi: 'वितरण और गुणन', boards: ['CBSE'], part: GP1 },
    { slug: 'proportional-reasoning-1', title: 'Proportional Reasoning 1', hi: 'आनुपातिक तर्क 1', boards: ['CBSE'], part: GP1 },
    { slug: 'fractions-in-disguise', title: 'Fractions in Disguise', hi: 'छिपी हुई भिन्नें', boards: ['CBSE'], part: GP2 },
    { slug: 'baudhayana-pythagoras-theorem', title: 'The Baudhayana-Pythagoras Theorem', hi: 'बौधायन-पाइथागोरस प्रमेय', boards: ['CBSE'], part: GP2 },
    { slug: 'proportional-reasoning-2', title: 'Proportional Reasoning 2', hi: 'आनुपातिक तर्क 2', boards: ['CBSE'], part: GP2 },
    { slug: 'exploring-some-geometric-themes', title: 'Exploring Some Geometric Themes', hi: 'कुछ ज्यामितीय विषयों की खोज', boards: ['CBSE'], part: GP2 },
    { slug: 'tales-by-dots-and-lines', title: 'Tales by Dots and Lines', hi: 'बिंदुओं और रेखाओं की कहानियाँ', boards: ['CBSE'], part: GP2 },
    { slug: 'algebra-play', title: 'Algebra Play', hi: 'बीजगणित का खेल', boards: ['CBSE'], part: GP2 },
    { slug: 'area', title: 'Area', hi: 'क्षेत्रफल', boards: ['CBSE'], part: GP2 },
  ]},
  'class-9': { label: 'Class 9', chapters: [
    { slug: 'orienting-yourself-coordinates', title: 'Orienting Yourself: The Use of Coordinates', hi: 'निर्देशांकों का उपयोग', boards: ['CBSE'], part: GM1 },
    { slug: 'linear-polynomials', title: 'Introduction to Linear Polynomials', hi: 'रैखिक बहुपद का परिचय', boards: ['CBSE'], part: GM1 },
    { slug: 'the-world-of-numbers', title: 'The World of Numbers', hi: 'संख्याओं की दुनिया', boards: ['CBSE'], part: GM1 },
    { slug: 'algebraic-identities', title: 'Exploring Algebraic Identities', hi: 'बीजीय सर्वसमिकाएँ', boards: ['CBSE'], part: GM1 },
    { slug: 'up-and-down-round-and-round', title: "I'm Up and Down, and Round and Round", hi: 'ऊपर-नीचे और गोल-गोल', boards: ['CBSE'], part: GM1 },
    { slug: 'perimeter-and-area', title: 'Measuring Space: Perimeter and Area', hi: 'परिमाप और क्षेत्रफल', boards: ['CBSE'], part: GM1 },
    { slug: 'introduction-to-probability', title: 'The Mathematics of Maybe: Introduction to Probability', hi: 'प्रायिकता का परिचय', boards: ['CBSE'], part: GM1 },
    { slug: 'sequences-and-progressions', title: 'Predicting What Comes Next? Exploring Sequences and Progressions', hi: 'अनुक्रम और श्रेढ़ियाँ', boards: ['CBSE'], part: GM1 },
    { slug: 'propositions-and-converses', title: 'Propositions and their Converses', hi: 'कथन और उनके विलोम', boards: ['CBSE'], part: GM2, no: 9 },
    { slug: 'understanding-data', title: 'How Quantities Combine: Understanding Data', hi: 'आँकड़ों की समझ', boards: ['CBSE'], part: GM2, no: 10 },
    { slug: 'the-world-of-algorithms', title: 'The World of Algorithms', hi: 'एल्गोरिदम की दुनिया', boards: ['CBSE'], part: GM2, no: 11 },
    { slug: 'quadrilaterals', title: 'Quadrilaterals', hi: 'चतुर्भुज', boards: ['CBSE'], part: GM2, no: 12 },
    { slug: 'two-variables-one-line', title: 'Two Variables, One Line', hi: 'दो चर वाले रैखिक समीकरण', boards: ['CBSE'], part: GM2, no: 13 },
    { slug: 'surface-area-and-volume', title: 'Math of Space: Surface Area and Volume', hi: 'पृष्ठीय क्षेत्रफल और आयतन', boards: ['CBSE'], part: GM2, no: 14 },
  ]},
  'class-10': { label: 'Class 10', chapters: [
    { slug: 'real-numbers', title: 'Real Numbers', hi: 'वास्तविक संख्याएँ', boards: ['CBSE'], part: NC10 },
    { slug: 'polynomials', title: 'Polynomials', hi: 'बहुपद', boards: ['CBSE'], part: NC10 },
    { slug: 'pair-of-linear-equations', title: 'Pair of Linear Equations in Two Variables', hi: 'दो चर वाले रैखिक समीकरण युग्म', boards: ['CBSE'], part: NC10 },
    { slug: 'quadratic-equations', title: 'Quadratic Equations', hi: 'द्विघात समीकरण', boards: ['CBSE'], part: NC10 },
    { slug: 'arithmetic-progression', title: 'Arithmetic Progressions', hi: 'समांतर श्रेढ़ियाँ', boards: ['CBSE'], part: NC10 },
    { slug: 'triangles', title: 'Triangles', hi: 'त्रिभुज', boards: ['CBSE'], part: NC10 },
    { slug: 'coordinate-geometry', title: 'Coordinate Geometry', hi: 'निर्देशांक ज्यामिति', boards: ['CBSE'], part: NC10 },
    { slug: 'trigonometry', title: 'Introduction to Trigonometry', hi: 'त्रिकोणमिति का परिचय', boards: ['CBSE'], part: NC10 },
    { slug: 'applications-of-trigonometry', title: 'Some Applications of Trigonometry', hi: 'त्रिकोणमिति के कुछ अनुप्रयोग', boards: ['CBSE'], part: NC10 },
    { slug: 'circles', title: 'Circles', hi: 'वृत्त', boards: ['CBSE'], part: NC10 },
    { slug: 'areas-related-to-circles', title: 'Areas Related to Circles', hi: 'वृत्तों से संबंधित क्षेत्रफल', boards: ['CBSE'], part: NC10 },
    { slug: 'surface-areas-and-volumes', title: 'Surface Areas and Volumes', hi: 'पृष्ठीय क्षेत्रफल और आयतन', boards: ['CBSE'], part: NC10 },
    { slug: 'statistics', title: 'Statistics', hi: 'सांख्यिकी', boards: ['CBSE'], part: NC10 },
    { slug: 'probability', title: 'Probability', hi: 'प्रायिकता', boards: ['CBSE'], part: NC10 },
  ]},
};

// ICSE chapters follow Selina Concise Mathematics, in book order.
const SEL = 'Selina Concise Mathematics';
const SELINA = {
  'class-8': ['Rational Numbers', 'Exponents (Powers)', 'Squares and Square Roots', 'Cubes and Cube Roots', 'Playing with Numbers',
    'Sets', 'Percent and Percentage', 'Profit, Loss and Discount', 'Simple and Compound Interest', 'Direct and Inverse Variations',
    'Algebraic Expressions', 'Algebraic Identities', 'Factorisation', 'Linear Equations in One Variable', 'Linear Inequations',
    'Understanding Shapes', 'Special Types of Quadrilaterals', 'Constructions', 'Representing 3-D in 2-D',
    'Area of a Trapezium and a Polygon', 'Surface Area, Volume and Capacity', 'Data Handling', 'Probability'],
  'class-9': ['Rational and Irrational Numbers', 'Compound Interest (Without Using Formula)', 'Compound Interest (Using Formula)',
    'Expansions', 'Factorisation', 'Simultaneous Linear Equations', 'Indices (Exponents)', 'Logarithms',
    'Triangles (Congruency in Triangles)', 'Isosceles Triangles', 'Inequalities', 'Mid-point and Its Converse', 'Pythagoras Theorem',
    'Rectilinear Figures', 'Construction of Polygons', 'Area Theorems', 'Circle', 'Statistics', 'Mean and Median',
    'Area and Perimeter of Plane Figures', 'Solids', 'Trigonometrical Ratios', 'Trigonometrical Ratios of Standard Angles',
    'Solution of Right Triangles', 'Complementary Angles', 'Co-ordinate Geometry', 'Graphical Solution', 'Distance Formula'],
  'class-10': ['GST', 'Banking (Recurring Deposit Accounts)', 'Shares and Dividend', 'Linear Inequations', 'Quadratic Equations',
    'Solving Problems Based on Quadratic Equations', 'Ratio and Proportion', 'Remainder and Factor Theorems', 'Matrices',
    'Arithmetic Progression', 'Geometric Progression', 'Reflection', 'Section and Mid-Point Formula', 'Equation of a Line',
    'Similarity', 'Loci', 'Circles', 'Tangents and Intersecting Chords', 'Constructions (Circles)', 'Cylinder, Cone and Sphere',
    'Trigonometrical Identities', 'Heights and Distances', 'Graphical Representation (Histograms and Ogives)',
    'Measures of Central Tendency', 'Probability'],
};
// ICSE slugs get an icse- prefix so they never clash with a CBSE chapter of the same name.
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const [cls, titles] of Object.entries(SELINA))
  CLASSES[cls].chapters.push(...titles.map(title => ({ title, slug: 'icse-' + slugify(title), boards: ['ICSE'], part: SEL })));

for (const [cls, c] of Object.entries(CLASSES)) for (const ch of c.chapters) ch.summary = SUMMARIES[cls][ch.slug];
