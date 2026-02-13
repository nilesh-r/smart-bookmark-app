'use client';

export function HeroBackground() {
  return (
    <div className="hero-bg fixed inset-0 -z-10" aria-hidden>
      <div className="absolute left-[20%] top-[15%] h-40 w-40 rounded-full bg-[var(--hero-red)] opacity-[0.04] blur-2xl" />
      <div className="absolute bottom-[15%] right-[15%] h-32 w-32 rounded-full bg-[var(--hero-gold)] opacity-[0.04] blur-2xl" />
    </div>
  );
}
