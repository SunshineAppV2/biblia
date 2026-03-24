import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { BIBLE_BOOKS } from "./bible-books";

/**
 * Returns the next unread chapter for the user across all 66 books
 * in canonical order.
 */
export async function getNextUserChapter(userId: string): Promise<{ bookId: string; chapter: number }> {
    try {
        const progressRef = collection(db, "users", userId, "reading_progress");
        const snapshot = await getDocs(progressRef);

        const completed = new Set<string>();
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.bookId && data.chapterId) {
                completed.add(`${data.bookId}_${data.chapterId}`);
            }
        });

        for (const book of BIBLE_BOOKS) {
            for (let chapter = 1; chapter <= book.chapters; chapter++) {
                if (!completed.has(`${book.id}_${chapter}`)) {
                    return { bookId: book.id, chapter };
                }
            }
        }

        // All 1189 chapters completed!
        return { bookId: "genesis", chapter: 1 };
    } catch (error) {
        console.error("Error getting next chapter:", error);
        return { bookId: "genesis", chapter: 1 };
    }
}
