import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;

  if (errorParam) {
    const message = errorDescription
      ? encodeURIComponent(errorDescription)
      : 'auth';
    return NextResponse.redirect(`${origin}/?error=${message}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    const message = encodeURIComponent(error.message);
    return NextResponse.redirect(`${origin}/?error=${message}`);
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
