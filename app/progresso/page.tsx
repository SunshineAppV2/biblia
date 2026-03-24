"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { BookOpen, ChevronLeft, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type ReadMap = Record<string, Set<string>>;

export default function ProgressoPage() {
    const { user, profile } = useAuth();
    const [readMap, setReadMap] = useState<ReadMap>({});
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState<string | null>(null);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetchProgress = async () => {
            try {
                const snap = await getDocs(collection(db, "users", user.uid, "reading_progress"));
                const map: ReadMap = {};
                snap.forEach(doc => {
                    const { bookId, chapterId } = doc.data();
                    if (!map[bookId]) map[bookId] = new Set();
                    map[bookId].add(chapterId);
                });
                setReadMap(map);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, [user]);

    const totalRead = Object.values(readMap).reduce((sum, s) => sum + s.size, 0);
    const totalChapters = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0);
    const overallPct = Math.round((totalRead / totalChapters) * 100);

    const atBooks = BIBLE_BOOKS.filter(b => b.testament === "AT");
    const ntBooks = BIBLE_BOOKS.filter(b => b.testament === "NT");

    function BookCard({ book }: { book: typeof BIBLE_BOOKS[0] }) {
        const readSet = readMap[book.id] ?? new Set();
        const readCount = readSet.size;
        const pct = Math.round((readCount / book.chapters) * 100);
        const isSelected = selectedBook === book.id;
        const isComplete = readCount === book.chapters;

        return (
            <div
                className={cn(
                    "rounded-xl border cursor-pointer transition-all",
                    isSelected ? "border-secondary/60 bg-white/90 shadow-md" : "border-primary/15 bg-white/60 hover:bg-white/80",
                    isComplete && "border-secondary/50"
                )}
                onClick={() => setSelectedBook(isSelected ? null : book.id)}
            >
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                            "text-xs font-bold truncate",
                            isComplete ? "text-secondary" : "text-primary"
                        )}>
                            {book.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono ml-1 shrink-0">
                            {readCount}/{book.chapters}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all",
                                isComplete ? "bg-secondary" : "bg-accent"
                            )}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>

                {/* Chapter dots (expanded) */}
                {isSelected && (
                    <div className="px-3 pb-3 pt-1 border-t border-primary/10">
                        <div className="flex flex-wrap gap-1 mt-2">
                            {Array.from({ length: book.chapters }, (_, i) => {
                                const chap = String(i + 1);
                                const isRead = readSet.has(chap);
                                return (
                                    <div
                                        key={i}
                                        title={`Cap. ${i + 1}`}
                                        className={cn(
                                            "w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center",
                                            isRead
                                                ? "bg-secondary text-white"
                                                : "bg-primary/10 text-muted-foreground"
                                        )}
                                    >
                                        {i + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-10">
            {/* Header */}
            <header className="sticky top-0 bg-white/70 backdrop-blur border-b border-secondary/20 z-10 px-4 py-3 flex items-center gap-3">
                <Link href="/" className="p-1 hover:bg-primary/10 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-primary" />
                </Link>
                <h1 className="text-lg font-black text-primary">Mapa de Progresso</h1>
            </header>

            <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
                {/* Overall stats */}
                <div className="bg-white/70 rounded-2xl border border-secondary/25 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progresso Geral</p>
                            <p className="text-2xl font-black text-primary">{totalRead} <span className="text-sm font-normal text-muted-foreground">de {totalChapters} capítulos</span></p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-3xl font-black text-secondary">{overallPct}%</p>
                            {loading && <p className="text-xs text-muted-foreground animate-pulse">Carregando...</p>}
                        </div>
                    </div>
                    <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-secondary to-accent rounded-full transition-all duration-700"
                            style={{ width: `${overallPct}%` }}
                        />
                    </div>
                    {!user && (
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            Faça login para ver seu progresso real.
                        </p>
                    )}
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/70 rounded-xl border border-secondary/20 p-3 text-center">
                        <p className="text-xl font-black text-primary">{profile?.totalChapters ?? 0}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Capítulos</p>
                    </div>
                    <div className="bg-white/70 rounded-xl border border-accent/20 p-3 text-center">
                        <p className="text-xl font-black text-primary">
                            {BIBLE_BOOKS.filter(b => (readMap[b.id]?.size ?? 0) === b.chapters).length}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Livros completos</p>
                    </div>
                    <div className="bg-white/70 rounded-xl border border-primary/20 p-3 text-center">
                        <p className="text-xl font-black text-primary">
                            {BIBLE_BOOKS.filter(b => (readMap[b.id]?.size ?? 0) > 0).length}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Livros iniciados</p>
                    </div>
                </div>

                {/* Antigo Testamento */}
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-secondary" /> Antigo Testamento
                        <span className="text-muted-foreground font-normal normal-case tracking-normal text-xs">
                            ({atBooks.reduce((s, b) => s + (readMap[b.id]?.size ?? 0), 0)} / {atBooks.reduce((s, b) => s + b.chapters, 0)} caps)
                        </span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {atBooks.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                </div>

                {/* Novo Testamento */}
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-accent" /> Novo Testamento
                        <span className="text-muted-foreground font-normal normal-case tracking-normal text-xs">
                            ({ntBooks.reduce((s, b) => s + (readMap[b.id]?.size ?? 0), 0)} / {ntBooks.reduce((s, b) => s + b.chapters, 0)} caps)
                        </span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {ntBooks.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}
