import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AddBookmarkForm } from './AddBookmarkForm';
import { BookmarkList } from './BookmarkList';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('id, url, title, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Your <span style={{ color: 'var(--hero-gold)' }}>bookmarks</span>
        </h1>
        <p className="mt-1" style={{ color: 'var(--foreground-muted)' }}>
          Add a URL and title. Changes sync in real time across tabs.
        </p>
      </div>

      <AddBookmarkForm />

      <BookmarkList initialBookmarks={bookmarks ?? []} />
    </div>
  );
}
