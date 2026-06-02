import { useState } from 'react';
import Form from './components/Form';
import Grid from './components/Grid';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-12">
      <header className="pb-5 border-b border-[var(--border)]">
        <h1 className="text-2xl font-semibold text-[var(--text)]">BookTracker</h1>
      </header>
      <section>
        <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase mb-6">Add a book</h2>
        <Form onSuccess={() => setRefreshKey((k) => k + 1)} />
      </section>
      <section>
        <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase mb-6">Books</h2>
        <Grid key={refreshKey} />
      </section>
    </main>
  );
}
