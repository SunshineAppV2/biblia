import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";

export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    xp: number;
    weeklyXp: number;
    currentLeague: string;
    leagueWeekId?: string; // week when league was last processed, e.g. "2026-W13"
    streak: number;
    totalChapters: number;
    lastActive: Timestamp | null;
    readDates: string[]; // Array de strings ISO de datas em que um capítulo foi lido
    streakFreezes: number; // Quantidade de bloqueios de ofensiva disponíveis
    gems: number; // Moeda virtual para compras
    preferredVersion?: string;
    achievements?: string[];
    wisdomPoints?: number;
    isAdmin?: boolean;
}

export async function createOrUpdateUser(user: User): Promise<UserProfile> {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            xp: 0,
            weeklyXp: 0,
            currentLeague: "AGATA",
            streak: 0,
            totalChapters: 0,
            readDates: [], // Inicializa o novo campo
            streakFreezes: 0, // Inicia com zero bloqueios
            gems: 100, // Presente de boas-vindas: 100 gemas
            lastActive: null,
            preferredVersion: "ARC",
            achievements: [],
            wisdomPoints: 0,
            isAdmin: user.email === "aseabra2005@gmail.com",
        };
        await setDoc(userRef, newProfile);
        return newProfile;
    } else {
        const data = userSnap.data();
        await updateDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastActive: serverTimestamp(),
            // Garante campo gems exista se já fosse um usuário antigo
            gems: data.gems !== undefined ? data.gems : 100,
            isAdmin: user.email === "aseabra2005@gmail.com",
        });
        return { ...data, ...userSnap.data(), isAdmin: user.email === "aseabra2005@gmail.com" } as UserProfile;
    }
}


export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) return userSnap.data() as UserProfile;
    return null;
}

export async function addUserXp(uid: string, amount: number): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        xp: increment(amount),
        weeklyXp: increment(amount),
        lastActive: serverTimestamp(),
    });
}

export async function applyXpDelta(uid: string, delta: number): Promise<void> {
    if (delta === 0) return;
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        xp: increment(delta),
        weeklyXp: increment(delta),
    });
}

export async function updateUserVersion(uid: string, version: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        preferredVersion: version,
        lastActive: serverTimestamp(),
    });
}

export async function buyStreakFreeze(uid: string, gemCost: number): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        gems: increment(-gemCost),
        streakFreezes: increment(1),
    });
}


