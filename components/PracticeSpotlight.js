import Link from 'next/link';

// Home page highlight for the practice test generator. The mock-up on the right plays a short loop
// (pick chapters, pick a level, a question appears, the right answer lights up) with CSS only.
export default function PracticeSpotlight() {
  return (<section className="section spot-sec"><div className="wrap">
    <div className="spot reveal">
      <div className="spot-copy">
        <span className="new-pill">NEW</span>
        <span className="kicker">Practice Test Generator</span>
        <h2>A fresh test every time. Built by you, in one tap.</h2>
        <p className="spot-usp">Most practice runs out. This one never does. Choose your class, chapters and difficulty, and {`MathSetu`} writes a brand-new exam-style paper in a second, with a clear explanation for every answer and a tracker that shows which chapter needs you next.</p>
        <ul className="spot-points">
          <li><b>Never the same paper twice.</b> Every question is generated fresh, so practice cannot be memorised.</li>
          <li><b>Yours to shape.</b> Any mix of chapters, Easy, Medium, Hard or Mixed, 5 to 30 questions, timed or relaxed.</li>
          <li><b>Learn from every mistake.</b> Step-by-step explanation after each answer, and one tap to retry only what you missed.</li>
          <li><b>Know your weak spots.</b> Your scores build a chapter-by-chapter progress chart, private on your own device.</li>
        </ul>
        <div className="cta-row">
          <Link className="btn btn-sun spot-btn" href="/practice">Make my test <span aria-hidden="true">→</span></Link>
          <span className="muted small" style={{ alignSelf: 'center' }}>Free. For Class 8, 9 and 10.</span>
        </div>
      </div>
      <div className="spot-demo" aria-hidden="true">
        <div className="sd-bar"><i /><i /><i /><span>mathsetu.in/practice</span></div>
        <div className="sd-body">
          <div className="sd-row"><em>Class</em><span className="sd-chip sd-on">Class 10</span></div>
          <div className="sd-row"><em>Chapters</em>
            <span className="sd-chip sd-c1">Quadratic Equations</span><span className="sd-chip sd-c2">Trigonometry</span><span className="sd-chip sd-c3">Probability</span></div>
          <div className="sd-row"><em>Level</em>
            <span className="sd-chip">Easy</span><span className="sd-chip">Medium</span><span className="sd-chip sd-lv">Hard</span></div>
          <div className="sd-go">Generate my test</div>
          <div className="sd-q">
            <small>Question 1 of 10 · Hard</small>
            <p>The equation x² + 8x + k = 0 has no real roots when</p>
            <div className="sd-o">k &lt; 16</div>
            <div className="sd-o sd-ok">k &gt; 16</div>
            <div className="sd-o">k = 16</div>
          </div>
        </div>
        <span className="sd-spark s1" /><span className="sd-spark s2" /><span className="sd-spark s3" />
      </div>
    </div>
  </div></section>);
}
