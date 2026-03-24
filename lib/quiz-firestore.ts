import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { BankQuestion, getQuizBank } from "./quiz-data";

/**
 * Returns quiz questions for a given book/chapter by merging
 * static questions from QUIZ_BANK with any questions stored in Firestore.
 */
export async function getQuizBankWithFirestore(
    bookId: string,
    chapter: number
): Promise<BankQuestion[]> {
    const staticQuestions = getQuizBank(bookId, chapter) ?? [];

    try {
        const docRef = doc(db, "quiz_questions", `${bookId}_${chapter}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            const data = snap.data();
            const firestoreQuestions: BankQuestion[] = data.questions ?? [];
            return [...staticQuestions, ...firestoreQuestions];
        }
    } catch (err) {
        console.error("Error fetching Firestore quiz questions:", err);
    }

    return staticQuestions;
}
