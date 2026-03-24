"use client";

import { useEffect, useState } from "react";
import {
    collectionGroup,
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/firestore";

interface ReadingLog {
    id: string;
    userId: string;
    bookId: string;
    bookName?: string;
    chapter: number;
    completedAt: Timestamp | null;
    xpEarned?: number;
}

function formatRelativeTime(ts: Timestamp | null): string {
    if (!ts) return "—";
    const now = Date.now();
    const diff = now - ts.toMillis();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `há ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days} dias`;
}

export default function LogsPage() {
    const [activeTab, setActiveTab] = useState<"leituras" | "usuarios">("leituras");

    const [logs, setLogs] = useState<ReadingLog[]>([]);
    const [logsError, setLogsError] = useState<string | null>(null);
    const [logsLoading, setLogsLoading] = useState(true);

    const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);

    // Real-time reading logs via collectionGroup
    useEffect(() => {
        setLogsLoading(true);
        try {
            const q = query(
                collectionGroup(db, "reading_progress"),
                orderBy("completedAt", "desc"),
                limit(50)
            );

            const unsubscribe = onSnapshot(
                q,
                (snap) => {
                    const items: ReadingLog[] = snap.docs.map((d) => {
                        const data = d.data();
                        // parent doc is users/{uid}, grandparent path: users/{uid}/reading_progress/{docId}
                        const pathParts = d.ref.path.split("/");
                        const userId = pathParts[1] ?? "unknown";
                        return {
                            id: d.id,
                            userId,
                            bookId: data.bookId ?? d.id.split("_")[0] ?? "—",
                            bookName: data.bookName ?? undefined,
                            chapter: data.chapter ?? Number(d.id.split("_")[1]) ?? 0,
                            completedAt: data.completedAt ?? null,
                            xpEarned: data.xpEarned ?? undefined,
                        };
                    });
                    setLogs(items);
                    setLogsLoading(false);
                    setLogsError(null);
                },
                (err) => {
                    console.error("collectionGroup snapshot error:", err);
                    if (err.message?.includes("index") || err.message?.includes("requires")) {
                        setLogsError(
                            "Para habilitar logs em tempo real, crie um índice no Firestore Console para reading_progress/completedAt."
                        );
                    } else {
                        setLogsError("Erro ao carregar logs: " + err.message);
                    }
                    setLogsLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            console.error(err);
            setLogsError("Erro ao configurar listener de logs.");
            setLogsLoading(false);
        }
    }, []);

    // Recent users
    useEffect(() => {
        async function loadUsers() {
            setUsersLoading(true);
            try {
                const q = query(
                    collection(db, "users"),
                    orderBy("lastActive", "desc"),
                    limit(20)
                );
                const snap = await getDocs(q);
                setRecentUsers(snap.docs.map((d) => d.data() as UserProfile));
            } catch (err) {
                console.error("Error loading recent users:", err);
            } finally {
                setUsersLoading(false);
            }
        }
        loadUsers();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Logs de Atividade</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Feed em tempo real das leituras e atividade recente dos usuários
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab("leituras")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "leituras"
                            ? "bg-white text-gray-900"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    Leituras Recentes
                </button>
                <button
                    onClick={() => setActiveTab("usuarios")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === "usuarios"
                            ? "bg-white text-gray-900"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    Usuários Recentes
                </button>
            </div>

            {activeTab === "leituras" && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-sm text-gray-400">Ao vivo — últimas 50 leituras</span>
                    </div>

                    {logsError ? (
                        <div className="p-5">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-yellow-400 text-sm">
                                <strong>Atenção:</strong> {logsError}
                            </div>
                        </div>
                    ) : logsLoading ? (
                        <div className="flex items-center gap-3 text-gray-400 p-6">
                            <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                            Aguardando dados...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-6 text-gray-600 text-sm">Nenhuma leitura registrada ainda.</div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {logs.map((log) => (
                                <div key={log.id} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-800/40 transition-colors">
                                    <div className="font-mono text-xs text-gray-600 shrink-0 w-20">
                                        {log.userId.slice(0, 8)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-white text-sm font-medium">
                                            {log.bookName ?? log.bookId}
                                        </span>
                                        {log.chapter > 0 && (
                                            <span className="text-gray-400 text-sm"> {log.chapter}</span>
                                        )}
                                    </div>
                                    {log.xpEarned !== undefined && (
                                        <span className="text-green-400 text-xs font-semibold shrink-0">
                                            +{log.xpEarned} XP
                                        </span>
                                    )}
                                    <span className="text-gray-600 text-xs shrink-0 w-24 text-right">
                                        {formatRelativeTime(log.completedAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "usuarios" && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-800">
                        <span className="text-sm text-gray-400">Últimos 20 usuários por atividade recente</span>
                    </div>

                    {usersLoading ? (
                        <div className="flex items-center gap-3 text-gray-400 p-6">
                            <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                            Carregando...
                        </div>
                    ) : recentUsers.length === 0 ? (
                        <div className="p-6 text-gray-600 text-sm">Nenhum usuário encontrado.</div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {recentUsers.map((u) => (
                                <div key={u.uid} className="px-5 py-3 flex items-center gap-4 hover:bg-gray-800/40 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300 shrink-0">
                                        {(u.displayName ?? u.email ?? "?")[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm font-medium truncate">
                                            {u.displayName ?? "—"}
                                        </div>
                                        <div className="text-gray-500 text-xs truncate">{u.email}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xs text-gray-400">{u.xp.toLocaleString("pt-BR")} XP</div>
                                        <div className="text-xs text-gray-600">
                                            {formatRelativeTime(u.lastActive as Timestamp | null)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
