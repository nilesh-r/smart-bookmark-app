export function AuthError({ message }: { message: string }) {
  const decoded = decodeURIComponent(message);
  const isRedirectError =
    /redirect|url|allowed|whitelist/i.test(decoded) ||
    decoded.includes('redirect_uri');
  const isProviderError = /provider|google|enabled/i.test(decoded);

  return (
    <div
      className="w-full max-w-md rounded-xl border px-4 py-3 text-left text-sm"
      style={{ borderColor: 'var(--hero-red)', backgroundColor: 'rgba(230, 57, 70, 0.1)', color: 'var(--foreground)' }}
      role="alert"
    >
      <p className="font-medium">Sign-in error</p>
      <p className="mt-1 opacity-90">{decoded}</p>
      <ul className="mt-3 list-inside list-disc space-y-1 opacity-90">
        {isRedirectError && (
          <li>
            In Supabase Dashboard go to <strong>Authentication → URL Configuration</strong> and add <strong>Redirect URL</strong>:<br />
            <code className="mt-1 block rounded bg-slate-800 px-2 py-1 text-xs">
              http://localhost:3000/auth/callback
            </code>
          </li>
        )}
        {isProviderError && (
          <li>
            In Supabase go to <strong>Authentication → Providers</strong>, enable <strong>Google</strong>, and add your OAuth Client ID and Secret from Google Cloud Console.
          </li>
        )}
        {!isRedirectError && !isProviderError && (
          <li>
            In Supabase: enable <strong>Google</strong> under Authentication → Providers and add <strong>http://localhost:3000/auth/callback</strong> under Authentication → URL Configuration → Redirect URLs.
          </li>
        )}
      </ul>
    </div>
  );
}
