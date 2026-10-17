// Questions and answers for a chapter page, made from what the chapter really has: its topics, its PDFs and its test.
// Nothing here is invented, so a chapter without (say) a PYQ sheet simply gets no question about it.
const list = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;
const LABEL = { notes: 'short notes', formulas: 'formula bank', dpp: 'DPP sheet', pyq: 'previous year questions', 'pyq-solutions': 'solutions to the previous year questions', ncert: 'NCERT solutions' };

export function chapterFaq({ ch, c, board, ready, topics, test, cls }) {
  const faq = [];
  const files = Object.keys(LABEL).filter(k => ready.includes(k) && k !== 'pyq-solutions');
  if (topics.length) faq.push({
    q: `What topics are in ${ch.title} for ${c.label} ${ch.boards.join(' and ')}?`,
    a: `On MathSetu this chapter is split into ${topics.length} topics: ${list(topics)}.${ready.includes('notes') ? ' Each topic is explained in the short notes with solved examples.' : ''}` });
  if (files.length) faq.push({
    q: `Where can I get ${ch.title} ${c.label} notes and formulas as a PDF?`,
    a: `On this page, free and without any sign-up. The chapter has ${list(files.map(k => LABEL[k]))}. Tap Open PDF to read on your phone, or Download to keep a copy.` });
  if (topics.length > 1) faq.push({
    q: `How should I study ${ch.title}?`,
    a: `Go through the topics in order, starting with ${topics[0]} and ending with ${topics[topics.length - 1]}. Try each solved example yourself before you read the solution, then write the formulas from memory, solve the DPP sheet without looking at the answers, and finish with the chapter test.` });
  if (test) faq.push({
    q: `Is there a test for ${ch.title}?`,
    a: `Yes. The chapter test has ${test.qs.length} questions to be done in ${test.minutes} minutes, and it shows your score with an explanation for every question. Aim for ${Math.ceil(test.qs.length * 0.7)} out of ${test.qs.length} before you move to the next chapter. A weak score only tells you which topic to read again.` });
  if (cls === 'class-10' && ready.includes('pyq')) faq.push({
    q: `Are previous year questions available for ${ch.title}?`,
    a: `Yes. The PYQ tab has previous year board questions of this chapter arranged topic by topic${ready.includes('pyq-solutions') ? ', with the solutions in a separate PDF' : ''}. Use them after you have finished the DPP sheet, to see the style of the board paper.` });
  if (ready.includes('ncert')) faq.push({
    q: `Are there NCERT solutions for ${ch.title}?`,
    a: `Yes, the NCERT Solutions tab has step-by-step solutions to the textbook exercises of this chapter. Try each question first, and open the solution only to check your method.` });
  if (ch.boards.length > 1) faq.push({
    q: `Is ${ch.title} the same for CBSE and ICSE?`,
    a: `This chapter is part of both ${list(ch.boards)}. The two boards go to different depths, so use the material for your own board and check the current syllabus on its official website.` });
  return faq;
}
