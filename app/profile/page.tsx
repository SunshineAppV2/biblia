"use client";

import { useAuth } from "@/components/AuthProvider";
import { getLevelInfo } from "@/lib/levels";
import { LEAGUE_CONFIGS } from "@/lib/leagues";
import { LeagueBadge } from "@/components/LeagueBadge";
import { ChevronLeft, Calendar, Award, BookOpen, Flame, Zap, Trophy, Bookmark, Bell, BellOff, Shield, Gem, Star } from "lucide-react";
import { LeagueTier } from "@/lib/leagues";
import { motion } from "framer-motion";
import Link from "next/link";
import { LevelProgressBar } from "@/components/LevelProgressBar";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievements";
import { useEffect, useState } from "react";
import { cn, getLocalDateString, calculateStreak } from "@/lib/utils";
import { requestNotificationPermission, disableNotifications, isNotificationsEnabled } from "@/lib/notifications";
import { ReadingHeatmap } from "@/components/ReadingHeatmap";
import { ShareButton } from "@/components/ShareButton";
import { buyStreakFreeze } from "@/lib/firestore";
import { useToast } from "@/components/Toast";
import { AdBanner } from "@/components/AdBanner";
import { MobileNav } from "@/components/MobileNav";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProfilePage() {
    const { user, profile, logout, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const { t, locale, setLocale } = useLanguage();
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [notifyEnabled, setNotifyEnabled] = useState(false);
    const [buying, setBuying] = useState(false);
    useEffect(() => { setNotifyEnabled(isNotificationsEnabled()); }, []);

    const handleBuyFreeze = async () => {
        if (!user || (profile?.gems ?? 0) < 50 || buying) return;
        setBuying(true);
        try {
            await buyStreakFreeze(user.uid, 50);
            await refreshProfile();
            showToast(t('profile.bought_freeze'), "achievement");
        } catch (error) {
            console.error("Failed to buy freeze", error);
            showToast(t('profile.buy_error'), "error");
        } finally {
            setBuying(false);
        }
    };


    const toggleNotifications = async () => {
        if (notifyEnabled) {
            disableNotifications();
            setNotifyEnabled(false);
        } else {
            const granted = await requestNotificationPermission();
            setNotifyEnabled(granted);
        }
    };

    const [localReadDates, setLocalReadDates] = useState<string[]>([]);
    useEffect(() => {
        const stored = localStorage.getItem("biblequest_read_dates");
        const fromLocal = stored ? JSON.parse(stored) : [];
        const merged = Array.from(new Set([...fromLocal, ...(profile?.readDates || [])]));
        setLocalReadDates(merged);
    }, [profile?.readDates]);

    useEffect(() => {
        if (profile?.achievements) {
            setUnlockedIds(profile.achievements);
        }
    }, [profile?.achievements]);


    if (!user || !profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-white">Ops! Você precisa estar logado.</h1>
                    <Link href="/" className="inline-block text-primary hover:underline">
                        Voltar para o Início
                    </Link>
                </div>
            </div>
        );
    }

    const levelInfo = getLevelInfo(profile.xp);
    const leagueConfig = LEAGUE_CONFIGS[profile.currentLeague as LeagueTier];
    const unlockedCount = unlockedIds.length;
    const totalAchievements = ACHIEVEMENTS.length;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <header className="p-4 flex items-center justify-between glass border-b border-white/5 sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-primary" />
                </Link>
                <h1 className="text-lg font-black text-primary uppercase italic tracking-widest">Seu Perfil</h1>
                <button
                    onClick={logout}
                    className="text-xs font-bold text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    Sair
                </button>
            </header>

            <main className="max-w-xl mx-auto p-6 space-y-8">
                {/* User Card */}
                <section className="flex flex-col items-center gap-6 text-center pt-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-primary/30 overflow-hidden ring-4 ring-secondary/20 shadow-2xl">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                                    {user.displayName?.[0]}
                                </div>
                            )}
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground font-black p-2 rounded-xl shadow-lg border-2 border-background text-xs"
                        >
                            NV. {levelInfo.currentLevel}
                        </motion.div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-primary italic truncate max-w-[300px]">
                            {user.displayName}
                        </h2>
                        <p className="text-muted-foreground text-sm flex items-center justify-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            Membro desde{" "}
                            {new Date(user.metadata.creationTime || Date.now()).toLocaleDateString("pt-BR", {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </section>

                {/* Level Stats */}
                <section className="glass-card p-6 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Progresso de Nível
                        </span>
                        <span className="text-sm font-black text-primary">XP TOTAL: {profile.xp}</span>
                    </div>
                    <LevelProgressBar
                        level={levelInfo.currentLevel}
                        progressPercentage={levelInfo.progressPercentage}
                        xpInCurrentLevel={levelInfo.xpInCurrentLevel}
                        xpRequiredForNextLevel={levelInfo.xpRequiredForNextLevel}
                        title={levelInfo.title}
                    />
                    <div className="flex items-center gap-2 pt-2 border-t border-primary/5">
                        <Gem className="w-4 h-4 text-blue-500 fill-current" />
                        <span className="text-sm font-black text-primary">{profile.gems || 0} Gemas</span>
                    </div>
                </section>

                {/* AD BANNER (Location 4) */}
                <div className="py-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                    <AdBanner 
                        adSlot="PROFILE_TOP" 
                        adFormat="horizontal" 
                        className="max-h-[60px] rounded-xl overflow-hidden" 
                    />
                </div>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white/40 border border-secondary/10 rounded-2xl p-4 shadow-sm">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 mb-2 italic">
                            {t('profile.xp_total')}
                        </p>
                        <p className="text-2xl font-black text-primary">{profile?.xp || 0}</p>
                    </div>
                    <div className="bg-white/40 border border-secondary/10 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-blue-500">
                            <Gem className="w-4 h-4 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('profile.gems')}</span>
                        </div>
                        <p className="text-2xl font-black text-primary mt-1">{profile?.gems || 0}</p>
                    </div>
                    <div className="bg-white/40 border border-secondary/10 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('profile.chapters')}</span>
                        </div>
                        <p className="text-2xl font-black text-primary mt-1">{profile?.totalChapters || 0}</p>
                    </div>
                    <div className="bg-white/40 border border-secondary/10 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-orange-500">
                            <Flame className="w-4 h-4 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('profile.streak')}</span>
                        </div>
                        <p className="text-2xl font-black text-primary mt-1">{profile?.streak || 0}d</p>
                    </div>
                </section>

                {/* Reading Heatmap */}
                <section className="mb-10">
                    <h2 className="text-lg font-black text-primary italic mb-4 px-1">{t('profile.history')}</h2>
                    <div className="bg-white border border-secondary/10 rounded-3xl p-6 shadow-sm overflow-x-auto">
                        <ReadingHeatmap userId={user.uid} />
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-lg font-black text-primary italic mb-4 px-1">{t('profile.settings')}</h2>
                    <div className="space-y-3">
                        {/* Language Selector in Profile */}
                        <div className="bg-white border border-secondary/10 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-primary">{t('profile.language')}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {locale === "pt" ? "Português" : "English"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary/5 p-1 rounded-xl border border-secondary/10 shadow-inner">
                                <button 
                                    onClick={() => setLocale("pt")}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${locale === "pt" ? "bg-secondary text-primary shadow-sm" : "text-primary/40 hover:text-primary"}`}
                                >
                                    PT
                                </button>
                                <button 
                                    onClick={() => setLocale("en")}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${locale === "en" ? "bg-secondary text-primary shadow-sm" : "text-primary/40 hover:text-primary"}`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border border-secondary/10 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-primary">{t('profile.streak_freeze')}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {profile?.streakFreezes || 0} {t('profile.available')}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={handleBuyFreeze}
                                disabled={buying || (profile?.gems ?? 0) < 50}
                                className="px-4 py-2 bg-secondary text-primary font-black text-[10px] rounded-xl hover:opacity-90 transition-all shadow-sm shadow-secondary/20 disabled:opacity-50 uppercase tracking-widest"
                            >
                                {buying ? "..." : (profile?.gems ?? 0) >= 50 ? t('profile.buy_freeze', { price: 50 }) : t('profile.insufficient_gems')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", notifyEnabled ? "bg-accent/15 border-accent/25" : "bg-muted/50 border-muted")}>
                            {notifyEnabled ? <Bell className="w-4 h-4 text-accent" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary uppercase tracking-wider">{t('profile.notifications')}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{notifyEnabled ? t('profile.notifications_on') : t('profile.notifications_off')}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleNotifications}
                        className={cn("px-3 py-1.5 rounded-full text-xs font-bold transition-all border", notifyEnabled ? "bg-red-400/10 border-red-400/25 text-red-400 hover:bg-red-400/20" : "bg-accent/10 border-accent/25 text-accent hover:bg-accent/20")}
                    >
                        {notifyEnabled ? t('profile.deactivate') : t('profile.activate')}
                    </button>
                </section>

                {/* Share Level */}
                <section className="glass-card p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">{t('profile.share')}</p>
                        <p className="text-sm font-bold text-primary">{t('profile.level')} {levelInfo.currentLevel} — {levelInfo.title}</p>
                    </div>
                    <ShareButton type="level" value={levelInfo.currentLevel} />
                </section>

                {/* Wisdom Points — only shown when user reached level 66 */}
                {(profile.wisdomPoints || 0) > 0 && (
                    <section className="glass-card p-6 space-y-4 border border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🕊️</span>
                            <div>
                                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{t('profile.wisdom_title')}</span>
                                <h3 className="text-xl font-black text-primary">
                                    {profile.wisdomPoints} Points
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {t('profile.wisdom_desc')}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {[
                                { label: "Contemplativo", threshold: 10, icon: "🕊️" },
                                { label: "Mestre Contemplativo", threshold: 100, icon: "✨" },
                                { label: "Segunda Aliança", threshold: 1189, icon: "📜" },
                            ].map(({ label, threshold, icon }) => {
                                const wp = profile.wisdomPoints || 0;
                                const progress = Math.min(100, (wp / threshold) * 100);
                                const done = wp >= threshold;
                                return (
                                    <div key={label} className="flex items-center gap-3">
                                        <span className={done ? "" : "grayscale opacity-40"}>{icon}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-[10px] mb-0.5">
                                                <span className={done ? "text-secondary font-bold" : "text-muted-foreground"}>{label}</span>
                                                <span className="text-muted-foreground">{Math.min(wp, threshold)}/{threshold}</span>
                                            </div>
                                            <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all", done ? "bg-secondary" : "bg-secondary/30")}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* League Status */}
                <section className="glass-card p-6 flex items-center gap-6 bg-gradient-to-br from-primary/10 to-primary/5 border-secondary/30">
                    <LeagueBadge tier={profile.currentLeague as LeagueTier} size="lg" />
                    <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t('profile.league_title')}</span>
                        <h3 className="text-2xl font-black text-primary uppercase italic tracking-tight">
                            {profile.currentLeague}
                        </h3>
                        <p className="text-xs text-muted-foreground">{t('profile.league_desc')}</p>
                    </div>
                </section>

                {/* Achievements */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" /> Conquistas ({unlockedCount}/{totalAchievements})
                        </h3>
                        <Link href="/conquistas" className="text-xs text-accent font-bold hover:underline">
                            Ver todas →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {ACHIEVEMENTS.map((achievement: Achievement, i: number) => {
                            const isUnlocked = unlockedIds.includes(achievement.id);
                            return (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={cn(
                                        "glass-card flex items-center gap-4 p-4 transition-all",
                                        !isUnlocked && "grayscale opacity-40"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-all",
                                        isUnlocked
                                            ? "bg-primary/20 border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                            : "bg-primary/20 border-secondary/10"
                                    )}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-primary">{achievement.title}</div>
                                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                                        <div className="text-[10px] text-accent font-bold mt-1">+{achievement.xpBonus} XP</div>
                                    </div>
                                    {isUnlocked && (
                                        <div className="text-accent text-xs font-black uppercase tracking-wider">
                                            ✓
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
                <div className="h-24" />
            </main>
            <MobileNav />
        </div>
    );
}
