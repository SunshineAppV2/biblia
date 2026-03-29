import { db, auth } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, addDoc, increment, serverTimestamp, Timestamp, collection, getDocs, query, where, orderBy, writeBatch, deleteDoc, limit, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";

export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    xp: number;
    weeklyXp: number;
    currentLeague: string;
    leagueWeekId?: string; // week when league was last processed, e.g. "2026-W13"
    streak: number;
    totalChapters: number;
    lastActive: Timestamp | null;
    readDates: string[]; // Array de strings ISO de datas em que um capítulo foi lido
    streakFreezes: number; // Quantidade de bloqueios de ofensiva disponíveis
    gems: number; // Moeda virtual para compras
    preferredVersion?: string;
    achievements?: string[];
    wisdomPoints?: number;
    isAdmin?: boolean;
    cycle?: number;
    totalReadInCycle?: number;
    cycleStartChapter?: { bookId: string; chapter: number } | null;
    cycleStartDate?: Timestamp | null;
    groupId?: string | null;
    activePlanId: string;
    planStartDate: Timestamp;
    referralCode: string;
    referredBy?: string | null;
    referralsCount: number;
    weeklyEncounterWins: number; // Vitórias na Jornada do Saber na semana atual
    lastWeekXp?: number; // XP da semana passada (para conferência)
    lastWeekEncounterWins?: number; // Vitórias da semana passada (para conferência)
    lastRankingRewardWeek?: string; // Última semana em que recebeu prêmio de ranking
}

export interface UserGroup {
    id: string;
    name: string;
    description: string;
    leaderUid: string;
    admins: string[]; // uids dos administradores da tribo
    memberCount: number;
    totalXpWeek: number;
    createdAt: Timestamp;
    members: string[]; // array de uids
}export interface TribeMessage {
    id?: string;
    senderUid: string;
    senderName: string;
    senderPhoto?: string | null;
    content: string;
    createdAt: Timestamp | any;
}

export async function createOrUpdateUser(user: User): Promise<UserProfile> {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            xp: 0,
            weeklyXp: 0,
            currentLeague: "AGATA",
            streak: 0,
            totalChapters: 0,
            readDates: [], // Inicializa o novo campo
            streakFreezes: 0, // Inicia com zero bloqueios
            gems: 100, // Presente de boas-vindas: 100 gemas
            lastActive: null,
            preferredVersion: "ARC",
            achievements: [],
            wisdomPoints: 0,
            isAdmin: user.email === "aseabra2005@gmail.com",
            activePlanId: "rpsp",
            planStartDate: Timestamp.now(),
            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            referralsCount: 0,
            groupId: null,
            weeklyEncounterWins: 0,
        };
        await setDoc(userRef, newProfile);
        return newProfile;
    } else {
        const data = userSnap.data();
        const updateData: any = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastActive: serverTimestamp(),
            // Garante campo gems exista se já fosse um usuário antigo
            gems: data.gems !== undefined ? data.gems : 100,
            isAdmin: user.email === "aseabra2005@gmail.com",
            groupId: data.groupId !== undefined ? data.groupId : null,
            weeklyEncounterWins: data.weeklyEncounterWins !== undefined ? data.weeklyEncounterWins : 0,
        };

        // Migração: adicionar referralCode para usuários antigos
        if (!data.referralCode) {
            updateData.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            updateData.referralsCount = 0;
        }

        await updateDoc(userRef, updateData);
        return { ...data, ...updateData, isAdmin: user.email === "aseabra2005@gmail.com" } as UserProfile;
    }
}


export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) return userSnap.data() as UserProfile;
    return null;
}

/** 
 * Envia uma ação de XP para o servidor validar e processar.
 * Única forma segura de ganhar XP após o hardening das regras.
 */
export async function awardXp(payload: { type: "CHAPTER" | "QUIZ" | "MISSION" | "ENCOUNTER_WIN", bookId?: string, chapter?: number, correctCount?: number, bonus?: number, missionId?: string }): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        const token = await user.getIdToken(true); // Forçar refresh para garantir token novo
        const res = await fetch("/api/xp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Erro ao processar XP");
        }
    } catch (error) {
        console.error("awardXp error:", error);
        throw error;
    }
}

/** Deprecated: use awardXp para ações específicas. 
 * Mantido por compatibilidade, redireciona para tipo MISSION com bônus.
 */
export async function addUserXp(uid: string, amount: number): Promise<void> {
    return awardXp({ type: "MISSION", bonus: amount, missionId: "legacy_add_user_xp" });
}

export async function applyXpDelta(uid: string, delta: number): Promise<void> {
    if (delta <= 0) return;
    return awardXp({ type: "MISSION", bonus: delta, missionId: "legacy_delta" });
}

export async function updateUserVersion(uid: string, version: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        preferredVersion: version,
        lastActive: serverTimestamp(),
    });
}

export async function buyStreakFreeze(uid: string, gemCost: number): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        gems: increment(-gemCost),
        streakFreezes: increment(1),
    });
}

