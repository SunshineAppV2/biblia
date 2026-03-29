import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, Timestamp } from "firebase/firestore";
import { calculateLevel } from "./levels";
import { getLocalDateString } from "./utils";

function toDate(ts: unknown): Date | null {
    if (!ts) return null;
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts && typeof ts === 'object' && 'toDate' in ts && typeof (ts as any).toDate === 'function') return (ts as any).toDate();
    if (ts instanceof Date) return ts;
    return null;
}

function isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getLocalDateString(date) === getLocalDateString(yesterday);
}

function isToday(date: Date): boolean {
    return getLocalDateString(date) === getLocalDateString(new Date());
}

function getDaysDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const MAX_LEVEL = 66;

/**
 * Marks a chapter as completed and awards XP.
 * Returns true if XP was awarded, false if already completed.
 * Post-level-66: also awards a Wisdom Point (Ponto de Sabedoria).
 */
import { awardXp } from "./firestore";

/**
 * Marks a chapter as completed and awards XP via the secure API.
 * Returns true if XP was successfully awarded.
 */
export async function completeChapter(
    userId: string,
    bookId: string,
    chapterId: string,
    xpAmount: number
): Promise<boolean> {
    try {
        await awardXp({ 
            type: "CHAPTER", 
            bookId, 
            chapter: Number(chapterId) 
        });
        return true;
    } catch (error) {
        console.error("Error completing chapter via API:", error);
        return false;
    }
}

export async function completeMissionXP(userId: string, xpAmount: number): Promise<void> {
    return awardXp({ type: "MISSION", bonus: xpAmount, missionId: "mission_completion" });
}

export async function isChapterCompleted(
    userId: string,
    bookId: string,
    chapterId: string
): Promise<boolean> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const currentCycle = userSnap.exists() ? (userSnap.data().cycle || 1) : 1;

        const progressId = `${bookId}_${chapterId}_cycle${currentCycle}`;
        const progressRef = doc(db, "users", userId, "reading_progress", progressId);
        const snap = await getDoc(progressRef);
        return snap.exists();
    } catch {
        return false; 
    }
}
