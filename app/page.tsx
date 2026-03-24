"use client";

import { useState, useEffect, useRef } from "react";
import { ReadingTimer } from "@/components/ReadingTimer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, Trophy, Flame, ChevronLeft, LogIn, CheckCircle, ArrowRight, SkipForward, Zap, Moon, Sun, Minus, Plus, Bookmark } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { completeChapter, isChapterCompleted } from "@/lib/progress";
import { Leaderboard } from "@/components/Leaderboard";
import { getNextUserChapter } from "@/lib/progression-service";
import { getChapterContent, ChapterContent, VERSIONS } from "@/lib/bible";
import { getLevelInfo, calculateLevel } from "@/lib/levels";
import { LevelProgressBar } from "@/components/LevelProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import { LevelUpModal } from "@/components/LevelUpModal";
import { QuizModal } from "@/components/QuizModal";
import { QuizOfferModal } from "@/components/QuizOfferModal";
import { getQuizBank } from "@/lib/quiz-data";
import { AdBanner } from "@/components/AdBanner";
import { OnboardingModal } from "@/components/OnboardingModal";
import { VersionSelector } from "@/components/VersionSelector";
import { updateUserVersion, getUserProfile, applyXpDelta } from "@/lib/firestore";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { useToast } from "@/components/Toast";
import { DailyMissions, trackDailyRead, trackDailyQuiz } from "@/components/DailyMissions";
import { DailyVerse } from "@/components/DailyVerse";

