"use client";

import { useEffect, useState, useCallback } from "react";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BankQuestion, getQuizBank, ensureBanksLoaded } from "@/lib/quiz-data";
import { motion, AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";

// ─── Books data ───────────────────────────────────────────────────────────────

const BOOKS = [
    { id: "genesis", label: "Gênesis", chapters: 50 },
    { id: "exodo", label: "Êxodo", chapters: 40 },
    { id: "levitico", label: "Levítico", chapters: 27 },
    { id: "numeros", label: "Números", chapters: 36 },
    { id: "deuteronomio", label: "Deuteronômio", chapters: 34 },
    { id: "josue", label: "Josué", chapters: 24 },
    { id: "juizes", label: "Juízes", chapters: 21 },
    { id: "rute", label: "Rute", chapters: 4 },
    { id: "1samuel", label: "1 Samuel", chapters: 31 },
    { id: "2samuel", label: "2 Samuel", chapters: 24 },
    { id: "1reis", label: "1 Reis", chapters: 22 },
    { id: "2reis", label: "2 Reis", chapters: 25 },
    { id: "1cronicas", label: "1 Crônicas", chapters: 29 },
    { id: "2cronicas", label: "2 Crônicas", chapters: 36 },
    { id: "esdras", label: "Esdras", chapters: 10 },
    { id: "neemias", label: "Neemias", chapters: 13 },
    { id: "ester", label: "Ester", chapters: 10 },
    { id: "jo", label: "Jó", chapters: 42 },
    { id: "salmos", label: "Salmos", chapters: 150 },
    { id: "proverbios", label: "Provérbios", chapters: 31 },
    { id: "eclesiastes", label: "Eclesiastes", chapters: 12 },
    { id: "cantares", label: "Cantares", chapters: 8 },
    { id: "isaias", label: "Isaías", chapters: 66 },
    { id: "jeremias", label: "Jeremias", chapters: 52 },
    { id: "lamentacoes", label: "Lamentações", chapters: 5 },
    { id: "ezequiel", label: "Ezequiel", chapters: 48 },
    { id: "daniel", label: "Daniel", chapters: 12 },
    { id: "oseias", label: "Oséias", chapters: 14 },
    { id: "joel", label: "Joel", chapters: 3 },
    { id: "amos", label: "Amós", chapters: 9 },
    { id: "abadias", label: "Obadias", chapters: 1 },
    { id: "jonas", label: "Jonas", chapters: 4 },
    { id: "miqueias", label: "Miquéias", chapters: 7 },
    { id: "naum", label: "Naum", chapters: 3 },
    { id: "habacuque", label: "Habacuque", chapters: 3 },
    { id: "sofonias", label: "Sofonias", chapters: 3 },
    { id: "ageu", label: "Ageu", chapters: 2 },
    { id: "zacarias", label: "Zacarias", chapters: 14 },
    { id: "malaquias", label: "Malaquias", chapters: 4 },
    { id: "mateus", label: "Mateus", chapters: 28 },
    { id: "marcos", label: "Marcos", chapters: 16 },
    { id: "lucas", label: "Lucas", chapters: 24 },
    { id: "joao", label: "João", chapters: 21 },
    { id: "atos", label: "Atos", chapters: 28 },
    { id: "romanos", label: "Romanos", chapters: 16 },
    { id: "1corintios", label: "1 Coríntios", chapters: 16 },
    { id: "2corintios", label: "2 Coríntios", chapters: 13 },
    { id: "galatas", label: "Gálatas", chapters: 6 },
    { id: "efesios", label: "Efésios", chapters: 6 },
    { id: "filipenses", label: "Filipenses", chapters: 4 },
    { id: "colossenses", label: "Colossenses", chapters: 4 },
    { id: "1tessalonicenses", label: "1 Tessalonicenses", chapters: 5 },
    { id: "2tessalonicenses", label: "2 Tessalonicenses", chapters: 3 },
    { id: "1timoteo", label: "1 Timóteo", chapters: 6 },
    { id: "2timoteo", label: "2 Timóteo", chapters: 4 },
    { id: "tito", label: "Tito", chapters: 3 },
    { id: "filemom", label: "Filemon", chapters: 1 },
    { id: "hebreus", label: "Hebreus", chapters: 13 },
    { id: "tiago", label: "Tiago", chapters: 5 },
    { id: "1pedro", label: "1 Pedro", chapters: 5 },
    { id: "2pedro", label: "2 Pedro", chapters: 3 },
    { id: "1joao", label: "1 João", chapters: 5 },
    { id: "2joao", label: "2 João", chapters: 1 },
    { id: "3joao", label: "3 João", chapters: 1 },
    { id: "judas", label: "Judas", chapters: 1 },
    { id: "apocalipse", label: "Apocalipse", chapters: 22 },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaggedQuestion extends BankQuestion {
    source: "static" | "firestore";
    index: number; // index in firestore array (only for firestore questions)
}

interface FormState {
    question: string;
    answer: string;
    distractor0: string;
    distractor1: string;
    reference: string;
}

const EMPTY_FORM: FormState = { question: "", answer: "", distractor0: "", distractor1: "", reference: "" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function docId(bookId: string, chapter: number) {
    return `${bookId}_${chapter}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuizAdminPage() {
    const [expandedBook, setExpandedBook] = useState<string | null>("genesis");
    const [selectedChapter, setSelectedChapter] = useState<{ bookId: string; chapter: number } | null>(null);
    const [showTestModal, setShowTestModal] = useState(false);
    const [ready, setReady] = useState(false);

    // Questions for the selected chapter
    const [staticQs, setStaticQs] = useState<BankQuestion[]>([]);
    const [firestoreQs, setFirestoreQs] = useState<BankQuestion[]>([]);
    const [loadingChapter, setLoadingChapter] = useState(false);

    // Chapters that have Firestore questions (per book, cached)
    const [firestoreChapters, setFirestoreChapters] = useState<Record<string, Set<number>>>({});

    // Inline form
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // index in firestoreQs
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [formLoading, setFormLoading] = useState(false);

    // Initial load
    useEffect(() => {
        ensureBanksLoaded().then(() => setReady(true));
    }, []);

    // Load chapter questions
    const loadChapter = useCallback(async (bookId: string, chapter: number) => {
        setLoadingChapter(true);
        setShowAddForm(false);
        setEditingIndex(null);
        setForm(EMPTY_FORM);

        await ensureBanksLoaded();
        const statics = getQuizBank(bookId, chapter) ?? [];
        setStaticQs(statics);

        try {
            const ref = doc(db, "quiz_questions", docId(bookId, chapter));
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setFirestoreQs(snap.data().questions ?? []);
            } else {
                setFirestoreQs([]);
            }
        } catch (err) {
            console.error(err);
            setFirestoreQs([]);
        } finally {
            setLoadingChapter(false);
        }
    }, []);

    useEffect(() => {
        if (selectedChapter) {
            loadChapter(selectedChapter.bookId, selectedChapter.chapter);
        }
    }, [selectedChapter, loadChapter]);

    // Check which chapters of a book have static OR firestore questions
    function chapterHasStaticQuestions(bookId: string, chapter: number): boolean {
        return (getQuizBank(bookId, chapter) ?? []).length > 0;
    }

    function chapterHasFirestoreQuestions(bookId: string, chapter: number): boolean {
        return firestoreChapters[bookId]?.has(chapter) ?? false;
    }

    // When a chapter is selected and loaded, mark it in firestoreChapters
    useEffect(() => {
        if (!selectedChapter) return;
        if (firestoreQs.length > 0) {
            setFirestoreChapters((prev) => {
                const s = new Set(prev[selectedChapter.bookId] ?? []);
                s.add(selectedChapter.chapter);
                return { ...prev, [selectedChapter.bookId]: s };
            });
        }
    }, [firestoreQs, selectedChapter]);

    // ── Save new question ──────────────────────────────────────────────────────
    async function handleSaveNew() {
        if (!selectedChapter) return;
        if (!form.question.trim() || !form.answer.trim() || !form.distractor0.trim() || !form.distractor1.trim()) {
            alert("Preencha todos os campos.");
            return;
        }
        setFormLoading(true);
        const newQ: BankQuestion = {
            question: form.question.trim(),
            answer: form.answer.trim(),
            distractors: [form.distractor0.trim(), form.distractor1.trim()],
            reference: form.reference.trim(),
        };
        const ref = doc(db, "quiz_questions", docId(selectedChapter.bookId, selectedChapter.chapter));
        const snap = await getDoc(ref);
        try {
            if (snap.exists()) {
                await updateDoc(ref, { questions: arrayUnion(newQ) });
            } else {
                await setDoc(ref, { questions: [newQ] });
            }
            setFirestoreQs((prev) => [...prev, newQ]);
            setShowAddForm(false);
            setForm(EMPTY_FORM);
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar pergunta.");
        } finally {
            setFormLoading(false);
        }
    }

    // ── Save edited question ───────────────────────────────────────────────────
    async function handleSaveEdit() {
        if (!selectedChapter || editingIndex === null) return;
        if (!form.question.trim() || !form.answer.trim() || !form.distractor0.trim() || !form.distractor1.trim()) {
            alert("Preencha todos os campos.");
            return;
        }
        setFormLoading(true);
        try {
            const oldQ = firestoreQs[editingIndex];
            const newQ: BankQuestion = {
                question: form.question.trim(),
                answer: form.answer.trim(),
                distractors: [form.distractor0.trim(), form.distractor1.trim()],
                reference: form.reference.trim(),
            };
            const ref = doc(db, "quiz_questions", docId(selectedChapter.bookId, selectedChapter.chapter));
            // Replace: remove old, add new
            await updateDoc(ref, { questions: arrayRemove(oldQ) });
            await updateDoc(ref, { questions: arrayUnion(newQ) });
            setFirestoreQs((prev) => prev.map((q, i) => (i === editingIndex ? newQ : q)));
            setEditingIndex(null);
            setForm(EMPTY_FORM);
        } catch (err) {
            console.error(err);
            alert("Erro ao editar pergunta.");
        } finally {
            setFormLoading(false);
        }
    }

    // ── Delete Firestore question ──────────────────────────────────────────────
    async function handleDelete(index: number) {
        if (!selectedChapter) return;
        if (!confirm("Excluir esta pergunta?")) return;
        try {
            const q = firestoreQs[index];
            const ref = doc(db, "quiz_questions", docId(selectedChapter.bookId, selectedChapter.chapter));
            await updateDoc(ref, { questions: arrayRemove(q) });
            setFirestoreQs((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir pergunta.");
        }
    }

    function startEdit(index: number) {
        const q = firestoreQs[index];
        setEditingIndex(index);
        setShowAddForm(false);
        setForm({
            question: q.question,
            answer: q.answer,
            distractor0: q.distractors[0],
            distractor1: q.distractors[1],
            reference: q.reference || "",
        });
    }

    function cancelForm() {
        setShowAddForm(false);
        setEditingIndex(null);
        setForm(EMPTY_FORM);
    }

    const allTagged: TaggedQuestion[] = [
        ...staticQs.map((q, i) => ({ ...q, source: "static" as const, index: i })),
        ...firestoreQs.map((q, i) => ({ ...q, source: "firestore" as const, index: i })),
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            {/* ── Left panel: books + chapters ──────────────────────────────── */}
            <aside className="w-56 bg-gray-900 border-r border-gray-800 overflow-y-auto shrink-0">
                <div className="px-4 py-4 border-b border-gray-800">
                    <h2 className="text-sm font-semibold text-white">Livros</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Selecione um capítulo</p>
                </div>

                <div className="py-2">
                    {BOOKS.map((book) => {
                        const isExpanded = expandedBook === book.id;
                        return (
                            <div key={book.id}>
                                <button
                                    onClick={() =>
                                        setExpandedBook(isExpanded ? null : book.id)
                                    }
                                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <span>{book.label}</span>
                                    <span className="text-gray-600 text-xs ml-2">
                                        {isExpanded ? "▲" : "▼"}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.18 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-4 pr-2 pb-1 grid grid-cols-5 gap-1">
                                                {Array.from({ length: book.chapters }, (_, i) => {
                                                    const ch = i + 1;
                                                    const hasStatic = chapterHasStaticQuestions(book.id, ch);
                                                    const hasFirestore = chapterHasFirestoreQuestions(book.id, ch);
                                                    const hasAny = hasStatic || hasFirestore;
                                                    const isSelected =
                                                        selectedChapter?.bookId === book.id &&
                                                        selectedChapter?.chapter === ch;
                                                    return (
                                                        <button
                                                            key={ch}
                                                            onClick={() => {
                                                                setSelectedChapter({ bookId: book.id, chapter: ch });
                                                            }}
                                                            className={`relative text-xs rounded px-1 py-1 font-medium transition-colors ${
                                                                isSelected
                                                                    ? "bg-white text-gray-900"
                                                                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                                                            }`}
                                                        >
                                                            {ch}
                                                            {hasAny && (
                                                                <span
                                                                    className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-green-400"
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* ── Right panel: questions ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-6">
                {!selectedChapter ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="text-5xl mb-4">📖</div>
                        <p className="text-lg">Selecione um livro e capítulo</p>
                        <p className="text-sm mt-1">para ver e gerenciar as perguntas</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {BOOKS.find((b) => b.id === selectedChapter.bookId)?.label} — Cap.{" "}
                                    {selectedChapter.chapter}
                                </h2>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    {staticQs.length} estáticas · {firestoreQs.length} editáveis
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowTestModal(true)}
                                    className="px-4 py-2 rounded-lg bg-accent/20 text-accent text-sm font-semibold hover:bg-accent/30 transition-colors border border-accent/30"
                                >
                                    🎯 Testar Capítulo
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddForm(true);
                                        setEditingIndex(null);
                                        setForm(EMPTY_FORM);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    + Adicionar Pergunta
                                </button>
                            </div>
                        </div>

                        {loadingChapter ? (
                            <div className="flex items-center gap-3 text-gray-400 py-8">
                                <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                                Carregando perguntas...
                            </div>
                        ) : (
                            <>
                                {/* Add form */}
                                <AnimatePresence>
                                    {showAddForm && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-6"
                                        >
                                            <QuestionForm
                                                form={form}
                                                setForm={setForm}
                                                onSave={handleSaveNew}
                                                onCancel={cancelForm}
                                                loading={formLoading}
                                                title="Nova Pergunta"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Questions list */}
                                {allTagged.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-3xl mb-2">🤔</div>
                                        <p>Nenhuma pergunta neste capítulo ainda.</p>
                                        <p className="text-sm mt-1">Clique em &quot;Adicionar Pergunta&quot; para começar.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {allTagged.map((q, idx) => (
                                            <div key={idx}>
                                                {editingIndex === q.index && q.source === "firestore" ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                    >
                                                        <QuestionForm
                                                            form={form}
                                                            setForm={setForm}
                                                            onSave={handleSaveEdit}
                                                            onCancel={cancelForm}
                                                            loading={formLoading}
                                                            title="Editar Pergunta"
                                                        />
                                                    </motion.div>
                                                ) : (
                                                    <QuestionCard
                                                        q={q}
                                                        onEdit={q.source === "firestore" ? () => startEdit(q.index) : undefined}
                                                        onDelete={q.source === "firestore" ? () => handleDelete(q.index) : undefined}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Test Modal Overlay */}
            {showTestModal && selectedChapter && (
                <QuizModal
                    isOpen={showTestModal}
                    bookId={selectedChapter.bookId}
                    bookName={BOOKS.find(b => b.id === selectedChapter.bookId)?.label || ""}
                    chapter={selectedChapter.chapter}
                    isTest={true}
                    customQuestions={allTagged}
                    onComplete={() => setShowTestModal(false)}
                />
            )}
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QuestionCard({
    q,
    onEdit,
    onDelete,
}: {
    q: TaggedQuestion;
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        {q.source === "static" ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 font-medium">
                                estático
                            </span>
                        ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                                editável
                            </span>
                        )}
                    </div>
                    <p className="text-white font-medium mb-2">{q.question}</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 font-medium border border-green-500/20">
                            ✓ {q.answer}
                        </span>
                        {q.distractors.map((d, i) => (
                            <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded-full bg-gray-700/60 text-gray-400"
                            >
                                {d}
                            </span>
                        ))}
                        {q.reference && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/15 text-secondary-foreground font-medium border border-secondary/20 uppercase">
                                📖 {q.reference}
                            </span>
                        )}
                    </div>
                </div>

                {q.source === "static" ? (
                    <div className="shrink-0 group relative">
                        <span className="text-xs text-gray-600 cursor-help border-b border-dashed border-gray-700">
                            estático
                        </span>
                        <div className="absolute right-0 top-5 z-10 hidden group-hover:block w-56 rounded-lg border border-gray-700 bg-gray-800 p-3 text-xs text-gray-400 shadow-xl">
                            Para editar, altere o arquivo{" "}
                            <code className="text-gray-200">lib/quiz-data.ts</code>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 shrink-0">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                                Editar
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                Excluir
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function QuestionForm({
    form,
    setForm,
    onSave,
    onCancel,
    loading,
    title,
}: {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    onSave: () => void;
    onCancel: () => void;
    loading: boolean;
    title: string;
}) {
    return (
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-blue-400">{title}</h3>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Pergunta</label>
                <textarea
                    rows={3}
                    value={form.question}
                    onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                    placeholder="Digite a pergunta..."
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Resposta correta</label>
                <input
                    type="text"
                    value={form.answer}
                    onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                    placeholder="Resposta correta..."
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Distrator 1</label>
                    <input
                        type="text"
                        value={form.distractor0}
                        onChange={(e) => setForm((f) => ({ ...f, distractor0: e.target.value }))}
                        placeholder="Opção errada 1..."
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Distrator 2</label>
                    <input
                        type="text"
                        value={form.distractor1}
                        onChange={(e) => setForm((f) => ({ ...f, distractor1: e.target.value }))}
                        placeholder="Opção errada 2..."
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Referência (Ex: Gênesis 1:1)</label>
                <input
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                    placeholder="Referência bíblica..."
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
            </div>

            <div className="flex gap-3 pt-1">
                <button
                    onClick={onSave}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
                <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
