import { getBookById } from "./bible-books";
import { GENESIS_ARC } from "./genesis-local";

// Local data takes priority for ARC — guaranteed availability offline
const LOCAL_DATA: Record<string, Record<number, string[]>> = {
    genesis: GENESIS_ARC,
};

export interface ChapterContent {
    bookId: string;
    bookName: string;
    chapter: number;
    text: string[];
    version: string;
    totalVerses: number;
    estimatedSeconds: number;
}

// Version mapping to bolls.life API codes
// bolls.life Portuguese translations: ARC, ARA, NTPT
export const VERSIONS = [
    { id: "ARC", name: "Almeida Revista e Corrigida", apiCode: "ARC" },
    { id: "ARA", name: "Almeida Revista e Atualizada", apiCode: "ARA" },
    { id: "NTLH", name: "Linguagem de Hoje", apiCode: "NTLH" },
    { id: "NVI", name: "Nova Versão Internacional", apiCode: "NVI" },
    { id: "NAA", name: "Nova Almeida Atualizada", apiCode: "NAA" },
];

interface BollsVerse {
    pk: number;
    verse: number;
    text: string;
    chapter: number;
    book: number;
}

// In-memory cache per session
const chapterCache = new Map<string, ChapterContent>();

function getApiCode(versionId: string): string {
    return VERSIONS.find(v => v.id === versionId)?.apiCode || "ARC";
}

async function fetchFromBolls(bookNum: number, chapter: number, apiCode: string): Promise<string[] | null> {
    try {
        const url = `https://bolls.life/get-chapter/${apiCode}/${bookNum}/${chapter}/`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const verses: BollsVerse[] = await response.json();
        if (!verses || verses.length === 0) return null;

        return verses
            .sort((a, b) => a.verse - b.verse)
            .map(v => v.text.replace(/<[^>]*>/g, '').trim());
    } catch (error) {
        console.error(`bolls.life fetch failed [${apiCode} ${bookNum}:${chapter}]`, error);
        return null;
    }
}

export async function getChapterContent(
    bookId: string,
    chapter: number,
    version: string = "ARC"
): Promise<ChapterContent | null> {
    const cacheKey = `${bookId}_${chapter}_${version}`;
    if (chapterCache.has(cacheKey)) return chapterCache.get(cacheKey)!;

    const book = getBookById(bookId);
    if (!book) return null;

    const apiCode = getApiCode(version);

    // 1. Use local data for ARC (instant, offline-safe)
    let verses: string[] | null = null;
    if (version === "ARC" && LOCAL_DATA[bookId]?.[chapter]) {
        verses = LOCAL_DATA[bookId][chapter];
    }

    // 2. Try API for other versions or chapters not in local data
    if (!verses) {
        verses = await fetchFromBolls(book.bookNum, chapter, apiCode);
    }

    // 3. Fallback: try ARC via API
    if (!verses && apiCode !== "ARC") {
        verses = await fetchFromBolls(book.bookNum, chapter, "ARC");
    }

    // 4. Last resort: use local ARC data regardless of requested version
    if (!verses && LOCAL_DATA[bookId]?.[chapter]) {
        verses = LOCAL_DATA[bookId][chapter];
    }

    if (!verses || verses.length === 0) return null;

    const totalVerses = verses.length;
    const estimatedSeconds = Math.max(60, totalVerses * 8); // ~8s per verse (~200 wpm), min 60s

    const content: ChapterContent = {
        bookId,
        bookName: book.name,
        chapter,
        text: verses,
        version,
        totalVerses,
        estimatedSeconds,
    };

    chapterCache.set(cacheKey, content);
    return content;
}
