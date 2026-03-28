"use client";

import { useState } from "react";
import { READING_PLANS } from "@/lib/reading-plan";
import { useAuth } from "@/components/AuthProvider";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/Toast";
import { MobileNav } from "@/components/MobileNav";
import { motion } from "framer-motion";
import { Book, Check, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PlansPage() {
    const { profile, refreshProfile } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [switching, setSwitching] = useState<string | null>(null);

    const handleSelectPlan = async (planId: string) => {
        if (!profile) return;
        setSwitching(planId);
        try {
            const userRef = doc(db, "users", profile.uid);
            await updateDoc(userRef, {
                activePlanId: planId,
                planStartDate: serverTimestamp()
            });
            await refreshProfile();
            showToast(`Plano ${READING_PLANS.find(p => p.id === planId)?.name} ativado!`, "achievement");
            router.push("/");
        } catch (error) {
            console.error(error);
            showToast("Erro ao trocar de plano", "error");
        } finally {
            setSwitching(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-32">
            <header className="p-6 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-black italic tracking-tighter">Escolha seu <span className="text-secondary">Plano</span></h1>
            </header>

            <main className="px-6 space-y-6 max-w-2xl mx-auto">
                <p className="text-sm text-[#455A80] font-medium leading-relaxed">
                    Selecione o plano que melhor se adapta ao seu ritmo. O progresso será reiniciado para o novo plano.
                </p>

                <div className="grid gap-4">
                    {READING_PLANS.map((plan) => {
                        const isActive = profile?.activePlanId === plan.id;
                        return (
                            <motion.div
                                key={plan.id}
                                whileHover={{ scale: 1.01 }}
                                className={`p-6 rounded-[32px] border-2 transition-all relative overflow-hidden ${
                                    isActive 
                                        ? "border-secondary bg-white shadow-xl shadow-secondary/10" 
                                        : "border-black/5 bg-white/50 hover:border-black/10"
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">
                                        ATIVO
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                        isActive ? "bg-secondary/20" : "bg-black/5"
                                    }`}>
                                        <Book className={`w-6 h-6 ${isActive ? "text-secondary" : "text-black/40"}`} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-xl font-black italic tracking-tight">{plan.name}</h3>
                                        <p className="text-sm text-[#455A80] font-medium leading-tight">{plan.description}</p>
                                        
                                        <div className="flex items-center gap-4 pt-4 text-[10px] font-black uppercase tracking-widest text-[#455A80]/60">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {plan.durationDays} Dias
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {plan.type === "global" ? "Início Fixo" : "Livre Escolha"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!isActive && (
                                    <button
                                        onClick={() => handleSelectPlan(plan.id)}
                                        disabled={switching !== null}
                                        className="w-full mt-6 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {switching === plan.id ? "Ativando..." : "ATİVAR ESTE PLANO"}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            <MobileNav />
        </div>
    );
}
