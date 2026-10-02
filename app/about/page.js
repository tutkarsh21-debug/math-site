import Link from 'next/link';
export const metadata = { title: 'About the Teacher' };
export default function About() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>About</div>
      <h1>About</h1>
    </div></div>
    <div className="wrap prose">
      <p>TODO: Your name, qualification, years of teaching, and your method. Parents trust a visible teacher, so keep this honest and specific.</p>
    </div>
  </>);
}
