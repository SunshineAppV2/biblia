# Planejamento de Implementação - BibleQuest (Ano Bíblico)

Este documento detalha o plano de execução para o desenvolvimento do **BibleQuest**, uma plataforma PWA de leitura bíblica gamificada.

## 1. Stack Tecnológica & Configuração Inicial

*   **Frontend**: Next.js 16 (App Router) + Turbopack.
*   **Estilização**: Tailwind CSS (com plugins: `typography`, `animate`). Design system focado em cores vibrantes, modo escuro e glassmorphism.
*   **Backend/BaaS**: Firebase (Firestore, Auth, Functions - se necessário para cron jobs de ligas).
*   **IA**: Google Gemini API via Google AI SDK for JavaScript.
*   **Hospedagem**: Vercel (Frontend) + Firebase (Dados/Auth).

## 2. Arquitetura de Dados (Firestore)

### Coleções Principais

*   `users`:
    *   `uid`, `displayName`, `email`, `photoURL`
    *   `xp` (total e semanal), `currentLeague` (enum: BRONZE..DIAMANTE)
    *   `streak` (dias consecutivos), `gems` (moeda virtual)
    *   `preferences` (tema, versão bíblica)
*   `reading_plans`:
    *   `id`, `title`, `description`
    *   `chapters` (array de referências: `{ book, chapter, averageTime }`)
*   `user_progress` (Subcoleção de `users` ou coleção raiz indexada):
    *   `userId`, `planId`, `book`, `chapter`
    *   `status` (completed), `completedAt`, `timeSpent`
*   `leagues`:
    *   `id` (ex: `2024-W01-BRONZE-01`)
    *   `tier` (BRONZE), `startDate`, `endDate`
    *   `participants` (array de UIDs ou subcoleção para escalabilidade)

## 3. Roteiro de Desenvolvimento (Fases)

### Fase 1: Fundação e Leitura (MVP)
*   **Configuração do Projeto**: Setup Next.js, Tailwind, Shadcn/UI (opcional, para componentes base), Firebase SDK.
*   **Autenticação**: Login com Google e Email (Firebase Auth).
*   **Interface de Leitura**:
    *   Renderização de texto bíblico (API pública ou local JSON para MVP).
    *   **Mecanismo "Foco Total"**: Componente `ReadingTimer` usando `document.visibilityState` e `setInterval`. Só valida XP se `tempoFocado >= 90% do tempoEstimado`.
*   **Dashboard Básico**: Visualização do plano atual e progresso simples.

### Fase 2: Gamificação (O Motor Social)
*   **Sistema de XP**: Lógica de cálculo de XP por capítulo lido e *streaks*.
*   **Ligas Semanais**:
    *   Lógica para agrupar usuários em "buckets" de 30.
    *   Job (provavelmente Firebase Function agendada ou rota API Cron da Vercel) para processar promoções/rebaixamentos domingo à noite.
*   **Perfil do Usuário**: Exibição de estatísticas, medalhas e liga atual.

### Fase 3: Inteligência Artificial (Gemini)
*   **Resumo & Aplicação**: Botão "Insights IA" ao final de cada capítulo.
*   **Contexto Histórico**: Sidebar ou modal com dados sobre o livro atual.
*   **Chat Assistente**: Interface de chat flutuante para dúvidas teológicas (preservando prompt de sistema para manter foco bíblico).

### Fase 4: Administração e Polimento Visual
*   **Painel Admin**: Rota protegida (`isAdmin: true`) para criar planos de leitura.
*   **Design Premium**:
    *   Refinamento de animações (Framer Motion).
    *   Micro-interações (confete ao terminar leitura, sons sutis).
    *   Otimização PWA (ícones, manifest, offline support básico).

## 4. Design System (Diretrizes)

*   **Paleta**: Cores "divinas" e modernas. Ex: Indigo Profundo (fundo), Dourado/Âmbar (conquistas), Esmeralda Neon (sucesso), Violeta (mistério/IA).
*   **Tipografia**: Inter ou Outfit para UI; Serifada moderna (ex: Merriweather ou Libre Baskerville) para o texto bíblico.
*   **Componentes**: Cards com efeito "glass" (backdrop-blur), botões com gradientes, barras de progresso animadas.

---

**Próximo Passo Sugerido**: Iniciar a **Fase 1** criando o projeto Next.js e configurando o Tailwind.
