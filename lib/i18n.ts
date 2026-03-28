export const locales = {
    pt: {
        welcome: {
            title: "AnoBíblico+",
            subtitle: "O AnoBíblico+ sincroniza sua leitura com o plano global (RPSP) e motiva sua caminhada com gamificação, tribos e recompensas.",
            cta: "ACESSAR ANOBÍBLICO+",
            donation: "DOE AQUI",
            policy: "POLÍTICA DE PRIVACIDADE",
            terms: "TERMOS DE USO",
            support: "SUPORTE",
            ads_info: "O AnoBíblico+ é mantido de forma gratuita através de anúncios e patrocínios.",
            ads_mission: "Seu apoio contribui para levar a Palavra ao mundo todo.",
            vanguard_title: "O que te espera na vanguarda?",
            vanguard_desc: "Ferramentas de elite para sua disciplina espiritual"
        },
        dashboard: {
            greeting: "Olá",
            greeting_anonymous: "Olá, Viajante",
            next_reading: "Próxima Leitura",
            favorites: "Favoritos",
            plans: "Planos de Leitura",
            cycle: "Ciclo Atual",
            rpsp: "REAVIVADOS POR SUA PALAVRA (RPSP)",
            ofensiva: "Ofensiva",
            xp_weekly: "XP Semanal",
            ranking_week: "Ranking da Semana",
            my_progress: "Meu Progresso",
            profile: "Perfil",
            install_pwa: "App Instalável",
            install_desc: "Instale para acesso rápido"
        },
        reading: {
            open_pergaminhos: "Abrindo pergaminhos...",
            versiculos: "versículos",
            complete: "Concluir Capítulo"
        }
    },
    en: {
        welcome: {
            title: "BibleYear+",
            subtitle: "BibleYear+ synchronizes your reading with the global plan (RPSP) and motivates your journey with gamification, tribes, and rewards.",
            cta: "ACCESS BIBLEYEAR+",
            donation: "DONATE HERE",
            policy: "PRIVACY POLICY",
            terms: "TERMS OF USE",
            support: "SUPPORT",
            ads_info: "BibleYear+ is maintained for free through advertisements and sponsorships.",
            ads_mission: "Your support helps spread the Word to the whole world.",
            vanguard_title: "What awaits you at the vanguard?",
            vanguard_desc: "Elite tools for your spiritual discipline"
        },
        dashboard: {
            greeting: "Hello",
            greeting_anonymous: "Hello, Traveler",
            next_reading: "Next Reading",
            favorites: "Favorites",
            plans: "Reading Plans",
            cycle: "Current Cycle",
            rpsp: "REVIVED BY HIS WORD (RPSP)",
            ofensiva: "Streak",
            xp_weekly: "Weekly XP",
            ranking_week: "Weekly Ranking",
            my_progress: "My Progress",
            profile: "Profile",
            install_pwa: "Installable App",
            install_desc: "Install for quick access"
        },
        reading: {
            open_pergaminhos: "Opening scrolls...",
            versiculos: "verses",
            complete: "Complete Chapter"
        }
    }
};

export type LocaleKey = keyof typeof locales;
export type Dictionary = typeof locales.pt;
