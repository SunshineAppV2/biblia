"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, getCountFromServer, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/firestore";
import { getLevelInfo } from "@/lib/levels";
import { LEAGUE_CONFIGS, LEAGUE_ORDER, LeagueTier } from "@/lib/leagues";

interface Stats {
    totalUsers: number;
    activeToday: number;
    activeWeek: number;
    totalChapters: number;
    avgStreak: number;
    popularLeague: string;
}

interface LeagueDist {
    tier: LeagueTier;
    label: string;
    color: string;
    count: number;
}

interface LevelBucket {
    label: string;
    count: number;
}

export default function StatsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats | null>(null);
    const [leagueDist, setLeagueDist] = useState<LeagueDist[]>([]);
    const [levelBuckets, setLevelBuckets] = useState<LevelBucket[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                // Total users
                const usersCol = collection(db, "users");
                const totalSnap = await getCountFromServer(usersCol);
                const totalUsers = totalSnap.data().count;

                // Active today
                const todayMidnight = new Date();
                todayMidnight.setHours(0, 0, 0, 0);
                const todayTs = Timestamp.fromDate(todayMidnight);
                const activeTodaySnap = await getCountFromServer(
                    query(usersCol, where("lastActive", ">=", todayTs))
                );
                const activeToday = activeTodaySnap.data().count;

                // Active this week
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                weekAgo.setHours(0, 0, 0, 0);
                const weekTs = Timestamp.fromDate(weekAgo);
                const activeWeekSnap = await getCountFromServer(
                    query(usersCol, where("lastActive", ">=", weekTs))
                );
                const activeWeek = activeWeekSnap.data().count;

                // Fetch all users for deeper stats
                const allUsersSnap = await getDocs(usersCol);
                const allUsers = allUsersSnap.docs.map((d) => d.data() as UserProfile);

                // Total chapters
                const totalChapters = allUsers.reduce((sum, u) => sum + (u.totalChapters ?? 0), 0);

                // Average streak
                const avgStreak =
                    allUsers.length > 0
                        ? Math.round(allUsers.reduce((sum, u) => sum + (u.streak ?? 0), 0) / allUsers.length)
                        : 0;

                // Most popular league
                const leagueCounts: Record<string, number> = {};
                for (const u of allUsers) {
                    const l = u.currentLeague || "AGATA";
                    leagueCounts[l] = (leagueCounts[l] ?? 0) + 1;
                }
                const popularLeague = Object.entries(leagueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "AGATA";

                setStats({ totalUsers, activeToday, activeWeek, totalChapters, avgStreak, popularLeague });

                // League distribution
                const dist: LeagueDist[] = LEAGUE_ORDER.map((tier) => ({
                    tier,
                    label: LEAGUE_CONFIGS[tier]?.label ?? tier,
                    color: LEAGUE_CONFIGS[tier]?.color ?? "#888",
                    count: leagueCounts[tier] ?? 0,
                }));
                setLeagueDist(dist);

                // Level distribution buckets
                const buckets: Record<string, number> = {
                    "1–10": 0,
                    "11–20": 0,
                    "21–30": 0,
                    "31–40": 0,
                    "41–50": 0,
                    "51–66": 0,
                };
                for (const u of allUsers) {
                    const lvl = getLevelInfo(u.xp ?? 0).currentLevel;
                    if (lvl <= 10) buckets["1–10"]++;
                    else if (lvl <= 20) buckets["11–20"]++;
                    else if (lvl <= 30) buckets["21–30"]++;
                    else if (lvl <= 40) buckets["31–40"]++;
                    else if (lvl <= 50) buckets["41–50"]++;
                    else buckets["51–66"]++;
                }
                setLevelBuckets(
                    Object.entries(buckets).map(([label, count]) => ({ label, count }))
                );
            } catch (err) {
                console.error("Error loading stats:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const maxLeagueCount = Math.max(...leagueDist.map((l) => l.count), 1);
    const maxLevelCount = Math.max(...levelBuckets.map((b) => b.count), 1);

    const popularLeagueCfg = stats
        ? LEAGUE_CONFIGS[stats.popularLeague as LeagueTier]
        : null;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Estatísticas</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Visão geral do engajamento e progresso dos usuários
                </p>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-gray-400 py-12">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                    Carregando estatísticas...
                </div>
            ) : stats ? (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <StatCard
                            label="Total de Usuários"
                            value={stats.totalUsers.toLocaleString("pt-BR")}
                            icon="👥"
                        />
                        <StatCard
                            label="Ativos Hoje"
                            value={stats.activeToday.toLocaleString("pt-BR")}
                            icon="☀️"
                            sub={`${stats.totalUsers > 0 ? Math.round((stats.activeToday / stats.totalUsers) * 100) : 0}% do total`}
                        />
                        <StatCard
                            label="Ativos Esta Semana"
                            value={stats.activeWeek.toLocaleString("pt-BR")}
                            icon="📅"
                            sub={`${stats.totalUsers > 0 ? Math.round((stats.activeWeek / stats.totalUsers) * 100) : 0}% do total`}
                        />
                        <StatCard
                            label="Capítulos Lidos (Total)"
                            value={stats.totalChapters.toLocaleString("pt-BR")}
                            icon="📖"
                        />
                        <StatCard
                            label="Média de Streak"
                            value={`${stats.avgStreak} dias`}
                            icon="🔥"
                        />
                        <StatCard
                            label="Liga Mais Popular"
                            value={popularLeagueCfg?.label ?? stats.popularLeague}
                            icon="🏆"
                            valueColor={popularLeagueCfg?.color}
                        />
                    </div>

                    {/* League Distribution */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Distribuição por Liga</h2>
                        <div className="space-y-2.5">
                            {leagueDist.map((l) => (
                                <div key={l.tier} className="flex items-center gap-3">
                                    <div className="w-24 text-xs text-gray-400 text-right shrink-0">{l.label}</div>
                                    <div className="flex-1 bg-gray-800 rounded-full h-5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                            style={{
                                                width: `${(l.count / maxLeagueCount) * 100}%`,
                                                backgroundColor: l.color + "cc",
                                                minWidth: l.count > 0 ? "2rem" : "0",
                                            }}
                                        >
                                            {l.count > 0 && (
                                                <span className="text-xs text-white font-semibold">{l.count}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-8 text-xs text-gray-500 shrink-0">{l.count === 0 ? "0" : ""}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Level Distribution */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Distribuição por Nível</h2>
                        <div className="flex items-end gap-3 h-40">
                            {levelBuckets.map((b) => (
                                <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs text-gray-400 font-mono">{b.count}</span>
                                    <div className="w-full bg-gray-800 rounded-t-md flex items-end" style={{ height: "100px" }}>
                                        <div
                                            className="w-full bg-blue-500/70 rounded-t-md transition-all duration-500"
                                            style={{
                                                height: `${(b.count / maxLevelCount) * 100}%`,
                                                minHeight: b.count > 0 ? "4px" : "0",
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-gray-500 py-12 text-center">Não foi possível carregar estatísticas.</div>
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    sub,
    valueColor,
}: {
    label: string;
    value: string;
    icon: string;
    sub?: string;
    valueColor?: string;
}) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
            </div>
            <div
                className="text-2xl font-bold"
                style={{ color: valueColor ?? "white" }}
            >
                {value}
            </div>
            {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
        </div>
    );
}
