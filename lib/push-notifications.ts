import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { db, app } from "./firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const VAPID_KEY = "BM1MKwT2SgB7mnM-nZvHakKDYPjDsWn-rUZKnNganVswi2BYMK6hAka_6vRhe6nUcLUMG9k89LDQHjNi5x5x_-s";

export async function requestPushPermission(uid: string) {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const messaging = getMessaging(app);
            const token = await getToken(messaging, { vapidKey: VAPID_KEY });
            
            if (token) {
                // Save token to user profile
                const userRef = doc(db, "users", uid);
                await updateDoc(userRef, {
                    fcmTokens: arrayUnion(token)
                });
                console.log("FCM Token saved");
            }
        }
    } catch (error) {
        console.error("Error setting up push notifications:", error);
    }
}

export function onForegroundMessage() {
    if (typeof window === "undefined") return;
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);
        // Show a custom toast if needed
    });
}
