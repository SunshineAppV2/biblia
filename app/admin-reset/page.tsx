"use client";

// PÁGINA TEMPORÁRIA — apagar após uso!
// Acesse /admin-reset no browser para executar o reset.

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc, deleteDoc } from "firebase/firestore";

export default function AdminResetPage() {
    const [log, setLog] = useState<string[]>([]);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);

    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    async function resetAll() {
        setRunning(true);
        setLog([]);
        addLog("Buscando usuários...");

        try {
            const usersSnap = await getDocs(collection(db, "users"));
            addLog(`Encontrados ${usersSnap.size} usuários.`);

            for (const userDoc of usersSnap.docs) {
                const uid = userDoc.id;
                addLog(`Resetando ${uid}...`);

                // 1. Deletar reading_progress
                const progressSnap = await getDocs(
                    collection(db, "users", uid, "reading_progress")
                );
                if (progressSnap.size > 0) {
                    const batch = writeBatch(db);
                    progressSnap.docs.forEach(d => batch.delete(d.ref));
                    await batch.commit();
                    addLog(`  ✓ ${progressSnap.size} registros de leitura deletados`);
                }

                // 2. Resetar perfil
                const batch = writeBatch(db);
                batch.update(doc(db, "users", uid), {
                    xp: 0,
                    weeklyXp: 0,
                    streak: 0,
                    totalChapters: 0,
                    currentLeague: "BRONZE",
                    achievements: [],
                    wisdomPoints: 0,
                    lastActive: null,
                });
                await batch.commit();
                addLog(`  ✓ Perfil zerado`);
            }

            addLog("✅ Concluído! Todos os usuários foram resetados.");
            setDone(true);
        } catch (e) {
            addLog(`❌ Erro: ${String(e)}`);
        } finally {
            setRunning(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-mono">
            <h1 className="text-2xl font-bold mb-2 text-red-400">⚠️ Reset de Usuários</h1>
            <p className="text-gray-400 mb-6 text-sm">
                Zera XP, streak, capítulos, conquistas e histórico de leitura de TODOS os usuários.<br />
                <strong className="text-red-300">Irreversível. Delete esta página após usar.</strong>
            </p>

            {!done && (
                <button
                    onClick={resetAll}
                    disabled={running}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg mb-6 transition-colors"
                >
                    {running ? "Executando..." : "RESETAR TUDO"}
                </button>
            )}

            {log.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto space-y-1">
                    {log.map((line, i) => (
                        <div key={i} className="text-xs text-green-300">{line}</div>
                    ))}
                </div>
            )}

            {done && (
                <p className="mt-6 text-yellow-400 font-bold">
                    Feito! Agora delete o arquivo <code>app/admin-reset/page.tsx</code>.
                </p>
            )}
        </div>
    );
}
