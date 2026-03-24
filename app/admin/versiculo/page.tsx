"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    setDoc,
    deleteDoc,
    doc,
    orderBy,
    query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DAILY_VERSES, getDailyVerse, DailyVerse } from "@/lib/daily-verse";

interface VerseOverride {
    id: string; // YYYY-MM-DD
    text: string;
    reference: string;
}

export default function VersiculoPage() {
    const todayVerse = getDailyVerse();
    const today = new Date().toISOString().slice(0, 10);

    const [overrides, setOverrides] = useState<VerseOverride[]>([]);
    const [loadingOverrides, setLoadingOverrides] = useState(true);

    // Form state
    const [formDate, setFormDate] = useState(today);
    const [formText, setFormText] = useState("");
    const [formRef, setFormRef] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [usingToday, setUsingToday] = useState<string | null>(null);

    useEffect(() => {
        loadOverrides();
    }, []);

    async function loadOverrides() {
        setLoadingOverrides(true);
        try {
            const snap = await getDocs(collection(db, "daily_verse_overrides"));
            const items: VerseOverride[] = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as { text: string; reference: string }),
            }));
            items.sort((a, b) => a.id.localeCompare(b.id));
            setOverrides(items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingOverrides(false);
        }
    }

    async function handleSave() {
        if (!formDate || !formText.trim() || !formRef.trim()) {
            setSaveMsg({ type: "err", text: "Preencha todos os campos." });
            return;
        }
        setSaving(true);
        setSaveMsg(null);
        try {
            await setDoc(doc(db, "daily_verse_overrides", formDate), {
                text: formText.trim(),
                reference: formRef.trim(),
                date: formDate,
            });
            setSaveMsg({ type: "ok", text: "Versículo salvo com sucesso!" });
            setFormText("");
            setFormRef("");
            setFormDate(today);
            await loadOverrides();
        } catch (err) {
            console.error(err);
            setSaveMsg({ type: "err", text: "Erro ao salvar versículo." });
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "daily_verse_overrides", id));
            setOverrides((prev) => prev.filter((o) => o.id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    }

    async function handleUseToday(verse: DailyVerse) {
        setUsingToday(verse.reference);
        try {
            await setDoc(doc(db, "daily_verse_overrides", today), {
                text: verse.text,
                reference: verse.reference,
                date: today,
            });
            await loadOverrides();
        } catch (err) {
            console.error(err);
        } finally {
            setUsingToday(null);
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Versículo do Dia</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Gerencie o versículo exibido diariamente para todos os usuários
                </p>
            </div>

            {/* Today's verse */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Versículo de Hoje ({today})
                </h2>
                <blockquote className="text-white text-lg leading-relaxed italic mb-2">
                    &ldquo;{todayVerse.text}&rdquo;
                </blockquote>
                <cite className="text-gray-400 text-sm not-italic">— {todayVerse.reference}</cite>
                <p className="text-xs text-gray-600 mt-3">
                    Este é o versículo gerado automaticamente. Use &quot;Usar Hoje&quot; abaixo para substituí-lo por um override.
                </p>
            </div>

            {/* Static verses list */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Banco de Versículos ({DAILY_VERSES.length} versículos)
                </h2>
                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {DAILY_VERSES.map((verse, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-colors"
                        >
                            <span className="text-xs text-gray-600 font-mono pt-0.5 w-5 shrink-0">{idx + 1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{verse.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{verse.reference}</p>
                            </div>
                            <button
                                onClick={() => handleUseToday(verse)}
                                disabled={usingToday === verse.reference}
                                className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                            >
                                {usingToday === verse.reference ? "..." : "Usar Hoje"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add special verse form */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Adicionar Versículo Especial
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Data</label>
                        <input
                            type="date"
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm focus:border-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Texto do Versículo</label>
                        <textarea
                            value={formText}
                            onChange={(e) => setFormText(e.target.value)}
                            rows={3}
                            placeholder="Digite o versículo completo..."
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-gray-500 focus:outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Referência</label>
                        <input
                            type="text"
                            value={formRef}
                            onChange={(e) => setFormRef(e.target.value)}
                            placeholder="ex: João 3:16"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-gray-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Salvando..." : "Salvar Override"}
                        </button>
                        {saveMsg && (
                            <span
                                className={`text-sm font-medium ${
                                    saveMsg.type === "ok" ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                {saveMsg.text}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Overrides list */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Overrides Agendados ({overrides.length})
                </h2>
                {loadingOverrides ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                        Carregando...
                    </div>
                ) : overrides.length === 0 ? (
                    <p className="text-gray-600 text-sm">Nenhum override agendado.</p>
                ) : (
                    <div className="space-y-3">
                        {overrides.map((o) => (
                            <div
                                key={o.id}
                                className="flex items-start gap-3 p-4 rounded-lg border border-gray-800 bg-gray-800/40"
                            >
                                <div className="shrink-0">
                                    <span
                                        className={`text-xs font-mono px-2 py-1 rounded font-semibold ${
                                            o.id === today
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-gray-700 text-gray-400"
                                        }`}
                                    >
                                        {o.id}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white leading-relaxed">{o.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{o.reference}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(o.id)}
                                    disabled={deletingId === o.id}
                                    className="shrink-0 text-xs px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                                >
                                    {deletingId === o.id ? "..." : "Excluir"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
