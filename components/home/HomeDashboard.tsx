"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight, BookOpen, Trophy, Flame, Zap, Lock, Bookmark } from "lucide-react";
import Link from "next/link";
import { Biblio } from "@/components/Biblio";
import { LevelProgressBar } from "@/components/LevelProgressBar";
import { getLevelInfo } from "@/lib/levels";
import { AdBanner } from "@/components/AdBanner";
import { ReadingPlanCard } from "@/components/ReadingPlanCard";
import { READING_PLANS } from "@/lib/reading-plan";
import { ReadingGoal } from "@/components/ReadingGoal";
import { DailyVerse } from "@/components/DailyVerse";
import { StreakWeek } from "@/components/StreakWeek";
import { DailyMissions } from "@/components/DailyMissions";
import { Leaderboard } from "@/components/Leaderboard";
import { User } from "firebase/auth";
import { UserProfile } from "@/lib/firestore";
import { calculateStreak } from "@/lib/utils";

interface HomeDashboardProps {
    user: User | null;
    profile: UserProfile | null;
    isInstallable: boolean;
    nextChapter: { bookId: string; chapter: number };
    chapterContent: any;
    localReadDates: string[];
    onInstallPWA: () => void;
    onStartReading: () => void;
    onNavigate: (bookId: string, chapter: number) => void;
}

export function HomeDashboard({
    user,
    profile,
    isInstallable,
    nextChapter,
    chapterContent,
    localReadDates,
    onInstallPWA,
    onStartReading,
    onNavigate
}: HomeDashboardProps) {
    return (
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
                    onClick={onInstallPWA}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-secondary to-secondary/80 text-white font-black shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Download className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs opacity-90 uppercase tracking-widest font-black">App Instalável</p>
                            <p className="text-sm">Instale para acesso rápido</p>
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

            {/* WhatsApp Support Button */}
            <div className="flex justify-center -mt-2">
                <a 
                    href="https://wa.me/5591983292005?text=PRECISO+DE+SUPORTE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#25D366]/10 text-[#25D366] font-black text-[10px] uppercase tracking-widest border border-[#25D366]/20 shadow-sm hover:bg-[#25D366]/20 active:scale-95 transition-all"
                >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    SUPORTE
                </a>
            </div>

            {/* Main Card: Next Chapter */}
            <div className="space-y-2">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onStartReading}
                    className="relative overflow-hidden rounded-2xl cursor-pointer border border-secondary/40 shadow-[0_4px_24px_rgba(197,160,89,0.15)] bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl"
                >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent" />
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

                    <div className="relative p-6 flex items-center gap-5">
                        <div className="shrink-0 w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                            <BookOpen className="w-8 h-8 text-secondary" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ">
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

                <div className="flex justify-between px-1">
                    <Link href="/favoritos" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                        <Bookmark className="w-3 h-3" /> Favoritos
                    </Link>
                    <Link href="/planos" className="text-xs font-bold text-secondary hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                        <BookOpen className="w-3 h-3" /> Planos de Leitura
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
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ciclo Atual</span>
                    </div>
                    <div className="font-black text-xs text-primary leading-tight tracking-tight mt-1">
                        {READING_PLANS.find(p => p.id === (profile?.activePlanId || "rpsp"))?.name || "PLANO ATIVO"}
                    </div>
                </div>

                <div className="rounded-2xl border border-accent/30 bg-white/70 backdrop-blur p-4 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
                            <BookOpen className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progresso</span>
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
                        {calculateStreak(localReadDates)} <span className="text-sm font-normal text-muted-foreground">dias</span>
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

            {user && <ReadingGoal />}

            <ReadingPlanCard 
                onNavigate={onNavigate} 
                planId={profile?.activePlanId || "rpsp"}
                startDate={profile?.planStartDate?.toDate()}
            />

            {/* Activities Section */}
            <section className="space-y-3">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-1 opacity-60">Atividades Bíblicas</h3>
                <div className="grid grid-cols-2 gap-3">
                    {(profile?.xp || 0) >= 10000 ? (
                        <Link href="/arena" className="bg-white/70 backdrop-blur border border-secondary/20 hover:border-secondary transition-all rounded-3xl p-5 flex flex-col gap-3 group shadow-sm">
                            <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform">
                                <Zap className="w-5 h-5 text-secondary fill-current" />
                            </div>
                            <div>
                                <h4 className="font-black text-[11px] uppercase text-primary leading-tight">BOM DE BÍBLIA+</h4>
                                <p className="text-[9px] text-muted-foreground mt-0.5">Duelo do seu Plano</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="bg-black/5 border border-black/5 rounded-3xl p-5 flex flex-col gap-3 opacity-50 grayscale cursor-not-allowed">
                            <div className="w-10 h-10 bg-black/10 rounded-2xl flex items-center justify-center border border-black/10">
                                <Lock className="w-4 h-4 text-black/40" />
                            </div>
                            <div>
                                <h4 className="font-black text-[11px] uppercase text-primary leading-tight">BOM DE BÍBLIA+</h4>
                                <p className="text-[9px] text-red-500/60 font-bold mt-0.5 uppercase">Nível 10 Necessário</p>
                            </div>
                        </div>
                    )}

                    {(profile?.xp || 0) >= 20000 ? (
                        <Link href="/desafios" className="bg-white/70 backdrop-blur border border-primary/20 hover:border-primary transition-all rounded-3xl p-5 flex flex-col gap-3 group shadow-sm">
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                <Trophy className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-black text-[11px] uppercase text-primary leading-tight">BIBLIAQUIZ+</h4>
                                <p className="text-[9px] text-muted-foreground mt-0.5">Desafio Trivia GERAL</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="bg-black/5 border border-black/5 rounded-3xl p-5 flex flex-col gap-3 opacity-50 grayscale cursor-not-allowed">
                            <div className="w-10 h-10 bg-black/10 rounded-2xl flex items-center justify-center border border-black/10">
                                <Lock className="w-4 h-4 text-black/40" />
                            </div>
                            <div>
                                <h4 className="font-black text-[11px] uppercase text-primary leading-tight">BIBLIAQUIZ+</h4>
                                <p className="text-[9px] text-red-500/60 font-bold mt-0.5 uppercase">Nível 20 Necessário</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <DailyVerse />

            {user && profile && <StreakWeek streak={profile.streak} streakFreezes={profile.streakFreezes} />}

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
    );
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.063 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    )
}
