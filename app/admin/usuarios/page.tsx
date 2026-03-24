"use client";

import { useEffect, useState, useCallback } from "react";
import {
    collection,
    getDocs,
    orderBy,
    query,
    doc,
    updateDoc,
    writeBatch,
    deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/firestore";
import { getLevelInfo } from "@/lib/levels";
import { LEAGUE_CONFIGS } from "@/lib/leagues";
import Image from "next/image";

const PAGE_SIZE = 20;

export default function UsuariosPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [confirmReset, setConfirmReset] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "users"), orderBy("weeklyXp", "desc"));
            const snap = await getDocs(q);
            setUsers(snap.docs.map((d) => d.data() as UserProfile));
        } catch (err) {
            console.error("Error loading users:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filtered = users.filter((u) => {
        const term = search.toLowerCase();
        return (
            !term ||
            (u.displayName ?? "").toLowerCase().includes(term) ||
            (u.email ?? "").toLowerCase().includes(term)
        );
    });

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const pageUsers = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    async function handleReset(uid: string) {
        setActionLoading(uid);
        try {
            const userRef = doc(db, "users", uid);

            // Reset user fields
            await updateDoc(userRef, {
                xp: 0,
                weeklyXp: 0,
                streak: 0,
                totalChapters: 0,
                achievements: [],
                wisdomPoints: 0,
                currentLeague: "AGATA",
            });

            // Delete reading_progress subcollection
            const progressSnap = await getDocs(collection(db, "users", uid, "reading_progress"));
            if (!progressSnap.empty) {
                const batch = writeBatch(db);
                progressSnap.docs.forEach((d) => batch.delete(d.ref));
                await batch.commit();
            }

            setUsers((prev) =>
                prev.map((u) =>
                    u.uid === uid
                        ? {
                              ...u,
                              xp: 0,
                              weeklyXp: 0,
                              streak: 0,
                              totalChapters: 0,
                              achievements: [],
                              wisdomPoints: 0,
                              currentLeague: "AGATA",
                          }
                        : u
                )
            );
        } catch (err) {
            console.error("Error resetting user:", err);
            alert("Erro ao resetar usuário.");
        } finally {
            setActionLoading(null);
            setConfirmReset(null);
        }
    }

    async function toggleAdmin(uid: string, currentIsAdmin: boolean) {
        setActionLoading(uid + "_admin");
        try {
            await updateDoc(doc(db, "users", uid), { isAdmin: !currentIsAdmin });
            setUsers((prev) =>
                prev.map((u) => (u.uid === uid ? { ...u, isAdmin: !currentIsAdmin } : u))
            );
        } catch (err) {
            console.error("Error toggling admin:", err);
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Usuários</h1>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {users.length} usuários cadastrados
                    </p>
                </div>
                <div className="sm:ml-auto">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        className="w-full sm:w-72 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white text-sm placeholder-gray-500 focus:border-gray-500 focus:outline-none"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-gray-400 py-12">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                    Carregando usuários...
                </div>
            ) : (
                <>
                    <div className="rounded-xl border border-gray-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 bg-gray-900">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Usuário</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Nível</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">XP</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Streak</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Liga</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageUsers.map((u) => {
                                    const levelInfo = getLevelInfo(u.xp);
                                    const leagueCfg = LEAGUE_CONFIGS[u.currentLeague as keyof typeof LEAGUE_CONFIGS];
                                    const isResetting = actionLoading === u.uid;
                                    const isTogglingAdmin = actionLoading === u.uid + "_admin";

                                    return (
                                        <tr
                                            key={u.uid}
                                            className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                                        >
                                            {/* User */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {u.photoURL ? (
                                                        <Image
                                                            src={u.photoURL}
                                                            alt={u.displayName ?? ""}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-300">
                                                            {(u.displayName ?? u.email ?? "?")[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-white text-sm">
                                                            {u.displayName ?? "—"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Level */}
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="text-white font-semibold">Nv. {levelInfo.currentLevel}</div>
                                                <div className="text-xs text-gray-500">{levelInfo.title}</div>
                                            </td>

                                            {/* XP */}
                                            <td className="px-4 py-3 text-right text-gray-300 font-mono text-sm">
                                                {u.xp.toLocaleString("pt-BR")}
                                            </td>

                                            {/* Streak */}
                                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                                                <span className="text-orange-400">{u.streak}🔥</span>
                                            </td>

                                            {/* League */}
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span
                                                    className="text-xs font-semibold px-2 py-1 rounded-full"
                                                    style={{
                                                        backgroundColor: (leagueCfg?.color ?? "#888") + "22",
                                                        color: leagueCfg?.color ?? "#888",
                                                    }}
                                                >
                                                    {leagueCfg?.label ?? u.currentLeague}
                                                </span>
                                            </td>

                                            {/* Admin toggle */}
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => toggleAdmin(u.uid, !!u.isAdmin)}
                                                    disabled={!!isTogglingAdmin}
                                                    title={u.isAdmin ? "Remover admin" : "Tornar admin"}
                                                    className={`text-xs px-2 py-1 rounded-full font-semibold transition-colors ${
                                                        u.isAdmin
                                                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                            : "bg-gray-700 text-gray-500 hover:bg-gray-600"
                                                    } disabled:opacity-50`}
                                                >
                                                    {isTogglingAdmin ? "..." : u.isAdmin ? "Admin" : "User"}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-right">
                                                {confirmReset === u.uid ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-xs text-gray-400">Confirmar?</span>
                                                        <button
                                                            onClick={() => handleReset(u.uid)}
                                                            disabled={isResetting}
                                                            className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            {isResetting ? "..." : "Sim"}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmReset(null)}
                                                            className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                        >
                                                            Não
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmReset(u.uid)}
                                                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        Resetar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {pageUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                                            Nenhum usuário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pageCount > 1 && (
                        <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                            <span>
                                Página {page + 1} de {pageCount} ({filtered.length} usuários)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Anterior
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                                    disabled={page >= pageCount - 1}
                                    className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Próxima →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
