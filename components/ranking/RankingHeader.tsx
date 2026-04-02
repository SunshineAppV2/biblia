"use client";

import { Trophy } from "lucide-react";

interface RankingHeaderProps {
    activeTab: "level" | "encounter";
}

export function RankingHeader({ activeTab }: RankingHeaderProps) {
    return (
        <header className="mb-10">
            <h1 className="text-4xl font-black text-primary flex items-center gap-4 italic tracking-tight">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-secondary" />
                </div>
                Hall da Fama
            </h1>
            <p className="text-sm text-muted-foreground mt-3 font-medium leading-relaxed">
                Os maiores leitores e estudiosos da Palavra. <br />
                <span className="text-secondary font-bold underline underline-offset-4 decoration-secondary/30">
                    {activeTab === "level" ? "Ranking por nível de sabedoria." : "Ranking da Jornada do Saber."}
                </span>
            </p>
        </header>
    );
}
