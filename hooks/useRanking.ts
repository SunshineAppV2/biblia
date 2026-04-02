"use client";

import { useQuery } from "@tanstack/react-query";
import { getGlobalLevelRanking, getWeeklyEncounterRanking, LeaderboardEntry } from "@/lib/leaderboard-service";

export type RankingTab = "level" | "encounter";
export type RankingView = "current" | "last";
export type RankingScope = "league" | "global";

/**
 * Hook para buscar dados do ranking usando TanStack Query.
 * Oferece cache automático e revalidação inteligente.
 */
export function useRanking(
    tab: RankingTab,
    view: RankingView,
    scope: RankingScope,
    currentLeague?: string
) {
    const isLastWeek = view === "last";
    const leagueFilter = scope === "league" ? currentLeague : undefined;

    return useQuery<LeaderboardEntry[]>({
        queryKey: ["ranking", tab, view, scope, leagueFilter],
        queryFn: () => {
            if (tab === "level") {
                return getGlobalLevelRanking(leagueFilter, isLastWeek);
            } else {
                return getWeeklyEncounterRanking(leagueFilter, isLastWeek);
            }
        },
        // Só executa se o escopo for global ou se tivermos a liga (evita chamadas inválidas)
        enabled: scope === "global" || !!currentLeague,
        staleTime: 1000 * 60 * 5, // 5 minutos de cache "fresco"
    });
}