export default function Home() {
    const { user, profile, loginWithGoogle, refreshProfile } = useAuth();
    const { showToast } = useToast();

    // UI States
    const [isReading, setIsReading] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);

    // Data States
    const [nextChapter, setNextChapter] = useState<{ bookId: string; chapter: number }>({ bookId: "genesis", chapter: 1 });
    const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);
    const [isCompletedNow, setIsCompletedNow] = useState(false);
    const [wasAlreadyRead, setWasAlreadyRead] = useState(false);

    // Level Up States
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevelReached, setNewLevelReached] = useState(1);

    // Quiz States
    const [showQuizOffer, setShowQuizOffer] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    // Version State — local so it updates immediately without waiting for Firebase
    const [currentVersion, setCurrentVersion] = useState("ARC");
    useEffect(() => {
        if (profile?.preferredVersion) setCurrentVersion(profile.preferredVersion);
    }, [profile?.preferredVersion]);

    // Font size (feature 8)
    const [fontSize, setFontSize] = useState(16);
    useEffect(() => {
        const stored = localStorage.getItem("biblequest_fontsize");
        if (stored) setFontSize(parseInt(stored));
    }, []);
    const changeFontSize = (delta: number) => {
        setFontSize(prev => {
            const next = Math.min(22, Math.max(14, prev + delta));
            localStorage.setItem("biblequest_fontsize", String(next));
            return next;
        });
    };

    // Dark mode (feature 10)
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const stored = localStorage.getItem("biblequest_theme");
        if (stored === "dark") {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("biblequest_theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("biblequest_theme", "light");
        }
    }, [isDark]);

    // Verse bookmarks (feature 11)
    const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
    const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        const key = `biblequest_bookmarks_${nextChapter.bookId}_${nextChapter.chapter}`;
        const stored = localStorage.getItem(key);
        setBookmarks(stored ? new Set(JSON.parse(stored)) : new Set());
    }, [nextChapter.bookId, nextChapter.chapter]);
    const toggleBookmark = (verseIndex: number) => {
        const next = new Set(bookmarks);
        if (next.has(verseIndex)) {
            next.delete(verseIndex);
            showToast("Marcador removido", "info");
        } else {
            next.add(verseIndex);
            showToast("📖 Versículo salvo nos favoritos", "achievement");
        }
        setBookmarks(next);
        localStorage.setItem(
            `biblequest_bookmarks_${nextChapter.bookId}_${nextChapter.chapter}`,
            JSON.stringify([...next])
        );
    };
    const handleVersePointerDown = (verseIndex: number) => {
        pressTimerRef.current = setTimeout(() => toggleBookmark(verseIndex), 600);
    };
    const handleVersePointerUp = () => {
        if (pressTimerRef.current) { clearTimeout(pressTimerRef.current); pressTimerRef.current = null; }
    };

    useEffect(() => {
        if (user) loadProgression();
    }, [user]);

    const loadProgression = async () => {
        if (!user) return;
        const next = await getNextUserChapter(user.uid);
        setNextChapter(next);
    };

    const handleStartReading = async () => {
        setIsReading(true);
        setLoadingContent(true);
        setIsCompletedNow(false);
        setWasAlreadyRead(false);

        try {
            // Load Bible content first — never blocked by Firebase
            const content = await getChapterContent(nextChapter.bookId, nextChapter.chapter, currentVersion);
            setChapterContent(content);

            // Check completion status separately — failure is non-fatal
            if (user) {
                try {
                    const alreadyRead = await isChapterCompleted(user.uid, nextChapter.bookId, nextChapter.chapter.toString());
                    setWasAlreadyRead(alreadyRead);
                    if (alreadyRead) setIsCompletedNow(true);
                } catch {
                    // Firebase offline — assume not read yet, reading still works
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingContent(false);
        }
    };

    const finishChapter = async (quizXpDelta: number = 0) => {
        if (!user || !profile) {
            setIsCompletedNow(true);
            return;
        }

        const xpBeforeCompletion = profile.xp;
        const xpAmount = 50;
        const wasAtMaxLevel = calculateLevel(xpBeforeCompletion) >= 66;

        // Track daily missions for reading
        const missionBonus = trackDailyRead();
        const totalQuizDelta = quizXpDelta + missionBonus;

        try {
            // Apply quiz XP delta (positive or negative) plus any mission bonus
            if (totalQuizDelta !== 0) {
                await applyXpDelta(user.uid, totalQuizDelta);
            }

            // Notify about wisdom point if already at max level
            if (wasAtMaxLevel) {
                showToast("🕊️ Ponto de Sabedoria conquistado!", "achievement");
            }

            // Check level up
            const oldLevel = calculateLevel(xpBeforeCompletion);
            const newLevel = calculateLevel(xpBeforeCompletion + xpAmount + totalQuizDelta);
            if (newLevel > oldLevel) {
                setNewLevelReached(newLevel);
                setTimeout(() => setShowLevelUp(true), 800);
            }

            await refreshProfile();

            const freshProfile = await getUserProfile(user.uid);
            if (freshProfile) {
                const newAchievements = await checkAndUnlockAchievements(user.uid, {
                    totalChapters: freshProfile.totalChapters || 0,
                    streak: freshProfile.streak,
                    level: calculateLevel(freshProfile.xp),
                    currentLeague: freshProfile.currentLeague,
                    wisdomPoints: freshProfile.wisdomPoints || 0,
                });

                newAchievements.forEach((a, i) => {
                    setTimeout(() => {
                        showToast(`${a.icon} Conquista desbloqueada: ${a.title}`, "achievement");
                    }, i * 1500 + 500);
                });

                if (newAchievements.length > 0) {
                    await refreshProfile();
                }
            }
        } catch (error) {
            console.error("Failed to finish chapter", error);
            showToast("Erro ao salvar progresso. Tente novamente.", "error");
        } finally {
            setIsCompletedNow(true);
        }
    };

    const handleComplete = async () => {
        // Non-logged users: just show completion UI
        if (!user || !profile) {
            setIsCompletedNow(true);
            return;
        }

        const xpAmount = 50;

        try {
            const wasNew = await completeChapter(
                user.uid,
                nextChapter.bookId,
                nextChapter.chapter.toString(),
                xpAmount
            );

            if (!wasNew) {
                setWasAlreadyRead(true);
                setIsCompletedNow(true);
                showToast("Capítulo já registrado anteriormente.", "info");
                return;
            }

            // Offer quiz only if there's a bank for this chapter
            const hasBank = !!getQuizBank(nextChapter.bookId, nextChapter.chapter);
            if (hasBank) {
                setShowQuizOffer(true);
            } else {
                await finishChapter(0);
            }
        } catch (error) {
            console.error("Failed to complete chapter", error);
            showToast("Erro ao salvar progresso. Tente novamente.", "error");
            setIsCompletedNow(true);
        }
    };

    const handleQuizAccept = () => {
        setShowQuizOffer(false);
        setShowQuiz(true);
    };

    const handleQuizDecline = async () => {
        setShowQuizOffer(false);
        await finishChapter(0);
    };

    const handleQuizComplete = async (quizXpDelta: number) => {
        setShowQuiz(false);
        trackDailyQuiz();
        await finishChapter(quizXpDelta);
    };

    const handleNextChapter = async () => {
        setIsReading(false);
        setIsCompletedNow(false);
        setShowQuizOffer(false);
        setShowQuiz(false);
        setWasAlreadyRead(false);
        setChapterContent(null);
        await loadProgression();
    };

    const handleVersionChange = async (versionId: string) => {
        setCurrentVersion(versionId); // atualiza imediatamente no estado local
        if (user) updateUserVersion(user.uid, versionId); // salva no Firebase em background
        if (isReading) {
            setLoadingContent(true);
            try {
                const content = await getChapterContent(nextChapter.bookId, nextChapter.chapter, versionId);
                setChapterContent(content);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingContent(false);
            }
        }
    };

    const handleBack = () => setIsReading(false);

    const chaptersCompleted = Math.max(0, (nextChapter.chapter - 1));

    return (
        <div className="min-h-screen pb-24 font-sans bg-background">
            {/* Header */}
            <header className="fixed top-0 w-full p-4 flex justify-between items-center bg-white/70 backdrop-blur border-b border-secondary/20 z-50">
                <div className="flex items-center gap-2">
                    {isReading && (
                        <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-full transition-colors mr-2">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    <h1 className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent tracking-tight">
                        BibleQuest
                    </h1>
                    {isReading && chapterContent && (
                        <button
                            onClick={handleNextChapter}
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
                        onClick={() => setIsDark(d => !d)}
                        className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                        title={isDark ? "Modo claro" : "Modo noturno"}
                    >
                        {isDark ? <Sun className="w-4 h-4 text-secondary" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <VersionSelector
                        currentVersion={currentVersion}
                        onVersionChange={handleVersionChange}
                        className="mr-2"
                    />
                    {user ? (
                        <>
                            <div className="flex items-center gap-1 text-secondary">
                                <Flame className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                                {profile?.streak || 0}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Nv.</span>
                                <span className="text-primary font-bold">{getLevelInfo(profile?.xp || 0).currentLevel}</span>
                            </div>
                            <motion.div
                                className="flex items-center gap-1 text-accent"
                                key={profile?.xp}
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.3 }}
                            >
                                <Trophy className="w-4 h-4 fill-current" /> {profile?.xp || 0} XP
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
                            onClick={loginWithGoogle}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 transition-all text-xs uppercase tracking-wider"
                        >
                            <LogIn className="w-4 h-4" /> Entrar
                        </button>
                    )}
                </div>
            </header>

            <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!isReading ? (
                        <motion.div
                            key="dashboard"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            {/* Greeting */}
                            <div className="text-center space-y-1 pt-4">
                                <p className="text-xs font-bold text-secondary uppercase tracking-[0.25em]">
                                    {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                                </p>
                                <h2 className="text-4xl font-black text-primary tracking-tight">
                                    {user ? `Olá, ${user.displayName?.split(" ")[0]}` : "Olá, Viajante"}
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    {user ? "Sua jornada continua. Que tal ler um pouco agora?" : "Faça login para salvar suas conquistas."}
                                </p>
                            </div>

                            {/* Level bar */}
                            {user && profile && (() => {
                                const levelInfo = getLevelInfo(profile.xp);
                                return (
                                    <div className="rounded-2xl border border-secondary/30 bg-white/70 backdrop-blur px-5 py-4 shadow-sm">
                                        <LevelProgressBar
                                            level={levelInfo.currentLevel}
                                            progressPercentage={levelInfo.progressPercentage}
                                            xpInCurrentLevel={levelInfo.xpInCurrentLevel}
                                            xpRequiredForNextLevel={levelInfo.xpRequiredForNextLevel}
                                            title={levelInfo.title}
                                        />
                                    </div>
                                );
                            })()}

                            {/* Main Card: Next Chapter */}
                            <div className="space-y-2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStartReading}
                                className="relative overflow-hidden rounded-2xl cursor-pointer border border-secondary/40 shadow-[0_4px_24px_rgba(197,160,89,0.15)] bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl"
                            >
                                {/* Gold top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent" />

                                {/* Decorative glow */}
                                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

                                <div className="relative p-6 flex items-center gap-5">
                                    {/* Book icon */}
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                                        <BookOpen className="w-8 h-8 text-secondary" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                                            Próxima Leitura
                                        </span>
                                        <h3 className="text-2xl font-black text-primary mt-0.5 capitalize leading-tight">
                                            {nextChapter.bookId.replace(/(\d+)/, " $1")} {nextChapter.chapter}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full border border-primary/10">
                                                {chapterContent ? `~${Math.round(chapterContent.estimatedSeconds / 60)} min` : "~5 min"}
                                            </span>
                                            <span className="text-xs font-bold text-accent flex items-center gap-1">
                                                <Trophy className="w-3 h-3" /> +50 XP
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-accent" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick links */}
                            <div className="flex justify-between px-1">
                                <Link
                                    href="/favoritos"
                                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                                >
                                    <Bookmark className="w-3 h-3" />
                                    Favoritos
                                </Link>
                                <Link
                                    href="/planos"
                                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                                >
                                    <BookOpen className="w-3 h-3" />
                                    Planos de Leitura
                                </Link>
                            </div>
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-secondary/30 bg-white/70 backdrop-blur p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
                                            <Trophy className="w-3.5 h-3.5 text-secondary" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sua Liga</span>
                                    </div>
                                    <div className="font-black text-xl text-primary tracking-tight">
                                        {profile?.currentLeague || "BRONZE"}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-accent/30 bg-white/70 backdrop-blur p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
                                            <BookOpen className="w-3.5 h-3.5 text-accent" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Capítulos Lidos</span>
                                    </div>
                                    <div className="font-black text-xl text-primary tracking-tight">
                                        {profile?.totalChapters || 0}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-red-400/30 bg-white/70 backdrop-blur p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-red-400/20 flex items-center justify-center">
                                            <Flame className="w-3.5 h-3.5 text-red-400 fill-current" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ofensiva</span>
                                    </div>
                                    <div className="font-black text-xl text-primary tracking-tight">
                                        {profile?.streak || 0} <span className="text-sm font-normal text-muted-foreground">dias</span>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-primary/20 bg-white/70 backdrop-blur p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Zap className="w-3.5 h-3.5 text-primary fill-current" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">XP Semanal</span>
                                    </div>
                                    <div className="font-black text-xl text-primary tracking-tight">
                                        {profile?.weeklyXp || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Daily Verse */}
                            <DailyVerse />

                            {/* Daily Missions */}
                            {user && <DailyMissions />}

                            {user && (
                                <div>
                                    <div className="flex items-center justify-between px-1 mb-3">
                                        <h3 className="text-base font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-secondary" /> Ranking da Semana
                                        </h3>
                                        <Link href="/progresso" className="text-xs text-accent font-bold hover:underline flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> Meu Progresso
                                        </Link>
                                    </div>
                                    <Leaderboard />
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reading"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {loadingContent ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-muted-foreground">Abrindo pergaminhos...</p>
                                </div>
                            ) : chapterContent ? (
                                <>
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
                                                onClick={() => changeFontSize(-2)}
                                                disabled={fontSize <= 14}
                                                className="w-7 h-7 rounded-full border border-secondary/30 flex items-center justify-center hover:bg-secondary/10 disabled:opacity-30 transition-colors"
                                            >
                                                <Minus className="w-3 h-3 text-secondary" />
                                            </button>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-10 text-center">{fontSize}px</span>
                                            <button
                                                onClick={() => changeFontSize(2)}
                                                disabled={fontSize >= 22}
                                                className="w-7 h-7 rounded-full border border-secondary/30 flex items-center justify-center hover:bg-secondary/10 disabled:opacity-30 transition-colors"
                                            >
                                                <Plus className="w-3 h-3 text-secondary" />
                                            </button>
                                        </div>

                                        {chapterContent.text.map((paragraph: string, i: number) => (
                                            <p
                                                key={i}
                                                className={`mb-5 leading-relaxed relative pl-7 pr-5 rounded-lg transition-colors select-none cursor-pointer ${bookmarks.has(i) ? "bg-secondary/10" : ""}`}
                                                style={{ fontSize: `${fontSize}px` }}
                                                onPointerDown={() => handleVersePointerDown(i)}
                                                onPointerUp={handleVersePointerUp}
                                                onPointerLeave={handleVersePointerUp}
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
                                    </article>

                                    {!isCompletedNow ? (
                                        <ReadingTimer
                                            averageTimeSeconds={chapterContent.estimatedSeconds}
                                            onComplete={handleComplete}
                                        />
                                    ) : (
                                        <div className="fixed bottom-0 left-0 w-full glass border-t border-accent/30 p-4 animate-in slide-in-from-bottom z-50">
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
                                                                <span className="text-lg text-accent">Capítulo Concluído!</span>
                                                                <span className="text-xs text-accent/70 uppercase tracking-widest">+50 XP adicionado</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleNextChapter}
                                                    className="px-6 py-3 bg-accent text-accent-foreground font-bold rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(66,165,245,0.4)]"
                                                >
                                                    Próximo Capítulo <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-red-400">Conteúdo indisponível para este capítulo ainda.</p>
                                    <button onClick={handleBack} className="mt-4 underline text-sm">Voltar</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <QuizOfferModal
                isOpen={showQuizOffer}
                bookName={chapterContent?.bookName ?? ""}
                chapter={chapterContent?.chapter ?? 1}
                onAccept={handleQuizAccept}
                onDecline={handleQuizDecline}
            />

            <QuizModal
                isOpen={showQuiz}
                bookId={nextChapter.bookId}
                bookName={chapterContent?.bookName ?? ""}
                chapter={chapterContent?.chapter ?? 1}
                onComplete={handleQuizComplete}
            />

            {/* Ad Banner — discreto, fixo no rodapé, apenas no dashboard */}
            {!isReading && (
                <div className="fixed bottom-0 left-0 right-0 z-40">
                    <div className="max-w-2xl mx-auto">
                        <AdBanner
                            adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT || ""}
                            adFormat="auto"
                            className="min-h-[50px]"
                        />
                    </div>
                </div>
            )}

            <LevelUpModal
                isOpen={showLevelUp}
                level={newLevelReached}
                onClose={() => setShowLevelUp(false)}
            />

            <OnboardingModal />

            {/* Footer */}
            {!isReading && (
                <div className="pb-20 pt-4 text-center">
                    <Link href="/politica-de-privacidade" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        Política de Privacidade
                    </Link>
                </div>
            )}
        </div>
    );
}
