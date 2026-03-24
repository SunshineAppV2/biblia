"use client";

import { useState, useEffect } from "react";
import { getChapterContent } from "@/lib/bible";
import { getBookById } from "@/lib/bible-books";
import Link from "next/link";
import { ChevronLeft, Bookmark, Trash2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookmarkGroup {
    bookId: string;
    chapter: number;
    indices: number[];
    bookName: string;
    verses: string[];
    loading: boolean;
}

export default function FavoritosPage() {
    const [groups, setGroups] = useState<BookmarkGroup[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith("biblequest_bookmarks_"));

        const parsed: BookmarkGroup[] = [];
        for (const key of keys) {
            const rest = key.replace("biblequest_bookmarks_", "");
            const lastUnderscore = rest.lastIndexOf("_");
            if (lastUnderscore === -1) continue;
            const bookId = rest.substring(0, lastUnderscore);
            const chapter = parseInt(rest.substring(lastUnderscore + 1));
            if (isNaN(chapter)) continue;

            const indices: number[] = JSON.parse(localStorage.getItem(key) || "[]");
            if (indices.length === 0) continue;

            const book = getBookById(bookId);
            parsed.push({
                bookId,
                chapter,
                indices: [...indices].sort((a, b) => a - b),
                bookName: book?.name || bookId,
                verses: [],
                loading: true,
            });
        }

        parsed.sort((a, b) => {
            const bookA = getBookById(a.bookId);
            const bookB = getBookById(b.bookId);
            if (bookA && bookB && bookA.bookNum !== bookB.bookNum) return bookA.bookNum - bookB.bookNum;
            return a.chapter - b.chapter;
        });

        setGroups(parsed);
        setLoaded(true);

        parsed.forEach(async (group, idx) => {
            try {
                const content = await getChapterContent(group.bookId, group.chapter);
                setGroups(prev => prev.map((g, i) =>
                    i === idx ? { ...g, verses: content?.text || [], loading: false } : g
                ));
            } catch {
                setGroups(prev => prev.map((g, i) =>
                    i === idx ? { ...g, loading: false } : g
                ));
            }
        });
    }, []);

    const removeBookmark = (bookId: string, chapter: number, verseIndex: number) => {
        const key = `biblequest_bookmarks_${bookId}_${chapter}`;
        setGroups(prev =>
            prev.map(g => {
                if (g.bookId !== bookId || g.chapter !== chapter) return g;
                const newIndices = g.indices.filter(i => i !== verseIndex);
                if (newIndices.length === 0) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, JSON.stringify(newIndices));
                }
                return { ...g, indices: newIndices };
            }).filter(g => g.indices.length > 0)
        );
    };

    const totalBookmarks = groups.reduce((sum, g) => sum + g.indices.length, 0);

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="sticky top-0 bg-white/70 backdrop-blur border-b border-secondary/20 z-10 px-4 py-3 flex items-center gap-3">
                <Link href="/" className="p-1 hover:bg-primary/10 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-primary" />
                </Link>
                <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-secondary fill-secondary" />
                    <h1 className="text-lg font-black text-primary leading-none">Versículos Favoritos</h1>
                </div>
                {totalBookmarks > 0 && (
                    <span className="ml-auto text-xs font-bold text-muted-foreground bg-primary/10 px-2.5 py-1 rounded-full">
                        {totalBookmarks} marcado{totalBookmarks !== 1 ? "s" : ""}
                    </span>
                )}
            </header>

            <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">
                {loaded && groups.length === 0 && (
                    <div className="text-center py-20 space-y-4">
                        <div className="text-6xl">📖</div>
                        <h2 className="text-xl font-black text-primary">Nenhum versículo salvo</h2>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Durante a leitura, pressione e segure qualquer versículo por 1 segundo para salvá-lo aqui.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm"
                        >
                            <BookOpen className="w-4 h-4" /> Ir para a Leitura
                        </Link>
                    </div>
                )}

                <AnimatePresence>
                    {groups.map((group, gIdx) => (
                        <motion.div
                            key={`${group.bookId}_${group.chapter}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: gIdx * 0.05 }}
                            className="rounded-2xl bg-white/80 border border-secondary/20 overflow-hidden shadow-sm"
                        >
                            {/* Chapter header */}
                            <div className="px-4 py-3 border-b border-secondary/10 flex items-center justify-between bg-secondary/5">
                                <div className="flex items-center gap-2">
                                    <Bookmark className="w-3.5 h-3.5 text-secondary fill-secondary" />
                                    <span className="font-black text-sm text-primary capitalize">
                                        {group.bookName} {group.chapter}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {group.indices.length} vers.
                                </span>
                            </div>

                            {/* Verses */}
                            <div className="divide-y divide-secondary/8">
                                {group.loading ? (
                                    <div className="px-4 py-6 flex justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary" />
                                    </div>
                                ) : (
                                    group.indices.map(verseIdx => (
                                        <div key={verseIdx} className="px-4 py-3 flex gap-3 items-start group">
                                            <span className="text-xs font-black text-secondary shrink-0 mt-0.5 w-5 text-right">
                                                {verseIdx + 1}
                                            </span>
                                            <p className="text-sm text-foreground leading-relaxed flex-1">
                                                {group.verses[verseIdx] || "—"}
                                            </p>
                                            <button
                                                onClick={() => removeBookmark(group.bookId, group.chapter, verseIdx)}
                                                className="shrink-0 p-1 rounded-full hover:bg-red-400/10 text-muted-foreground/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remover marcador"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
