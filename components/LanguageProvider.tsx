"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { locales, LocaleKey, Dictionary } from "@/lib/i18n";
import { useAuth } from "./AuthProvider";
import { updateUserLanguage } from "@/lib/firestore";
import { useRef } from "react";

interface LanguageContextType {
    locale: LocaleKey;
    setLocale: (l: LocaleKey) => void;
    t: (key: string, variables?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    locale: "pt",
    setLocale: () => {},
    t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();
    const [locale, setLocale] = useState<LocaleKey>("pt");
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const stored = localStorage.getItem("biblia_locale") as LocaleKey;
        if (stored && locales[stored]) {
            setLocale(stored);
        } else {
            // Check browser language
            const browserLang = navigator.language.split("-")[0];
            if (locales[browserLang as LocaleKey]) {
                setLocale(browserLang as LocaleKey);
            }
        }
    }, []);

    useEffect(() => {
        if (profile?.language && locales[profile.language as LocaleKey]) {
            // Only overwrite if it's the first time we load the profile 
            // OR if the profile language actually changed on the server
            if (isFirstLoad.current || profile.language !== locale) {
                console.log("Updating locale from profile:", profile.language);
                setLocale(profile.language as LocaleKey);
                isFirstLoad.current = false;
            }
        }
    }, [profile?.language]);

    const changeLocale = async (l: LocaleKey) => {
        setLocale(l);
        localStorage.setItem("biblia_locale", l);
        if (profile?.uid) {
            try {
                await updateUserLanguage(profile.uid, l);
            } catch (err) {
                console.error("Failed to update user language in firestore", err);
            }
        }
    };

    const t = (key: string, variables?: Record<string, any>) => {
        const dictionary = locales[locale];
        const keys = key.split(".");
        let result: any = dictionary;

        for (const k of keys) {
            if (result && result[k]) {
                result = result[k];
            } else {
                return key;
            }
        }

        if (typeof result === "string" && variables) {
            Object.entries(variables).forEach(([name, value]) => {
                result = result.replace(`{${name}}`, String(value));
            });
        }

        return String(result);
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale: changeLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
