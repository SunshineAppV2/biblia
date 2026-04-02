"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Info } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";
import { useRanking, RankingTab, RankingView, RankingScope } from "@/hooks/useRanking";

// Componentes Modulares anteriormente extraídos
import { RankingHeader } from "@/components/ranking/RankingHeader";
import { RankingFilters } from "@/components/ranking/RankingFilters";
import { RankingTabs } from "@/components/ranking/RankingTabs";
import { RewardBanner } from "@/components/ranking/RewardBanner";
import { RankingChildItem } from "@/components/ranking/RankingChildItem";

export default function RankingPage() {
    const { user, profile } = useAuth();
    
    // UI Local States
    const [activeTab, setActiveTab] = useState<RankingTab>("level");
    const [view, setView] = useState<RankingView>("current");
    const [scope, setScope] = useState<RankingScope>("league");

    /**
     * Gerenciamento de estado de dados via TanStack Query.
     * Oferece cache persistente entre trocas de abas e revalidação automática.
     */
    const { 
        data: ranking = [], 
        isLoading,
        isError,
        error 
    } = useRanking(
        activeTab,
        view,
        scope,
        profile?.currentLeague
    );

    return (
        <div className="min-h-screen bg-background pb-32 pt-12 px-6 font-sans max-w-2xl mx-auto">
            <RankingHeader activeTab={activeTab} />

            <RankingFilters 
                view={view} 
                setView={setView} 
                scope={scope} 
                setScope={setScope} 
                currentLeague={profile?.currentLeague} 
            />

            <RankingTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />

            <RewardBanner activeTab={activeTab} />

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-20 bg-white/40 dark:bg-white/10 rounded-[28px] animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="py-20 text-center opacity-40">
                        <Info className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <p className="font-bold uppercase tracking-widest text-xs">Erro ao carregar ranking.</p>
                        <p className="text-[10px] mt-2 italic font-mono opacity-60">{(error as any)?.message}</p>
                    </div>
                ) : ranking.length === 0 ? (
                    <div className="py-20 text-center opacity-40">
                        <Info className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">Ainda não há dados suficientes.</p>
                    </div>
                ) : (
                    ranking.map((entry, index) => (
                        <RankingChildItem 
                            key={entry.uid} 
                            entry={entry} 
                            index={index} 
                            isMe={entry.uid === user?.uid} 
                            activeTab={activeTab} 
                        />
                    ))
                )}
            </div>

            <MobileNav />
        </div>
    );
}
