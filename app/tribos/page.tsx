"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { 
    createGroup, 
    joinGroup, 
    leaveGroup, 
    getGroupsRanking, 
    getGroupById,
    UserGroup,
    UserProfile
} from "@/lib/firestore";
import { Trophy, Users, Plus, Shield, LogOut, ChevronRight, Crown, Info, BookOpen, Flame, Zap, Target, Star, Gem, Play, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/Toast";
import { AdBanner } from "@/components/AdBanner";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function TribesPage() {
    const { user, profile, refreshProfile } = useAuth();
    const { t } = useLanguage();
    const [group, setGroup] = useState<UserGroup | null>(null);
    const [ranking, setRanking] = useState<UserGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                if (profile?.groupId) {
                    const g = await getGroupById(profile.groupId);
                    setGroup(g);
                } else {
                    setGroup(null);
                }
                const r = await getGroupsRanking(3); // Min 3 members
                setRanking(r);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, profile?.groupId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newName) return;
        try {
            await createGroup(user.uid, newName, newDesc);
            showToast("Tribo criada com sucesso!", "success");
            setIsCreating(false);
            refreshProfile();
        } catch (error: any) {
            showToast(error.message, "error");
        }
    };

    const handleLeave = async () => {
        if (!user || !confirm("Tem certeza que deseja sair desta tribo?")) return;
        try {
            await leaveGroup(user.uid);
            showToast("Você saiu da tribo.", "info");
            refreshProfile();
        } catch (error: any) {
            showToast(error.message, "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32 pt-12 px-6 font-sans max-w-2xl mx-auto">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-black text-primary flex items-center gap-4 italic tracking-tight">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center">
                        <Users className="w-7 h-7 text-secondary" />
                    </div>
                    Tribos Bíblicas
                </h1>
                <p className="text-sm text-muted-foreground mt-3 font-medium leading-relaxed">
                   Unam-se para conquistar o objetivo de ler a Bíblia toda em um ano. <br />
                   <span className="text-secondary font-bold underline underline-offset-4 decoration-secondary/30">Guerreiem juntos, cresçam juntos.</span>
                </p>
            </header>

            <AnimatePresence mode="wait">
                {group ? (
                    <motion.div 
                        key="active-group"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        {/* Group Display Card */}
                        <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#0E1B5C] to-[#1A237E] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                             <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/15 rounded-full blur-[80px] -mr-20 -mt-20" />
                             <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/40 rounded-full blur-[60px] -ml-10 -mb-10" />
                             
                             <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">{t('tribes.my_tribe')}</span>
                                    <h2 className="text-4xl font-black italic mt-4 tracking-tighter">{group.name}</h2>
                                    <p className="text-sm opacity-60 mt-2 font-medium max-w-[280px] leading-snug">{group.description}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/15 flex flex-col items-center min-w-[80px] shadow-lg">
                                    <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">{t('tribes.members')}</span>
                                    <span className="text-2xl font-black mt-1">{group.memberCount}</span>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-5 relative z-10">
                                <div className="bg-white/5 backdrop-blur-md p-5 rounded-[28px] border border-white/10 hover:bg-white/10 transition-all">
                                    <p className="text-[10px] font-bold uppercase opacity-60 flex items-center gap-2 mb-2 tracking-widest">
                                        <Flame className="w-3.5 h-3.5 text-secondary fill-current" />
                                        XP
                                    </p>
                                    <p className="text-3xl font-black text-white">{group.totalXpWeek}</p>
                                </div>
                                
                                <div className="bg-white/5 backdrop-blur-md p-5 rounded-[28px] border border-white/10 flex flex-col justify-center">
                                    {group.memberCount < 3 ? (
                                        <div className="flex items-start gap-2.5 text-secondary">
                                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase leading-tight tracking-wider">{t('tribes.inactive')}</p>
                                                <p className="text-[9px] font-medium opacity-80 mt-1 leading-relaxed">{t('tribes.need_more', { count: 3 - group.memberCount })}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-emerald-400">
                                            <p className="text-[10px] font-black uppercase flex items-center gap-2 tracking-widest">
                                                <Shield className="w-3.5 h-3.5 fill-current" />
                                                {t('tribes.eligible')}
                                            </p>
                                            <p className="text-[9px] font-medium opacity-80 mt-1 leading-relaxed">{t('tribes.ready')}</p>
                                        </div>
                                    )}
                                </div>
                             </div>

                             <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                                <button 
                                    onClick={handleLeave}
                                    className="flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-red-300 transition-all uppercase tracking-[0.2em]"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    {t('tribes.leave')}
                                </button>
                                <div className="text-[9px] font-black text-secondary/60 italic">ID: {group.id.split('_')[1]}</div>
                             </div>
                        </div>

                        {/* Warriors List */}
                        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-secondary/10 rounded-[32px] p-8 shadow-sm">
                            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Users className="w-5 h-5 text-secondary" />
                                {t('tribes.warriors')}
                            </h3>
                            <div className="grid gap-3">
                                {group.members.map((m, i) => (
                                    <div key={m} className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-black/5 hover:border-secondary/20 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-[11px] font-black text-secondary">
                                                #{i + 1}
                                            </div>
                                            <div>
                                                <span className="text-sm font-black text-primary block truncate max-w-[140px]">
                                                    {m === group.leaderUid && <Crown className="w-3.5 h-3.5 inline mr-1.5 text-secondary fill-current" />}
                                                    {t('tribes.member')} {m.slice(0, 6)}
                                                </span>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t('tribes.warrior_faith')}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-[10px] font-black flex items-center gap-1.5">
                                            <Zap className="w-3 h-3 fill-current" />
                                            {t('tribes.online')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="no-group"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {!isCreating ? (
                            <div className="space-y-6">
                                <div className="p-10 rounded-[48px] bg-white border border-secondary/15 text-center shadow-2xl shadow-secondary/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-primary" />
                                    <div className="w-24 h-24 bg-secondary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                        <Users className="w-12 h-12 text-secondary" />
                                    </div>
                                    <h2 className="text-3xl font-black text-primary italic tracking-tight">{t('tribes.no_tribe_title')}</h2>
                                    <p className="text-sm text-muted-foreground mt-4 px-6 font-medium leading-relaxed">
                                        {t('tribes.no_tribe_desc')}
                                        <br /><span className="text-secondary font-bold mt-2 block">{t('tribes.min_members')}</span>
                                    </p>
                                    <button 
                                        onClick={() => setIsCreating(true)}
                                        className="mt-10 w-full py-5 rounded-[24px] bg-secondary text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-secondary/30 hover:scale-[1.03] active:scale-95 transition-all group"
                                    >
                                        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                                        {t('tribes.create_tribe')}
                                    </button>
                                </div>
                                <div className="text-center p-6 bg-secondary/5 rounded-3xl border border-secondary/10 border-dashed">
                                    <p className="text-xs text-secondary font-bold flex items-center justify-center gap-2">
                                        <Info className="w-4 h-4" />
                                        {t('tribes.tip')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <motion.form 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onSubmit={handleCreate} 
                                className="bg-white shadow-2xl border border-secondary/15 rounded-[48px] p-10 space-y-8"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-primary uppercase tracking-[0.2em] italic">{t('tribes.new_foundation')}</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">{t('tribes.new_foundation_desc')}</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1 mb-2 block">{t('tribes.tribe_name')}</label>
                                        <input 
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            placeholder={t('tribes.name_placeholder')}
                                            className="w-full p-5 rounded-2xl bg-[#FDFBF7] border border-secondary/15 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 font-black text-base transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary ml-1 mb-2 block">{t('tribes.description')}</label>
                                        <textarea 
                                            value={newDesc}
                                            onChange={e => setNewDesc(e.target.value)}
                                            placeholder={t('tribes.desc_placeholder')}
                                            className="w-full p-5 rounded-2xl bg-[#FDFBF7] border border-secondary/15 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 font-bold text-sm h-32 resize-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-5 rounded-2xl bg-muted/20 text-muted-foreground font-black text-xs uppercase tracking-widest hover:bg-muted/30 transition-colors"
                                    >
                                        {t('tribes.back')}
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-[2] py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        {t('tribes.crystallize')}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ranking Header */}
            <div className="mt-16 mb-8 flex items-center justify-between px-2">
                <div>
                  <h2 className="text-xl font-black text-primary uppercase tracking-[0.2em] italic flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-secondary" />
                      {t('tribes.ranking_title')}
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{t('tribes.ranking_subtitle')}</p>
                </div>
                <div className="shrink-0 flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary/20 flex items-center justify-center text-[10px] font-black text-secondary">
                        {i}
                    </div>
                  ))}
                </div>
            </div>

            {/* AD BANNER (Location 2) */}
            <div className="mt-12 mb-2 p-4 border-2 border-dashed border-secondary/10 rounded-3xl bg-secondary/5">
                <p className="text-[8px] text-center font-black uppercase tracking-[0.5em] text-secondary/40 mb-3 underline decoration-secondary/10 underline-offset-4">Patrocinado pela Comunidade</p>
                <AdBanner 
                    adSlot="TRIBES_RANKING_TOP" 
                    adFormat="horizontal" 
                    className="max-h-[60px] rounded-xl overflow-hidden opacity-70 grayscale hover:grayscale-0 transition-all pointer-events-auto" 
                />
            </div>

            {/* Ranking List */}
            <div className="space-y-4">
                {ranking.length > 0 ? (
                    ranking.map((r, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            key={r.id} 
                            className={`group p-5 rounded-[28px] transition-all border relative overflow-hidden ${
                                r.id === profile?.groupId 
                                ? "bg-secondary text-white border-secondary shadow-xl shadow-secondary/30 ring-4 ring-secondary/20" 
                                : "bg-white border-secondary/10 hover:border-secondary/40 shadow-sm hover:shadow-md"
                            }`}
                        >
                            {i === 0 && <Crown className="absolute -top-1 -left-1 w-10 h-10 text-secondary/20 -rotate-12" />}
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-inner ${
                                    r.id === profile?.groupId ? "bg-white/20" : "bg-secondary/10 text-secondary"
                                }`}>
                                    #{i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-base truncate uppercase tracking-tighter italic leading-none">{r.name}</h3>
                                    <div className="flex items-center gap-4 mt-2 font-black">
                                        <div className="flex items-center gap-1.5">
                                            <Users className={`w-3 h-3 ${r.id === profile?.groupId ? "text-white" : "text-secondary"}`} />
                                            <span className={`text-[10px] uppercase tracking-widest ${r.id === profile?.groupId ? "text-white opacity-80" : "text-muted-foreground"}`}>
                                                {r.memberCount}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Zap className={`w-3 h-3 ${r.id === profile?.groupId ? "text-white" : "text-secondary"} fill-current`} />
                                            <span className={`text-[10px] uppercase tracking-[0.1em] ${r.id === profile?.groupId ? "text-white" : "text-secondary"}`}>
                                                {r.totalXpWeek} <span className="opacity-60">XP</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className={`w-6 h-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${r.id === profile?.groupId ? "text-white" : "text-primary"}`} />
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-16 border-4 border-dotted border-secondary/15 rounded-[48px] text-center bg-secondary/5">
                        <Users className="w-12 h-12 text-secondary/30 mx-auto mb-6 opacity-50" />
                        <p className="text-sm text-secondary font-black italic px-10 leading-relaxed uppercase tracking-widest">
                            Nenhuma tribo atingiu o quórum mínimo de 3 membros para batalha.
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest">A glória aguarda os primeiros!</p>
                    </div>
                )}
            </div>
            
            <div className="mt-12 p-8 rounded-3xl bg-secondary/10 border border-secondary/15 text-center">
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4">Como funciona o Ranking?</p>
                <ul className="text-[10px] text-muted-foreground text-left space-y-3 font-bold uppercase tracking-tighter">
                    <li className="flex gap-3"><span className="text-secondary">●</span> Somente grupos com 3 a 10 membros participam.</li>
                    <li className="flex gap-3"><span className="text-secondary">●</span> Todo XP ganho por leitura individual soma para a Tribo.</li>
                    <li className="flex gap-3"><span className="text-secondary">●</span> O ranking reseta semanalmente para novas disputas.</li>
                </ul>
            </div>
        </div>
    );
}
