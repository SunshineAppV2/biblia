"use client";

import { useEffect, useState } from "react";
import { getQuizBankKeysAsync, getQuizBankStatsAsync } from "@/lib/quiz-data";

// ---------------------------------------------------------------------------
// Bible book definitions
// ---------------------------------------------------------------------------

interface BookDef {
    id: string;
    name: string;
    chapters: number;
}

const OT_BOOKS: BookDef[] = [
    { id: "genesis", name: "Gênesis", chapters: 50 },
    { id: "exodo", name: "Êxodo", chapters: 40 },
    { id: "levitico", name: "Levítico", chapters: 27 },
    { id: "numeros", name: "Números", chapters: 36 },
    { id: "deuteronomio", name: "Deuteronômio", chapters: 34 },
    { id: "josue", name: "Josué", chapters: 24 },
    { id: "juizes", name: "Juízes", chapters: 21 },
    { id: "rute", name: "Rute", chapters: 4 },
    { id: "1samuel", name: "1 Samuel", chapters: 31 },
    { id: "2samuel", name: "2 Samuel", chapters: 24 },
    { id: "1reis", name: "1 Reis", chapters: 22 },
    { id: "2reis", name: "2 Reis", chapters: 25 },
    { id: "1cronicas", name: "1 Crônicas", chapters: 29 },
    { id: "2cronicas", name: "2 Crônicas", chapters: 36 },
    { id: "esdras", name: "Esdras", chapters: 10 },
    { id: "neemias", name: "Neemias", chapters: 13 },
    { id: "ester", name: "Ester", chapters: 10 },
    { id: "jo", name: "Jó", chapters: 42 },
    { id: "salmos", name: "Salmos", chapters: 150 },
    { id: "proverbios", name: "Provérbios", chapters: 31 },
    { id: "eclesiastes", name: "Eclesiastes", chapters: 12 },
    { id: "cantares", name: "Cantares", chapters: 8 },
    { id: "isaias", name: "Isaías", chapters: 66 },
    { id: "jeremias", name: "Jeremias", chapters: 52 },
    { id: "lamentacoes", name: "Lamentações", chapters: 5 },
    { id: "ezequiel", name: "Ezequiel", chapters: 48 },
    { id: "daniel", name: "Daniel", chapters: 12 },
    { id: "oseias", name: "Oséias", chapters: 14 },
    { id: "joel", name: "Joel", chapters: 3 },
    { id: "amos", name: "Amós", chapters: 9 },
    { id: "abadias", name: "Abdias", chapters: 1 },
    { id: "jonas", name: "Jonas", chapters: 4 },
    { id: "miqueias", name: "Miquéias", chapters: 7 },
    { id: "naum", name: "Naum", chapters: 3 },
    { id: "habacuque", name: "Habacuque", chapters: 3 },
    { id: "sofonias", name: "Sofonias", chapters: 3 },
    { id: "ageu", name: "Ageu", chapters: 2 },
    { id: "zacarias", name: "Zacarias", chapters: 14 },
    { id: "malaquias", name: "Malaquias", chapters: 4 },
];

