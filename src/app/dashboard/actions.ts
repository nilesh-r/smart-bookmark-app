'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addBookmark(formData: FormData) {
  const url = (formData.get('url') as string)?.trim();
  const title = (formData.get('title') as string)?.trim();

  if (!url || !title) {
    return { error: 'URL and title are required.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to add a bookmark.' };
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({ user_id: user.id, url, title });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { error: null };
}
