
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function IronManBackground() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Colors based on theme (Stark Tech Blue in Dark, Red/Gold in Light)
    const strokeColor = theme === 'dark' ? 'rgba(0, 255, 240, 0.05)' : 'rgba(236, 29, 36, 0.05)';
    const glowColor = theme === 'dark' ? 'rgba(0, 255, 240, 0.1)' : 'rgba(255, 215, 0, 0.15)';

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none flex items-center justify-center">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
                className="opacity-50"
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Abstract Tech Lines - HUD Style */}
                <circle cx="50" cy="50" r="30" fill="none" stroke={strokeColor} strokeWidth="0.2" className="animate-spin-slow" style={{ animationDuration: '60s' }} />
                <circle cx="50" cy="50" r="25" fill="none" stroke={strokeColor} strokeWidth="0.1" strokeDasharray="1 2" className="animate-spin-reverse" style={{ animationDuration: '40s' }} />

                {/* Iron Man Mask Geometric Abstraction */}
                <g transform="translate(50, 50) scale(0.6)" filter="url(#glow)">
                    {/* Outline */}
                    <path
                        d="M-15 -20 L15 -20 L20 -10 L20 15 L10 25 L-10 25 L-20 15 L-20 -10 Z"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="0.5"
                    />
                    {/* Eyes */}
                    <path d="M-12 0 L-5 0 L-4 3 L-13 3 Z" fill={glowColor} className="animate-pulse" />
                    <path d="M12 0 L5 0 L4 3 L13 3 Z" fill={glowColor} className="animate-pulse" />

                    {/* Faceplate details */}
                    <path d="M-5 15 L5 15 L7 20 L-7 20 Z" fill="none" stroke={strokeColor} strokeWidth="0.3" />
                    <path d="M0 -15 L0 -5" stroke={strokeColor} strokeWidth="0.2" />
                </g>
            </svg>
        </div>
    );
}
