import SUMMARIES from './summaries';

export const SITE = {
  name: 'MathSetu',            // TODO: your brand name
  telegram: 'https://t.me/MathSetu',
  youtube: 'https://www.youtube.com/@MathSetu2026',
  // A public email address for parents and for password help. Leave it empty until you have one; it is then shown in the footer.
  email: 'contact@mathsetu.in',
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

// How MathSetu teaches, in six points. Shown on the home page.
export const APPROACH = [
  { title: 'Concept first', text: 'We explain why a method works before how to use it, so nothing has to be memorised blindly.' },
  { title: 'From the basics', text: 'Every chapter starts from what the student already knows and fills the gaps left from earlier classes.' },
  { title: 'A little every day', text: 'A short practice sheet for every chapter, with answers, so that practice becomes a habit.' },
  { title: 'Test, then move on', text: 'A timed test after each chapter shows what is understood and what needs another look.' },
  { title: 'Doubts in private', text: 'A student can send a doubt with a photo and get a step-by-step answer. No one else sees it.' },
  { title: 'Simple Hinglish', text: 'Lessons are explained in everyday Hinglish, with maths terms kept in English as in the exam.' },
];
// The three programmes, from free to live. "hot" marks the one the site leads with.
export const PROGRAMMES = [
  { name: 'Self Study', tag: 'Free', href: '/self-study', go: 'Start free', line: 'Start today, at your own pace.',
    gets: ['Short notes and a formula sheet for every chapter', 'A daily practice sheet with answers', 'A timed online test for every chapter', 'Previous year questions for Class 10'] },
  { name: 'Recorded Lectures', tag: 'Watch any time', href: '/recorded-lectures', go: 'See the lectures', line: 'Everything in Self Study, plus:',
    gets: ['Chapter-wise video lessons in Hinglish', 'Pause, rewind and watch again', 'Being added chapter by chapter'] },
  { name: 'Live Classes', tag: 'Free demo first', href: '/live-courses', go: 'See live courses', hot: true, line: 'Everything in Self Study, plus:',
    gets: ['Online classes with a teacher at a fixed time', 'Doubts solved in the class itself', 'Batch details are shared after the demo'] },
];
// How a parent joins. Shown on the home page and on the demo page.
export const JOIN = [
  { title: 'Book a free demo', text: 'Fill in the short form with your child\'s class and board. It takes less than a minute.' },
  { title: 'We call you to fix a time', text: 'We call the number you gave and agree on a time that suits you and your child.' },
  { title: 'Attend, then decide', text: 'Your child attends the demo class online. If you like it, we help you choose a batch. There is nothing to pay for the demo.' },
];
// About the teacher. Leave the name empty to hide this block. Fill in only what is true and what you are happy to make public.
// photo: a file placed in public/, for example '/teacher.jpg'. points: short facts such as '12 years of teaching'.
export const TEACHER = { name: '', title: '', about: '', photo: '', points: [] };
// What parents and students have said. Add only real words, with permission: { words: '...', by: 'Parent of a Class 9 student, Lucknow' }.
// The block is hidden while this list is empty.
export const TESTIMONIALS = [];

// The three ways to study on this site, used by the header, the home page and the class pages.
export const MODES = [
  { href: '/live-courses', label: 'Live Courses', badge: 'LIVE', kind: 'live', text: 'Online classes with a teacher at a fixed time, with doubts solved in class.' },
  { href: '/recorded-lectures', label: 'Recorded Lectures', badge: 'RECORDED', kind: 'rec', text: 'Chapter-wise video lectures in Hinglish that you can watch any time.' },
  { href: '/self-study', label: 'Self Study', badge: 'FREE', kind: 'self', text: 'Short notes, formula bank, DPP sheets and previous year questions as PDFs.' },
];
// The other links of the header, after the three study modes.
// The header menu: a few groups instead of a long row of links. A group has items; a single link has an href.
export const NAV = [
  { label: 'Classes', items: [
    { href: '/class-8', label: 'Class 8 Maths', note: 'CBSE and ICSE' },
    { href: '/class-9', label: 'Class 9 Maths', note: 'CBSE and ICSE' },
    { href: '/class-10', label: 'Class 10 Maths', note: 'CBSE and ICSE' },
    { href: '/olympiad', label: 'Olympiad (SOF IMO)', note: 'Prepare alongside school' },
  ] },
  { label: 'Learn', items: [
    { href: '/self-study', label: 'Self Study', note: 'Free notes, formulas and DPP' },
    { href: '/recorded-lectures', label: 'Recorded Lectures', note: 'Video lessons in Hinglish' },
    { href: '/live-courses', label: 'Live Courses', note: 'A teacher, at a fixed time' },
    { href: '/start', label: 'Weak in maths? Start here', note: 'From the basics, in six steps' },
  ] },
  { label: 'Practice', items: [
    { href: '/practice', label: 'Practice Generator', note: 'A new test every time', hot: true },
    { href: '/tests', label: 'Test Series', note: 'Timed chapter tests' },
    { href: '/sample-papers', label: 'Sample Papers', note: 'Board-style papers' },
  ] },
  { href: '/doubts', label: 'Ask a Doubt' },
];
// The path shown on the home page: what a student does, in order, and where to do it.
export const ROADMAP = [
  { stage: 'Foundation', title: 'Understand the basics', text: 'Short notes that start from what you already know, and a formula bank for each chapter.', href: '/self-study', go: 'Open the notes' },
  { stage: 'Practice', title: 'Practise every day', text: 'A DPP sheet with answers, and a practice generator that writes a fresh test whenever you want one.', href: '/practice', go: 'Make a test' },
  { stage: 'Check', title: 'Test and fix gaps', text: 'A timed test for every chapter, with an explanation for each answer and a list of weak topics.', href: '/tests', go: 'Take a test' },
  { stage: 'Exam ready', title: 'Revise like the exam', text: 'Previous year questions, board-style sample papers and, if you like, Olympiad practice.', href: '/sample-papers', go: 'See sample papers' },
];
// Tools that keep a student and a parent on track. href 'TELEGRAM' means the Telegram link of the site.
export const TOOLS = [
  { title: 'Student dashboard', text: 'See your scores, the chapters you have finished and what to study next.', href: '/account', go: 'Open my dashboard' },
  { title: 'Parent dashboard', text: 'A parent can follow tests and progress with a simple parent code.', href: '/parent', go: 'Open the parent view' },
  { title: 'Private doubts', text: 'Send a doubt with a photo and get a step-by-step answer. Nobody else sees it.', href: '/doubts', go: 'Ask a doubt' },
  { title: 'Test analysis and AI report', text: 'After a test, see strong and weak topics, and what to read next.', href: '/tests', go: 'Take a test' },
  { title: 'A daily problem', text: 'A new problem every day on Telegram, to keep the habit going.', href: 'TELEGRAM', go: 'Join Telegram' },
  { title: 'The MathSetu app', text: 'Add MathSetu to your phone and open it like any other app.', href: '/app', go: 'Get the app' },
];
export const MORE = [
  { href: '/practice', label: 'Practice Generator', hot: true },
  { href: '/tests', label: 'Test Series' },
  { href: '/doubts', label: 'Ask a Doubt' },
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
