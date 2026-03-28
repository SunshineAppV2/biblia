"use client";

import { useState } from "react";
import { VERSIONS } from "@/lib/bible";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "@/components/LanguageProvider";

interface VersionSelectorProps {
    currentVersion: string;
    onVersionChange: (versionId: string) => void;
    className?: string;
}

export function VersionSelector({ currentVersion, onVersionChange, className }: VersionSelectorProps) {
    const { locale, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    // Only show versions for the current language
    const availableVersions = VERSIONS.filter(v => v.language === locale);
    
    // If currentVersion is not in availableVersions (e.g. language switched), 
    // we still show its name, but it might be better to force a change in parent.
    const currentVersionName = VERSIONS.find(v => v.id === currentVersion)?.name || "Almeida";

    return (
        <div className={cn("relative z-20", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-secondary/20 hover:border-secondary/40 transition-colors text-xs font-medium text-foreground/80"
            >
                <Globe className="w-3 h-3 text-primary" />
                <span className="hidden sm:inline">{currentVersionName}</span>
                <span className="sm:hidden">{currentVersion}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-secondary/25 shadow-xl z-20 overflow-hidden"
                        >
                            <div className="px-3 py-2 border-b border-primary/8">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('profile.version')}</p>
                            </div>
                            <div className="p-2 space-y-0.5">
                                {availableVersions.map((v) => {
                                    const isActive = currentVersion === v.id;
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => { onVersionChange(v.id); setIsOpen(false); }}
                                            className={cn(
                                                "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between gap-2",
                                                isActive
                                                    ? "bg-secondary/15 border border-secondary/40"
                                                    : "hover:bg-primary/6 border border-transparent"
                                            )}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className={cn("font-black text-sm", isActive ? "text-secondary" : "text-primary")}>
                                                    {v.id}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">{v.name}</div>
                                            </div>
                                            {isActive && (
                                                <div className="shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
