import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { UserProfile } from "./firestore";

export type LeagueTier =
    | "AGATA" | "JASPE" | "ONIX" | "AMETISTA" | "CALCEDONIA"
    | "SARDIO" | "LAPIS" | "CRISOLITO" | "AMBAR" | "JACINTO"
    | "TURQUESA" | "BERILO" | "SARDONICA" | "TOPAZIO" | "CRISOPRASO"
    | "PEROLA" | "SAFIRA" | "ESMERALDA" | "RUBI" | "DIAMANTE";

export const LEAGUE_ORDER: LeagueTier[] = [
    "AGATA", "JASPE", "ONIX", "AMETISTA", "CALCEDONIA",
    "SARDIO", "LAPIS", "CRISOLITO", "AMBAR", "JACINTO",
    "TURQUESA", "BERILO", "SARDONICA", "TOPAZIO", "CRISOPRASO",
    "PEROLA", "SAFIRA", "ESMERALDA", "RUBI", "DIAMANTE",
];

export interface LeagueConfig {
    color: string;
    gradient: string;
    description: string;
    label: string;
    reference: string; // Referência bíblica
}

export const LEAGUE_CONFIGS: Record<LeagueTier, LeagueConfig> = {
    AGATA: {
        color: "#8B7355",
        gradient: "from-[#A0876A] to-[#5C4A2A]",
        label: "Ágata",
        description: "O início da sua jornada — abundante como a graça.",
        reference: "Êxodo 28:19",
    },
    JASPE: {
        color: "#C65D3C",
        gradient: "from-[#C65D3C] to-[#6B2D1E]",
        label: "Jaspe",
        description: "Pedra fundamental, sólida como a fé.",
        reference: "Apocalipse 21:18",
    },
    ONIX: {
        color: "#5A5A5A",
        gradient: "from-[#6E6E6E] to-[#1A1A1A]",
        label: "Ônix",
        description: "Força nas trevas, luz no coração.",
        reference: "Gênesis 2:12",
    },
    AMETISTA: {
        color: "#9966CC",
        gradient: "from-[#9966CC] to-[#4B0082]",
        label: "Ametista",
        description: "Espiritualidade e foco na Palavra.",
        reference: "Apocalipse 21:20",
    },
    CALCEDONIA: {
        color: "#7B9EB9",
        gradient: "from-[#7B9EB9] to-[#3A5F7A]",
        label: "Calcedônia",
        description: "Brilho suave de uma fé crescente.",
        reference: "Apocalipse 21:19",
    },
    SARDIO: {
        color: "#CC4E1A",
        gradient: "from-[#E05A20] to-[#8B2500]",
        label: "Sárdio",
        description: "Fervor ardente como brasa de altar.",
        reference: "Êxodo 28:17",
    },
    LAPIS: {
        color: "#1F4D8C",
        gradient: "from-[#2A5FA8] to-[#0D2850]",
        label: "Lápis-Lazúli",
        description: "O azul profundo dos céus proclamados.",
        reference: "Jó 28:6",
    },
    CRISOLITO: {
        color: "#8B9E2C",
        gradient: "from-[#9BB030] to-[#4A5A10]",
        label: "Crisólito",
        description: "Verde-oliva, como oliveiras na terra prometida.",
        reference: "Apocalipse 21:20",
    },
    AMBAR: {
        color: "#E8A020",
        gradient: "from-[#F5B830] to-[#A06010]",
        label: "Âmbar",
        description: "Cor de fogo — visão e revelação divina.",
        reference: "Ezequiel 1:4",
    },
    JACINTO: {
        color: "#4472CA",
        gradient: "from-[#5585E0] to-[#1A3B80]",
        label: "Jacinto",
        description: "Brilho que confunde — mistério de Deus.",
        reference: "Apocalipse 21:20",
    },
    TURQUESA: {
        color: "#40B5AD",
        gradient: "from-[#4ECDC4] to-[#1A7B73]",
        label: "Turquesa",
        description: "Raridade pura — dedicação sem igual.",
        reference: "Êxodo 28:18",
    },
    BERILO: {
        color: "#5BB8D4",
        gradient: "from-[#6CCAE8] to-[#1A6E8A]",
        label: "Berilo",
        description: "Família da esmeralda — nobre em espírito.",
        reference: "Apocalipse 21:20",
    },
    SARDONICA: {
        color: "#9B3A2C",
        gradient: "from-[#B04535] to-[#5C1A10]",
        label: "Sardônica",
        description: "Camadas raras de força e perseverança.",
        reference: "Apocalipse 21:20",
    },
    TOPAZIO: {
        color: "#F5A623",
        gradient: "from-[#FFB830] to-[#C47A0A]",
        label: "Topázio",
        description: "O Topázio Imperial — saedoria de alto valor.",
        reference: "Jó 28:19",
    },
    CRISOPRASO: {
        color: "#73CC3C",
        gradient: "from-[#82E040] to-[#3A7A10]",
        label: "Crisópraso",
        description: "Verde vivo — crescimento e renovação.",
        reference: "Apocalipse 21:20",
    },
    PEROLA: {
        color: "#D4C5A0",
        gradient: "from-[#EAE0C8] to-[#A07848]",
        label: "Pérola",
        description: "A pérola de grande valor — tudo foi dado por ela.",
        reference: "Mateus 13:45",
    },
    SAFIRA: {
        color: "#0F52BA",
        gradient: "from-[#1A65D0] to-[#000080]",
        label: "Safira",
        description: "Uma das Quatro Grandes — profundidade e sabedoria.",
        reference: "Jó 28:16",
    },
    ESMERALDA: {
        color: "#50C878",
        gradient: "from-[#5EE088] to-[#006400]",
        label: "Esmeralda",
        description: "Valor altíssimo — perfeição sem inclusões.",
        reference: "Apocalipse 4:3",
    },
    RUBI: {
        color: "#E0115F",
        gradient: "from-[#F01A70] to-[#800000]",
        label: "Rubi",
        description: "Mais valioso que o diamante branco.",
        reference: "Provérbios 3:15",
    },
    DIAMANTE: {
        color: "#B9F2FF",
        gradient: "from-[#D0F8FF] to-[#4682B4]",
        label: "Diamante",
        description: "O ápice da dureza e brilho — a liga mestre.",
        reference: "Jeremias 17:1",
    },
};

