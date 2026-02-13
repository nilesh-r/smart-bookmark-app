'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  created_at: string;
};

export function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync list when page data refreshes (e.g. after adding a bookmark)
  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          }
          if (payload.eventType === 'DELETE') {
            const old = payload.old as { id: string };
            setBookmarks((prev) => prev.filter((b) => b.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from('bookmarks').delete().eq('id', id);
    setDeletingId(null);
  }

  if (bookmarks.length === 0) {
    return (
      <p
        className="animate-fade-in-up rounded-xl border border-dashed py-12 text-center"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-bg)', color: 'var(--foreground-subtle)' }}
      >
        No bookmarks yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map((b, i) => (
        <li
          key={b.id}
          className="card-hero animate-fade-in-up flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
          style={{
            animationDelay: `${Math.min(i * 0.05, 0.3)}s`,
            borderColor: 'var(--input-border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <div className="min-w-0 flex-1">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-medium transition"
              style={{ color: 'var(--foreground)' }}
            >
              {b.title}
            </a>
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm transition"
              style={{ color: 'var(--foreground-muted)' }}
            >
              {b.url}
            </a>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(b.id)}
            disabled={deletingId === b.id}
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm transition hover:opacity-80 disabled:opacity-50"
            style={{ color: 'var(--hero-red)' }}
            aria-label={`Delete ${b.title}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