export async function createGroup(uid: string, name: string, description: string): Promise<string> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    const userData = userSnap.data() as UserProfile;
    if (userData.groupId) throw new Error("User already in a group");

    const groupsRef = collection(db, "groups");
    const newGroupRef = doc(groupsRef);
    const groupId = newGroupRef.id;

    const newGroup = {
        id: groupId,
        name,
        description: description || "Sem descrição",
        leaderUid: uid,
        memberCount: 1,
        totalXpWeek: 0,
        createdAt: serverTimestamp(),
        members: [uid],
        admins: [uid] // O líder começa como admin
    };

    try {
        await setDoc(newGroupRef, newGroup);
    } catch (e: any) {
        throw new Error("Erro no Grupo: " + e.message);
    }

    try {
        await updateDoc(userRef, { groupId });
    } catch (e: any) {
        throw new Error("Erro no Perfil: " + e.message);
    }

    return groupId;
}

export async function joinGroup(uid: string, groupId: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    const userData = userSnap.data() as UserProfile;
    if (userData.groupId) throw new Error("User already in a group");

    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) throw new Error("Group not found");
    
    const groupData = groupSnap.data();
    const members = groupData.members || [];
    if (members.length >= 10) throw new Error("Group full");

    await updateDoc(groupRef, {
        members: [...members, uid],
        memberCount: increment(1)
    });

    await updateDoc(userRef, { groupId });
}

export async function leaveGroup(uid: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const userData = userSnap.data() as UserProfile;
    if (!userData.groupId) return;

    const groupRef = doc(db, "groups", userData.groupId);
    const groupSnap = await getDoc(groupRef);
    if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        const members = groupData.members || [];
        const newMembers = members.filter((m: string) => m !== uid);
        
        if (newMembers.length === 0) {
            await updateDoc(groupRef, { members: [], memberCount: 0 });
        } else {
            await updateDoc(groupRef, {
                members: newMembers,
                memberCount: newMembers.length,
                leaderUid: groupData.leaderUid === uid ? newMembers[0] : groupData.leaderUid
            });
        }
    }

    await updateDoc(userRef, { groupId: null });
}

export async function getGroupsRanking(minMembers = 3): Promise<UserGroup[]> {
    const groupsRef = collection(db, "groups");
    const q = query(
        groupsRef, 
        where("memberCount", ">=", minMembers),
        orderBy("totalXpWeek", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as UserGroup);
}

export async function redeemReferralCode(uid: string, code: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("Usuário não encontrado");
    const userData = userSnap.data() as UserProfile;
    
    if (userData.referredBy) throw new Error("Você já resgatou um convite");
    if (userData.referralCode === code) throw new Error("Você não pode usar seu próprio código");

    const ambassadorQuery = query(collection(db, "users"), where("referralCode", "==", code.toUpperCase()));
    const ambassadorSnap = await getDocs(ambassadorQuery);

    if (ambassadorSnap.empty) throw new Error("Código de convite inválido");
    
    const ambassadorDoc = ambassadorSnap.docs[0];
    const ambassadorUid = ambassadorDoc.id;

    // Atualiza o indicado (ganha 100 gemas de bônus)
    await updateDoc(userRef, {
        referredBy: ambassadorUid,
        gems: increment(100)
    });

    const ambassadorData = ambassadorDoc.data() as UserProfile;
    const currentCount = ambassadorData.referralsCount || 0;
    const newCount = currentCount + 1;

    const ambassadorUpdate: any = {
        gems: increment(50),
        referralsCount: increment(1)
    };
    if (newCount === 3) ambassadorUpdate.xp = increment(500);

    // Atualiza o embaixador
    await updateDoc(doc(db, "users", ambassadorUid), ambassadorUpdate);
}

export async function getGroupById(groupId: string): Promise<UserGroup | null> {
    const docSnap = await getDoc(doc(db, "groups", groupId));
    if (docSnap.exists()) {
        const data = docSnap.data() as UserGroup;
        return { ...data, id: docSnap.id };
    }
    return null;
}

/** Retorna todas as tribos (Função Administrativa) */
export async function getAllGroups(): Promise<UserGroup[]> {
    const q = query(collection(db, "groups"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data() as UserGroup, id: d.id }));
}

export async function adminSetUserXp(uid: string, xp: number): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { xp });
}

export async function adminResetUser(uid: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        xp: 0,
        weeklyXp: 0,
        gems: 100,
        streak: 0,
        totalChapters: 0,
        readDates: [],
        achievements: [],
        wisdomPoints: 0,
        referralsCount: 0,
        referredBy: null,
        totalReadInCycle: 0
    });
}

export async function searchUserByEmail(email: string): Promise<UserProfile | null> {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as UserProfile;
}

export async function adminUpdateUserData(uid: string, data: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
}

export async function deleteGroup(groupId: string, leaderUid: string): Promise<void> {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) throw new Error("Tribo não encontrada");
    
    const groupData = groupSnap.data() as UserGroup;
    if (groupData.leaderUid !== leaderUid) throw new Error("Apenas o líder pode excluir a tribo");

    const batch = writeBatch(db);
    
    // Remover groupId de todos os membros
    for (const memberUid of groupData.members) {
        batch.update(doc(db, "users", memberUid), { groupId: null });
    }
    
    // Deletar o documento do grupo
    batch.delete(groupRef);
    
    await batch.commit();
}

