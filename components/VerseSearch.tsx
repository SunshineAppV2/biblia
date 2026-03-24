"use client";

import { useState, useMemo } from "react";
import { BIBLE_BOOKS } from "@/lib/bible-books";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, ChevronRight } from "lucide-react";

interface VerseSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (bookId: string, chapter: number) => void;
}

export function VerseSearch({ isOpen, onClose, onNavigate }: VerseSearchProps) {
    const [query, setQuery] = useState("");
    const [selectedBook, setSelectedBook] = useState<typeof BIBLE_BOOKS[0] | null>(null);

    const filteredBooks = useMemo(() => {
        if (!query.trim()) return BIBLE_BOOKS.slice(0, 10);
        const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return BIBLE_BOOKS.filter(b => {
            const name = b.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return name.includes(q);
        }).slice(0, 8);
    }, [query]);

    const handleSelect = (bookId: string, chapter: number) => {
        onNavigate(bookId, chapter);
        onClose();
        setQuery("");
        setSelectedBook(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: "var(--reading-bg)", border: "1px solid rgba(184,130,10,0.25)" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-secondary/15">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        autoFocus
                        value={query}
                        onChange={e => { setQuery(e.target.value); setSelectedBook(null); }}
                        placeholder="Buscar livro... (ex: João, Salmos, Gênesis)"
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                    />
                    {query && (
                        <button onClick={() => { setQuery(""); setSelectedBook(null); }}>
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {/* Book list */}
                    {!selectedBook && (
                        <div className="p-2">
                            {filteredBooks.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-6">Nenhum livro encontrado</p>
                            )}
                            {filteredBooks.map(book => (
                                <button
                                    key={book.id}
                                    onClick={() => setSelectedBook(book)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary/8 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{book.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{book.chapters} capítulos · {book.testament}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-secondary transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Chapter selection */}
                    {selectedBook && (
                        <div className="p-3">
                            <button
                                onClick={() => setSelectedBook(null)}
                                className="flex items-center gap-1.5 text-xs text-secondary font-bold mb-3 hover:opacity-80"
                            >
                                ← {selectedBook.name}
                            </button>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2 px-1">
                                Escolha o capítulo
                            </p>
                            <div className="grid grid-cols-8 gap-1">
                                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                                    <button
                                        key={ch}
                                        onClick={() => handleSelect(selectedBook.id, ch)}
                                        className="w-full aspect-square rounded-lg text-xs font-bold bg-primary/8 hover:bg-secondary hover:text-white transition-all text-foreground"
                                    >
                                        {ch}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
