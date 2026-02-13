'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addBookmark } from './actions';

export function AddBookmarkForm() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!url.trim() || !title.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.set('url', url.trim());
    formData.set('title', title.trim());

    const result = await addBookmark(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setUrl('');
    setTitle('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in-up stagger-2 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-hero rounded-xl border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--hero-red)]"
          style={{
            borderColor: 'var(--input-border)',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--foreground)',
          }}
          required
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-hero rounded-xl border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--hero-red)]"
          style={{
            borderColor: 'var(--input-border)',
            backgroundColor: 'var(--input-bg)',
            color: 'var(--foreground)',
          }}
          required
        />
      </div>
      {error && (
        <p className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="btn-hero rounded-xl bg-gradient-to-r from-[var(--hero-red)] to-[var(--hero-gold)] px-5 py-2.5 font-semibold text-white shadow-lg disabled:opacity-50"
        style={{ boxShadow: '0 4px 14px var(--hero-red-glow)' }}
      >
        {loading ? 'Adding…' : 'Add bookmark'}
      </button>
    </form>
  );
}
