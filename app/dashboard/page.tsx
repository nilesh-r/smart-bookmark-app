
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AddBookmarkForm from '@/components/AddBookmarkForm';
import BookmarkList from '@/components/BookmarkList';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                console.log('No session found, redirecting to login');
                router.push('/');
                return;
            }

            setUser(session.user);
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push('/');
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-primary">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container mx-auto px-4 py-8 max-w-5xl"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">My Library</h1>
                    <p className="text-muted-foreground">Manage and organize your favorite links.</p>
                </div>

                <AddBookmarkForm userId={user.id} />

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"></span>
                        Saved Bookmarks
                    </h2>
                </div>

                <BookmarkList userId={user.id} />
            </motion.main>
        </div>
    );
}
