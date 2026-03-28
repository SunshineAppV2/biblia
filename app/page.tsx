"use client";

import { useState, useEffect, useRef } from "react";
import { ReadingTimer } from "@/components/ReadingTimer";
import { cn, calculateStreak } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, Trophy, Flame, ChevronLeft, LogIn, CheckCircle, ArrowRight, SkipForward, Zap, Moon, Sun, Minus, Plus, Bookmark, Search, Gem, Download } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { usePWAInstall } from "@/hooks/usePWAInstall";
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
import { getQuizBank, ensureBanksLoaded } from "@/lib/quiz-data";
import { AdBanner } from "@/components/AdBanner";
import { OnboardingModal } from "@/components/OnboardingModal";
import { VersionSelector } from "@/components/VersionSelector";
import { updateUserVersion, getUserProfile, applyXpDelta } from "@/lib/firestore";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { useToast } from "@/components/Toast";
import { DailyMissions, trackDailyRead, trackDailyQuiz } from "@/components/DailyMissions";
import { DailyVerse } from "@/components/DailyVerse";
import { ReadingPlanCard } from "@/components/ReadingPlanCard";
import { ReadingGoal } from "@/components/ReadingGoal";
import { Biblio } from "@/components/Biblio";
import { StreakWeek } from "@/components/StreakWeek";
import { VerseSearch } from "@/components/VerseSearch";
import { checkAndSendReminder, checkStreakAtRisk, markReadToday, trackWeeklyChapter } from "@/lib/notifications";
import { checkAndProcessLeagueWeek } from "@/lib/leagues";
import { MobileNav } from "@/components/MobileNav";
import WelcomePage from "@/components/WelcomePage";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
    const { user, profile, loading, loginWithGoogle, refreshProfile } = useAuth();
    const { t, locale, setLocale } = useLanguage();
    const { isInstallable, installPWA } = usePWAInstall();
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
    const [prevLevel, setPrevLevel] = useState<number | null>(null);
    const [showLevelUp, setShowLevelUp] = useState(false);

    // Quiz States
    const [showQuizOffer, setShowQuizOffer] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizTarget, setQuizTarget] = useState<{ bookId: string; chapter: number } | null>(null);

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

    // Streak calculation consistency (from StreakWeek)
    const [localReadDates, setLocalReadDates] = useState<string[]>([]);
    useEffect(() => {
        const stored = localStorage.getItem("biblequest_read_dates");
        const fromLocal = stored ? JSON.parse(stored) : [];
        // Merge with profile.readDates to ensure we have the most complete history
        const merged = Array.from(new Set([...fromLocal, ...(profile?.readDates || [])]));
        setLocalReadDates(merged);
    }, [profile?.readDates]);

    // Swipe navigation
    const swipeTouchRef = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        swipeTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!swipeTouchRef.current) return;
        const dx = e.changedTouches[0].clientX - swipeTouchRef.current.x;
        const dy = e.changedTouches[0].clientY - swipeTouchRef.current.y;
        swipeTouchRef.current = null;
        // Only trigger if horizontal movement dominates and exceeds threshold
        if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        if (dx < 0 && isCompletedNow) {
            // Swipe left → next chapter
            handleNextChapter();
        } else if (dx > 0) {
            // Swipe right → back to dashboard
            handleBack();
        }
    };

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
            showToast(t('reading.verse_saved' as any) || "📖 Versículo salvo nos favoritos", "achievement");
        }
        setBookmarks(next);
        localStorage.setItem(
            `biblequest_bookmarks_${nextChapter.bookId}_${nextChapter.chapter}`,
            JSON.stringify([...next])
        );
    };

    // Level Up tracking effect
    useEffect(() => {
        if (profile) {
            const current = getLevelInfo(profile.xp).currentLevel;
            if (prevLevel !== null && (prevLevel > 0) && current > prevLevel) {
                setShowLevelUp(true);
            }
            if (current > 0) setPrevLevel(current);
        }
    }, [profile?.xp]);

    const handleVersePointerDown = (verseIndex: number) => {
        pressTimerRef.current = setTimeout(() => toggleBookmark(verseIndex), 600);
    };
    const handleVersePointerUp = () => {
        if (pressTimerRef.current) { clearTimeout(pressTimerRef.current); pressTimerRef.current = null; }
    };

    // Verse search
    const [showSearch, setShowSearch] = useState(false);

    // On mount: check notification reminder
    useEffect(() => {
        checkAndSendReminder();
        ensureBanksLoaded(); // Pre-load all quiz banks for faster access
    }, []);

    // Check streak at risk when profile loads
    useEffect(() => {
        if (profile?.streak) checkStreakAtRisk(profile.streak);
    }, [profile?.streak]);

    // On login: check league week promotion/demotion
    useEffect(() => {
        if (!user || !profile) return;
        checkAndProcessLeagueWeek(profile).then(result => {
            if (result?.promoted) showToast(`${t('profile.promoted' as any) || "🎉 Promovido para a Liga"} ${result.newLeague}!`, "achievement");
            else if (result?.demoted) showToast(`${t('profile.demoted' as any) || "📉 Rebaixado para a Liga"} ${result.newLeague}`, "info");
        }).catch(() => {});
    }, [user?.uid]);

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

        // Track daily/weekly progress
        markReadToday();
        trackWeeklyChapter();
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

            // Check level up celebration
            const oldLevel = calculateLevel(xpBeforeCompletion);
            const newLevel = calculateLevel(xpBeforeCompletion + xpAmount + totalQuizDelta);
            if (newLevel > oldLevel) {
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
                showToast(t('dashboard.already_read'), "info");
                return;
            }

            // Save chapter completed — XP/achievements applied now
            await finishChapter(0);
        } catch (error) {
            console.error("Failed to complete chapter", error);
            showToast(t('dashboard.save_error'), "error");
            setIsCompletedNow(true);
        }
    };

    const handleQuizAccept = () => {
        setShowQuizOffer(false);
        setShowQuiz(true);
    };

    const handleQuizDecline = async () => {
        setShowQuizOffer(false);
        await doNavigateNext();
    };

    const handleQuizComplete = async (quizXpDelta: number, correctCount: number) => {
        setShowQuiz(false);
        const missionBonus = trackDailyQuiz(correctCount === 3);
        const totalDelta = quizXpDelta + (missionBonus || 0);
        
        // Apply quiz XP bonus/penalty separately
        if (totalDelta !== 0 && user) {
            await applyXpDelta(user.uid, totalDelta);
            await refreshProfile();
        }
        await doNavigateNext();
    };


    // Actual navigation to next chapter — called after quiz or directly
    const doNavigateNext = async () => {
        setIsReading(false);
        setIsCompletedNow(false);
        setShowQuizOffer(false);
        setShowQuiz(false);
        setWasAlreadyRead(false);
        setChapterContent(null);
        await loadProgression();
    };

    const handleNextChapter = async () => {
        // If chapter was completed (not already read), offer quiz before navigating
        if (isCompletedNow && !wasAlreadyRead && user) {
            const bookId = nextChapter.bookId;
            const chapter = nextChapter.chapter;
            
            // Re-ensure banks are loaded just in case (should be mostly immediate if already loaded)
            await ensureBanksLoaded();
            
            const hasBank = !!getQuizBank(bookId, chapter);
            if (hasBank) {
                setQuizTarget({
                    bookId,
                    chapter,
                });
                setShowQuizOffer(true);
                return;
            }
        }
        await doNavigateNext();
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

    const handleNavigate = async (bookId: string, chapter: number) => {
        setNextChapter({ bookId, chapter });
        setIsReading(true);
        setLoadingContent(true);
        setIsCompletedNow(false);
        setWasAlreadyRead(false);
        try {
            const content = await getChapterContent(bookId, chapter, currentVersion);
            setChapterContent(content);
            if (user) {
                const alreadyRead = await isChapterCompleted(user.uid, bookId, chapter.toString()).catch(() => false);
                setWasAlreadyRead(alreadyRead);
                if (alreadyRead) setIsCompletedNow(true);
            }
        } finally {
            setLoadingContent(false);
        }
    };

    const chaptersCompleted = Math.max(0, (nextChapter.chapter - 1));

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-bold text-muted-foreground animate-pulse">{t('dashboard.loading_journey')}</p>
            </div>
        );
    }

    if (!user) {
        return <WelcomePage onLogin={loginWithGoogle} />;
    }

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
                        AnoBíblico+
                    </h1>
                    {isReading && chapterContent && (
                        <button
                            onClick={handleNextChapter}
                            className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:border-secondary/50 text-muted-foreground hover:text-secondary transition-all text-xs font-bold"
                            title={t('dashboard.next')}
                        >
                            <SkipForward className="w-3 h-3" />
                            <span className="hidden sm:inline">{t('dashboard.next')}</span>
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-4 text-sm font-bold">
                    <button
                        onClick={() => setShowSearch(true)}
                        className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                        title="Buscar capítulo"
                    >
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </button>
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
                                {calculateStreak(localReadDates)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Nv.</span>
                                <span className="text-primary font-bold">{getLevelInfo(profile?.xp || 0).currentLevel}</span>
                            </div>
                            
                            {/* Animated XP */}
                            <motion.div
                                className="flex items-center gap-1 text-accent font-black"
                                key={`xp-${profile?.xp}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                                <Trophy className="w-4 h-4 fill-current" /> {profile?.xp || 0}
                            </motion.div>

                            {/* Animated Gems */}
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
                                <span className="text-[10px] font-black uppercase tracking-tighter text-primary">{t('dashboard.profile_short')}</span>
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={loginWithGoogle}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 transition-all text-xs uppercase tracking-wider"
                        >
                            <LogIn className="w-4 h-4" /> {t('dashboard.login')}
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
                            {/* PWA Install Button */}
                            {isInstallable && (
                                <motion.button
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={installPWA}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-secondary to-secondary/80 text-white font-black shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                            <Download className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs opacity-90 uppercase tracking-widest font-black">{t('dashboard.install_pwa')}</p>
                                            <p className="text-sm">{t('dashboard.install_desc')}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            )}

                            {/* Mascote Biblio */}
                            <div className="flex justify-center pt-4">
                                <Biblio mood={profile?.streak && profile.streak > 2 ? "excited" : "happy"} size={90} />
                            </div>

                            {/* Greeting */}
                            <div className="text-center space-y-1">
                                <p className="text-xs font-bold text-secondary uppercase tracking-[0.25em]">
                                    {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                                </p>
                                <h2 className="text-4xl font-black text-primary tracking-tight">
                                    {user ? `${t('dashboard.greeting')}, ${user.displayName?.split(" ")[0]}` : t('dashboard.greeting_anonymous')}
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    {user ? t('dashboard.journey_continue') : t('dashboard.login_save')}
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

                            {/* WhatsApp Support Button */}
                            <div className="flex justify-center -mt-2">
                                <a 
                                    href="https://wa.me/5591983292005?text=PRECISO+DE+SUPORTE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#25D366]/10 text-[#25D366] font-black text-[10px] uppercase tracking-widest border border-[#25D366]/20 shadow-sm hover:bg-[#25D366]/20 active:scale-95 transition-all"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.063 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                    SUPORTE
                                </a>
                            </div>

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
                                <div className="rounded-2xl border border-secondary/30 bg-white/70 backdrop-blur p-4 space-y-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
                                            <Trophy className="w-3.5 h-3.5 text-secondary" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.current_cycle')}</span>
                                    </div>
                                    <div className="font-black text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1">{t('dashboard.global_plan')}</div>
                                    <div className="font-black text-xs text-primary leading-tight tracking-tight mt-1">
                                        {t('dashboard.rpsp')}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-accent/30 bg-white/70 backdrop-blur p-4 space-y-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
                                            <BookOpen className="w-3.5 h-3.5 text-accent" />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t('dashboard.progress')}</span>
                                    </div>
                                    <div className="font-black text-xl text-primary tracking-tight">
                                        {Math.round(((profile?.totalReadInCycle || 0) / 1189) * 100)}%
                                        <span className="text-[10px] font-normal text-muted-foreground ml-1">
                                            ({profile?.totalReadInCycle || 0}/1189)
                                        </span>
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
                                        {calculateStreak(localReadDates)} <span className="text-sm font-normal text-muted-foreground">{t('dashboard.days')}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('dashboard.ofensiva')}</span>
                                    </div>
                                    <div className="text-2xl font-black text-primary italic">{profile?.streak || 0}d</div>
                                </div>

                                <div className="glass-card p-6 flex flex-col justify-between border-l-4 border-accent relative overflow-hidden group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-4 h-4 text-accent fill-current" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('dashboard.xp_weekly')}</span>
                                    </div>
                                    <div className="text-2xl font-black text-primary italic">{profile?.weeklyXp || 0} XP</div>
                                </div>
                            </div>

                            {/* Ranking Card */}
                            <div className="glass-card overflow-hidden">
                                <div className="p-6 border-b border-secondary/10 flex items-center justify-between">
                                    <h3 className="text-lg font-black text-primary tracking-tight italic">{t('dashboard.ranking_week')}</h3>
                                    <Trophy className="w-5 h-5 text-secondary" />
                                </div>
                                <Leaderboard />
                            </div>

                            {/* Other stuff using translations if needed... */}
                            <div className="p-6 flex items-center justify-between">
                                <h3 className="text-lg font-black text-primary tracking-tight italic">{t('dashboard.plans')}</h3>
                                <BookOpen className="w-5 h-5 text-secondary" />
                            </div>
                            {/* Reading Goal */}
                            {user && <ReadingGoal />}

                            {/* Reading Plan */}
                            <ReadingPlanCard onNavigate={handleNavigate} />

                            {/* Daily Verse */}
                            <DailyVerse />

                            {/* Streak Week */}
                            {user && profile && <StreakWeek streak={profile.streak} streakFreezes={profile.streakFreezes} />}

                            {/* Daily Missions */}
                            {user && <DailyMissions />}

                            {/* DISCRETE DASHBOARD AD (Bottom) */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 flex justify-center border-t border-primary/5 pt-6 pb-2"
                            >
                                <AdBanner 
                                    adSlot="DASHBOARD_BOTTOM" 
                                    adFormat="horizontal" 
                                    className="max-h-[60px] w-full overflow-hidden rounded-xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
                                />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reading"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {loadingContent ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-muted-foreground">{t('reading.open_pergaminhos')}</p>
                                </div>
                            ) : chapterContent ? (
                                <>
                                    <article className="reading-surface rounded-2xl shadow-2xl px-6 py-10 max-w-none mb-32 border border-[#C5A059]/20">
                                        <h2 className="text-center text-4xl font-serif mb-3 tracking-tight text-primary">
                                            {t(`books.${chapterContent.bookId}` as any)} {chapterContent.chapter}
                                        </h2>
                                        <p className="text-center text-xs mb-4 uppercase tracking-widest font-semibold text-muted-foreground">
                                            {chapterContent.version} • {chapterContent.totalVerses} {t('reading.versiculos')} • ~{Math.round(chapterContent.estimatedSeconds / 60)} min
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
                                            {t('reading.hold_to_mark')}
                                        </p>

                                        {/* DISCRETE CHAPTER AD */}
                                        <div className="mt-12 mb-4 border-t border-primary/5 pt-8">
                                            <p className="text-[9px] text-center font-black uppercase tracking-[0.4em] text-primary/30 mb-4">{t('reading.study_recommendation')}</p>
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
                                                                <span className="text-lg text-muted-foreground">{t('reading.already_read_banner')}</span>
                                                                <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">{t('reading.advance_next')}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-lg text-accent">{t('reading.reading_complete')}</span>
                                                                <span className="text-xs text-accent/70 uppercase tracking-widest">{t('reading.xp_quiz_info')}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleNextChapter}
                                                    className="px-6 py-3 bg-accent text-accent-foreground font-bold rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(66,165,245,0.4)]"
                                                >
                                                </button>
                                                {profile && (() => {
                                                    const levelInfo = getLevelInfo(profile.xp);
                                                    return (
                                                        <LevelProgressBar 
                                                            level={levelInfo.currentLevel}
                                                            progressPercentage={levelInfo.progressPercentage}
                                                            xpInCurrentLevel={levelInfo.xpInCurrentLevel}
                                                            xpRequiredForNextLevel={levelInfo.xpRequiredForNextLevel}
                                                            title={levelInfo.title}
                                                            className="mt-6"
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-red-400">{t('reading.content_unavailable' as any) || "Conteúdo indisponível para este capítulo ainda."}</p>
                                    <button onClick={handleBack} className="mt-4 underline text-sm">{t('common.back' as any) || "Voltar"}</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <QuizOfferModal
                isOpen={showQuizOffer}
                bookId={quizTarget?.bookId ?? "genesis"}
                chapter={quizTarget?.chapter ?? 1}
                onAccept={handleQuizAccept}
                onDecline={handleQuizDecline}
            />

            <QuizModal
                isOpen={showQuiz}
                bookId={quizTarget?.bookId ?? "genesis"}
                chapter={quizTarget?.chapter ?? 1}
                onComplete={handleQuizComplete}
            />


            <LevelUpModal
                isOpen={showLevelUp}
                level={getLevelInfo(profile?.xp || 0).currentLevel}
                onClose={() => setShowLevelUp(false)}
            />

            <OnboardingModal />

            <VerseSearch
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                onNavigate={handleNavigate}
            />

            {/* Footer */}
            {!isReading && (
                <>
                    <div className="pb-32 pt-4 text-center">
                        <Link href="/politica-de-privacidade" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            Política de Privacidade
                        </Link>
                    </div>
                    <MobileNav />
                </>
            )}
        </div>
    );
}
