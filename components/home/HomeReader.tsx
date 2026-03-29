"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Volume2, VolumeX, Bookmark, CheckCircle, ArrowRight } from "lucide-react";
import { ReadingTimer } from "@/components/ReadingTimer";
import { AdBanner } from "@/components/AdBanner";
import { cn } from "@/lib/utils";

interface HomeReaderProps {
    loadingContent: boolean;
    chapterContent: any;
    fontSize: number;
    isSpeaking: boolean;
    bookmarks: Set<number>;
    isCompletedNow: boolean;
    wasAlreadyRead: boolean;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onChangeFontSize: (delta: number) => void;
    onToggleAudio: () => void;
    onVersePointerDown: (idx: number) => void;
    onVersePointerUp: () => void;
    onComplete: () => void;
    onNextChapter: () => void;
    onBack: () => void;
}

export function HomeReader({
    loadingContent,
    chapterContent,
    fontSize,
    isSpeaking,
    bookmarks,
    isCompletedNow,
    wasAlreadyRead,
    onTouchStart,
    onTouchEnd,
    onChangeFontSize,
    onToggleAudio,
    onVersePointerDown,
    onVersePointerUp,
    onComplete,
    onNextChapter,
    onBack
}: HomeReaderProps) {
    if (loadingContent) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Abrindo pergaminhos...</p>
            </div>
        );
    }

    if (!chapterContent) {
        return (
            <div className="text-center py-20">
                <p className="text-red-400">Conteúdo indisponível para este capítulo ainda.</p>
                <button onClick={onBack} className="mt-4 underline text-sm">Voltar</button>
            </div>
        );
    }

    return (
        <motion.div
            key="reading"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <article className="reading-surface rounded-2xl shadow-2xl px-6 py-10 max-w-none mb-32 border border-[#C5A059]/20">
                <h2 className="text-center text-4xl font-serif mb-3 tracking-tight text-primary">
                    {chapterContent.bookName} {chapterContent.chapter}
                </h2>
                <p className="text-center text-xs mb-4 uppercase tracking-widest font-semibold text-muted-foreground">
                    {chapterContent.version} • {chapterContent.totalVerses} versículos • ~{Math.round(chapterContent.estimatedSeconds / 60)} min
                </p>

                {/* Font size controls */}
                <div className="flex items-center justify-center gap-3 mb-8 opacity-50 hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onChangeFontSize(-2)}
                        disabled={fontSize <= 14}
                        className="w-7 h-7 rounded-full border border-secondary/30 flex items-center justify-center hover:bg-secondary/10 disabled:opacity-30 transition-colors"
                    >
                        <Minus className="w-3 h-3 text-secondary" />
                    </button>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-10 text-center">{fontSize}px</span>
                    <button
                        onClick={() => onChangeFontSize(2)}
                        disabled={fontSize >= 22}
                        className="w-7 h-7 rounded-full border border-secondary/30 flex items-center justify-center hover:bg-secondary/10 disabled:opacity-30 transition-colors"
                    >
                        <Plus className="w-3 h-3 text-secondary" />
                    </button>

                    <div className="w-px h-4 bg-secondary/20 mx-1" />

                    <button
                        onClick={onToggleAudio}
                        className={cn(
                            "h-8 px-3 rounded-full flex items-center gap-1.5 transition-all",
                            isSpeaking 
                                ? "bg-secondary text-white shadow-lg shadow-secondary/25" 
                                : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                        )}
                    >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {isSpeaking ? "Parar" : "Ouvir"}
                        </span>
                    </button>
                </div>

                {chapterContent.text.map((paragraph: string, i: number) => (
                    <p
                        key={i}
                        className={`mb-5 leading-relaxed relative pl-7 pr-5 rounded-lg transition-colors select-none cursor-pointer ${bookmarks.has(i) ? "bg-secondary/10" : ""}`}
                        style={{ fontSize: `${fontSize}px` }}
                        onPointerDown={() => onVersePointerDown(i)}
                        onPointerUp={onVersePointerUp}
                        onPointerLeave={onVersePointerUp}
                    >
                        <span className="text-xs font-bold select-none absolute left-0 mt-1" style={{ color: "#C5A059" }}>
                            {i + 1}
                        </span>
                        {bookmarks.has(i) && (
                            <Bookmark className="w-3 h-3 text-secondary fill-secondary absolute right-1 top-1.5" />
                        )}
                        {paragraph}
                    </p>
                ))}
                <p className="text-center text-[10px] text-muted-foreground/50 mt-6 uppercase tracking-widest">
                    Pressione e segure um versículo para marcar
                </p>

                <div className="mt-12 mb-4 border-t border-primary/5 pt-8">
                    <p className="text-[9px] text-center font-black uppercase tracking-[0.4em] text-primary/30 mb-4">Recomendação de Estudo</p>
                    <AdBanner 
                        adSlot="CHAPTER_END" 
                        adFormat="horizontal" 
                        className="max-h-[80px] rounded-xl overflow-hidden opacity-80" 
                    />
                </div>
            </article>

            {!isCompletedNow ? (
                <ReadingTimer
                    averageTimeSeconds={chapterContent.estimatedSeconds}
                    onComplete={onComplete}
                />
            ) : (
                <div className="fixed bottom-24 left-0 w-full glass border-t border-accent/30 p-4 animate-in slide-in-from-bottom z-50">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 font-bold">
                            <CheckCircle className="w-6 h-6 text-accent" />
                            <div className="flex flex-col">
                                {wasAlreadyRead ? (
                                    <>
                                        <span className="text-lg text-muted-foreground">Capítulo já lido</span>
                                        <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">Avance para o próximo</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg text-accent">Leitura Concluída!</span>
                                        <span className="text-xs text-accent/70 uppercase tracking-widest">+50 XP • Quiz Disponível ao Avançar</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onNextChapter}
                            className="px-6 py-3 bg-accent text-accent-foreground font-bold rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(66,165,245,0.4)]"
                        >
                            Próximo Capítulo <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
