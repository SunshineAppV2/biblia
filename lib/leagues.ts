import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { UserProfile } from "./firestore";

export type LeagueTier =
    | "BRONZE" | "PRATA" | "OURO" | "SAFIRA" | "RUBI"
    | "ESMERALDA" | "AMETISTA" | "PEROLA" | "OBSIDIANA" | "DIAMANTE";

export const LEAGUE_ORDER: LeagueTier[] = [
    "BRONZE", "PRATA", "OURO", "SAFIRA", "RUBI",
    "ESMERALDA", "AMETISTA", "PEROLA", "OBSIDIANA", "DIAMANTE"
];

export interface LeagueConfig {
    color: string;
    gradient: string;
    description: string;
    label: string;
}

export const LEAGUE_CONFIGS: Record<LeagueTier, LeagueConfig> = {
    BRONZE: {
        color: "#cd7f32",
        gradient: "from-[#cd7f32] to-[#8b4513]",
        label: "Bronze",
        description: "O início da sua jornada épica."
    },
    PRATA: {
        color: "#c0c0c0",
        gradient: "from-[#c0c0c0] to-[#708090]",
        label: "Prata",
        description: "Você está ganhando ritmo!"
    },
    OURO: {
        color: "#ffd700",
        gradient: "from-[#ffd700] to-[#b8860b]",
        label: "Ouro",
        description: "Brilhando como o sol da manhã."
    },
    SAFIRA: {
        color: "#0f52ba",
        gradient: "from-[#0f52ba] to-[#000080]",
        label: "Safira",
        description: "Profundidade e sabedoria."
    },
    RUBI: {
        color: "#e0115f",
        gradient: "from-[#e0115f] to-[#800000]",
        label: "Rubi",
        description: "Paixão ardente pela Palavra."
    },
    ESMERALDA: {
        color: "#50c878",
        gradient: "from-[#50c878] to-[#006400]",
        label: "Esmeralda",
        description: "Crescimento constante e vigor."
    },
    AMETISTA: {
        color: "#9966cc",
        gradient: "from-[#9966cc] to-[#4b0082]",
        label: "Ametista",
        description: "Espiritualidade e foco."
    },
    PEROLA: {
        color: "#eae0c8",
        gradient: "from-[#eae0c8] to-[#c19a6b]",
        label: "Pérola",
        description: "Raridade e pureza."
    },
    OBSIDIANA: {
        color: "#444444",
        gradient: "from-[#444444] to-[#000000]",
        label: "Obsidiana",
        description: "Força inabalável."
    },
    DIAMANTE: {
        color: "#b9f2ff",
        gradient: "from-[#b9f2ff] to-[#4682b4]",
        label: "Diamante",
        description: "A glória máxima do conhecimento."
    },
};

export interface LeagueParticipant {
    uid: string;
    displayName: string;
    photoURL: string | null;
    weeklyXp: number;
}

export interface League {
    id: string; // e.g., "2024-W01-BRONZE-001"
    tier: LeagueTier;
    startDate: string; // ISO Date
    endDate: string; // ISO Date
    participants: LeagueParticipant[];
}

/**
 * Generates the current week ID (e.g., "2025-W01")
 */
export function getCurrentWeekId(): string {
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
}

/**
 * Gets or joins a league for the user
 * Simplified logic for MVP: randomly assigns to a bucket if not assigned
 */
export async function getLeagueLeaderboard(user: UserProfile): Promise<LeagueParticipant[]> {
    // In a real app, we would look up the specific league ID stored in the user profile.
    // For this MVP, we will query users in the same tier.

    // This is a simplified "Global Tier" view. 
    // In a full bucket system, we'd filter by a 'leagueId' field on the user.
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

// Logic helpers for UI
export function getPromotionZone(tier: LeagueTier): number {
    return 5; // Top 5 promote
}

export function getDemotionZone(tier: LeagueTier): number {
    if (tier === "BRONZE") return 0; // Can't go below Bronze
    return 25; // Users from rank 26-30 demote
}
