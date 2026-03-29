import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc } from "firebase/firestore";
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

/**
 * Week ID based on Sunday 19:00 cutoff.
 * A new week starts every Sunday at 19:00.
 * Returns the date string (YYYY-MM-DD) of the Sunday when the current week started.
 */
export function getCurrentWeekId(): string {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const hour = now.getHours();

    // How many days back to the last "week start" (Sunday 19:00)
    let daysBack: number;
    if (day === 0 && hour >= 19) {
        daysBack = 0; // Today is Sunday after 19:00 — new week just started
    } else if (day === 0) {
        daysBack = 7; // Today is Sunday before 19:00 — still in previous week
    } else {
        daysBack = day; // Mon(1)–Sat(6) → go back to last Sunday
    }

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysBack);
    const y = weekStart.getFullYear();
    const m = String(weekStart.getMonth() + 1).padStart(2, "0");
    const d = String(weekStart.getDate()).padStart(2, "0");
    return `week-${y}-${m}-${d}`;
}

/** Returns the next league reset Date (next Sunday at 19:00). */
export function getNextLeagueReset(): Date {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    // Days until next Sunday 19:00
    let daysAhead: number;
    if (day === 0 && hour < 19) {
        daysAhead = 0; // Today is Sunday, reset hasn't happened yet
    } else if (day === 0) {
        daysAhead = 7; // Today is Sunday after 19:00, next reset is next Sunday
    } else {
        daysAhead = 7 - day; // Days remaining until Sunday
    }

    const reset = new Date(now);
    reset.setDate(now.getDate() + daysAhead);
    reset.setHours(19, 0, 0, 0);
    return reset;
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

/**
 * Checks if the current week is different from the user's last processed week.
 * If so: applies promotion/demotion based on weekly rank, resets weeklyXp.
 * Called on login/session start.
 */
export async function checkAndProcessLeagueWeek(user: UserProfile): Promise<{
    promoted: boolean;
    demoted: boolean;
    newLeague: string;
} | null> {
    const weekId = getCurrentWeekId();
    if (user.leagueWeekId === weekId) return null; // Already processed this week

    const currentTier = migrateLegacyLeague(user.currentLeague || "AGATA");
    const currentIdx = LEAGUE_ORDER.indexOf(currentTier);

    // Get user's rank in their league (XP)
    const leaderboard = await getLeagueLeaderboard(user);
    const rank = leaderboard.findIndex(p => p.uid === user.uid) + 1;
    const total = leaderboard.length;

    // Get user's rank in Jornada (Encounter Wins)
    const { getWeeklyEncounterRanking } = await import("./leaderboard-service");
    const encounterLeaderboard = await getWeeklyEncounterRanking();
    const encounterRank = encounterLeaderboard.findIndex(p => p.uid === user.uid) + 1;

    let newIdx = currentIdx;
    let promoted = false;
    let demoted = false;

    if (rank > 0 && rank <= 5 && currentIdx < LEAGUE_ORDER.length - 1) {
        newIdx = currentIdx + 1;
        promoted = true;
    } else if (total >= 10 && rank > total - 5 && currentIdx > 0) {
        newIdx = currentIdx - 1;
        demoted = true;
    } else if (user.weeklyXp === 0 && currentIdx > 0) {
        // Inactive — demote
        newIdx = currentIdx - 1;
        demoted = true;
    }

    const newLeague = LEAGUE_ORDER[newIdx];
    const userRef = doc(db, "users", user.uid);
    
    const updateData: any = {
        currentLeague: newLeague,
        weeklyXp: 0,
        weeklyEncounterWins: 0,
        leagueWeekId: weekId,
    };

    // Reward for 1st place in League (XP) or 1st place in Jornada (Wins)
    if ((rank === 1 && user.weeklyXp > 0) || (encounterRank === 1 && (user.weeklyEncounterWins || 0) > 0)) {
        updateData.gems = (user.gems || 0) + 50;
    }

    await updateDoc(userRef, updateData);

    return { promoted, demoted, newLeague };
}
