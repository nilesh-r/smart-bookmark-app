import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthError } from './AuthError';
import { SignInWithGoogle } from './SignInWithGoogle';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: errorParam } = await searchParams;

  if (user) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4" style={{ color: 'var(--foreground)' }}>
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="animate-fade-in-up flex flex-col items-center gap-6 text-center">
          <Logo href="/dashboard" className="animate-float" />
          <p style={{ color: 'var(--foreground-muted)' }}>You are signed in.</p>
          <Link
            href="/dashboard"
            className="btn-hero rounded-xl bg-gradient-to-r from-[var(--hero-red)] to-[var(--hero-gold)] px-6 py-3 font-semibold text-white shadow-lg"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4" style={{ color: 'var(--foreground)' }}>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="flex max-w-md flex-col items-center gap-8 text-center">
        <Logo className="animate-float" showText={true} href="/" />
        <h1 className="animate-fade-in-up stagger-1 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--foreground)' }}>
          Save your links. <span style={{ color: 'var(--hero-gold)' }}>Sync everywhere.</span>
        </h1>
        <p className="animate-fade-in-up stagger-2" style={{ color: 'var(--foreground-muted)' }}>
          Sign in with Google. Your bookmarks stay private and update in real time across tabs.
        </p>
        {errorParam && (
          <div className="animate-fade-in-up stagger-3 w-full">
            <AuthError message={errorParam} />
          </div>
        )}
        <div className="animate-fade-in-up stagger-4">
          <SignInWithGoogle />
        </div>
        <p className="animate-fade-in-up stagger-5 text-sm" style={{ color: 'var(--foreground-subtle)' }}>
          No email/password — Google OAuth only
        </p>
      </div>
    </div>
  );
}
