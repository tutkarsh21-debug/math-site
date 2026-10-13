// The Olympiad study material: short notes, formula sheet, DPP and a subject test for each topic.
// The files live in public/pdf/olympiad/<slug>/ and lib/tests.json (key 'olympiad/<slug>'), built by notes-pdf/build.mjs and tests.mjs.
export const OLY_GROUPS = [
  { id: 'mental-ability', tab: 'Mental Ability', title: 'Mental Ability',
    intro: 'Reasoning questions that need no formula, only careful thinking. They are quick marks once the common patterns are familiar.',
    tip: 'Practise a few every day and time yourself. Speed here leaves more time for the harder sections.',
    topics: [
      { slug: 'number-and-letter-series', title: 'Number and Letter Series', summary: 'Find the rule behind a number or letter series: differences, ratios, squares, mixed series and letter positions.' },
      { slug: 'analogy-and-classification', title: 'Analogy and Classification (Odd One Out)', summary: 'Find the relation in an analogy and the common property in an odd-one-out question, for words, numbers and letters.' },
      { slug: 'coding-and-decoding', title: 'Coding and Decoding', summary: 'Letter shifts, the reverse alphabet, position codes and word codes, and how to decode a message.' },
      { slug: 'direction-sense', title: 'Direction Sense', summary: 'Directions, left and right turns, the shadow rule and the distance from the start using Pythagoras.' },
      { slug: 'blood-relations', title: 'Blood Relations', summary: 'Names of family relations and a step-by-step way to solve relation puzzles.' },
      { slug: 'ranking-and-ordering', title: 'Ranking and Ordering', summary: 'Positions in a row, total from two ranks, people between two positions, and ordering by height or age.' },
      { slug: 'mirror-and-water-images', title: 'Mirror and Water Images', summary: 'Mirror and water images, letters that stay the same, and the mirror image of a clock time.' },
      { slug: 'venn-diagrams', title: 'Venn Diagrams', summary: 'Choose the right diagram for a set of groups, and count with two and three overlapping groups.' },
      { slug: 'clocks-and-calendars', title: 'Clocks and Calendars', summary: 'The angle between clock hands, when they meet, and the day of the week from odd days.' },
    ] },
  { id: 'everyday-mathematics', tab: 'Everyday Mathematics', title: 'Everyday Mathematics',
    intro: 'Word problems from daily life. The maths is from your school syllabus; the skill is turning the story into an equation.',
    tip: 'Underline what is given and what is asked before you calculate. Most mistakes are in reading, not in arithmetic.',
    topics: [
      { slug: 'percentage', title: 'Percentage', summary: 'Percent as a fraction of 100, increase and decrease, and successive changes.' },
      { slug: 'profit-loss-discount', title: 'Profit, Loss and Discount', summary: 'Cost price, selling price, marked price, discount and successive discounts.' },
      { slug: 'simple-and-compound-interest', title: 'Simple and Compound Interest', summary: 'Interest by the formula, compound interest by repeated growth, and the difference in two years.' },
      { slug: 'ratio-and-proportion', title: 'Ratio and Proportion', summary: 'Sharing in a ratio, proportion, and direct and inverse variation.' },
      { slug: 'time-and-work', title: 'Time and Work', summary: 'One day’s work, working together, wages, and pipes filling or emptying a tank.' },
      { slug: 'speed-distance-time', title: 'Speed, Distance and Time', summary: 'Average and relative speed, trains and boats in streams.' },
      { slug: 'averages', title: 'Averages', summary: 'The mean, what happens when a number is added or removed, and the average of two groups.' },
      { slug: 'area-perimeter-and-volume', title: 'Area, Perimeter and Volume in Real Situations', summary: 'Fencing, tiling, painting, paths and tanks with area, perimeter and volume formulas.' },
      { slug: 'tables-and-graphs', title: 'Reading Tables and Graphs', summary: 'Read tables, bar graphs, line graphs and pie charts, and turn them into totals, averages, percentages and angles.' },
    ] },
  { id: 'hots', tab: 'HOTS', title: 'HOTS (Higher Order Thinking Skills) Questions',
    intro: 'Questions that join two or more ideas, or ask a familiar idea in an unfamiliar way. They carry more marks and decide the top ranks. Choose your class.',
    tip: 'Finish the chapter properly first. Then try each question for a few minutes before looking at the solution.',
    topics: [
      { slug: 'hots-class-8', title: 'HOTS Questions for Class 8', summary: 'Numbers, algebra, money, geometry, mensuration and data, with a full solution for each question.', hots: true, cls: 'Class 8', mixed: true },
      { slug: 'hots-class-9', title: 'HOTS Questions for Class 9', summary: 'Number systems, polynomials, lines and angles, quadrilaterals, circles, mensuration and statistics, with full solutions.', hots: true, cls: 'Class 9', mixed: true },
      { slug: 'hots-class-10', title: 'HOTS Questions for Class 10', summary: 'Real numbers, quadratic equations, progressions, similar triangles, coordinates, trigonometry, circles and probability, with full solutions.', hots: true, cls: 'Class 10', mixed: true },
    ] },
];

