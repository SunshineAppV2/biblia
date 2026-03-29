"use client";

import { useState, useEffect, useRef } from "react";
import { ReadingTimer } from "@/components/ReadingTimer";
import { cn, calculateStreak } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, Trophy, ChevronLeft, LogIn, CheckCircle, ArrowRight, SkipForward, Zap, Moon, Sun, Minus, Plus, Bookmark, Search, Gem, Download } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { completeChapter, isChapterCompleted } from "@/lib/progress";
import { getNextUserChapter } from "@/lib/progression-service";
import { getChapterContent, ChapterContent } from "@/lib/bible";
import { getLevelInfo, calculateLevel } from "@/lib/levels";
import { motion, AnimatePresence } from "framer-motion";
import { LevelUpModal } from "@/components/LevelUpModal";
import { QuizModal } from "@/components/QuizModal";
import { QuizOfferModal } from "@/components/QuizOfferModal";
import { getQuizBank, ensureBanksLoaded } from "@/lib/quiz-data";
import { OnboardingModal } from "@/components/OnboardingModal";
import { updateUserVersion, getUserProfile } from "@/lib/firestore";
import { secureApplyXp } from "@/lib/api-client";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import { useToast } from "@/components/Toast";
import { trackDailyRead, trackDailyQuiz } from "@/components/DailyMissions";
import { VerseSearch } from "@/components/VerseSearch";
import { checkAndSendReminder, checkStreakAtRisk, trackWeeklyChapter, markReadToday } from "@/lib/notifications";
import { checkAndProcessLeagueWeek } from "@/lib/leagues";
import { MobileNav } from "@/components/MobileNav";
import WelcomePage from "@/components/WelcomePage";

// New Refactored Components
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { HomeReader } from "@/components/home/HomeReader";

export default function Home() {
    const { user, profile, loading, loginWithGoogle, refreshProfile } = useAuth();
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
    const [quizTarget, setQuizTarget] = useState<{ bookId: string; chapter: number; bookName: string } | null>(null);

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

    // Audio Bible Logic
    const [isSpeaking, setIsSpeaking] = useState(false);
    const toggleAudio = () => {
        if (typeof window === "undefined") return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            if (!chapterContent) return;
            const textToSpeak = `${chapterContent.bookName} capítulo ${chapterContent.chapter}. ${chapterContent.text.join(". ")}`;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = "pt-BR";
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

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
            showToast("📖 Versículo salvo nos favoritos", "achievement");
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
            if (result?.promoted) showToast(`🎉 Promovido para a Liga ${result.newLeague}!`, "achievement");
            else if (result?.demoted) showToast(`📉 Rebaixado para a Liga ${result.newLeague}`, "info");
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

        try {
            // Chapter XP is handled by secureApplyXp
            const addedXp = await secureApplyXp(user.uid, {
                type: "CHAPTER",
                bookId: nextChapter.bookId,
                chapter: nextChapter.chapter
            });

            if (addedXp) {
                // Tracking
                markReadToday();
                trackWeeklyChapter();
                
                const missionBonus = trackDailyRead();
                if (missionBonus) {
                    await secureApplyXp(user.uid, {
                        type: "MISSION",
                        missionId: "DAILY_READ",
                        bonus: missionBonus
                    });
                }

                // Notify about wisdom point if already at max level
                if (wasAtMaxLevel) {
                    showToast("🕊️ Ponto de Sabedoria conquistado!", "achievement");
                }

                // Check level up celebration
                const oldLevel = calculateLevel(xpBeforeCompletion);
                const newLevel = calculateLevel(xpBeforeCompletion + addedXp + (missionBonus || 0));
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
            }
        } catch (error) {
            console.error("Failed to finish chapter", error);
            showToast("Erro ao salvar progresso. Tente novamente.", "error");
        } finally {
            setIsCompletedNow(true);
        }
    };

    const handleComplete = async () => {
        if (!user || !profile) {
            setIsCompletedNow(true);
            return;
        }

        try {
            const wasNew = await completeChapter(
                user.uid,
                nextChapter.bookId,
                nextChapter.chapter.toString(),
                50
            );

            if (!wasNew) {
                setWasAlreadyRead(true);
                setIsCompletedNow(true);
                showToast("Capítulo já registrado anteriormente.", "info");
                return;
            }

            await finishChapter(0);
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
        await doNavigateNext();
    };

    const handleQuizComplete = async (quizXpDelta: number, correctCount: number) => {
        setShowQuiz(false);
        const missionBonus = trackDailyQuiz(correctCount === 3);
        
        if (user) {
            // Secure XP for Quiz
            await secureApplyXp(user.uid, {
                type: "QUIZ",
                bookId: quizTarget?.bookId,
                chapter: quizTarget?.chapter,
                correctCount
            });

            // Secure XP for Mission bonus
            if (missionBonus) {
                await secureApplyXp(user.uid, {
                    type: "MISSION",
                    missionId: "QUIZ_FLAWLESS",
                    bonus: missionBonus
                });
            }
            
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
                    bookName: chapterContent?.bookName ?? "",
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

    const handleBack = () => {
        if (typeof window !== "undefined") window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsReading(false);
    };

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
                <p className="text-sm font-bold text-muted-foreground animate-pulse">Carregando sua jornada...</p>
            </div>
        );
    }

    if (user && !profile) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-bold text-muted-foreground animate-pulse">Preparando seu perfil...</p>
            </div>
        );
    }

    if (!user && !loading) {
        return <WelcomePage onLogin={loginWithGoogle} />;
    }

    return (
        <div className="min-h-screen pb-24 font-sans bg-background">
            <HomeHeader 
                user={user}
                profile={profile}
                isReading={isReading}
                chapterContent={chapterContent}
                currentVersion={currentVersion}
                isDark={isDark}
                localReadDates={localReadDates}
                onBack={handleBack}
                onNextChapter={handleNextChapter}
                onShowSearch={() => setShowSearch(true)}
                onToggleDark={() => setIsDark(d => !d)}
                onVersionChange={handleVersionChange}
                onLogin={loginWithGoogle}
            />

            <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!isReading ? (
                        <HomeDashboard 
                            user={user}
                            profile={profile}
                            isInstallable={isInstallable}
                            nextChapter={nextChapter}
                            chapterContent={chapterContent}
                            localReadDates={localReadDates}
                            onInstallPWA={installPWA}
                            onStartReading={handleStartReading}
                            onNavigate={handleNavigate}
                        />
                    ) : (
                        <HomeReader 
                            loadingContent={loadingContent}
                            chapterContent={chapterContent}
                            fontSize={fontSize}
                            isSpeaking={isSpeaking}
                            bookmarks={bookmarks}
                            isCompletedNow={isCompletedNow}
                            wasAlreadyRead={wasAlreadyRead}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onChangeFontSize={changeFontSize}
                            onToggleAudio={toggleAudio}
                            onVersePointerDown={handleVersePointerDown}
                            onVersePointerUp={handleVersePointerUp}
                            onComplete={handleComplete}
                            onNextChapter={handleNextChapter}
                            onBack={handleBack}
                        />
                    )}
                </AnimatePresence>
            </main>

            {/* Modals */}
            <QuizOfferModal
                isOpen={showQuizOffer}
                bookName={quizTarget?.bookName ?? ""}
                chapter={quizTarget?.chapter ?? 1}
                onAccept={handleQuizAccept}
                onDecline={handleQuizDecline}
            />
            <QuizModal
                isOpen={showQuiz}
                bookId={quizTarget?.bookId ?? "genesis"}
                bookName={quizTarget?.bookName ?? ""}
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

            <MobileNav />
        </div>
    );
}
