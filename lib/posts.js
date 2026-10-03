// Blog articles and exam news, newest first. To add one, copy an entry and change it.
// category: 'Blog' or 'Exam News'. date: 'YYYY-MM-DD'. body: paragraphs; an entry { h: '...' } is a heading and { list: [...] } a bullet list.
// For exam news, always give the official notice in `source` so readers can check it.
export const POSTS = [
  {
    slug: 'how-to-study-a-maths-chapter', category: 'Blog', date: '2026-10-04',
    title: 'How to study a Maths chapter in four steps',
    summary: 'A simple routine for every chapter: notes, formulas, practice, then a test.',
    body: [
      'Most students read a chapter once, feel that they have understood it, and move on. The marks are lost later, when the same chapter has to be recalled in an exam. A fixed routine for every chapter prevents this.',
      { h: '1. Read the short notes with a pen in hand' },
      'Do not only read the solved examples. Cover the solution, try the example yourself, and then compare. An example you solved yourself stays with you much longer than one you read.',
      { h: '2. Learn the formula bank' },
      'Write the formulas of the chapter from memory on a blank page, then check them against the formula bank. Repeat the next day for the ones you missed. Five minutes a day is enough.',
      { h: '3. Solve the DPP without looking' },
      'Attempt every question of the DPP sheet before opening the answer key. Mark the questions you got wrong and do only those again after two days.',
      { h: '4. Take the chapter test' },
      'A timed test shows whether you can do the chapter under exam pressure. If you score below 7 out of 10, read the explanations, go back to the notes for those topics and take the test again.',
      { h: 'How long should this take?' },
      'For most chapters, two to three sittings of 45 minutes each. Short, regular sittings work better than one long one.',
    ],
  },
  {
    slug: 'why-you-lose-marks-in-maths', category: 'Blog', date: '2026-10-04',
    title: 'Why you lose marks in Maths even when you know the method',
    summary: 'Seven common slips that cost marks in school and board exams, and how to stop making them.',
    body: [
      'Many marks are lost not because the method is unknown, but because of small slips. These are the ones seen most often.',
      { list: [
        'Sign errors: forgetting to change the sign when a term crosses the equals sign, or when a bracket has a minus in front of it.',
        'Skipping steps: board examiners give marks for steps. A correct final answer with no working can lose marks, and a wrong answer with correct steps still earns some.',
        'Units: writing an area in cm instead of sq cm, or leaving the unit out altogether.',
        'Not answering what was asked: finding x when the question asked for 2x + 1, or the radius when it asked for the diameter.',
        'Copying the question wrongly: one wrong digit at the start makes the whole solution wrong.',
        'Rounding too early: keep fractions or surds until the last step, then round once.',
        'No final statement: in word problems, end with a sentence that answers the question.',
      ] },
      { h: 'A two-minute check' },
      'Before handing in the paper, go through each answer and ask three things: did I answer what was asked, are the units there, and does the answer look reasonable? A person\'s age cannot be negative and a probability cannot be more than 1.',
    ],
  },
  {
    slug: 'how-to-use-previous-year-questions', category: 'Blog', date: '2026-10-04',
    title: 'How to use previous year questions properly',
    summary: 'Previous year questions are most useful after the chapter is done, not before.',
    body: [
      'Previous year questions (PYQs) show how a chapter is actually asked in the board exam: which topics come again and again, and how many marks they carry. They are a tool for the last stage of preparation, not the first.',
      { h: 'When to start' },
      'Start the PYQs of a chapter only after you have finished its notes and DPP. If you start earlier, you end up reading solutions instead of solving.',
      { h: 'How to solve them' },
      { list: [
        'Solve topic-wise first, so that you see every type of question from one topic together.',
        'Write full solutions, as you would in the exam, and time yourself: about one and a half minutes per mark.',
        'Check your solution against the given one step by step, not just the final answer.',
        'Keep a list of the questions you could not do. Redo that list a week later.',
      ] },
      { h: 'What PYQs cannot do' },
      'They do not replace the textbook. Boards also ask new questions every year, so a student who only memorises old questions is caught out. Use PYQs to practise, and the textbook and notes to understand.',
    ],
  },
  {
    slug: 'cbse-and-icse-class-10-maths-compared', category: 'Blog', date: '2026-10-04',
    title: 'CBSE and ICSE Class 10 Maths: how the two differ',
    summary: 'The two boards share most of the syllabus, but each has topics the other does not.',
    body: [
      'Students who change boards, or who use material written for the other board, often ask how different the two Class 10 Maths courses are. Most of the algebra, geometry, trigonometry, mensuration, statistics and probability is common. The differences are mainly these.',
      { h: 'Topics found only in ICSE' },
      { list: ['Commercial mathematics: GST, banking (recurring deposits), shares and dividend', 'Linear inequations', 'Ratio and proportion, remainder and factor theorems', 'Matrices', 'Geometric progression', 'Reflection and equation of a line', 'Loci'] },
      { h: 'Topics found only in CBSE' },
      { list: ['Real numbers (the Fundamental Theorem of Arithmetic and irrational numbers)', 'Pair of linear equations in two variables as a separate chapter', 'Areas related to circles (sectors and segments)'] },
      { h: 'What this means for you' },
      'On MathSetu, CBSE and ICSE chapters are kept separate, so open the chapter list of your own board. If a chapter has the same name in both boards, the notes may still differ in depth, so use the one for your board.',
      'Syllabuses are revised from time to time. Always check the current syllabus on the official website of your board.',
    ],
  },
];

// Official websites for dates, syllabus and notices. Exam news on this site always links to one of these.
export const OFFICIAL = [
  { name: 'CBSE', url: 'https://www.cbse.gov.in', about: 'Date sheets, circulars and results' },
  { name: 'CBSE Academic', url: 'https://cbseacademic.nic.in', about: 'Syllabus and official sample papers' },
  { name: 'CISCE', url: 'https://cisce.org', about: 'ICSE syllabus, timetable and specimen papers' },
  { name: 'NCERT', url: 'https://ncert.nic.in', about: 'Textbooks' },
  { name: 'SOF', url: 'https://sofworld.org', about: 'IMO dates, syllabus and results' },
];
