"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getQuizBankStats } from "@/lib/quiz-data";
import Link from "next/link";
import { motion } from "framer-motion";

interface Stats {
    totalUsers: number;
    totalQuestions: number;
    chaptersCovered: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const usersSnap = await getCountFromServer(collection(db, "users"));
                const totalUsers = usersSnap.data().count;
                const { totalQuestions, chaptersCovered } = getQuizBankStats();
                setStats({ totalUsers, totalQuestions, chaptersCovered });
            } catch (err) {
                console.error("Error loading stats:", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const statCards = stats
        ? [
              {
                  label: "Usuários Cadastrados",
                  value: stats.totalUsers.toLocaleString("pt-BR"),
                  description: "Total na coleção users",
                  icon: "👥",
                  href: "/admin/usuarios",
              },
              {
                  label: "Perguntas de Quiz",
                  value: stats.totalQuestions.toLocaleString("pt-BR"),
                  description: "Banco estático (quiz-data.ts)",
                  icon: "❓",
                  href: "/admin/quiz",
              },
              {
                  label: "Capítulos com Quiz",
                  value: stats.chaptersCovered.toLocaleString("pt-BR"),
                  description: "Combinações livro+capítulo cobertas",
                  icon: "📖",
                  href: "/admin/quiz",
              },
          ]
        : [];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Painel Admin — AnoBíblico+</h1>
                <p className="text-gray-400 mt-1">Visão geral do sistema</p>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                    Carregando estatísticas...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Link href={card.href} className="block rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-600 transition-colors group">
                                <div className="text-3xl mb-3">{card.icon}</div>
                                <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
                                <div className="text-sm font-medium text-gray-300">{card.label}</div>
                                <div className="text-xs text-gray-500 mt-1">{card.description}</div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="border-t border-gray-800 pt-8">
                <h2 className="text-lg font-semibold text-white mb-4">Acesso Rápido</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/admin/usuarios"
                        className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 px-5 py-4 hover:border-gray-600 transition-colors"
                    >
                        <span className="text-2xl">👥</span>
                        <div>
                            <div className="font-semibold text-white">Gerenciar Usuários</div>
                            <div className="text-xs text-gray-500">Ver, resetar e promover usuários</div>
                        </div>
                        <span className="ml-auto text-gray-600">→</span>
                    </Link>
                    <Link
                        href="/admin/quiz"
                        className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 px-5 py-4 hover:border-gray-600 transition-colors"
                    >
                        <span className="text-2xl">📋</span>
                        <div>
                            <div className="font-semibold text-white">Banco de Quiz</div>
                            <div className="text-xs text-gray-500">Adicionar, editar e remover perguntas</div>
                        </div>
                        <span className="ml-auto text-gray-600">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
