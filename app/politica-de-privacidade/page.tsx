import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Política de Privacidade — AnoBíblico+",
    description: "Saiba como o AnoBíblico+ coleta, usa e protege seus dados pessoais.",
};

export default function PrivacyPolicyPage() {
    const lastUpdated = "23 de março de 2026";

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors mb-6 inline-block"
                    >
                        ← Voltar ao AnoBíblico+
                    </Link>
                    <h1 className="text-4xl font-black text-primary mb-2">Política de Privacidade</h1>
                    <p className="text-muted-foreground text-sm">Última atualização: {lastUpdated}</p>
                </div>

                <div className="space-y-8 text-foreground">

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">1. Quem somos</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            O <strong className="text-primary">AnoBíblico+</strong> é um aplicativo web de leitura bíblica gamificada,
                            acessível em <strong>anobiblico.vercel.app</strong>. Este documento explica quais dados
                            coletamos, como os utilizamos e como protegemos sua privacidade, em conformidade com a
                            Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">2. Dados que coletamos</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">2.1 Dados de autenticação</h3>
                                <p>
                                    Ao fazer login com o Google, coletamos seu nome de exibição, endereço de e-mail
                                    e foto de perfil fornecidos pelo Google. Esses dados são usados exclusivamente
                                    para identificar sua conta dentro do app.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">2.2 Dados de progresso</h3>
                                <p>
                                    Armazenamos seu progresso de leitura bíblica, pontos de experiência (XP),
                                    nível atual, sequência de dias (ofensiva), capítulos concluídos,
                                    conquistas desbloqueadas e pontos de sabedoria. Esses dados são necessários
                                    para o funcionamento do sistema de gamificação.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">2.3 Dados de uso</h3>
                                <p>
                                    Registramos a data e hora das leituras concluídas e respostas de quiz para
                                    calcular pontuações e rankings semanais.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">3. Como usamos seus dados</h2>
                        <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-2">
                            <li>Manter seu progresso de leitura e gamificação entre sessões</li>
                            <li>Exibir rankings semanais por liga</li>
                            <li>Calcular conquistas e recompensas de XP</li>
                            <li>Personalizar a experiência de leitura (versão bíblica preferida)</li>
                            <li>Melhorar o funcionamento do aplicativo</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong className="text-foreground">Não vendemos, alugamos nem compartilhamos</strong> seus
                            dados pessoais com terceiros para fins comerciais.
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">4. Publicidade — Google AdSense</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Utilizamos o <strong className="text-foreground">Google AdSense</strong> para exibir anúncios.
                            O Google pode usar cookies e tecnologias similares para exibir anúncios personalizados
                            com base em suas visitas a este e outros sites.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Você pode optar por não receber anúncios personalizados acessando as
                            <a
                                href="https://adssettings.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline mx-1"
                            >
                                Configurações de anúncios do Google
                            </a>
                            ou consultando a
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline mx-1"
                            >
                                Política de Privacidade do Google
                            </a>.
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">5. Armazenamento e segurança</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Os dados são armazenados no <strong className="text-foreground">Google Firebase (Firestore)</strong>,
                            plataforma segura com criptografia em trânsito (HTTPS/TLS) e em repouso.
                            O acesso é controlado por regras de segurança que garantem que cada usuário
                            acesse apenas seus próprios dados.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            A autenticação é realizada pelo <strong className="text-foreground">Google Firebase Authentication</strong>,
                            sem que armazenemos senhas em nossos sistemas.
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">6. Seus direitos (LGPD)</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Em conformidade com a LGPD, você tem direito a:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-1 ml-2">
                            <li>Confirmar a existência de tratamento de seus dados</li>
                            <li>Acessar seus dados armazenados</li>
                            <li>Solicitar a correção de dados incompletos ou incorretos</li>
                            <li>Solicitar a exclusão de seus dados pessoais</li>
                            <li>Revogar o consentimento a qualquer momento</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed">
                            Para exercer qualquer um desses direitos, entre em contato pelo e-mail abaixo.
                            A exclusão da conta remove todos os dados de progresso permanentemente.
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">7. Retenção de dados</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Mantemos seus dados enquanto sua conta estiver ativa. Contas sem acesso por
                            mais de 2 anos podem ser removidas automaticamente. Rankings semanais são
                            redefinidos a cada semana, sem armazenamento histórico individual.
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">8. Menores de idade</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            O AnoBíblico+ não é direcionado a crianças menores de 13 anos e não coleta
                            intencionalmente dados de menores. Caso identifique que dados de um menor foram
                            coletados, entre em contato para que possamos removê-los imediatamente.
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">9. Alterações nesta política</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Podemos atualizar esta Política de Privacidade periodicamente. Alterações
                            significativas serão comunicadas por meio do próprio aplicativo. O uso
                            continuado do AnoBíblico+ após alterações constitui aceitação da nova política.
                        </p>
                    </section>

                    <section className="bg-white/70 rounded-2xl border border-secondary/20 p-6 space-y-3">
                        <h2 className="text-xl font-bold text-primary">10. Contato</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Dúvidas, solicitações ou reclamações relacionadas à privacidade podem ser
                            enviadas para:
                        </p>
                        <p className="font-semibold text-primary">
                            AnoBíblico+ — anobiblico.vercel.app
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Respondemos em até 15 dias úteis, conforme exigido pela LGPD.
                        </p>
                    </section>

                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90 transition-all text-sm"
                    >
                        Voltar ao AnoBíblico+
                    </Link>
                </div>
            </div>
        </div>
    );
}
