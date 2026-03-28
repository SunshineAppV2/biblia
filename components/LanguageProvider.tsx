"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { locales, LocaleKey, Dictionary } from "@/lib/i18n";
import { useAuth } from "./AuthProvider";

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
            setLocale(profile.language as LocaleKey);
        }
    }, [profile?.language]);

    const changeLocale = (l: LocaleKey) => {
        setLocale(l);
        localStorage.setItem("biblia_locale", l);
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
