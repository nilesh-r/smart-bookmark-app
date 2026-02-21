
'use client';

import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, Zap } from 'lucide-react'; // Changed Bookmark to Shield for Avengers vibe
import { motion } from 'framer-motion';
import { ModeToggle } from './mode-toggle';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserName(session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Hero'); // Default to Hero
            }
        };
        getUserData();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
        >
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">

                {/* Left Side: Logo & Greeting */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 group cursor-pointer" onClick={() => router.push('/dashboard')}>
                        <div className="bg-primary px-2 py-1 rounded-sm transform -skew-x-12 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            {/* Marvel-style block logo */}
                            <span className="text-white font-black text-xl tracking-tighter transform skew-x-12 inline-block">SMART</span>
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tighter uppercase hidden sm:block">Bookmarks</span>
                    </div>

                    {userName && (
                        <div className="hidden md:flex flex-col border-l-2 border-primary/20 pl-4">
                            <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Identity Confirmed</span>
                            <span className="text-sm font-bold text-foreground uppercase tracking-wide">Agent {userName.split(' ')[0]}</span>
                        </div>
                    )}
                </div>

                {/* Right Side: Toggle & SignOut */}
                <div className="flex items-center gap-4">
                    <ModeToggle />

                    <button
                        onClick={handleSignOut}
                        className="group flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold bg-muted hover:bg-destructive hover:text-white transition-all duration-300"
                    >
                        <LogOut className="h-4 w-4 group-hover:rotate-180 transition-transform" />
                        <span className="hidden sm:inline">EJECT</span>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
