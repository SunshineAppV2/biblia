"use client";

import { useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/firestore";
import { getLevelInfo } from "@/lib/levels";
import { getQuizBankStats } from "@/lib/quiz-data";

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
    const csv = [headers, ...rows]
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadJSON(filename: string, data: unknown) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function formatDate(ts: { toDate?: () => Date } | null | undefined): string {
    if (!ts || typeof ts.toDate !== "function") return "—";
    return ts.toDate().toLocaleDateString("pt-BR");
}

export default function ExportarPage() {
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingRanking, setLoadingRanking] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    async function handleExportUsers() {
        setLoadingUsers(true);
        setMsg(null);
        try {
            const snap = await getDocs(collection(db, "users"));
            const users = snap.docs.map((d) => d.data() as UserProfile);

            const headers = ["Nome", "Email", "XP", "Nível", "Streak", "Capítulos", "Liga", "Conquistas", "Admin", "Membro Desde"];
            const rows = users.map((u) => {
                const levelInfo = getLevelInfo(u.xp ?? 0);
                return [
                    u.displayName ?? "",
                    u.email ?? "",
                    String(u.xp ?? 0),
                    String(levelInfo.currentLevel),
                    String(u.streak ?? 0),
                    String(u.totalChapters ?? 0),
                    u.currentLeague ?? "",
                    String((u.achievements ?? []).length),
                    u.isAdmin ? "Sim" : "Não",
                    formatDate(u.lastActive as { toDate?: () => Date } | null),
                ];
            });

            const today = new Date().toISOString().slice(0, 10);
            downloadCSV(`usuarios_${today}.csv`, rows, headers);
            setMsg({ type: "ok", text: `${users.length} usuários exportados.` });
        } catch (err) {
            console.error(err);
            setMsg({ type: "err", text: "Erro ao exportar usuários." });
        } finally {
            setLoadingUsers(false);
        }
    }

    async function handleExportRanking() {
        setLoadingRanking(true);
        setMsg(null);
        try {
            const q = query(collection(db, "users"), orderBy("weeklyXp", "desc"));
            const snap = await getDocs(q);
            const users = snap.docs.map((d) => d.data() as UserProfile);

            const headers = ["Posição", "Nome", "Email", "XP Semanal", "Liga"];
            const rows = users.map((u, idx) => [
                String(idx + 1),
                u.displayName ?? "",
                u.email ?? "",
                String(u.weeklyXp ?? 0),
                u.currentLeague ?? "",
            ]);

            const today = new Date().toISOString().slice(0, 10);
            downloadCSV(`ranking_semanal_${today}.csv`, rows, headers);
            setMsg({ type: "ok", text: `${users.length} entradas exportadas.` });
        } catch (err) {
            console.error(err);
            setMsg({ type: "err", text: "Erro ao exportar ranking." });
        } finally {
            setLoadingRanking(false);
        }
    }

    async function handleExportQuiz() {
        setLoadingQuiz(true);
        setMsg(null);
        try {
            // Static stats
            const staticStats = getQuizBankStats();

            // Firestore questions
            const snap = await getDocs(collection(db, "quiz_questions"));
            const firestoreQuestions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

            const exportData = {
                exportedAt: new Date().toISOString(),
                static: {
                    totalQuestions: staticStats.totalQuestions,
                    chaptersCovered: staticStats.chaptersCovered,
                },
                firestore: {
                    totalDocs: firestoreQuestions.length,
                    questions: firestoreQuestions,
                },
            };

            const today = new Date().toISOString().slice(0, 10);
            downloadJSON(`quiz_bank_${today}.json`, exportData);
            setMsg({
                type: "ok",
                text: `Exportado: ${staticStats.totalQuestions} perguntas estáticas + ${firestoreQuestions.length} docs no Firestore.`,
            });
        } catch (err) {
            console.error(err);
            setMsg({ type: "err", text: "Erro ao exportar banco de quiz." });
        } finally {
            setLoadingQuiz(false);
        }
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Exportar Dados</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Exporte dados do aplicativo em formatos CSV e JSON
                </p>
            </div>

            {msg && (
                <div
                    className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${
                        msg.type === "ok"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                >
                    {msg.text}
                </div>
            )}

            <div className="space-y-4">
                {/* Export Users */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-white font-semibold mb-1">Exportar Usuários</h2>
                            <p className="text-gray-400 text-sm">
                                CSV com: Nome, Email, XP, Nível, Streak, Capítulos, Liga, Conquistas, Admin, Membro Desde
                            </p>
                        </div>
                        <button
                            onClick={handleExportUsers}
                            disabled={loadingUsers}
                            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            {loadingUsers ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                                    Exportando...
                                </>
                            ) : (
                                <>📥 CSV</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Export Ranking */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-white font-semibold mb-1">Exportar Ranking Semanal</h2>
                            <p className="text-gray-400 text-sm">
                                CSV com: Posição, Nome, Email, XP Semanal, Liga (ordenado por XP semanal)
                            </p>
                        </div>
                        <button
                            onClick={handleExportRanking}
                            disabled={loadingRanking}
                            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            {loadingRanking ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                                    Exportando...
                                </>
                            ) : (
                                <>📥 CSV</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Export Quiz */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-white font-semibold mb-1">Exportar Banco de Quiz</h2>
                            <p className="text-gray-400 text-sm">
                                JSON com estatísticas das perguntas estáticas e todos os documentos de quiz do Firestore
                            </p>
                        </div>
                        <button
                            onClick={handleExportQuiz}
                            disabled={loadingQuiz}
                            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            {loadingQuiz ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                                    Exportando...
                                </>
                            ) : (
                                <>📥 JSON</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs text-gray-600">
                Os arquivos são gerados no seu navegador e baixados diretamente. Nenhum dado é enviado para servidores externos.
            </div>
        </div>
    );
}
