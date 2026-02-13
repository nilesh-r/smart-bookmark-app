import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthError } from './AuthError';

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

function SignInWithGoogle() {
  return (
    <form action="/auth/signin" method="get">
      <button
        type="submit"
        className="btn-hero animate-glow-pulse flex items-center gap-3 rounded-xl border px-6 py-3 font-medium text-white backdrop-blur-sm transition"
        style={{
          borderColor: 'rgba(230, 57, 70, 0.5)',
          backgroundColor: 'var(--input-bg)',
          color: 'var(--foreground)',
        }}
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
