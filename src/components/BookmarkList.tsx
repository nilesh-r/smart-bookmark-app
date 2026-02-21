
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Trash2, ExternalLink, Loader2, Globe, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bookmark {
    id: string;
    title: string;
    url: string;
    created_at: string;
}

export default function BookmarkList({ userId, addedBookmark }: { userId: string, addedBookmark?: Bookmark | null }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [spotlightId, setSpotlightId] = useState<string | null>(null);

    // Initial fetch
    useEffect(() => {
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching bookmarks:', error);
            else setBookmarks(data || []);
            setLoading(false);
        };

        fetchBookmarks();
    }, [userId]);

    // Handle manual add trigger (immediate feedback)
    useEffect(() => {
        if (addedBookmark) {
            setBookmarks((prev) => {
                if (prev.find(b => b.id === addedBookmark.id)) return prev;
                return [addedBookmark, ...prev];
            });
            setSpotlightId(addedBookmark.id);
            setTimeout(() => setSpotlightId(null), 3500);
        }
    }, [addedBookmark]);

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
                            // Deduplicate
                            if (prev.find(b => b.id === newBookmark.id)) return prev;

                            // If it wasn't added manually yet, trigger spotlight here too
                            setSpotlightId(newBookmark.id);
                            setTimeout(() => setSpotlightId(null), 3500);

                            return [newBookmark, ...prev];
                        });
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((bookmark) => (bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark))
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const handleDelete = async (id: string) => {
        // Optimistic update
        const originalBookmarks = [...bookmarks];
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));

        try {
            const { error } = await supabase.from('bookmarks').delete().eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error("Delete failed:", error);
            // Revert state on error
            setBookmarks(originalBookmarks);
            alert("Failed to delete. Please try again.");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getFavicon = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) {
            return '';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border"
            >
                <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground">Add your first bookmark to get started.</p>
            </motion.div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Filter bookmarks if spotlight is active
    const displayedBookmarks = spotlightId ? bookmarks.filter(b => b.id === spotlightId) : bookmarks;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={spotlightId ? "flex justify-center items-center py-10" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}
        >
            <AnimatePresence mode='popLayout'>
                {displayedBookmarks.map((bookmark) => (
                    <motion.div
                        layout
                        key={bookmark.id}
                        variants={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={spotlightId ? { scale: 1.1, zIndex: 10 } : { scale: 1, zIndex: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className={`group relative flex flex-col justify-between rounded-xl bg-card border border-border/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 ${spotlightId ? 'w-full max-w-md border-primary shadow-xl shadow-primary/20' : 'h-full hover:border-primary/50'}`}
                    >
                        {spotlightId && (
                            <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                                NEW!
                            </div>
                        )}

                        {/* Top section */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="bg-muted p-2 rounded-lg">
                                    <img
                                        src={getFavicon(bookmark.url)}
                                        alt=""
                                        className="w-5 h-5 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <Globe className="w-5 h-5 text-muted-foreground hidden only:block" />
                                </div>
                                <button
                                    onClick={() => handleDelete(bookmark.id)}
                                    className="text-destructive hover:text-destructive/80 transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                                    title="Delete"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <h3 className="mb-2 font-semibold text-card-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors" title={bookmark.title}>
                                {bookmark.title}
                            </h3>

                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-4 break-all"
                            >
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                <span className="line-clamp-1">{new URL(bookmark.url).hostname}</span>
                            </a>
                        </div>

                        {/* Bottom section */}
                        <div className="pt-4 border-t border-border mt-auto flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(bookmark.created_at)}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
