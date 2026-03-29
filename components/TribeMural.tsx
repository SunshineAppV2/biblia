"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { sendTribeMessage, TribeMessage } from "@/lib/firestore";
import { User } from "firebase/auth";
import { Send, User as UserIcon, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TribeMuralProps {
    groupId: string;
    user: User;
}

export function TribeMural({ groupId, user }: TribeMuralProps) {
    const [messages, setMessages] = useState<TribeMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(
            collection(db, "groups", groupId, "messages"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as TribeMessage)).reverse();
            setMessages(msgs);
            setLoading(false);
            
            // Auto scroll to bottom
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }, 100);
        });

        return () => unsubscribe();
    }, [groupId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        const temp = newMessage;
        setNewMessage("");
        try {
            await sendTribeMessage(groupId, user, temp);
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            setNewMessage(temp); // Restore on error
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white/50 backdrop-blur rounded-3xl border border-secondary/20 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-secondary/10 bg-secondary/5 flex items-center justify-between">
                <h3 className="font-black text-xs uppercase tracking-widest text-secondary flex items-center gap-2">
                    <Send className="w-3 h-3" /> Mural da Tribo
                </h3>
                <span className="text-[10px] font-bold text-muted-foreground opacity-60">
                    {messages.length} mensagens recentes
                </span>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                            <Send className="w-6 h-6 text-secondary" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest">Nada por aqui ainda...</p>
                        <p className="text-[10px]">Seja o primeiro a enviar um grito de guerra!</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.senderUid === user.uid ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className="shrink-0">
                                    {msg.senderPhoto ? (
                                        <img src={msg.senderPhoto} alt="" className="w-8 h-8 rounded-xl object-cover border border-secondary/20 shadow-sm" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-[10px] text-secondary border border-secondary/20">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <div className={`flex flex-col max-w-[80%] ${msg.senderUid === user.uid ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                                            {msg.senderName.split(' ')[0]}
                                        </span>
                                        <span className="text-[8px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-2 h-2" />
                                            {msg.createdAt && formatDistanceToNow(msg.createdAt instanceof Timestamp ? msg.createdAt.toDate() : new Date(), { addSuffix: true, locale: ptBR })}
                                        </span>
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                        msg.senderUid === user.uid 
                                            ? 'bg-secondary text-secondary-foreground rounded-tr-none' 
                                            : 'bg-white border border-secondary/10 text-primary rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Input Area */}
            <form 
                onSubmit={handleSend}
                className="p-4 bg-white/70 border-t border-secondary/10 flex gap-2"
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Envie uma mensagem..."
                    className="flex-1 px-5 py-3 rounded-full bg-white border border-secondary/20 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all shadow-inner"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-11 h-11 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-lg shadow-secondary/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
