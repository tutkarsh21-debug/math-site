import OwnerReset from '@/components/OwnerReset';

// Not linked from anywhere, and kept out of search results.
export const metadata = { title: 'Owner password reset', robots: { index: false, follow: false } };

export default function Page() {
  return (<div className="wrap" style={{ padding: '2rem 0' }}>
    <h1>Owner password reset</h1>
    <OwnerReset />
  </div>);
}
