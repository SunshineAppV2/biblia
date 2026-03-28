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
export async function completeChapter(
    userId: string,
    bookId: string,
    chapterId: string,
    xpAmount: number
): Promise<boolean> {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data() || {};
    const currentCycle = data.cycle || 1;

    const progressId = `${bookId}_${chapterId}_cycle${currentCycle}`;
    const progressRef = doc(db, "users", userId, "reading_progress", progressId);

    try {
        const progressSnap = await getDoc(progressRef);
        if (progressSnap.exists()) return false; // Already completed in this cycle

        await setDoc(progressRef, {
            bookId,
            chapterId,
            completedAt: serverTimestamp(),
            xpAwarded: xpAmount,
            cycle: currentCycle,
        });

        let newStreak = 1;
        let isPostMaxLevel = false;
        const todayStr = getLocalDateString();

        const updatePayload: Record<string, unknown> = {
            xp: increment(xpAmount),
            weeklyXp: increment(xpAmount),
            lastActive: serverTimestamp(),
            totalChapters: increment(1),
            gems: increment(10), 
        };

        if (userSnap.exists()) {
            const data = userSnap.data();
            const lastActive = toDate(data.lastActive);
            const currentStreak = data.streak || 0;
            const streakFreezes = data.streakFreezes || 0;
            const currentLevel = calculateLevel(data.xp || 0);
            isPostMaxLevel = currentLevel >= MAX_LEVEL;
            
            // Circular Logic
            const cycle = data.cycle || 1;
            const cycleStartChapter = data.cycleStartChapter;
            const totalReadInCycle = (data.totalReadInCycle || 0) + 1;
            const TOTAL_BIBLE_CHAPTERS = 1189;

            if (!cycleStartChapter) {
                // First chapter of the cycle
                updatePayload.cycleStartChapter = { bookId, chapter: Number(chapterId) };
                updatePayload.cycleStartDate = serverTimestamp();
            }

            updatePayload.totalReadInCycle = totalReadInCycle;

            if (totalReadInCycle >= TOTAL_BIBLE_CHAPTERS) {
                // Cycle complete!
                updatePayload.cycle = cycle + 1;
                updatePayload.totalReadInCycle = 0;
                updatePayload.cycleStartChapter = null; // Reset for next cycle
                updatePayload.cycleStartDate = null;
                // Optional: clear or archive progress. 
                // For now, we clear it so getNextUserChapter can find "unread" chapters again.
                // NOTE: This usually requires a lot of deletions. In a real app we might 
                // use a subcollection with the cycle number as part of the ID.
                // But as per requirement "reseta o progresso", we'll implement a way 
                // to ignore old progress in getNextUserChapter by using the cycle number.
            }

            // Sync readDates in Firestore
            const existingDates = data.readDates || [];
            if (!existingDates.includes(todayStr)) {
                updatePayload.readDates = [...existingDates, todayStr].slice(-30);
            }

            if (lastActive && isToday(lastActive)) {
                newStreak = currentStreak; 
            } else if (lastActive && isYesterday(lastActive)) {
                newStreak = currentStreak + 1;
            } else if (lastActive) {
                const daysMissed = getDaysDifference(lastActive, new Date()) - 1;
                if (daysMissed > 0 && streakFreezes >= daysMissed) {
                    newStreak = currentStreak + 1;
                    updatePayload.streakFreezes = increment(-daysMissed);
                } else {
                    newStreak = 1;
                }
            } else {
                newStreak = 1;
            }
        } else {
            // First time ever
            updatePayload.readDates = [todayStr];
            updatePayload.cycle = 1;
            updatePayload.totalReadInCycle = 1;
            updatePayload.cycleStartChapter = { bookId, chapter: Number(chapterId) };
            updatePayload.cycleStartDate = serverTimestamp();
        }

        updatePayload.streak = newStreak;

        if (isPostMaxLevel) {
            updatePayload.wisdomPoints = increment(1);
        }

        await updateDoc(userRef, updatePayload);

        // Sync XP with group
        if (data.groupId) {
            const groupRef = doc(db, "groups", data.groupId);
            await updateDoc(groupRef, {
                totalXpWeek: increment(xpAmount)
            });
        }

        return true;
    } catch (error: unknown) {
        const code = (error as { code?: string })?.code;
        if (code === "unavailable" || code === "failed-precondition") {
            console.warn("Firebase offline — chapter progress not saved.");
            return false;
        }
        console.error("Error completing chapter:", error);
        throw error;
    }
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