// chapter sets class 10
OLY_GROUPS[2].topics.push(...[
 {
  "slug": "hots-10-real-numbers",
  "title": "HOTS: Real Numbers (Class 10)",
  "summary": "Higher order thinking questions on real numbers for Class 10: HCF and LCM in real situations, Euclid's algorithm, irrational numbers and decimal expansions, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-polynomials",
  "title": "HOTS: Polynomials (Class 10)",
  "summary": "Higher order thinking questions on polynomials for Class 10: expressions in the zeroes, forming polynomials, finding unknown coefficients and division, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-pair-of-linear-equations",
  "title": "HOTS: Pair of Linear Equations (Class 10)",
  "summary": "Higher order thinking questions on pairs of linear equations for Class 10: equations that become linear after a substitution, number and age problems, consistency conditions and boats in streams, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-quadratic-equations",
  "title": "HOTS: Quadratic Equations (Class 10)",
  "summary": "Higher order thinking questions on quadratic equations for Class 10: equations with fractions, conditions on the roots, and word problems on speed, tanks and numbers, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-arithmetic-progression",
  "title": "HOTS: Arithmetic Progressions (Class 10)",
  "summary": "Higher order thinking questions on arithmetic progressions for Class 10: sums of multiples, relations between terms, finding an AP from two sums and three numbers in AP, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-triangles",
  "title": "HOTS: Triangles (Class 10)",
  "summary": "Higher order thinking questions on similar triangles for Class 10: area ratios, the basic proportionality theorem, altitudes in right triangles and ladders and shadows, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-coordinate-geometry",
  "title": "HOTS: Coordinate Geometry (Class 10)",
  "summary": "Higher order thinking questions on coordinate geometry for Class 10: points on a line, the section formula, collinearity and shapes from their vertices, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-trigonometry",
  "title": "HOTS: Introduction to Trigonometry (Class 10)",
  "summary": "Higher order thinking questions on trigonometric ratios and identities for Class 10: finding all ratios from one, proving identities, complementary angles and conditions on sums, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-applications-of-trigonometry",
  "title": "HOTS: Applications of Trigonometry (Class 10)",
  "summary": "Higher order thinking questions on heights and distances for Class 10: two angles of elevation or depression, towers and buildings, and objects on opposite sides, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-circles",
  "title": "HOTS: Circles (Class 10)",
  "summary": "Higher order thinking questions on tangents to a circle for Class 10: angles between tangents, lengths of tangents, quadrilaterals around a circle and concentric circles, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-areas-related-to-circles",
  "title": "HOTS: Areas Related to Circles (Class 10)",
  "summary": "Higher order thinking questions on areas related to circles for Class 10: sectors, arcs, segments, rings, clock hands and combined figures, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-surface-areas-and-volumes",
  "title": "HOTS: Surface Areas and Volumes (Class 10)",
  "summary": "Higher order thinking questions on surface areas and volumes for Class 10: combined solids, melting and recasting, conical heaps, frustums and flowing water, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-statistics",
  "title": "HOTS: Statistics (Class 10)",
  "summary": "Higher order thinking questions on statistics for Class 10: finding a missing frequency from a given mean, the mode and median of grouped data and the relation between the three averages, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 },
 {
  "slug": "hots-10-probability",
  "title": "HOTS: Probability (Class 10)",
  "summary": "Higher order thinking questions on probability for Class 10: cards, dice, coins, bags of balls and finding an unknown number from a given probability, each with a full solution.",
  "hots": true,
  "cls": "Class 10"
 }
]);
// end class 10

export const OLY_TOPICS = OLY_GROUPS.flatMap(g => g.topics.map(t => ({ ...t, group: g })));
export const findOlyTopic = slug => OLY_TOPICS.find(t => t.slug === slug);