const NT_BOOKS: BookDef[] = [
    { id: "mateus", name: "Mateus", chapters: 28 },
    { id: "marcos", name: "Marcos", chapters: 16 },
    { id: "lucas", name: "Lucas", chapters: 24 },
    { id: "joao", name: "João", chapters: 21 },
    { id: "atos", name: "Atos", chapters: 28 },
    { id: "romanos", name: "Romanos", chapters: 16 },
    { id: "1corintios", name: "1 Coríntios", chapters: 16 },
    { id: "2corintios", name: "2 Coríntios", chapters: 13 },
    { id: "galatas", name: "Gálatas", chapters: 6 },
    { id: "efesios", name: "Efésios", chapters: 6 },
    { id: "filipenses", name: "Filipenses", chapters: 4 },
    { id: "colossenses", name: "Colossenses", chapters: 4 },
    { id: "1tessalonicenses", name: "1 Tessalonicenses", chapters: 5 },
    { id: "2tessalonicenses", name: "2 Tessalonicenses", chapters: 3 },
    { id: "1timoteo", name: "1 Timóteo", chapters: 6 },
    { id: "2timoteo", name: "2 Timóteo", chapters: 4 },
    { id: "tito", name: "Tito", chapters: 3 },
    { id: "filemom", name: "Filemom", chapters: 1 },
    { id: "hebreus", name: "Hebreus", chapters: 13 },
    { id: "tiago", name: "Tiago", chapters: 5 },
    { id: "1pedro", name: "1 Pedro", chapters: 5 },
    { id: "2pedro", name: "2 Pedro", chapters: 3 },
    { id: "1joao", name: "1 João", chapters: 5 },
    { id: "2joao", name: "2 João", chapters: 1 },
    { id: "3joao", name: "3 João", chapters: 1 },
    { id: "judas", name: "Judas", chapters: 1 },
    { id: "apocalipse", name: "Apocalipse", chapters: 22 },
];

const TOTAL_OT_CHAPTERS = OT_BOOKS.reduce((s, b) => s + b.chapters, 0);
const TOTAL_NT_CHAPTERS = NT_BOOKS.reduce((s, b) => s + b.chapters, 0);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
            {sub && <div className="text-xs text-gray-500">{sub}</div>}
        </div>
    );
}

