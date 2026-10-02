export const SITE = {
  name: 'MathSetu',            // TODO: your brand name
  telegram: 'https://t.me/MathSetu',
  youtube: 'https://www.youtube.com/@MathSetu2026',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

// boards: 'CBSE', 'ICSE'. youtube = video ID (leave '' until uploaded).
// part (optional): the book part a CBSE chapter belongs to; shown as a heading on the class page.
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
    { slug: 'rational-numbers', title: 'Rational Numbers', hi: 'परिमेय संख्याएँ', boards: ['ICSE'] },
    { slug: 'squares-and-square-roots', title: 'Squares and Square Roots', hi: 'वर्ग और वर्गमूल', boards: ['ICSE'] },
    { slug: 'linear-equations', title: 'Linear Equations in One Variable', hi: 'रैखिक समीकरण', boards: ['ICSE'] },
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
    { slug: 'number-systems', title: 'Number Systems', hi: 'संख्या पद्धति', boards: ['ICSE'] },
    { slug: 'polynomials', title: 'Polynomials', hi: 'बहुपद', boards: ['ICSE'] },
    { slug: 'coordinate-geometry', title: 'Coordinate Geometry', hi: 'निर्देशांक ज्यामिति', boards: ['ICSE'] },
  ]},
  'class-10': { label: 'Class 10', chapters: [
    { slug: 'real-numbers', title: 'Real Numbers', hi: 'वास्तविक संख्याएँ', boards: ['CBSE'], part: NC10 },
    { slug: 'polynomials', title: 'Polynomials', hi: 'बहुपद', boards: ['CBSE'], part: NC10 },
    { slug: 'pair-of-linear-equations', title: 'Pair of Linear Equations in Two Variables', hi: 'दो चर वाले रैखिक समीकरण युग्म', boards: ['CBSE'], part: NC10 },
    { slug: 'quadratic-equations', title: 'Quadratic Equations', hi: 'द्विघात समीकरण', boards: ['CBSE','ICSE'], part: NC10,
      youtube: '',
      summary: 'Learn standard form, the discriminant and the quadratic formula, with solved examples and common mistakes.',
      formulas: ['Standard form: ax² + bx + c = 0 (a ≠ 0)', 'Discriminant: D = b² − 4ac', 'Roots: x = (−b ± √D) / 2a', 'D > 0: two distinct real roots; D = 0: equal roots; D < 0: no real roots'],
      concept: 'In a quadratic equation the highest power of x is 2. There are three ways to find the roots: factorisation, completing the square and the quadratic formula. Find D first, then decide whether the roots are real or not.',
      examples: [
        { q: 'Solve x² − 5x + 6 = 0', a: 'Factorise: (x − 2)(x − 3) = 0, so x = 2 or x = 3.' },
        { q: 'Find the nature of roots of 2x² − 4x + 3 = 0', a: 'D = 16 − 24 = −8 < 0, so no real roots.' },
      ],
      mistakes: ['Sign errors while writing b and c', 'Forgetting that a ≠ 0', 'Writing √D without dividing the whole numerator by 2a'],
      practice: ['Solve x² − 7x + 12 = 0', 'Find k so that x² + kx + 9 = 0 has equal roots', 'Solve 2x² + x − 6 = 0 by the formula'],
      faq: [{ q: 'Is the quadratic formula needed for boards?', a: 'Yes, both factorisation and the formula are commonly asked.' }] },
    { slug: 'arithmetic-progression', title: 'Arithmetic Progressions', hi: 'समांतर श्रेढ़ियाँ', boards: ['CBSE','ICSE'], part: NC10 },
    { slug: 'triangles', title: 'Triangles', hi: 'त्रिभुज', boards: ['CBSE'], part: NC10 },
    { slug: 'coordinate-geometry', title: 'Coordinate Geometry', hi: 'निर्देशांक ज्यामिति', boards: ['CBSE'], part: NC10 },
    { slug: 'trigonometry', title: 'Introduction to Trigonometry', hi: 'त्रिकोणमिति का परिचय', boards: ['CBSE','ICSE'], part: NC10 },
    { slug: 'applications-of-trigonometry', title: 'Some Applications of Trigonometry', hi: 'त्रिकोणमिति के कुछ अनुप्रयोग', boards: ['CBSE'], part: NC10 },
    { slug: 'circles', title: 'Circles', hi: 'वृत्त', boards: ['CBSE'], part: NC10 },
    { slug: 'areas-related-to-circles', title: 'Areas Related to Circles', hi: 'वृत्तों से संबंधित क्षेत्रफल', boards: ['CBSE'], part: NC10 },
    { slug: 'surface-areas-and-volumes', title: 'Surface Areas and Volumes', hi: 'पृष्ठीय क्षेत्रफल और आयतन', boards: ['CBSE'], part: NC10 },
    { slug: 'statistics', title: 'Statistics', hi: 'सांख्यिकी', boards: ['CBSE'], part: NC10 },
    { slug: 'probability', title: 'Probability', hi: 'प्रायिकता', boards: ['CBSE'], part: NC10 },
    { slug: 'icse-shares-and-dividend', title: 'Shares and Dividend (ICSE)', hi: 'शेयर और लाभांश', boards: ['ICSE'] },
    { slug: 'icse-gst', title: 'GST (ICSE)', hi: 'जीएसटी', boards: ['ICSE'] },
  ]},
};
