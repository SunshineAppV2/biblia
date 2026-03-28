"use client";

import { motion } from "framer-motion";
import { 
    Users, Trophy, Zap, Target, Star, Shield, 
    Flame, Gem, ChevronRight, Play, Download, 
    MapPin, RefreshCw, BookOpen, Crown 
} from "lucide-react";
import Link from "next/link";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const FEATURES = [
    {
        icon: Flame,
        title: "Ofensiva (Streak)",
        description: "Mantenha o hábito vivo. Cada dia de leitura conta para sua sequência ininterrupta.",
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        icon: Users,
        title: "Tribos Bíblicas",
        description: "Crie grupos com amigos para lerem juntos. Ranking exclusivo para tribos com 3+ membros.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: RefreshCw,
        title: "Ciclo Circular (RPP)",
        description: "Leia todos os 1.189 capítulos. O plano se adapta ao seu início e recomeça automaticamente.",
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        icon: Trophy,
        title: "Ligas Globais",
        description: "Suba de liga, do Jaspe ao Diamante, competindo saudavelmente com outros leitores.",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        icon: Gem,
        title: "Recompensas",
        description: "Ganhe gemas por leituras e quizes. Proteja sua ofensiva ou desbloqueie itens raros.",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
    },
    {
        icon: Target,
        title: "Metas Semanais",
        description: "Defina seus objetivos e acompanhe sua evolução com estatísticas reais.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    }
];

export default function WelcomePage({ onLogin }: { onLogin?: () => void }) {
    const { isInstallable, installPWA } = usePWAInstall();

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#0E1B5C] font-sans selection:bg-secondary/30 overflow-x-hidden">
            {/* Soft Ambient Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-secondary/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0E1B5C] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20 rotate-3">
                            A
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter text-primary">
                            AnoBíblico<span className="text-secondary">+</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {isInstallable && (
                            <button 
                                onClick={installPWA}
                                className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-secondary/10 text-secondary text-[11px] font-black hover:bg-secondary/20 transition-all border border-secondary/20 tracking-widest uppercase"
                            >
                                <Download className="w-4 h-4" />
                                INSTALAR APP
                            </button>
                        )}
                        <button 
                            onClick={onLogin}
                            className="px-6 py-2.5 rounded-2xl bg-primary text-white text-[11px] font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all outline outline-offset-2 outline-transparent hover:outline-primary/20 uppercase tracking-widest"
                        >
                            ACESSAR
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            A Experiência Bíblica Definitiva
                        </motion.div>
                        
                        <h1 className="text-6xl sm:text-8xl font-black leading-[0.9] mb-10 tracking-tighter">
                            Toda a Bíblia. <br />
                            <span className="text-primary italic">Todos os dias.</span>
                        </h1>
                        
                        <p className="text-xl sm:text-2xl text-[#455A80] font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
                            O <strong>AnoBíblico+</strong> sincroniza sua leitura com o plano global (RPP) <br className="hidden sm:block" />
                            e motiva sua caminhada com <span className="text-secondary font-bold">gamificação, tribos e recompensas.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button 
                                onClick={onLogin}
                                className="w-full sm:w-auto px-12 py-6 rounded-[32px] bg-primary text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(14,27,92,0.3)] hover:scale-[1.03] active:scale-95 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                <Play className="w-6 h-6 fill-current" />
                                INICIAR JORNADA
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                            </button>
                            
                            {isInstallable && (
                                <button 
                                    onClick={installPWA}
                                    className="w-full sm:w-auto px-12 py-6 rounded-[32px] bg-white border-2 border-primary/10 text-primary font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/5 active:scale-95 transition-all"
                                >
                                    <Download className="w-6 h-6" />
                                    BAIXAR APP
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Showcase */}
            <section className="py-32 px-6 bg-white shadow-[0_-40px_100px_rgba(184,130,10,0.05)] rounded-[60px] relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter italic">O que te espera na <span className="text-secondary">vanguarda</span>?</h2>
                        <div className="w-24 h-1.5 bg-secondary/30 mx-auto rounded-full mb-6" />
                        <p className="text-[#455A80] font-bold text-sm uppercase tracking-widest">Ferramentas de elite para sua disciplina espiritual</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 rounded-[40px] bg-[#FDFBF7] border border-secondary/10 hover:border-secondary/40 transition-all group shadow-xl shadow-secondary/5 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/5 to-transparent rounded-full -mr-12 -mt-12" />
                                <div className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-black/5`}>
                                    <f.icon className={`w-8 h-8 ${f.color} fill-current`} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 italic tracking-tight">{f.title}</h3>
                                <p className="text-base leading-relaxed text-[#455A80] font-medium">
                                    {f.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Section: Tribes & Quizzes */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24">
                    <div className="flex-1 space-y-10">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-primary/20">
                            <Users className="w-4 h-4" />
                            Novo: Tribos e Ranking
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black leading-[1] italic bg-gradient-to-br from-[#0E1B5C] to-[#42A5F5] bg-clip-text text-transparent">
                            Juntos no Caminho da <span className="text-secondary underline underline-offset-8 decoration-secondary/30">Luz.</span>
                        </h2>
                        <p className="text-xl text-[#455A80] font-medium leading-relaxed">
                            A leitura individual agora faz parte de um todo. Ganhe XP para sua **Tribo** e suba no ranking mundial. Após cada capítulo, um quiz flash solidifica seu aprendizado.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-secondary" />
                                </div>
                                <span className="font-black text-sm uppercase tracking-widest italic">Liga Diamante</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <span className="font-black text-sm uppercase tracking-widest italic">Aceleração Real</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative perspective-1000">
                        <motion.div 
                            animate={{ 
                                rotateY: [0, 5, 0],
                                rotateX: [0, -5, 0],
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative p-3 rounded-[50px] border-[14px] border-[#0E1B5C] bg-[#FDFBF7] shadow-[0_50px_100px_rgba(14,27,92,0.25)] aspect-[9/16] w-full max-w-[340px] mx-auto overflow-hidden ring-1 ring-white/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/10" />
                            {/* Mockup Content */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 bg-secondary/20 rounded-xl" />
                                    <div className="w-24 h-4 bg-primary/10 rounded-full" />
                                </div>
                                <div className="aspect-square w-full bg-primary/5 rounded-[40px] flex items-center justify-center border-2 border-dashed border-primary/10">
                                   <BookOpen className="w-20 h-20 text-primary opacity-20" />
                                </div>
                                <div className="space-y-3">
                                   <div className="h-6 w-3/4 bg-primary/20 rounded-lg" />
                                   <div className="h-4 w-full bg-primary/10 rounded-md" />
                                   <div className="h-4 w-1/2 bg-primary/10 rounded-md" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                   <div className="h-24 bg-secondary/10 rounded-3xl p-4 flex flex-col justify-between">
                                      <Zap className="w-5 h-5 text-secondary" />
                                      <div className="h-3 w-10 bg-secondary/20 rounded-full" />
                                   </div>
                                   <div className="h-24 bg-primary/10 rounded-3xl p-4 flex flex-col justify-between">
                                      <Trophy className="w-5 h-5 text-primary" />
                                      <div className="h-3 w-10 bg-primary/20 rounded-full" />
                                   </div>
                                </div>
                            </div>
                        </motion.div>
                        {/* decorative elements */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
                        <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <footer className="py-40 px-6 border-t border-secondary/10 bg-[#0E1B5C] text-white rounded-t-[80px]">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-5xl sm:text-7xl font-black tracking-tighter italic"
                    >
                        Redescubra a Bíblia <br /> como <span className="text-secondary underline decoration-secondary/30 underline-offset-8">nunca</span> antes.
                    </motion.h2>
                    <button 
                        onClick={onLogin}
                        className="px-16 py-7 rounded-[32px] bg-secondary text-primary font-black text-2xl shadow-[0_20px_60px_rgba(184,130,10,0.4)] hover:scale-105 active:scale-95 transition-all group"
                    >
                        INICIAR GRATUITAMENTE
                    </button>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-12 pt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                        <Link href="/politica-de-privacidade" className="hover:text-secondary transition-colors">POLÍTICA DE PRIVACIDADE</Link>
                        <span className="hidden sm:block">|</span>
                        <p>© 2026 ANOBÍBLICO+. TODOS OS DIREITOS RESERVADOS.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
