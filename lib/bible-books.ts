export interface BibleBook {
    id: string;
    name: string;
    chapters: number;
    bookNum: number; // 1-66 for bolls.life API
    testament: 'AT' | 'NT';
}

export const BIBLE_BOOKS: BibleBook[] = [
    { id: "genesis", name: "Gênesis", chapters: 50, bookNum: 1, testament: "AT" },
    { id: "exodo", name: "Êxodo", chapters: 40, bookNum: 2, testament: "AT" },
    { id: "levitico", name: "Levítico", chapters: 27, bookNum: 3, testament: "AT" },
    { id: "numeros", name: "Números", chapters: 36, bookNum: 4, testament: "AT" },
    { id: "deuteronomio", name: "Deuteronômio", chapters: 34, bookNum: 5, testament: "AT" },
    { id: "josue", name: "Josué", chapters: 24, bookNum: 6, testament: "AT" },
    { id: "juizes", name: "Juízes", chapters: 21, bookNum: 7, testament: "AT" },
    { id: "rute", name: "Rute", chapters: 4, bookNum: 8, testament: "AT" },
    { id: "1samuel", name: "1 Samuel", chapters: 31, bookNum: 9, testament: "AT" },
    { id: "2samuel", name: "2 Samuel", chapters: 24, bookNum: 10, testament: "AT" },
    { id: "1reis", name: "1 Reis", chapters: 22, bookNum: 11, testament: "AT" },
    { id: "2reis", name: "2 Reis", chapters: 25, bookNum: 12, testament: "AT" },
    { id: "1cronicas", name: "1 Crônicas", chapters: 29, bookNum: 13, testament: "AT" },
    { id: "2cronicas", name: "2 Crônicas", chapters: 36, bookNum: 14, testament: "AT" },
    { id: "esdras", name: "Esdras", chapters: 10, bookNum: 15, testament: "AT" },
    { id: "neemias", name: "Neemias", chapters: 13, bookNum: 16, testament: "AT" },
    { id: "ester", name: "Ester", chapters: 10, bookNum: 17, testament: "AT" },
    { id: "jo", name: "Jó", chapters: 42, bookNum: 18, testament: "AT" },
    { id: "salmos", name: "Salmos", chapters: 150, bookNum: 19, testament: "AT" },
    { id: "proverbios", name: "Provérbios", chapters: 31, bookNum: 20, testament: "AT" },
    { id: "eclesiastes", name: "Eclesiastes", chapters: 12, bookNum: 21, testament: "AT" },
    { id: "cantares", name: "Cantares", chapters: 8, bookNum: 22, testament: "AT" },
    { id: "isaias", name: "Isaías", chapters: 66, bookNum: 23, testament: "AT" },
    { id: "jeremias", name: "Jeremias", chapters: 52, bookNum: 24, testament: "AT" },
    { id: "lamentacoes", name: "Lamentações", chapters: 5, bookNum: 25, testament: "AT" },
    { id: "ezequiel", name: "Ezequiel", chapters: 48, bookNum: 26, testament: "AT" },
    { id: "daniel", name: "Daniel", chapters: 12, bookNum: 27, testament: "AT" },
    { id: "oseias", name: "Oseias", chapters: 14, bookNum: 28, testament: "AT" },
    { id: "joel", name: "Joel", chapters: 3, bookNum: 29, testament: "AT" },
    { id: "amos", name: "Amós", chapters: 9, bookNum: 30, testament: "AT" },
    { id: "obadias", name: "Obadias", chapters: 1, bookNum: 31, testament: "AT" },
    { id: "jonas", name: "Jonas", chapters: 4, bookNum: 32, testament: "AT" },
    { id: "miqueias", name: "Miquéias", chapters: 7, bookNum: 33, testament: "AT" },
    { id: "naum", name: "Naum", chapters: 3, bookNum: 34, testament: "AT" },
    { id: "habacuque", name: "Habacuque", chapters: 3, bookNum: 35, testament: "AT" },
    { id: "sofonias", name: "Sofonias", chapters: 3, bookNum: 36, testament: "AT" },
    { id: "ageu", name: "Ageu", chapters: 2, bookNum: 37, testament: "AT" },
    { id: "zacarias", name: "Zacarias", chapters: 14, bookNum: 38, testament: "AT" },
    { id: "malaquias", name: "Malaquias", chapters: 4, bookNum: 39, testament: "AT" },
    { id: "mateus", name: "Mateus", chapters: 28, bookNum: 40, testament: "NT" },
    { id: "marcos", name: "Marcos", chapters: 16, bookNum: 41, testament: "NT" },
    { id: "lucas", name: "Lucas", chapters: 24, bookNum: 42, testament: "NT" },
    { id: "joao", name: "João", chapters: 21, bookNum: 43, testament: "NT" },
    { id: "atos", name: "Atos", chapters: 28, bookNum: 44, testament: "NT" },
    { id: "romanos", name: "Romanos", chapters: 16, bookNum: 45, testament: "NT" },
    { id: "1corintios", name: "1 Coríntios", chapters: 16, bookNum: 46, testament: "NT" },
    { id: "2corintios", name: "2 Coríntios", chapters: 13, bookNum: 47, testament: "NT" },
    { id: "galatas", name: "Gálatas", chapters: 6, bookNum: 48, testament: "NT" },
    { id: "efesios", name: "Efésios", chapters: 6, bookNum: 49, testament: "NT" },
    { id: "filipenses", name: "Filipenses", chapters: 4, bookNum: 50, testament: "NT" },
    { id: "colossenses", name: "Colossenses", chapters: 4, bookNum: 51, testament: "NT" },
    { id: "1tessalonicenses", name: "1 Tessalonicenses", chapters: 5, bookNum: 52, testament: "NT" },
    { id: "2tessalonicenses", name: "2 Tessalonicenses", chapters: 3, bookNum: 53, testament: "NT" },
    { id: "1timoteo", name: "1 Timóteo", chapters: 6, bookNum: 54, testament: "NT" },
    { id: "2timoteo", name: "2 Timóteo", chapters: 4, bookNum: 55, testament: "NT" },
    { id: "tito", name: "Tito", chapters: 3, bookNum: 56, testament: "NT" },
    { id: "filemom", name: "Filemom", chapters: 1, bookNum: 57, testament: "NT" },
    { id: "hebreus", name: "Hebreus", chapters: 13, bookNum: 58, testament: "NT" },
    { id: "tiago", name: "Tiago", chapters: 5, bookNum: 59, testament: "NT" },
    { id: "1pedro", name: "1 Pedro", chapters: 5, bookNum: 60, testament: "NT" },
    { id: "2pedro", name: "2 Pedro", chapters: 3, bookNum: 61, testament: "NT" },
    { id: "1joao", name: "1 João", chapters: 5, bookNum: 62, testament: "NT" },
    { id: "2joao", name: "2 João", chapters: 1, bookNum: 63, testament: "NT" },
    { id: "3joao", name: "3 João", chapters: 1, bookNum: 64, testament: "NT" },
    { id: "judas", name: "Judas", chapters: 1, bookNum: 65, testament: "NT" },
    { id: "apocalipse", name: "Apocalipse", chapters: 22, bookNum: 66, testament: "NT" },
];

export function getBookById(id: string): BibleBook | undefined {
    return BIBLE_BOOKS.find(b => b.id === id);
}

export function getBookIndex(id: string): number {
    return BIBLE_BOOKS.findIndex(b => b.id === id);
}

export function getTotalChapters(): number {
    return BIBLE_BOOKS.reduce((sum, book) => sum + book.chapters, 0);
}