export interface LeagueParticipant {
    uid: string;
    displayName: string;
    photoURL: string | null;
    weeklyXp: number;
}

export interface League {
    id: string;
    tier: LeagueTier;
    startDate: string;
    endDate: string;
    participants: LeagueParticipant[];
}

export function getCurrentWeekId(): string {
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
}

export async function getLeagueLeaderboard(user: UserProfile): Promise<LeagueParticipant[]> {
    const usersRef = collection(db, "users");
    const q = query(
        usersRef,
        where("currentLeague", "==", user.currentLeague),
        orderBy("weeklyXp", "desc"),
        limit(30)
    );

    const snapshot = await getDocs(q);
    const leaderboard: LeagueParticipant[] = [];

    snapshot.forEach(doc => {
        const data = doc.data() as UserProfile;
        leaderboard.push({
            uid: data.uid,
            displayName: data.displayName || "Viajante Anônimo",
            photoURL: data.photoURL,
            weeklyXp: data.weeklyXp
        });
    });

    return leaderboard;
}

/** Converte ligas do sistema antigo para o novo (compatibilidade com dados existentes). */
export function migrateLegacyLeague(tier: string): LeagueTier {
    const legacy: Record<string, LeagueTier> = {
        BRONZE: "AGATA",
        PRATA: "CALCEDONIA",
        OURO: "TOPAZIO",
        OBSIDIANA: "LAPIS",
        // As abaixo existem nos dois sistemas com o mesmo nome
        SAFIRA: "SAFIRA",
        RUBI: "RUBI",
        ESMERALDA: "ESMERALDA",
        AMETISTA: "AMETISTA",
        PEROLA: "PEROLA",
        DIAMANTE: "DIAMANTE",
    };
    if (LEAGUE_ORDER.includes(tier as LeagueTier)) return tier as LeagueTier;
    return legacy[tier] ?? "AGATA";
}

export function getPromotionZone(tier: LeagueTier): number {
    return 5;
}

export function getDemotionZone(tier: LeagueTier): number {
    if (tier === "AGATA") return 0;
    return 25;
}
