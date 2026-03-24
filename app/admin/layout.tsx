"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/usuarios", label: "Usuários", icon: "👥" },
  { href: "/admin/quiz", label: "Banco de Quiz", icon: "📋" },
  { href: "/admin/stats", label: "Estatísticas", icon: "📊" },
  { href: "/admin/versiculo", label: "Versículo do Dia", icon: "📅" },
  { href: "/admin/conquistas", label: "Conquistas", icon: "🏆" },
  { href: "/admin/notificacoes", label: "Notificações", icon: "📣" },
  { href: "/admin/exportar", label: "Exportar", icon: "📤" },
  { href: "/admin/logs", label: "Logs", icon: "🔍" },
  { href: "/admin/config", label: "Configurações", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading } = useAuth();
    const pathname = usePathname();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-gray-400 text-sm">Verificando acesso...</span>
                </div>
            </div>
        );
    }

    if (!user || profile?.isAdmin !== true) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
                <div className="text-6xl">🔒</div>
                <h1 className="text-3xl font-bold">Acesso Negado</h1>
                <p className="text-gray-400 text-center max-w-sm">
                    Você não tem permissão para acessar o painel administrativo.
                    Esta área é restrita a administradores.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-lg bg-white text-gray-950 font-semibold hover:bg-gray-100 transition-colors"
                >
                    ← Voltar ao Início
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
                <div className="px-5 py-5 border-b border-gray-800">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">BibleQuest</div>
                    <div className="text-sm font-bold text-white">Painel Admin</div>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <span className="text-base leading-none">{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-5 py-4 border-t border-gray-800">
                    <div className="text-xs text-gray-500 truncate">{profile?.displayName ?? profile?.email}</div>
                    <div className="text-xs text-green-400 font-medium mt-0.5">Admin</div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto bg-gray-950">
                {children}
            </main>
        </div>
    );
}
