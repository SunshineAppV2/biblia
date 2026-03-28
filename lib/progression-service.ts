import { db } from "./firebase";
import { BIBLE_BOOKS } from "./bible-books";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

/**
 * Returns the next unread chapter for the user across all 1189 chapters,
 * respecting the circular reading cycle.
 */
export async function getNextUserChapter(userId: string): Promise<{ bookId: string; chapter: number }> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) return { bookId: "genesis", chapter: 1 };
        
        const data = userSnap.data();
        const cycle = data.cycle || 1;
        const cycleStart = data.cycleStartChapter; // { bookId, chapter }

        // Get completed chapters for CURRENT cycle
        const progressRef = collection(db, "users", userId, "reading_progress");
        const cycleQuery = query(progressRef, where("cycle", "==", cycle));
        const snapshot = await getDocs(cycleQuery);

        const completed = new Set<string>();
        snapshot.forEach(doc => {
            const d = doc.data();
            if (d.bookId && d.chapterId) {
                completed.add(`${d.bookId}_${d.chapterId}`);
            }
        });

        // 1.189 Bible chapters in canonical order
        const allChapters: { bookId: string; chapter: number }[] = [];
        for (const book of BIBLE_BOOKS) {
            for (let ch = 1; ch <= book.chapters; ch++) {
                allChapters.push({ bookId: book.id, chapter: ch });
            }
        }

        // If cycleStart exists, we shift the array to start from it
        let startIndex = 0;
        if (cycleStart) {
            startIndex = allChapters.findIndex(c => c.bookId === cycleStart.bookId && c.chapter === cycleStart.chapter);
            if (startIndex === -1) startIndex = 0;
        }

        // Search circularly
        for (let i = 0; i < allChapters.length; i++) {
            const idx = (startIndex + i) % allChapters.length;
            const target = allChapters[idx];
            if (!completed.has(`${target.bookId}_${target.chapter}`)) {
                return target;
            }
        }

        // If all 1.189 are completed in this cycle, the completeChapter logic will reset the cycle
        // and getNextUserChapter will be called again with no completed chapters for the new cycle.
        return { bookId: "genesis", chapter: 1 };

    } catch (error) {
        console.error("Error getting next chapter:", error);
        return { bookId: "genesis", chapter: 1 };
    }
}
