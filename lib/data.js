export const SITE = {
  name: 'MathSetu',            // TODO: your brand name
  telegram: 'https://t.me/your_channel',
  youtube: 'https://youtube.com/@your_channel',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

// boards: 'CBSE', 'ICSE'. youtube = video ID (leave '' until uploaded).
export const CLASSES = {
  'class-8': { label: 'Class 8', chapters: [
    { slug: 'rational-numbers', title: 'Rational Numbers', hi: 'परिमेय संख्याएँ', boards: ['CBSE','ICSE'] },
    { slug: 'squares-and-square-roots', title: 'Squares and Square Roots', hi: 'वर्ग और वर्गमूल', boards: ['CBSE','ICSE'] },
    { slug: 'linear-equations', title: 'Linear Equations in One Variable', hi: 'रैखिक समीकरण', boards: ['CBSE','ICSE'] },
  ]},
  'class-9': { label: 'Class 9', chapters: [
    { slug: 'number-systems', title: 'Number Systems', hi: 'संख्या पद्धति', boards: ['CBSE','ICSE'] },
    { slug: 'polynomials', title: 'Polynomials', hi: 'बहुपद', boards: ['CBSE','ICSE'] },
    { slug: 'coordinate-geometry', title: 'Coordinate Geometry', hi: 'निर्देशांक ज्यामिति', boards: ['CBSE','ICSE'] },
  ]},
  'class-10': { label: 'Class 10', chapters: [
    { slug: 'quadratic-equations', title: 'Quadratic Equations', hi: 'द्विघात समीकरण', boards: ['CBSE','ICSE'],
      youtube: '',
      summary: 'Learn standard form, the discriminant and the quadratic formula, with solved examples and common mistakes.',
      formulas: ['Standard form: ax² + bx + c = 0 (a ≠ 0)', 'Discriminant: D = b² − 4ac', 'Roots: x = (−b ± √D) / 2a', 'D > 0: two distinct real roots; D = 0: equal roots; D < 0: no real roots'],
      concept: 'Ek quadratic equation mein x ki highest power 2 hoti hai. Roots nikalne ke teen tarike hain: factorisation, completing the square aur quadratic formula. Pehle D nikaliye, phir decide kijiye ki roots real hain ya nahi.',
      examples: [
        { q: 'Solve x² − 5x + 6 = 0', a: 'Factorise: (x − 2)(x − 3) = 0, so x = 2 or x = 3.' },
        { q: 'Find the nature of roots of 2x² − 4x + 3 = 0', a: 'D = 16 − 24 = −8 < 0, so no real roots.' },
      ],
      mistakes: ['Sign errors while writing b and c', 'Forgetting that a ≠ 0', 'Writing √D without dividing the whole numerator by 2a'],
      practice: ['Solve x² − 7x + 12 = 0', 'Find k so that x² + kx + 9 = 0 has equal roots', 'Solve 2x² + x − 6 = 0 by the formula'],
      faq: [{ q: 'Is the quadratic formula needed for boards?', a: 'Yes, both factorisation and the formula are commonly asked.' }] },
    { slug: 'arithmetic-progression', title: 'Arithmetic Progression', hi: 'समांतर श्रेढ़ी', boards: ['CBSE','ICSE'] },
    { slug: 'trigonometry', title: 'Trigonometry', hi: 'त्रिकोणमिति', boards: ['CBSE','ICSE'] },
    { slug: 'icse-shares-and-dividend', title: 'Shares and Dividend (ICSE)', hi: 'शेयर और लाभांश', boards: ['ICSE'] },
    { slug: 'icse-gst', title: 'GST (ICSE)', hi: 'जीएसटी', boards: ['ICSE'] },
  ]},
};
