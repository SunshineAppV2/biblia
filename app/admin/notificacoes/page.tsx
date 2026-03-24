"use client";

import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    orderBy,
    query,
    limit,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

interface PushNotification {
    id: string;
    title: string;
    body: string;
    sentAt: Timestamp | null;
    sentBy: string;
}

function formatRelativeTime(ts: Timestamp | null): string {
    if (!ts) return "—";
    const now = Date.now();
    const diff = now - ts.toMillis();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "agora mesmo";
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days} dias`;
}

export default function NotificacoesPage() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [sendMsg, setSendMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const [history, setHistory] = useState<PushNotification[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        setLoadingHistory(true);
        try {
            const q = query(
                collection(db, "push_notifications"),
                orderBy("sentAt", "desc"),
                limit(20)
            );
            const snap = await getDocs(q);
            setHistory(
                snap.docs.map((d) => ({
                    id: d.id,
                    ...(d.data() as Omit<PushNotification, "id">),
                }))
            );
        } catch (err) {
            console.error("Error loading notifications:", err);
        } finally {
            setLoadingHistory(false);
        }
    }

    async function handleSend() {
        if (!title.trim() || !body.trim()) {
            setSendMsg({ type: "err", text: "Preencha título e mensagem." });
            return;
        }
        setSending(true);
        setSendMsg(null);
        try {
            await addDoc(collection(db, "push_notifications"), {
                title: title.trim(),
                body: body.trim(),
                sentAt: serverTimestamp(),
                sentBy: auth.currentUser?.email ?? "admin",
            });
            setSendMsg({ type: "ok", text: "Notificação agendada com sucesso!" });
            setTitle("");
            setBody("");
            await loadHistory();
        } catch (err) {
            console.error("Error sending notification:", err);
            setSendMsg({ type: "err", text: "Erro ao enviar notificação." });
        } finally {
            setSending(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "push_notifications", id));
            setHistory((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            console.error("Error deleting notification:", err);
        } finally {
            setDeletingId(null);
        }
    }

    const titleLen = title.length;
    const bodyLen = body.length;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Notificações</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Envie notificações push para todos os usuários do BibleQuest
                </p>
            </div>

            {/* Info banner */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 mb-6 text-blue-300 text-sm">
                <strong>Como funciona:</strong> A notificação é salva no Firestore e entregue na próxima visita
                de cada usuário que habilitou notificações push no navegador.
            </div>

            {/* Send form */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Nova Notificação
                </h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs text-gray-400">Título</label>
                            <span className={`text-xs ${titleLen > 60 ? "text-red-400" : "text-gray-600"}`}>
                                {titleLen}/60
                            </span>
                        </div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.slice(0, 60))}
                            placeholder="Ex: Novo versículo disponível!"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs text-gray-400">Mensagem</label>
                            <span className={`text-xs ${bodyLen > 200 ? "text-red-400" : "text-gray-600"}`}>
                                {bodyLen}/200
                            </span>
                        </div>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value.slice(0, 200))}
                            rows={3}
                            placeholder="Escreva sua mensagem aqui..."
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-gray-500 focus:outline-none resize-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSend}
                            disabled={sending || titleLen > 60 || bodyLen > 200}
                            className="px-5 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            {sending ? "Enviando..." : "📣 Enviar para Todos"}
                        </button>
                        {sendMsg && (
                            <span
                                className={`text-sm font-medium ${
                                    sendMsg.type === "ok" ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                {sendMsg.text}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Histórico (últimas 20)
                </h2>
                {loadingHistory ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                        Carregando...
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-gray-600 text-sm">Nenhuma notificação enviada ainda.</p>
                ) : (
                    <div className="space-y-3">
                        {history.map((n) => (
                            <div
                                key={n.id}
                                className="flex items-start gap-3 p-4 rounded-lg border border-gray-800 bg-gray-800/40"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-white text-sm">{n.title}</div>
                                    <div className="text-gray-400 text-sm mt-0.5 leading-relaxed">{n.body}</div>
                                    <div className="text-xs text-gray-600 mt-1.5 flex items-center gap-2">
                                        <span>{formatRelativeTime(n.sentAt)}</span>
                                        <span>·</span>
                                        <span>por {n.sentBy}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(n.id)}
                                    disabled={deletingId === n.id}
                                    className="shrink-0 text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                                >
                                    {deletingId === n.id ? "..." : "Excluir"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
