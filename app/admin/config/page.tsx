"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppConfig, DEFAULT_CONFIG, getAppConfig } from "@/lib/app-config";

function Toggle({
    checked,
    onChange,
    disabled,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                checked ? "bg-green-500" : "bg-gray-700"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    checked ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    );
}

export default function ConfigPage() {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        getAppConfig()
            .then((cfg) => setConfig(cfg))
            .catch((err) => console.error("Error loading config:", err))
            .finally(() => setLoading(false));
    }, []);

    const saveConfig = useCallback(async (cfg: AppConfig) => {
        setSaveState("saving");
        try {
            await setDoc(doc(db, "app_config", "settings"), cfg);
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 2000);
        } catch (err) {
            console.error("Error saving config:", err);
            setSaveState("error");
            setTimeout(() => setSaveState("idle"), 3000);
        }
    }, []);

    const updateConfig = useCallback(
        (partial: Partial<AppConfig>) => {
            setConfig((prev) => {
                const next = { ...prev, ...partial };

                // Debounced auto-save
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    saveConfig(next);
                }, 1000);

                return next;
            });
        },
        [saveConfig]
    );

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Configurações</h1>
                    <p className="text-gray-400 text-sm mt-0.5">
                        Configurações globais do aplicativo — salvas automaticamente
                    </p>
                </div>
                <div className="text-sm font-medium">
                    {saveState === "saving" && (
                        <span className="text-gray-400 flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-gray-300 rounded-full animate-spin" />
                            Salvando...
                        </span>
                    )}
                    {saveState === "saved" && <span className="text-green-400">Salvo ✓</span>}
                    {saveState === "error" && <span className="text-red-400">Erro ao salvar</span>}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-gray-400 py-12">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                    Carregando configurações...
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Maintenance Mode */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-white font-semibold">Modo Manutenção</h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    Exibe um banner de manutenção para todos os usuários
                                </p>
                            </div>
                            <Toggle
                                checked={config.maintenanceMode}
                                onChange={(v) => updateConfig({ maintenanceMode: v })}
                            />
                        </div>
                        {config.maintenanceMode && (
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Mensagem de Manutenção</label>
                                <input
                                    type="text"
                                    value={config.maintenanceMessage}
                                    onChange={(e) => updateConfig({ maintenanceMessage: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-gray-500 focus:outline-none"
                                    placeholder="Mensagem exibida durante a manutenção..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Quiz */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-semibold">Quiz Habilitado</h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    Ativa ou desativa o recurso de quiz para todos os usuários
                                </p>
                            </div>
                            <Toggle
                                checked={config.quizEnabled}
                                onChange={(v) => updateConfig({ quizEnabled: v })}
                            />
                        </div>
                    </div>

                    {/* Leagues */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-semibold">Ligas Habilitadas</h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    Ativa ou desativa o sistema de ligas
                                </p>
                            </div>
                            <Toggle
                                checked={config.leaguesEnabled}
                                onChange={(v) => updateConfig({ leaguesEnabled: v })}
                            />
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-white font-semibold">Mensagem de Boas-vindas</h2>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    Exibe uma mensagem personalizada no dashboard de todos os usuários
                                </p>
                            </div>
                            <Toggle
                                checked={config.welcomeMessageEnabled}
                                onChange={(v) => updateConfig({ welcomeMessageEnabled: v })}
                            />
                        </div>
                        {config.welcomeMessageEnabled && (
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Texto da Mensagem</label>
                                <input
                                    type="text"
                                    value={config.welcomeMessage}
                                    onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm placeholder-gray-600 focus:border-gray-500 focus:outline-none"
                                    placeholder="Ex: Bem-vindo à Semana Santa! Aproveite para ler..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Current values summary */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Estado Atual</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <ConfigBadge
                                label="Manutenção"
                                value={config.maintenanceMode ? "Ativa" : "Normal"}
                                active={config.maintenanceMode}
                                activeColor="red"
                            />
                            <ConfigBadge
                                label="Quiz"
                                value={config.quizEnabled ? "Habilitado" : "Desabilitado"}
                                active={config.quizEnabled}
                                activeColor="green"
                            />
                            <ConfigBadge
                                label="Ligas"
                                value={config.leaguesEnabled ? "Habilitadas" : "Desabilitadas"}
                                active={config.leaguesEnabled}
                                activeColor="green"
                            />
                            <ConfigBadge
                                label="Boas-vindas"
                                value={config.welcomeMessageEnabled ? "Ativa" : "Inativa"}
                                active={config.welcomeMessageEnabled}
                                activeColor="blue"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ConfigBadge({
    label,
    value,
    active,
    activeColor,
}: {
    label: string;
    value: string;
    active: boolean;
    activeColor: "green" | "red" | "blue";
}) {
    const colorMap = {
        green: "bg-green-500/20 text-green-400",
        red: "bg-red-500/20 text-red-400",
        blue: "bg-blue-500/20 text-blue-400",
    };
    return (
        <div className="bg-gray-800 rounded-lg px-3 py-2">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div
                className={`text-xs font-semibold px-1.5 py-0.5 rounded w-fit ${
                    active ? colorMap[activeColor] : "bg-gray-700 text-gray-400"
                }`}
            >
                {value}
            </div>
        </div>
    );
}
