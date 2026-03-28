import { db } from "./firebase";
import { getPlanChapter, getPlanSequence } from "./reading-plan";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

/**
 * Returns the next unread chapter for the user based on their active plan.
 * For RPSP, it respects the circular reading cycle starting from the current RPSP date for new users.
 * For other plans, it follows the plan's specific sequence.
 */
export async function getNextUserChapter(userId: string): Promise<{ bookId: string; chapter: number }> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        // Default plan settings
        let activePlanId = "rpsp";
        let planStartDate = undefined;

        if (userSnap.exists()) {
            const data = userSnap.data();
            activePlanId = data.activePlanId || "rpsp";
            planStartDate = data.planStartDate?.toDate();
        }

        // 1. Get current plan chapter
        const currentTarget = getPlanChapter(activePlanId, planStartDate);

        // 2. Get completed chapters for this user (performance could be tuned later with a subcollection limit)
        const progressRef = collection(db, "users", userId, "reading_progress");
        const snapshot = await getDocs(progressRef);
        const completed = new Set<string>();
        snapshot.forEach(doc => {
            const d = doc.data();
            completed.add(`${d.bookId}_${d.chapterId}`);
        });

        // 3. Get plan sequence
        const sequence = getPlanSequence(activePlanId);

        // 4. Find where the user should be (current target for today)
        let startIndex = sequence.findIndex(c => c.bookId === currentTarget.bookId && c.chapter === currentTarget.chapter);
        if (startIndex === -1) startIndex = 0;

        // 5. Search forward for the next unread chapter in the sequence
        for (let i = 0; i < sequence.length; i++) {
            const idx = (startIndex + i) % sequence.length;
            const target = sequence[idx];
            if (!completed.has(`${target.bookId}_${target.chapter}`)) {
                return { bookId: target.bookId, chapter: target.chapter };
            }
        }

        // Fallback: If everything in the plan is finished, return first chapter of plan (could show a "Completed" state instead)
        return { bookId: sequence[0].bookId, chapter: sequence[0].chapter };

    } catch (error) {
        console.error("Error getting next chapter:", error);
        return { bookId: "genesis", chapter: 1 };
    }
}