function BookCard({
    book,
    coveredSet,
    chapterCounts,
}: {
    book: BookDef;
    coveredSet: Set<string>;
    chapterCounts: Map<string, number>;
}) {
    const covered = Array.from({ length: book.chapters }, (_, i) => i + 1).filter((ch) =>
        coveredSet.has(`${book.id}_${ch}`)
    ).length;

    const pct = book.chapters === 0 ? 0 : Math.round((covered / book.chapters) * 100);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
            {/* Book name + fraction */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white truncate">{book.name}</span>
                <span className="text-xs text-gray-400 shrink-0">
                    {covered}/{book.chapters} cap.
                </span>
            </div>

            {/* Chapter squares */}
            <div className="flex flex-wrap gap-0.5">
                {Array.from({ length: book.chapters }, (_, i) => {
                    const ch = i + 1;
                    const key = `${book.id}_${ch}`;
                    const hasCoverage = coveredSet.has(key);
                    const count = chapterCounts.get(key) ?? 0;
                    return (
                        <div
                            key={ch}
                            title={`Cap. ${ch}${hasCoverage ? ` — ${count} perguntas` : " — sem perguntas"}`}
                            style={{
                                width: 14,
                                height: 14,
                                backgroundColor: hasCoverage ? "#22c55e" : "#374151",
                                borderRadius: 2,
                                flexShrink: 0,
                            }}
                        />
                    );
                })}
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${pct}%`,
                            backgroundColor: pct === 100 ? "#22c55e" : pct > 0 ? "#3b82f6" : "#374151",
                        }}
                    />
                </div>
                <div className="text-xs text-gray-500">{pct}% coberto</div>
            </div>
        </div>
    );
}

function TestamentSection({
    title,
    books,
    coveredSet,
    chapterCounts,
    totalChapters,
    coveredChapters,
}: {
    title: string;
    books: BookDef[];
    coveredSet: Set<string>;
    chapterCounts: Map<string, number>;
    totalChapters: number;
    coveredChapters: number;
}) {
    const pct = totalChapters === 0 ? 0 : Math.round((coveredChapters / totalChapters) * 100);

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                <span className="text-sm text-gray-400">
                    {coveredChapters}/{totalChapters} capítulos ({pct}%)
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        coveredSet={coveredSet}
                        chapterCounts={chapterCounts}
                    />
                ))}
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ConteudoPage() {
    const [coveredSet, setCoveredSet] = useState<Set<string>>(new Set());
    const [chapterCounts, setChapterCounts] = useState<Map<string, number>>(new Map());
    const [stats, setStats] = useState<{ totalQuestions: number; chaptersCovered: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [keys, bankStats] = await Promise.all([
                    getQuizBankKeysAsync(),
                    getQuizBankStatsAsync(),
                ]);

                const newSet = new Set<string>();
                const counts = new Map<string, number>();

                // Build a temporary per-chapter question counter from raw banks
                // We only have keys here, not counts, so we re-import to get counts
                const { getQuizBankChapterCount } = await import("@/lib/quiz-data");

                for (const { bookId, chapter } of keys) {
                    const key = `${bookId}_${chapter}`;
                    newSet.add(key);
                    if (!counts.has(key)) {
                        counts.set(key, getQuizBankChapterCount(bookId, chapter));
                    }
                }

                setCoveredSet(newSet);
                setChapterCounts(counts);
                setStats(bankStats);
            } catch (err) {
                console.error("Failed to load quiz bank data:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Compute coverage numbers
    const otCovered = OT_BOOKS.reduce((sum, book) => {
        return (
            sum +
            Array.from({ length: book.chapters }, (_, i) => i + 1).filter((ch) =>
                coveredSet.has(`${book.id}_${ch}`)
            ).length
        );
    }, 0);

    const ntCovered = NT_BOOKS.reduce((sum, book) => {
        return (
            sum +
            Array.from({ length: book.chapters }, (_, i) => i + 1).filter((ch) =>
                coveredSet.has(`${book.id}_${ch}`)
            ).length
        );
    }, 0);

    const otPct = Math.round((otCovered / TOTAL_OT_CHAPTERS) * 100);
    const ntPct = Math.round((ntCovered / TOTAL_NT_CHAPTERS) * 100);

    return (
        <div className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Page header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-white">Cobertura do Banco de Quiz</h1>
                <p className="text-sm text-gray-400">
                    Visualização da cobertura de perguntas por livro e capítulo da Bíblia.{" "}
                    <span className="text-gray-500 italic">
                        Perguntas baseadas na tradução ARC (Almeida Revista e Corrigida).
                    </span>
                </p>
            </div>

            {/* Summary stat cards */}
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-20 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard
                        label="Capítulos cobertos"
                        value={stats?.chaptersCovered ?? 0}
                        sub="com pelo menos 1 pergunta"
                    />
                    <StatCard
                        label="Total de perguntas"
                        value={(stats?.totalQuestions ?? 0).toLocaleString("pt-BR")}
                        sub="em todo o banco"
                    />
                    <StatCard
                        label="Cobertura NT"
                        value={`${ntPct}%`}
                        sub={`${ntCovered}/${TOTAL_NT_CHAPTERS} capítulos`}
                    />
                    <StatCard
                        label="Cobertura AT"
                        value={`${otPct}%`}
                        sub={`${otCovered}/${TOTAL_OT_CHAPTERS} capítulos`}
                    />
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: "#22c55e" }} />
                    <span>Com perguntas</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: "#374151" }} />
                    <span>Sem perguntas</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: "#3b82f6" }} />
                    <span>Cobertura parcial</span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-gray-400 text-sm">Carregando banco de quiz...</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    <TestamentSection
                        title="Antigo Testamento"
                        books={OT_BOOKS}
                        coveredSet={coveredSet}
                        chapterCounts={chapterCounts}
                        totalChapters={TOTAL_OT_CHAPTERS}
                        coveredChapters={otCovered}
                    />
                    <TestamentSection
                        title="Novo Testamento"
                        books={NT_BOOKS}
                        coveredSet={coveredSet}
                        chapterCounts={chapterCounts}
                        totalChapters={TOTAL_NT_CHAPTERS}
                        coveredChapters={ntCovered}
                    />
                </div>
            )}
        </div>
    );
}
