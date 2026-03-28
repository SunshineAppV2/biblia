import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, Timestamp, collection, getDocs, query, where, orderBy } from "firebase/firestore";
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
    groupId?: string | null;
    language?: string;
    achievements?: string[];
    wisdomPoints?: number;
    isAdmin?: boolean;
    cycle?: number;
    totalReadInCycle?: number;
    cycleStartChapter?: { bookId: string; chapter: number } | null;
    cycleStartDate?: Timestamp | null;
}

export interface UserGroup {
    id: string;
    name: string;
    description: string;
    leaderUid: string;
    memberCount: number;
    totalXpWeek: number;
    createdAt: Timestamp;
    members: string[]; // array de uids
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
        };
        await setDoc(userRef, newProfile);
        return newProfile;
    } else {
        const data = userSnap.data();
        await updateDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastActive: serverTimestamp(),
            // Garante campo gems exista se já fosse um usuário antigo
            gems: data.gems !== undefined ? data.gems : 100,
            isAdmin: user.email === "aseabra2005@gmail.com",
        });
        return { ...data, ...userSnap.data(), isAdmin: user.email === "aseabra2005@gmail.com" } as UserProfile;
    }
}


export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) return userSnap.data() as UserProfile;
    return null;
}

export async function addUserXp(uid: string, amount: number): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        xp: increment(amount),
        weeklyXp: increment(amount),
        lastActive: serverTimestamp(),
    });
}

export async function applyXpDelta(uid: string, delta: number): Promise<void> {
    if (delta === 0) return;
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        xp: increment(delta),
        weeklyXp: increment(delta),
    });
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

    const groupId = `group_${Date.now()}_${uid}`;
    const groupRef = doc(db, "groups", groupId);

    const newGroup = {
        id: groupId,
        name,
        description: description || "Sem descrição",
        leaderUid: uid,
        memberCount: 1,
        totalXpWeek: 0,
        createdAt: serverTimestamp(),
        members: [uid]
    };

    await setDoc(groupRef, newGroup);
    await updateDoc(userRef, { groupId });

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

export async function getGroupById(groupId: string): Promise<UserGroup | null> {
    const groupRef = doc(db, "groups", groupId);
    const snap = await getDoc(groupRef);
    return snap.exists() ? (snap.data() as UserGroup) : null;
}


