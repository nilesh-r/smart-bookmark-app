
'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Plus, Loader2, Sparkles, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AnimatedArrow from './AnimatedArrow';

export default function AddBookmarkForm({ userId, onAdd }: { userId: string, onAdd?: (bookmark: any) => void }) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !title) return;

        setLoading(true);
        try {
            let formattedUrl = url;
            if (!/^https?:\/\//i.test(url)) {
                formattedUrl = 'https://' + url;
            }

            const { data, error } = await supabase.from('bookmarks').insert({
                user_id: userId,
                title,
                url: formattedUrl,
            }).select().single();

            if (error) throw error;

            if (onAdd && data) {
                onAdd(data);
            }

            setUrl('');
            setTitle('');
            setShowArrow(true);
            setTimeout(() => setShowArrow(false), 2000); // Reset after animation
        } catch (error) {
            console.error('Error adding bookmark:', error);
            alert('Failed to add bookmark');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-[1px]"
        >
            {showArrow && <AnimatedArrow />}
            <div className="bg-card backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-border shadow-md">
                <div className="flex items-center gap-3 mb-6 text-primary">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="text-xl font-bold tracking-tight text-card-foreground">Add New Resource</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1 group relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-primary font-bold text-lg">T</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Title (e.g., Design Inspiration)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-background border border-border text-foreground placeholder-muted-foreground rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all hover:bg-accent/50"
                            required
                        />
                    </div>
                    <div className="flex-[2] group relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-5 w-5 text-primary" />
                        </div>
                        <input
                            type="text"
                            placeholder="URL (e.g., dribbble.com)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-background border border-border text-foreground placeholder-muted-foreground rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all hover:bg-accent/50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 min-w-[140px]"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Plus className="h-5 w-5" /> Save</>}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
