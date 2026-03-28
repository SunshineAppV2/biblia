"use client";

import { motion } from "framer-motion";
import { BookOpen, Trophy, Zap, Target, Star, Shield, Flame, Gem, ChevronRight, Play, Download } from "lucide-react";
import Link from "next/link";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const FEATURES = [
    {
        icon: Flame,
        title: "Ofensiva (Streak)",
        description: "Mantenha o hábito vivo. Cada dia de leitura conta para sua sequência.",
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        icon: Trophy,
        title: "Ligas e Ranking",
        description: "Suba de liga, do Jaspe ao Diamante, competindo saudavelmente com outros leitores.",
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        icon: Gem,
        title: "Recompensas",
        description: "Ganhe gemas por leituras e quizes. Use para proteger sua ofensiva ou desbloquear itens.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: Target,
        title: "Metas Semanais",
        description: "Defina quantos capítulos quer ler por semana e acompanhe seu progresso em tempo real.",
        color: "text-green-500",
        bg: "bg-green-500/10"
    }
];

export default function WelcomePage({ onLogin }: { onLogin?: () => void }) {
    const { isInstallable, installPWA } = usePWAInstall();

    return (
        <div className="min-h-screen bg-background dark:bg-slate-950 font-sans selection:bg-secondary/30">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/80 backdrop-blur-md border-b border-secondary/15 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-secondary/20">
                            A
                        </div>
                        <span className="text-xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                            AnoBíblico+
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isInstallable && (
                            <button 
                                onClick={installPWA}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-black hover:bg-secondary/20 transition-all border border-secondary/20"
                            >
                                <Download className="w-3.5 h-3.5" />
                                INSTALAR APP
                            </button>
                        )}
                        <button 
                            onClick={onLogin}
                            className="px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all outline outline-offset-2 outline-transparent hover:outline-primary/20"
                        >
                            Acessar Conta
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20 dark:opacity-40">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-secondary rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-secondary/15 text-secondary text-xs font-black uppercase tracking-widest">
                            ✨ A Experiência Bíblica Definitiva
                        </span>
                        <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] mb-8 bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                            Sua jornada de fé, <br />
                            <span className="text-secondary italic">elevada</span> ao próximo nível.
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            O <strong>AnoBíblico+</strong> combina a profundidade das Escrituras com a mecânica da gamificação para ajudar você a ler a Bíblia toda em um ano, com prazer e consistência.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={onLogin}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-secondary text-white font-black flex items-center justify-center gap-2 shadow-2xl shadow-secondary/30 hover:scale-105 active:scale-95 transition-all group"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                COMEÇAR AGORA
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {isInstallable ? (
                                <button 
                                    onClick={installPWA}
                                    className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
                                >
                                    <Download className="w-5 h-5" />
                                    INSTALAR APP
                                </button>
                            ) : (
                                <a 
                                    href="#recursos"
                                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 transition-all"
                                >
                                    CONHECER RECURSOS
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="recursos" className="py-20 px-6 bg-white dark:bg-slate-950/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black mb-4">Por que o AnoBíblico+?</h2>
                        <p className="text-slate-500">Mais que um leitor, um companheiro de disciplina espiritual.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-white/40 dark:bg-white/5 border border-secondary/15 backdrop-blur-sm hover:border-secondary/40 transition-all group shadow-sm"
                            >
                                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                                    <f.icon className={`w-7 h-7 ${f.color} fill-current`} />
                                </div>
                                <h3 className="text-xl font-black mb-3">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                    {f.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="py-20 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 text-foreground">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent italic">
                            Quizes Diários e <br />
                            <span className="text-secondary">Aprendizado</span> Real
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                            Não apenas leia. Compreenda. Após cada capítulo, teste seu conhecimento com quizes rápidos e ganhe bônus de XP para subir no ranking global. Seu progresso é salvo automaticamente na nuvem.
                        </p>
                        <ul className="space-y-4 text-left max-w-sm mx-auto lg:mx-0">
                            {[
                                "Quizes baseados no capítulo lido",
                                "Conheça o Biblio, seu mascote guia",
                                "Suba da Liga Jaspe ao Diamante",
                                "Medalhas por desempenho perfeito"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-bold text-sm">
                                    <div className="w-5 h-5 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Visual UI Preview */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-secondary/20 blur-[100px] rounded-full" />
                        <div className="relative p-2 rounded-[40px] border-[12px] border-slate-900 bg-slate-100 dark:bg-slate-900 shadow-2xl aspect-[9/16] w-full max-w-[320px] mx-auto overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-b from-primary to-secondary opacity-10" />
                           {/* Mini UI Mockup */}
                           <div className="p-4 space-y-4">
                              <div className="h-6 w-3/4 bg-white/50 rounded-lg animate-pulse" />
                              <div className="aspect-[4/3] w-full bg-white/30 rounded-2xl animate-pulse" />
                              <div className="space-y-2">
                                 <div className="h-4 w-full bg-white/20 rounded" />
                                 <div className="h-4 w-5/6 bg-white/20 rounded" />
                                 <div className="h-4 w-4/6 bg-white/20 rounded" />
                              </div>
                              <div className="grid grid-cols-2 gap-3 mt-8">
                                 <div className="h-20 bg-orange-500/20 rounded-2xl flex flex-col items-center justify-center gap-1">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <div className="h-2 w-8 bg-orange-500/30 rounded" />
                                 </div>
                                 <div className="h-20 bg-blue-500/20 rounded-2xl flex flex-col items-center justify-center gap-1">
                                    <Trophy className="w-5 h-5 text-blue-500" />
                                    <div className="h-2 w-8 bg-blue-500/30 rounded" />
                                 </div>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-200 dark:border-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black mb-8">Pronto para começar sua transformação?</h2>
                    <button 
                        onClick={onLogin}
                        className="px-12 py-5 rounded-2xl bg-primary text-white font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all mb-12"
                    >
                        ACESSAR ANOBÍBLICO+
                    </button>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500 font-medium">
                        <Link href="/politica-de-privacidade">Privacidade</Link>
                        <span>·</span>
                        <p>© 2026 AnoBíblico+. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
