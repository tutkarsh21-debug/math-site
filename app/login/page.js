import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import { BOARDS, CLASSES } from '@/lib/data';

export const metadata = { title: 'Login or Register', description: 'Log in to MathSetu to save your test scores, or create a free student account.' };

export default function Login() {
  return (<>
    <div className="page-head"><div className="wrap">
      <div className="crumbs"><Link href="/">Home</Link><span>/</span>Login</div>
      <h1>Login or Register</h1>
      <p>A free student account saves your test scores. Notes, PDFs and tests can be used without an account.</p>
    </div></div>
    <section className="section"><div className="wrap">
      <AuthForm classes={Object.entries(CLASSES).map(([k, c]) => [k, c.label])} boards={BOARDS} />
    </div></section>
  </>);
}
