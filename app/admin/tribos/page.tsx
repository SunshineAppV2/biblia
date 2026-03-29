"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getAllGroups, adminDeleteGroup, UserGroup } from "@/lib/firestore";
import { useToast } from "@/components/Toast";
import { Trash2, Users, Search, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminTribesPage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (profile && !profile.isAdmin) {
            router.push("/");
            return;
        }
        loadGroups();
    }, [profile]);

    async function loadGroups() {
        setLoading(true);
        try {
            const data = await getAllGroups();
            setGroups(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (groupId: string, name: string) => {
        if (!confirm(`TEM CERTEZA que deseja excluir a tribo "${name}"? Todos os membros serão removidos e a tribo será deletada permanentemente.`)) return;
        try {
            await adminDeleteGroup(groupId);
            showToast("Tribo excluída.", "success");
            loadGroups();
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    const filtered = groups.filter(g => 
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8 text-white">Carregando tribos...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen bg-[#0E1B5C] text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                   <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2 text-sm">
                       <ChevronLeft className="w-4 h-4" /> Voltar ao Painel
                   </Link>
                   <h1 className="text-3xl font-black italic">Gerenciar Tribos</h1>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="font-bold">{groups.length} Tribos</span>
                </div>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Buscar tribos por nome ou descrição..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary/50 transition-all outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(g => (
                    <div key={g.id} className="bg-white/5 border border-white/10 rounded-[30px] p-6 hover:border-white/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold italic tracking-tight">{g.name}</h3>
                            <button 
                                onClick={() => handleDelete(g.id, g.name)}
                                className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10">{g.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-3">
                                <span className="block text-[10px] uppercase font-black opacity-40">Membros</span>
                                <span className="text-lg font-black">{g.memberCount}</span>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3">
                                <span className="block text-[10px] uppercase font-black opacity-40">XP Semana</span>
                                <span className="text-lg font-black">{g.totalXpWeek}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {filtered.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                    <p className="text-gray-400 font-medium">Nenhuma tribo encontrada.</p>
                </div>
            )}
        </div>
    );
}
