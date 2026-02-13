import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next') ?? '/dashboard';
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.headers.get('origin') ?? 'http://localhost:3000';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return NextResponse.redirect(`${origin}/?error=auth`);
  }

  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
