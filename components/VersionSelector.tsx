"use client";

import { useState } from "react";
import { VERSIONS } from "@/lib/bible";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface VersionSelectorProps {
    currentVersion: string;
    onVersionChange: (versionId: string) => void;
    className?: string;
}

export function VersionSelector({ currentVersion, onVersionChange, className }: VersionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

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
                            className="absolute right-0 mt-2 w-56 rounded-xl bg-[#2E3B42] border border-secondary/20 shadow-2xl z-20 overflow-hidden"
                        >
                            <div className="p-2 space-y-1">
                                {VERSIONS.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => {
                                            onVersionChange(v.id);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                            currentVersion === v.id
                                                ? "bg-primary/20 text-primary font-bold"
                                                : "text-muted-foreground hover:bg-primary/20 hover:text-foreground"
                                        )}
                                    >
                                        <div className="font-bold">{v.id}</div>
                                        <div className="text-[10px] opacity-60 uppercase tracking-tighter">{v.name}</div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
