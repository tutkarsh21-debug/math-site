import Link from 'next/link';
import PracticeBuilder from '@/components/PracticeBuilder';
import JsonLd, { breadcrumbs } from '@/components/JsonLd';

export const metadata = {
  title: 'Custom Practice Test Generator: Choose Class, Chapter and Difficulty',
  description: 'Build your own Maths practice test. Choose the class, chapters, difficulty and number of questions, and get a brand-new test every time, with instant score, step-by-step explanations and a progress tracker.',
};

export default function Practice() {
  return (<>
    <JsonLd data={breadcrumbs([['Practice Test Generator', '/practice']])} />
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Practice Test Generator</div>
      <h1>Build Your Own Practice Test</h1>
      <p>Pick the class, the chapters and how hard you want it. We make a brand-new test for you in a second. Questions are generated fresh every time, so you can practise as many times as you like and never meet the same paper twice.</p>
    </div></div>
    <section className="section"><div className="wrap narrow">
      <PracticeBuilder />
    </div></section>
  </>);
}
