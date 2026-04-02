import { getBookById } from "./bible-books";
import { LOCAL_BIBLE } from "./bible-local-index";

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
    { id: "ARA",  name: "Almeida Revista e Atualizada",  apiCode: "ARA"  },
    { id: "NVI",  name: "Nova Versão Internacional",      apiCode: "NVI"  },
    { id: "NTLH", name: "Nova Trad. Linguagem de Hoje", apiCode: "NTLH" },
    { id: "NAA",  name: "Nova Almeida Atualizada",       apiCode: "NAA"  },
    { id: "TB",   name: "Tradução Brasileira",            apiCode: "TB"   },
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

async function fetchFromBolls(
    bookNum: number, 
    chapter: number, 
    apiCode: string, 
    retries: number = 2
): Promise<string[] | null> {
    const url = `https://bolls.life/get-chapter/${apiCode}/${bookNum}/${chapter}/`;
    
    for (let i = 0; i <= retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 404) return null; // Chapter truly doesn't exist
                throw new Error(`HTTP ${response.status}`);
            }

            const verses: BollsVerse[] = await response.json();
            if (!verses || verses.length === 0) return null;

            return verses
                .sort((a, b) => a.verse - b.verse)
                .map(v => v.text.replace(/<[^>]*>/g, '').trim());
        } catch (error: any) {
            const isLast = i === retries;
            const errorMsg = error.name === 'AbortError' ? 'Timeout' : error.message;
            
            console.warn(
                `bolls.life fetch attempt ${i + 1} failed [${apiCode} ${bookNum}:${chapter}]: ${errorMsg}`
            );

            if (isLast) {
                console.error(`Final failure fetching from bolls.life:`, error);
                return null;
            }
            
            // Wait before retry: 500ms, 1200ms
            await new Promise(resolve => setTimeout(resolve, 500 * (i + 1) * (i + 1)));
        }
    }
    return null;
}

export async function getChapterContent(
    bookId: string,
    chapter: number,
    version: string = "ARA"
): Promise<ChapterContent | null> {
    const cacheKey = `${bookId}_${chapter}_${version}`;
    if (chapterCache.has(cacheKey)) return chapterCache.get(cacheKey)!;

    const book = getBookById(bookId);
    if (!book) return null;

    const apiCode = getApiCode(version);

    // 1. Use local data for the requested version (offline-safe)
    const localVersion = LOCAL_BIBLE[version] ?? LOCAL_BIBLE['ARA'];
    let verses: string[] | null = localVersion?.[bookId]?.[chapter] ?? null;

    // 2. If not found locally, try the API
    if (!verses) {
        verses = await fetchFromBolls(book.bookNum, chapter, apiCode);
    }

    // 3. Fallback: use local ARA if API also failed
    if (!verses) {
        verses = LOCAL_BIBLE['ARA']?.[bookId]?.[chapter] ?? null;
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
