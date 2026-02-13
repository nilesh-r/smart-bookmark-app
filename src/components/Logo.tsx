import Link from 'next/link';

type Props = {
  className?: string;
  showText?: boolean;
  href?: string;
};

export function Logo({ className = '', showText = true, href = '/' }: Props) {
  const content = (
    <>
      <span
        className="inline-flex items-center justify-center rounded-xl p-2 shadow-lg transition-transform duration-200 hover:scale-105"
        style={{
          background: `linear-gradient(135deg, var(--hero-red), var(--hero-gold))`,
          boxShadow: '0 4px 14px var(--hero-red-glow)',
        }}
      >
        <svg
          className="h-6 w-6 text-white drop-shadow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </span>
      {showText && (
        <span className="ml-2 font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
          Smart <span style={{ color: 'var(--hero-gold)' }}>Bookmark</span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center ${className}`}
        aria-label="Smart Bookmark home"
      >
        {content}
      </Link>
    );
  }

  return <div className={`inline-flex items-center ${className}`}>{content}</div>;
}
