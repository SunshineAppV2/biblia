import { getAuth } from "firebase/auth";

export async function secureApplyXp(uid: string, body: any): Promise<number | null> {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            console.error("No current user for secure XP update");
            return null;
        }

        const idToken = await user.getIdToken();

        const response = await fetch("/api/xp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to add XP");
        }

        const data = await response.json();
        return data.xpAdded;
    } catch (error) {
        console.error("Error applying secure XP:", error);
        return null;
    }
}
