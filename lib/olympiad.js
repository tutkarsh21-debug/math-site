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
      { slug: 'hots-class-8', title: 'HOTS Questions for Class 8', summary: 'Numbers, algebra, money, geometry, mensuration and data, with a full solution for each question.', hots: true },
      { slug: 'hots-class-9', title: 'HOTS Questions for Class 9', summary: 'Number systems, polynomials, lines and angles, quadrilaterals, circles, mensuration and statistics, with full solutions.', hots: true },
      { slug: 'hots-class-10', title: 'HOTS Questions for Class 10', summary: 'Real numbers, quadratic equations, progressions, similar triangles, coordinates, trigonometry, circles and probability, with full solutions.', hots: true },
    ] },
];

export const OLY_TOPICS = OLY_GROUPS.flatMap(g => g.topics.map(t => ({ ...t, group: g })));
export const findOlyTopic = slug => OLY_TOPICS.find(t => t.slug === slug);
