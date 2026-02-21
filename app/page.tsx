
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import LoginButton from '@/components/LoginButton';
import { Bookmark, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AddBookmarkForm from '@/components/AddBookmarkForm';
import BookmarkList from '@/components/BookmarkList';
import { motion } from 'framer-motion';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [newBookmark, setNewBookmark] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBookmarkAdded = (bookmark: any) => {
    setNewBookmark(bookmark);
    // Reset after a short delay so the effect can trigger again if needed
    setTimeout(() => setNewBookmark(null), 500);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in, show the Dashboard view on the Homepage
  if (user) {
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

          <AddBookmarkForm userId={user.id} onAdd={handleBookmarkAdded} />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"></span>
              Saved Bookmarks
            </h2>
          </div>

          <BookmarkList userId={user.id} addedBookmark={newBookmark} />
        </motion.main>
      </div>
    );
  }

  // Otherwise show the Landing Page
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 text-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl bg-black/20 backdrop-blur-3xl p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 mb-4 transform hover:rotate-3 transition-transform duration-500">
          <Bookmark className="w-12 h-12 text-white" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Smart<span className="text-indigo-400">Bookmarks</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light">
            Your digital brain for organizing the web. <br />
            <span className="text-indigo-300 font-medium">Simple. Private. Real-time.</span>
          </p>
        </div>

        <div className="pt-8">
          <LoginButton />
        </div>

        <p className="text-sm text-gray-500 pt-8">
          Powered by Supabase & Next.js
        </p>
      </div>
    </main>
  );
}