/** Exclui qualquer tribo (Função Administrativa) */
export async function adminDeleteGroup(groupId: string): Promise<void> {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) throw new Error("Tribo não encontrada");
    
    const groupData = groupSnap.data() as UserGroup;
    const batch = writeBatch(db);
    
    for (const memberUid of groupData.members) {
        batch.update(doc(db, "users", memberUid), { groupId: null });
    }
    
    batch.delete(groupRef);
    await batch.commit();
}

export async function toggleTribeAdmin(groupId: string, senderUid: string, targetUid: string): Promise<void> {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) throw new Error("Tribo não encontrada");
    
    const groupData = groupSnap.data() as UserGroup;
    
    // Somente o líder pode nomear/remover admins
    if (groupData.leaderUid !== senderUid) throw new Error("Apenas o líder pode gerenciar administradores");
    if (targetUid === groupData.leaderUid) throw new Error("O líder sempre é administrador");

    const currentAdmins = groupData.admins || [];
    let newAdmins;
    
    if (currentAdmins.includes(targetUid)) {
        newAdmins = currentAdmins.filter(id => id !== targetUid);
    } else {
        newAdmins = [...currentAdmins, targetUid];
    }
    
    await updateDoc(groupRef, { admins: newAdmins });
}

export async function getGroupMembers(memberUids: string[]): Promise<UserProfile[]> {
    if (memberUids.length === 0) return [];
    
    const usersRef = collection(db, "users");
    // O Firestore tem limite de 10-30 itens no 'in', mas grupos são de max 10 membros
    const q = query(usersRef, where("uid", "in", memberUids));
    const snap = await getDocs(q);
    
    return snap.docs.map(d => d.data() as UserProfile);
}

export async function sendTribeMessage(groupId: string, user: User, content: string): Promise<void> {
    if (!content.trim()) return;
    
    const messagesRef = collection(db, "groups", groupId, "messages");
    await addDoc(messagesRef, {
        senderUid: user.uid,
        senderName: user.displayName || "Usuário",
        senderPhoto: user.photoURL,
        content: content.trim(),
        createdAt: serverTimestamp()
    });
}

// --- ENCONTRO BÍBLICO / JORNADA DO SABER ---

export interface ArenaPlayer {
    uid: string;
    name: string;
    level: number;
    status: "searching" | "playing";
    createdAt: any;
}

export interface ArenaMatch {
    id?: string;
    players: string[];
    playerNames: Record<string, string>;
    scores: Record<string, number>;
    status: "playing" | "finished";
    createdAt: any;
}

/** Inicia jornada do saber */
export async function joinArenaQueue(user: User, level: number) {
    const queueRef = doc(db, "arena_queue", user.uid);
    await setDoc(queueRef, {
        uid: user.uid,
        name: user.displayName || "Leitor",
        level: level,
        status: "searching",
        createdAt: serverTimestamp()
    });
}

/** Finaliza busca */
export async function leaveArenaQueue(uid: string) {
    await deleteDoc(doc(db, "arena_queue", uid));
}

/** Busca um oponente na fila que não seja ele mesmo e no mesmo nível/próximo */
export async function findRivalInQueue(uid: string, level: number): Promise<ArenaPlayer | null> {
    const q = query(
        collection(db, "arena_queue"),
        where("status", "==", "searching"),
        where("level", ">=", level - 2), // Margem de 2 níveis
        where("level", "<=", level + 2),
        limit(5)
    );
    
    const snapshot = await getDocs(q);
    const rivals = snapshot.docs
        .map(d => d.data() as ArenaPlayer)
        .filter(r => r.uid !== uid);
    
    return rivals.length > 0 ? rivals[0] : null;
}

/** Inicializa uma partida entre dois jogadores */
export async function createArenaMatch(player1: { uid: string, name: string }, player2: { uid: string, name: string }): Promise<string> {
    const matchId = [player1.uid, player2.uid].sort().join("_");
    const matchRef = doc(db, "arena_matches", matchId);
    await setDoc(matchRef, {
        players: [player1.uid, player2.uid],
        playerNames: {
            [player1.uid]: player1.name,
            [player2.uid]: player2.name
        },
        scores: {
            [player1.uid]: 0,
            [player2.uid]: 0
        },
        status: "playing",
        createdAt: serverTimestamp()
    });
    
    // Atualiza status na fila (para que outros não os achem)
    await deleteDoc(doc(db, "arena_queue", player1.uid));
    await deleteDoc(doc(db, "arena_queue", player2.uid));
    
    return matchId;
}

/** Atualiza a pontuação na partida */
export async function updateMatchScore(matchId: string, uid: string, score: number) {
    const matchRef = doc(db, "arena_matches", matchId);
    await updateDoc(matchRef, {
        [`scores.${uid}`]: score
    });
}

/** Finaliza a partida */
export async function finishArenaMatch(matchId: string) {
    const matchRef = doc(db, "arena_matches", matchId);
    await updateDoc(matchRef, {
        status: "finished"
    });
}
