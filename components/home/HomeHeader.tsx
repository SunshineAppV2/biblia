"use client";

import { ChevronLeft, SkipForward, Search, Moon, Sun, Flame, Trophy, Gem } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { VersionSelector } from "@/components/VersionSelector";
import { calculateStreak } from "@/lib/utils";
import { getLevelInfo } from "@/lib/levels";
import { User } from "firebase/auth";
import { UserProfile } from "@/lib/firestore";

interface HomeHeaderProps {
    user: User | null;
    profile: UserProfile | null;
    isReading: boolean;
    chapterContent: any;
    currentVersion: string;
    isDark: boolean;
    localReadDates: string[];
    onBack: () => void;
    onNextChapter: () => void;
    onShowSearch: () => void;
    onToggleDark: () => void;
    onVersionChange: (v: string) => void;
    onLogin: () => void;
}

export function HomeHeader({
    user,
    profile,
    isReading,
    chapterContent,
    currentVersion,
    isDark,
    localReadDates,
    onBack,
    onNextChapter,
    onShowSearch,
    onToggleDark,
    onVersionChange,
    onLogin
}: HomeHeaderProps) {
    return (
        <header className="fixed top-0 w-full p-4 flex justify-between items-center bg-white/70 backdrop-blur border-b border-secondary/20 z-50">
            <div className="flex items-center gap-2">
                {isReading && (
                    <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors mr-2">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent tracking-tight">
                    AnoBíblico+
                </h1>
                {isReading && chapterContent && (
                    <button
                        onClick={onNextChapter}
                        className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:border-secondary/50 text-muted-foreground hover:text-secondary transition-all text-xs font-bold"
                        title="Pular para o próximo capítulo"
                    >
                        <SkipForward className="w-3 h-3" />
                        <span className="hidden sm:inline">Próximo</span>
                    </button>
                )}
            </div>
            <div className="flex items-center gap-4 text-sm font-bold">
                <button
                    onClick={onShowSearch}
                    className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                    title="Buscar capítulo"
                >
                    <Search className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                    onClick={onToggleDark}
                    className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                    title={isDark ? "Modo claro" : "Modo noturno"}
                >
                    {isDark ? <Sun className="w-4 h-4 text-secondary" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                </button>
                <VersionSelector
                    currentVersion={currentVersion}
                    onVersionChange={onVersionChange}
                    className="mr-2"
                />
                {user ? (
                    <>
                        <div className="flex items-center gap-1 text-secondary">
                            <Flame className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                            {calculateStreak(localReadDates)}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Nv.</span>
                            <span className="text-primary font-bold">{getLevelInfo(profile?.xp || 0).currentLevel}</span>
                        </div>
                        
                        <motion.div
                            className="flex items-center gap-1 text-accent font-black"
                            key={`xp-${profile?.xp}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            <Trophy className="w-4 h-4 fill-current" /> {profile?.xp || 0}
                        </motion.div>

                        <motion.div 
                            className="flex items-center gap-1 text-blue-500 font-bold ml-1 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20"
                            key={`gems-${profile?.gems}`}
                            initial={{ y: -10, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                        >
                            <Gem className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <span>{profile?.gems || 0}</span>
                        </motion.div>

                        <Link
                            href="/profile"
                            className="ml-2 p-1 hover:bg-primary/10 rounded-2xl transition-all border border-primary/15 flex items-center gap-2 pr-3"
                            title="Meu Perfil"
                        >
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-7 h-7 rounded-xl object-cover" />
                            ) : (
                                <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                                    {user.displayName?.[0]}
                                </div>
                            )}
                            <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Perfil</span>
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={onLogin}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 transition-all text-xs uppercase tracking-wider"
                    >
                        <LogInIcon className="w-4 h-4" /> Entrar
                    </button>
                )}
            </div>
        </header>
    );
}

function LogInIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
    )
}
