"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

export default function AdminSetupPage() {
    const [email, setEmail] = useState("master@anobiblico.com");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("Master Admin");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = credential.user.uid;

            await setDoc(doc(db, "users", uid), {
                uid,
                displayName,
                email,
                photoURL: null,
                xp: 999999,
                weeklyXp: 0,
                currentLeague: "DIAMANTE",
                streak: 365,
                totalChapters: 1189,
                lastActive: null,
                isAdmin: true,
                achievements: [],
                wisdomPoints: 1189,
                preferredVersion: "ARC",
            });

            setSuccess(true);
        } catch (err: unknown) {
            const e = err as { code?: string; message?: string };
            if (e.code === "auth/email-already-in-use") {
                setError("Essa conta já existe. Faça login normalmente em /admin.");
            } else {
                setError(e.message ?? "Erro desconhecido.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Warning banner */}
                <div className="mb-6 rounded-lg border border-yellow-500 bg-yellow-500/10 px-4 py-3 text-yellow-300 text-sm font-medium text-center">
                    ⚠ Página temporária — delete após uso
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
                    <h1 className="text-2xl font-bold mb-2 text-white">Criar Conta Admin</h1>
                    <p className="text-gray-400 text-sm mb-6">
                        Configure a conta master do painel administrativo.
                    </p>

                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="text-green-400 text-lg font-semibold">
                                ✓ Conta criada com sucesso!
                            </div>
                            <p className="text-gray-400 text-sm">
                                A conta master foi criada. Agora você pode acessar o painel.
                            </p>
                            <Link
                                href="/admin"
                                className="inline-block mt-4 px-6 py-3 rounded-lg bg-white text-gray-950 font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Ir para o Painel Admin →
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Nome de exibição
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                            </div>

                            {error && (
                                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-white text-gray-950 font-semibold py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Criando..." : "Criar Conta Admin"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
