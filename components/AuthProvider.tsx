"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createOrUpdateUser, getUserProfile, UserProfile } from "@/lib/firestore";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    loginWithGoogle: async () => {},
    logout: async () => {},
    refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!auth || typeof auth.onAuthStateChanged !== "function") {
            console.error("Firebase Auth is not properly initialized.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const profile = await createOrUpdateUser(currentUser);
                    setProfile(profile);
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string };
            console.error("Login failed:", err.code, err.message);
            showToast("Não foi possível completar o login.", "error");
            setLoading(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setProfile(null);
        router.push("/");
    };

    const refreshProfile = async () => {
        if (!user) return;
        const updated = await getUserProfile(user.uid);
        if (updated) setProfile(updated);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
