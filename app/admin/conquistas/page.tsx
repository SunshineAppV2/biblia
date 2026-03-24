"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getCountFromServer,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievements";

interface AchievementStat extends Achievement {
    unlockedCount: number;
    percentage: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    leitura: "Leitura",
    streak: "Streak",
    nivel: "Nível",
    liga: "Liga",
    sabedoria: "Sabedoria",
};

const CATEGORY_COLORS: Record<string, string> = {
    leitura: "bg-blue-500/20 text-blue-400",
    streak: "bg-orange-500/20 text-orange-400",
    nivel: "bg-purple-500/20 text-purple-400",
    liga: "bg-yellow-500/20 text-yellow-400",
    sabedoria: "bg-teal-500/20 text-teal-400",
};

export default function ConquistasPage() {
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [achievementStats, setAchievementStats] = useState<AchievementStat[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const usersCol = collection(db, "users");

                // Get total user count
                const totalSnap = await getCountFromServer(usersCol);
                const total = totalSnap.data().count;
                setTotalUsers(total);

                // For each achievement, count how many users have it
                const stats: AchievementStat[] = await Promise.all(
                    ACHIEVEMENTS.map(async (achievement) => {
                        try {
                            const countSnap = await getCountFromServer(
                                query(usersCol, where("achievements", "array-contains", achievement.id))
                            );
                            const count = countSnap.data().count;
                            return {
                                ...achievement,
                                unlockedCount: count,
                                percentage: total > 0 ? Math.round((count / total) * 100) : 0,
                            };
                        } catch {
                            return { ...achievement, unlockedCount: 0, percentage: 0 };
                        }
                    })
                );

                setAchievementStats(stats);
            } catch (err) {
                console.error("Error loading achievement stats:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const mostCommon = [...achievementStats].sort((a, b) => b.unlockedCount - a.unlockedCount)[0];
    const rarest = [...achievementStats].sort((a, b) => a.unlockedCount - b.unlockedCount)[0];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Conquistas</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Estatísticas de desbloqueio das conquistas pelos usuários
                </p>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-gray-400 py-12">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                    Carregando conquistas...
                </div>
            ) : (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Total de Conquistas</div>
                            <div className="text-3xl font-bold text-white">{ACHIEVEMENTS.length}</div>
                        </div>
                        {mostCommon && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Mais Comum</div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{mostCommon.icon}</span>
                                    <span className="text-white font-semibold text-sm">{mostCommon.title}</span>
                                </div>
                                <div className="text-green-400 text-sm font-medium">
                                    {mostCommon.unlockedCount} usuários ({mostCommon.percentage}%)
                                </div>
                            </div>
                        )}
                        {rarest && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Mais Rara</div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{rarest.icon}</span>
                                    <span className="text-white font-semibold text-sm">{rarest.title}</span>
                                </div>
                                <div className="text-purple-400 text-sm font-medium">
                                    {rarest.unlockedCount} usuários ({rarest.percentage}%)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info notice */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 mb-6 text-blue-300 text-sm">
                        <strong>Nota:</strong> Para editar título, descrição ou XP de uma conquista, edite diretamente o arquivo{" "}
                        <code className="bg-blue-500/20 px-1 rounded font-mono text-xs">lib/achievements.ts</code>.
                        Este painel exibe apenas estatísticas de uso em tempo real.
                    </div>

                    {/* Achievement grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievementStats.map((a) => (
                            <div
                                key={a.id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="text-2xl shrink-0">{a.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-white font-semibold text-sm">{a.title}</span>
                                            <span
                                                className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                                                    CATEGORY_COLORS[a.category] ?? "bg-gray-700 text-gray-400"
                                                }`}
                                            >
                                                {CATEGORY_LABELS[a.category] ?? a.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-gray-400">+{a.xpBonus} XP</span>
                                    <span className="text-gray-400">
                                        {a.unlockedCount} / {totalUsers} usuários
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-800 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-white/40 transition-all duration-500"
                                        style={{ width: `${a.percentage}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">{a.percentage}%</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
