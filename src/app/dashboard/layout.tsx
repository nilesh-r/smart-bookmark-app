import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split('@')[0] ??
    'User';

  return (
    <div className="relative min-h-screen" style={{ color: 'var(--foreground)' }}>
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--page-bg-elevated)' }}
      >
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Logo href="/dashboard" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="max-w-[200px] truncate text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Hi, {displayName}.
            </span>
            <Link
              href="/auth/signout"
              className="text-sm transition hover:opacity-90"
              style={{ color: 'var(--hero-gold)' }}
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
