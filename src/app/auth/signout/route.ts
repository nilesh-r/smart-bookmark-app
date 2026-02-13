import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function getRedirectUrl(request: Request): string {
  const url = new URL(request.url);
  const origin = url.origin;
  return `${origin}/`;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(getRedirectUrl(request), { status: 302 });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(getRedirectUrl(request), { status: 302 });
}
