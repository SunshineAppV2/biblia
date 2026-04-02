import { BankQuestion } from "./quiz-data";

export const QUIZ_BANK_WISDOM_MINOR: Record<string, Record<number, BankQuestion[]>> = {
    proverbios: {
        1: [
            { question: "Qual é o princípio da sabedoria?", answer: "O temor do Senhor", distractors: ["O estudo das leis", "A experiência de vida"], reference: "Provérbios 1:7" },
            { question: "Onde a sabedoria clama e levanta a sua voz?", answer: "Nas praças e lugares públicos", distractors: ["Dentro dos templos", "Apenas no coração do homem"], reference: "Provérbios 1:20" },
            { question: "O que os pecadores buscam fazer com o jovem, segundo Provérbios 1?", answer: "Atraí-lo para derramar sangue e roubar", distractors: ["Ensiná-lo a trabalhar", "Levá-lo ao deserto"], reference: "Provérbios 1:11-13" },
            { question: "O que acontecerá com aqueles que desprezam o conselho da sabedoria?", answer: "Ela se rirá da sua perdição no dia do espanto", distractors: ["Terão uma segunda chance", "Ficarão em silêncio eterno"], reference: "Provérbios 1:24-26" },
            { question: "O que o texto diz sobre o repouso dos simples?", answer: "O seu desvio os matará", distractors: ["Será doce e tranquilo", "Será breve e passageiro"], reference: "Provérbios 1:32" }
        ],
        2: [
            { question: "Como devemos buscar o entendimento?", answer: "Como a tesouros escondidos", distractors: ["Como o pão de cada dia", "Como a luz do sol"], reference: "Provérbios 2:4" },
            { question: "Quem dá a sabedoria?", answer: "O Senhor", distractors: ["Os anciãos da cidade", "O estudo constante"], reference: "Provérbios 2:6" },
            { question: "Do que a sabedoria livra o homem, segundo Provérbios 2?", answer: "Do mau caminho e da mulher estranha", distractors: ["Da pobreza extrema", "De doenças incuráveis"], reference: "Provérbios 2:12,16" },
            { question: "O que acontece com os íntegros na terra?", answer: "Habitarão nela e nela permanecerão", distractors: ["Serão levados para longe", "Sofrerão perseguição constante"], reference: "Provérbios 2:21" },
            { question: "O que o Senhor reserva para os retos?", answer: "A verdadeira sabedoria (o auxílio)", distractors: ["Grandes riquezas de ouro", "Domínio sobre todos os povos"], reference: "Provérbios 2:7" }
        ],
        3: [
            { question: "Com que o jovem deve se preocupar em não se esquecer?", answer: "Da lei e dos mandamentos do Pai", distractors: ["Das tradições dos avós", "Dos caminhos do mundo"], reference: "Provérbios 3:1" },
            { question: "Como devemos confiar no Senhor?", answer: "De todo o coração, sem estribar no próprio entendimento", distractors: ["Com metade de nossa força", "Apenas nos momentos de angústia"], reference: "Provérbios 3:5" },
            { question: "Como devemos honrar ao Senhor?", answer: "Com a nossa fazenda e as primícias de toda a renda", distractors: ["Com orações de madrugada", "Construindo templos de pedra"], reference: "Provérbios 3:9" },
            { question: "Por que o Senhor castiga o homem?", answer: "Porque o ama, como o pai ao filho", distractors: ["Para mostrar sua soberania", "Porque o homem é irrecuperável"], reference: "Provérbios 3:12" },
            { question: "O que a sabedoria é para os que a retêm?", answer: "Árvore de vida", distractors: ["Fonte de riqueza passageira", "Apenas uma lição moral"], reference: "Provérbios 3:18" },
            { question: "O que o Senhor amaldiçoa e o que Ele abençoa?", answer: "Amaldiçoa a casa do ímpio e abençoa a dos justos", distractors: ["Amaldiçoa os campos e abençoa as cidades", "Amaldiçoa os pobres e abençoa os ricos"], reference: "Provérbios 3:33" }
        ],
        4: [
            { question: "O que o pai exorta os filhos a adquirirem acima de tudo?", answer: "A sabedoria e o entendimento", distractors: ["Gado e terras", "Fama entre os povos"], reference: "Provérbios 4:5" },
            { question: "Como é a vereda dos justos?", answer: "Como a luz da aurora, que brilha mais até ser dia perfeito", distractors: ["Como um caminho estreito e escuro", "Como o curso de um rio calmo"], reference: "Provérbios 4:18" },
            { question: "Como é o caminho dos ímpios?", answer: "Como a escuridão; não sabem em que tropeçam", distractors: ["Todo cercado de espinhos", "Aparentemente largo e fácil"], reference: "Provérbios 4:19" },
            { question: "O que devemos guardar acima de todas as coisas?", answer: "O coração, porque dele procedem as saídas da vida", distractors: ["As riquezas acumuladas", "A reputação diante dos homens"], reference: "Provérbios 4:23" },
            { question: "O que devemos fazer com os nossos pés, segundo Provérbios 4?", answer: "Ponderar a vereda e evitar o mal", distractors: ["Caminhar sem olhar para trás", "Correr em busca de prazeres"], reference: "Provérbios 4:26-27" }
        ],
        5: [
            { question: "Como são descritos os lábios da mulher estranha?", answer: "Destilam favos de mel, mas o fim é amargoso", distractors: ["São duros como a pedra", "Sempre dizem a verdade"], reference: "Provérbios 5:3-4" },
            { question: "Para onde levam os pés da mulher adúltera?", answer: "Para a morte e para o inferno", distractors: ["Para a riqueza fácil", "Para o esquecimento"], reference: "Provérbios 5:5" },
            { question: "De onde o homem deve beber água, simbolizando a fidelidade?", answer: "Da sua própria cisterna e do seu poço", distractors: ["De todas as fontes que encontrar", "Apenas dos rios que correm ao norte"], reference: "Provérbios 5:15" },
            { question: "O que acontece com o homem que não aceita a disciplina?", answer: "Morrerá e se perderá na sua estultícia", distractors: ["Ficará rico mas infeliz", "Será perdoado sem consequências"], reference: "Provérbios 5:22-23" }
        ],
        6: [
            { question: "Para qual animal o preguiçoso é enviado para aprender?", answer: "Para a formiga", distractors: ["Para o leão", "Para a abelha"], reference: "Provérbios 6:6" },
            { question: "Quantas coisas o Senhor aborrece (odeia)?", answer: "Seis coisas, e a sétima Ele abomina", distractors: ["Dez mandamentos quebrados", "Três grandes pecados"], reference: "Provérbios 6:16" },
            { question: "Qual destas coisas Deus abomina, segundo a lista de Provérbios 6?", answer: "Olhos altivos e língua mentirosa", distractors: ["Pobreza e fome", "Dúvida e incerteza"], reference: "Provérbios 6:17" },
            { question: "O que a preguiça traz ao homem?", answer: "A pobreza como um ladrão", distractors: ["Tempo para meditação", "Saúde para o corpo"], reference: "Provérbios 6:11" },
            { question: "O que o mandamento e a lei são, segundo Provérbios 6?", answer: "O mandamento é lâmpada e a lei é luz", distractors: ["São fardos pesados", "São apenas conselhos antigos"], reference: "Provérbios 6:23" }
        ],
        7: [
            { question: "Como o filho deve guardar os mandamentos?", answer: "Como a menina dos olhos", distractors: ["Em um cofre de ouro", "Apenas na memória"], reference: "Provérbios 7:2" },
            { question: "Onde o jovem sem juízo foi visto passando?", answer: "Perto da esquina da mulher estranha, no crepúsculo", distractors: ["No átrio do templo", "No mercado da cidade"], reference: "Provérbios 7:8-9" },
            { question: "Como a mulher sedutora estava vestida?", answer: "Com enfeites de prostituta e astúcia de coração", distractors: ["Com vestes brancas de linho", "Com trajes de rainha"], reference: "Provérbios 7:10" },
            { question: "O que aconteceu com o jovem que seguiu a sedutora?", answer: "Foi como o boi ao matadouro", distractors: ["Tornou-se rei de sua terra", "Encontrou a felicidade plena"], reference: "Provérbios 7:22" }
        ],
        8: [
            { question: "O que a sabedoria diz que ama?", answer: "Amo os que me amam", distractors: ["Amo aos que são ricos", "Amo aos que não erram"], reference: "Provérbios 8:17" },
            { question: "Desde quando a sabedoria afirma existir em Provérbios 8?", answer: "Desde a eternidade, antes que a terra existisse", distractors: ["Desde o tempo de Moisés", "Desde que o homem pecou"], reference: "Provérbios 8:22-23" },
            { question: "Quem a sabedoria diz que encontra a vida?", answer: "O que me achar, achará a vida e o favor do Senhor", distractors: ["O que acumular muito ouro", "O que for temido pelos homens"], reference: "Provérbios 8:35" },
            { question: "Como a sabedoria descreve o seu fruto?", answer: "Melhor do que o ouro, sim, do que o ouro refinado", distractors: ["Amargo como o fel", "Doce como o mel mas passageiro"], reference: "Provérbios 8:19" }
        ],
        9: [
            { question: "Quantas colunas a sabedoria lavrou para a sua casa?", answer: "Sete colunas", distractors: ["Doze colunas", "Três colunas"], reference: "Provérbios 9:1" },
            { question: "O que a sabedoria preparou para o seu banquete?", answer: "Matou os seus animais e misturou o seu vinho", distractors: ["Apenas pão e água", "Mel e frutos do campo"], reference: "Provérbios 9:2" },
            { question: "O que acontece ao repreender o escarnecedor?", answer: "Ele te odiará", distractors: ["Ele se tornará teu amigo", "Ele te agradecerá"], reference: "Provérbios 9:8" },
            { question: "O que acontece ao repreender o sábio?", answer: "Ele te amará", distractors: ["Ele ficará ofendido", "Ele se calará para sempre"], reference: "Provérbios 9:8" },
            { question: "Como é descrita a mulher louca (estultícia)?", answer: "Alvoroçada, simples e não sabe coisa alguma", distractors: ["Sábia e silenciosa", "Rica e poderosa"], reference: "Provérbios 9:13" }
        ],
        11: [
            { question: "Como o Senhor considera a balança enganosa?", answer: "Abominação para o Senhor", distractors: ["Apenas um erro comum", "Algo tolerável na necessidade"], reference: "Provérbios 11:1" },
            { question: "Onde o texto diz que há segurança?", answer: "Na multidão de conselheiros", distractors: ["Na solidão do deserto", "No acúmulo de muitas riquezas"], reference: "Provérbios 11:14" },
            { question: "O que acontece com o que retém mais do que é justo?", answer: "É para a sua pobreza", distractors: ["Enriquece rapidamente", "Ganha o respeito de todos"], reference: "Provérbios 11:24" },
            { question: "A que é comparada a mulher formosa sem brio (discrição)?", answer: "A uma joia de ouro no focinho de uma porca", distractors: ["A uma flor que murcha rápido", "A um vaso quebrado na praça"], reference: "Provérbios 11:22" },
            { question: "O que acontece com quem confia nas suas riquezas?", answer: "Cairá", distractors: ["Sempre prosperará", "Será invejado"], reference: "Provérbios 11:28" }
        ],
        12: [
            { question: "Quem ama a correção, ama o quê?", answer: "O conhecimento", distractors: ["O sofrimento", "A solidão"], reference: "Provérbios 12:1" },
            { question: "O que é a mulher virtuosa para o seu marido?", answer: "A sua coroa", distractors: ["O seu maior fardo", "Apenas uma companheira"], reference: "Provérbios 12:4" },
            { question: "Como o caminho do louco parece ser aos seus próprios olhos?", answer: "Reto", distractors: ["Errado", "Confuso"], reference: "Provérbios 12:15" },
            { question: "O que os lábios mentirosos são para o Senhor?", answer: "Abominação", distractors: ["Apenas erros", "Algo indiferente"], reference: "Provérbios 12:22" },
            { question: "O que o homem preguiçoso não assará?", answer: "A sua caça", distractors: ["O seu pão", "A sua carne"], reference: "Provérbios 12:27" }
        ],
        13: [
            { question: "O que acontece com quem guarda a sua boca?", answer: "Guarda a sua alma", distractors: ["Não faz amigos", "Ganha segredos"], reference: "Provérbios 13:3" },
            { question: "O que a esperança adiada faz ao coração?", answer: "Adoece o coração", distractors: ["Fica mais forte", "Torna-se indiferente"], reference: "Provérbios 13:12" },
            { question: "O que acontece com quem anda com os sábios?", answer: "Ficará sábio", distractors: ["Será invejado", "Terá dificuldades"], reference: "Provérbios 13:20" },
            { question: "O que o pai que retém a vara faz ao seu filho?", answer: "Aborrece (odeia) a seu filho", distractors: ["Está sendo misericordioso", "O treina para a paz"], reference: "Provérbios 13:24" },
            { question: "A luz dos justos faz o quê?", answer: "Alegra", distractors: ["Cega os ímpios", "Fica oculta"], reference: "Provérbios 13:9" }
        ],
        14: [
            { question: "O que toda mulher sábia faz?", answer: "Edifica a sua casa", distractors: ["Trabalha incansavelmente", "Acumula bens preciosos"], reference: "Provérbios 14:1" },
            { question: "Como a estultícia da mulher tola destrói a casa?", answer: "Com as suas próprias mãos", distractors: ["Com o passar do tempo", "Com o vento forte"], reference: "Provérbios 14:1" },
            { question: "O que há num caminho que ao homem parece direito?", answer: "O seu fim são caminhos de morte", distractors: ["Um campo de flores", "Um grande segredo"], reference: "Provérbios 14:12" },
            { question: "Onde o Senhor diz que está a glória do rei?", answer: "Na multidão do povo", distractors: ["Nos seus exércitos", "No seu trono de ouro"], reference: "Provérbios 14:28" },
            { question: "O que é o temor do Senhor para quem o tem?", answer: "Fonte de vida para desviar dos laços da morte", distractors: ["Sentimento de medo constante", "Uma tradição de família"], reference: "Provérbios 14:27" }
        ],
        15: [
            { question: "O que a resposta branda faz?", answer: "Desvia o furor", distractors: ["Excita a ira", "Não faz diferença"], reference: "Provérbios 15:1" },
            { question: "Onde os olhos do Senhor estão?", answer: "Em todo lugar, contemplando os maus e os bons", distractors: ["Apenas no templo", "Apenas no céu"], reference: "Provérbios 15:3" },
            { question: "O que o coração alegre faz ao rosto?", answer: "Aformoseia o rosto", distractors: ["Faz chorar", "Torna-o sério"], reference: "Provérbios 15:13" },
            { question: "O que é melhor: um prato de hortaliça onde há amor ou um boi cevado com ódio?", answer: "O prato de hortaliça com amor", distractors: ["O boi cevado com ódio", "Ambos são iguais"], reference: "Provérbios 15:17" },
            { question: "Ao que o Senhor está longe e a quem Ele ouve a oração?", answer: "Longe dos ímpios; ouve os justos", distractors: ["Longe de todos", "Ouve a todos por igual"], reference: "Provérbios 15:29" }
        ],
        16: [
            { question: "De quem é a resposta da língua, segundo Provérbios 16?", answer: "Do Senhor", distractors: ["Do próprio homem", "Do conselho dos sábios"], reference: "Provérbios 16:1" },
            { question: "O que devemos fazer para que nossos pensamentos sejam estabelecidos?", answer: "Confiar nossas obras ao Senhor", distractors: ["Trabalhar em silêncio", "Estudar as leis"], reference: "Provérbios 16:3" },
            { question: "O que precede a ruína e a queda?", answer: "A soberba e a altivez de espírito", distractors: ["A pobreza e a fome", "O excesso de trabalho"], reference: "Provérbios 16:18" },
            { question: "Como são descritas as palavras suaves?", answer: "Favos de mel, doces para a alma e saúde para os ossos", distractors: ["Duras como o vento", "Efêmeras como a névoa"], reference: "Provérbios 16:24" },
            { question: "O que se diz sobre o homem paciente em relação ao guerreiro?", answer: "O paciente é melhor que o guerreiro", distractors: ["O guerreiro é mais importante", "Ambos ocupam o mesmo posto"], reference: "Provérbios 16:32" }
        ],
        17: [
            { question: "O que é melhor: o bocado seco com paz ou a casa cheia de iguarias com contenda?", answer: "O bocado seco com paz", distractors: ["A casa cheia com contenda", "Não importa, desde que tenha comida"], reference: "Provérbios 17:1" },
            { question: "Quando o amigo ama, segundo Provérbios 17?", answer: "Em todo o tempo", distractors: ["Apenas na alegria", "Apenas na tristeza"], reference: "Provérbios 17:17" },
            { question: "O que o coração alegre é para o homem?", answer: "Bom remédio", distractors: ["Sinal de fraqueza", "Sentimento passageiro"], reference: "Provérbios 17:22" },
            { question: "Como até o tolo pode ser tido por sábio?", answer: "Se se calar e cerra os seus lábios", distractors: ["Se falar muito", "Se vestir roupas ricas"], reference: "Provérbios 17:28" },
            { question: "O que o espírito abatido faz aos ossos?", answer: "Seca os ossos", distractors: ["Torna-os fortes", "Faz crescer"], reference: "Provérbios 17:22" }
        ],
        18: [
            { question: "O que é o nome do Senhor para o justo?", answer: "Uma torre forte", distractors: ["Um fardo pesado", "Um nome como outro qualquer"], reference: "Provérbios 18:10" },
            { question: "O que está no poder da língua?", answer: "A morte e a vida", distractors: ["Apenas o som", "O alimento"], reference: "Provérbios 18:21" },
            { question: "O que acha aquele que acha uma mulher?", answer: "Acha uma coisa boa e alcançou o favor do Senhor", distractors: ["Acha um fardo difícil", "Acha apenas companhia"], reference: "Provérbios 18:22" },
            { question: "Como o homem que tem muitos amigos deve se portar?", answer: "Amigavelmente", distractors: ["Distante para não sofrer", "Pedindo favores constantes"], reference: "Provérbios 18:24" },
            { question: "O que precede a honra?", answer: "A humildade", distractors: ["A riqueza", "A fama"], reference: "Provérbios 18:12" }
        ],
        19: [
            { question: "Do que a casa e os bens são herança?", answer: "Dos pais", distractors: ["De Deus", "De estranhos"], reference: "Provérbios 19:14" },
            { question: "De onde vem a mulher prudente?", answer: "Do Senhor", distractors: ["Dos bons costumes", "De uma família rica"], reference: "Provérbios 19:14" },
            { question: "O que faz aquele que se compadece do pobre?", answer: "Empresta ao Senhor", distractors: ["Perde seu dinheiro", "Ganha fama"], reference: "Provérbios 19:17" },
            { question: "O que acalma a ira de um homem?", answer: "A sua discrição", distractors: ["O seu grito", "A sua força física"], reference: "Provérbios 19:11" },
            { question: "O que devemos fazer com o conselho, segundo Provérbios 19, para ser sábio nos últimos dias?", answer: "Ouvir o conselho e receber a correção", distractors: ["Ignorar e seguir o coração", "Registrar em livros"], reference: "Provérbios 19:20" }
        ],
        20: [
            { question: "Como são descritos o vinho e a bebida forte?", answer: "O vinho é escarnecedor, a bebida forte, alvoroçadora", distractors: ["São remédios", "São para a alegria plena"], reference: "Provérbios 20:1" },
            { question: "O que o homem deve evitar fazer em relação aos segredos ao lidar com o mexeriqueiro?", answer: "Não se entremeter com ele", distractors: ["Contar tudo", "Ficar ouvindo por horas"], reference: "Provérbios 20:19" },
            { question: "Qual é a glória dos jovens e a beleza dos velhos?", answer: "Glória: força; beleza: canas (cabelo branco)", distractors: ["Glória: ouro; beleza: vestes", "Glória: fama; beleza: saúde"], reference: "Provérbios 20:29" },
            { question: "Quem dirige os passos do homem?", answer: "O Senhor", distractors: ["O próprio homem", "O destino"], reference: "Provérbios 20:24" },
            { question: "Como o Senhor considera dois pesos e duas medidas?", answer: "Abominação para o Senhor", distractors: ["São práticas comerciais úteis", "Apenas pecados menores"], reference: "Provérbios 20:10" }
        ],
        21: [
            { question: "Onde o coração do rei está nas mãos do Senhor?", answer: "Como correntes de águas", distractors: ["Como um livro aberto", "Como uma pedra preciosa"], reference: "Provérbios 21:1" },
            { question: "O que é mais aceitável ao Senhor do que o sacrifício?", answer: "Fazer justiça e juízo", distractors: ["Cantar louvores", "Jejuar por dias"], reference: "Provérbios 21:3" },
            { question: "O que acontece com quem tapa o ouvido ao clamor do pobre?", answer: "Também clamará e não será ouvido", distractors: ["Será perdoado se orar", "Ganha mais riquezas"], reference: "Provérbios 21:13" },
            { question: "De quem vem a vitória, embora o cavalo se prepare para a batalha?", answer: "Do Senhor", distractors: ["Do general", "Da força do cavalo"], reference: "Provérbios 21:31" },
            { question: "Melhor é morar no canto do eirado do que com qual tipo de mulher?", answer: "Mulher rixosa (briguenta)", distractors: ["Mulher preguiçosa", "Mulher pobre"], reference: "Provérbios 21:9" }
        ],
        22: [
            { question: "O que vale mais do que as muitas riquezas?", answer: "O bom nome", distractors: ["A força física", "A descendência numerosa"], reference: "Provérbios 22:1" },
            { question: "O que devemos fazer com a criança para que não se desvie quando velha?", answer: "Instruí-la no caminho em que deve andar", distractors: ["Dar-lhe tudo o que pede", "Deixá-la escolher seu caminho"], reference: "Provérbios 22:6" },
            { question: "Quem o Senhor considera como o Criador tanto do rico quanto do pobre?", answer: "O Senhor é o Criador de todos eles", distractors: ["O destino", "A natureza"], reference: "Provérbios 22:2" },
            { question: "O que acontece com o que semeia a perversidade?", answer: "Segará males", distractors: ["Prosperará na terra", "Será esquecido"], reference: "Provérbios 22:8" },
            { question: "O que o prudente faz ao ver o mal?", answer: "Esconde-se", distractors: ["Segue adiante sem medo", "Chama a atenção de todos"], reference: "Provérbios 22:3" }
        ],
        23: [
            { question: "O que o texto diz sobre o esforço para ser rico?", answer: "Não te fatigues para ser rico", distractors: ["Trabalha dia e noite por isso", "A riqueza é o único objetivo"], reference: "Provérbios 23:4" },
            { question: "O que acontece se fustigares a criança com a vara?", answer: "Ela não morrerá; livrarás a sua alma do inferno", distractors: ["Ela ficará traumatizada", "Ela fugirá de casa"], reference: "Provérbios 23:13-14" },
            { question: "O que o Pai pede ao filho no versículo 26?", answer: "Dá-me, filho meu, o teu coração", distractors: ["Dá-me as tuas riquezas", "Dá-me o teu tempo"], reference: "Provérbios 23:26" },
            { question: "Para quem são os ais, as lidas e as feridas sem causa?", answer: "Para os que se demoram perto do vinho", distractors: ["Para os que trabalham muito", "Para os que viajam longe"], reference: "Provérbios 23:29-30" },
            { question: "O que devemos fazer com the verdade?", answer: "Compra a verdade e não a vendas", distractors: ["Usa a verdade apenas quando convém", "Guarda a verdade apenas para ti"], reference: "Provérbios 23:23" }
        ],
        24: [
            { question: "Com o que se edifica a casa e com o que se estabelece?", answer: "Com a sabedoria e com a inteligência", distractors: ["Com tijolos e cimento", "Com dinheiro e ouro"], reference: "Provérbios 24:3" },
            { question: "O que se diz sobre a força de quem se mostra frouxo no dia da angústia?", answer: "A sua força é pequena", distractors: ["É um homem prudente", "Terá descanso depois"], reference: "Provérbios 24:10" },
            { question: "O que acontece com o justo quando cai sete vezes?", answer: "Levanta-se", distractors: ["Fica prostrado", "Desiste da caminhada"], reference: "Provérbios 24:16" },
            { question: "O que aconteceu com o campo do preguiçoso?", answer: "Estava todo cheio de espinhos e urtigas", distractors: ["Estava pronto para a colheita", "Foi vendido por alto preço"], reference: "Provérbios 24:30-31" },
            { question: "Não tenhas inveja de quem?", answer: "Dos homens maus", distractors: ["Dos homens ricos", "Dos reis da terra"], reference: "Provérbios 24:1" }
        ],
        25: [
            { question: "Qual é a glória de Deus e qual a dos reis?", answer: "Glória de Deus: encobrir as coisas; dos reis: esquadrinhá-las", distractors: ["Glória de Deus: criar; dos reis: destruir", "Glória de Deus: julgar; dos reis: perdoar"], reference: "Provérbios 25:2" },
            { question: "Como é a palavra dita a seu tempo?", answer: "Como maçãs de ouro em salvas de prata", distractors: ["Como chuva no deserto", "Como um grito na multidão"], reference: "Provérbios 25:11" },
            { question: "O que fazer se o inimigo tiver fome ou sede?", answer: "Dar-lhe pão e água", distractors: ["Ignorar e seguir caminho", "Alegrar-se com a sua ruína"], reference: "Provérbios 25:21" },
            { question: "Ao que o homem que não pode conter o seu espírito é comparado?", answer: "Como a cidade derrubada, que não tem muros", distractors: ["Como um leão feroz", "Como uma árvore sem folhas"], reference: "Provérbios 25:28" },
            { question: "Melhor é morar no deserto do que com qual tipo de mulher?", answer: "Rixosa e iracunda", distractors: ["Pobre e doente", "Silenciosa e triste"], reference: "Provérbios 25:24" }
        ],
        26: [
            { question: "O que se diz sobre a maldição sem causa?", answer: "Não virá (não pousará)", distractors: ["Sempre atingirá o alvo", "Afeta apenas os culpados"], reference: "Provérbios 26:2" },
            { question: "O que acontece quando não há mexeriqueiro?", answer: "Cessa a contenda", distractors: ["Aumenta a paz", "Nada muda"], reference: "Provérbios 26:20" },
            { question: "O que o texto diz sobre o homem sábio aos seus próprios olhos?", answer: "Maior esperança há para o tolo do que para ele", distractors: ["Ele governará as nações", "Ele nunca errará"], reference: "Provérbios 26:12" },
            { question: "Ao que o preguiçoso diz estar no caminho?", answer: "Um leão", distractors: ["Uma tempestade", "Muitos inimigos"], reference: "Provérbios 26:13" },
            { question: "O que acontece ao tirar a lenha do fogo?", answer: "O fogo se apagará", distractors: ["Ele queima mais forte", "Ele se torna fumaça"], reference: "Provérbios 26:20" }
        ],
        27: [
            { question: "Por que não devemos nos gloriar do dia de amanhã?", answer: "Porque não sabemos o que produzirá o dia", distractors: ["Porque o amanhã não existe", "Porque devemos focar no passado"], reference: "Provérbios 27:1" },
            { question: "O que é melhor: a repreensão aberta ou o amor encoberto?", answer: "A repreensão aberta", distractors: ["O amor encoberto", "Nenhum dos dois"], reference: "Provérbios 27:5" },
            { question: "O que o ferro faz com o ferro?", answer: "O agura (afia)", distractors: ["O destrói", "O derrete"], reference: "Provérbios 27:17" },
            { question: "Como o homem é provado, segundo Provérbios 27?", answer: "Pelos louvores que recebe", distractors: ["Pelos insultos que ouve", "Pela fome que passa"], reference: "Provérbios 27:21" },
            { question: "Leais são as feridas feitas por quem?", answer: "Pelo que ama", distractors: ["Pelo inimigo", "Pelo estranho"], reference: "Provérbios 27:6" }
        ],
        28: [
            { question: "Quem foge sem que ninguém o persiga?", answer: "O ímpio", distractors: ["O justo", "O animal feroz"], reference: "Provérbios 28:1" },
            { question: "O que acontece com quem confessa e deixa as suas transgressões?", answer: "Alcançará misericórdia", distractors: ["Será castigado publicamente", "Continuará na mesma situação"], reference: "Provérbios 28:13" },
            { question: "Quem é considerado insensato?", answer: "O que confia no seu próprio coração", distractors: ["O que ouve os pais", "O que estuda muito"], reference: "Provérbios 28:26" },
            { question: "O que acontece com quem dá ao pobre?", answer: "Não terá necessidade", distractors: ["Ficará pobre também", "Será recompensado pelos homens"], reference: "Provérbios 28:27" },
            { question: "O que acontece com quem endurece o coração?", answer: "Cairá no mal", distractors: ["Terá vida longa", "Será inabalável"], reference: "Provérbios 28:14" }
        ],
        29: [
            { question: "O que acontece com o homem que endurece a cerviz após muitas repreensões?", answer: "Será quebrantado de repente", distractors: ["Vencerá as dificuldades", "Será honrado"], reference: "Provérbios 29:1" },
            { question: "Qual o sentimento do povo quando os justos se engrandecem?", answer: "Alegria", distractors: ["Inveja", "Medo"], reference: "Provérbios 29:2" },
            { question: "O que acontece ao povo quando não há profecia?", answer: "O povo se corrompe (se desmanda)", distractors: ["O povo prospera mais", "O povo fica em paz"], reference: "Provérbios 29:18" },
            { question: "O que o temor do homem arma?", answer: "Laços (armadilhas)", distractors: ["Escudos", "Caminhos largos"], reference: "Provérbios 29:25" },
            { question: "Onde o homem que confia no Senhor estará?", answer: "Seguro", distractors: ["Longe de todos", "Sempre rico"], reference: "Provérbios 29:25" }
        ],
        30: [
            { question: "Como é descrita toda palavra de Deus?", answer: "Pura", distractors: ["Antiga", "Difícil"], reference: "Provérbios 30:5" },
            { question: "O que Agur pediu para não receber, para não se esquecer de Deus ou roubar?", answer: "Nem a pobreza nem a riqueza", distractors: ["Nem saúde nem doença", "Nem amigos nem inimigos"], reference: "Provérbios 30:8" },
            { question: "Quais são as quatro coisas pequenas que são mui sábias?", answer: "Formigas, coelhos, gafanhoto e aranha (ou lagarto)", distractors: ["Leão, águia, baleia e urso", "Bezerro, cordeiro, cabrito e pomba"], reference: "Provérbios 30:24-28" },
            { question: "O que Deus é para os que confiam Nele?", answer: "Escudo", distractors: ["Castigo", "Observador distante"], reference: "Provérbios 30:5" }
        ],
        31: [
            { question: "A favor de quem devemos abrir a boca e julgar retamente?", answer: "Do mudo e do necessitado", distractors: ["Dos reis e poderosos", "Dos que nos dão presentes"], reference: "Provérbios 31:8-9" },
            { question: "O valor da mulher virtuosa excede ao de quê?", answer: "Rubis", distractors: ["Ouro puro", "Pérolas raras"], reference: "Provérbios 31:10" },
            { question: "O que se diz sobre a graça e a formosura?", answer: "A graça é enganosa e a formosura é vaidade", distractors: ["São as coisas mais importantes", "Sempre andam juntas com a sabedoria"], reference: "Provérbios 31:30" },
            { question: "Qual mulher será louvada?", answer: "A mulher que teme ao Senhor", distractors: ["A mulher mais rica da terra", "A mulher que fala muitas línguas"], reference: "Provérbios 31:30" },
            { question: "Como a mulher virtuosa trata os pobres?", answer: "Abre a mão ao pobre e estende as mãos ao necessitado", distractors: ["Evita contato para não se contaminar", "Dá apenas o que sobra"], reference: "Provérbios 31:20" }
        ]
    },
    eclesiastes: {
        1: [
            { question: "Qual é a frase central do Pregador no início de Eclesiastes?", answer: "Vaidade de vaidades, tudo é vaidade", distractors: ["Riqueza sobre riquezas", "Paz sobre a terra"], reference: "Eclesiastes 1:2" },
            { question: "O que o texto diz sobre o surgimento de coisas novas debaixo do sol?", answer: "Nada há de novo debaixo do sol", distractors: ["Todos os dias há algo novo", "O homem inventa segredos"], reference: "Eclesiastes 1:9" },
            { question: "O que acontece com o aumento da sabedoria, segundo o Pregador?", answer: "Aumenta o enfado e a dor", distractors: ["Aumenta a alegria plena", "Traz fama imediata"], reference: "Eclesiastes 1:18" }
        ],
        2: [
            { question: "Qual foi a conclusão do Pregador sobre o riso?", answer: "É uma loucura", distractors: ["É o melhor remédio", "É necessário sempre"], reference: "Eclesiastes 2:2" },
            { question: "Onde o sábio tem os seus olhos, segundo Provérbios 2?", answer: "Na sua cabeça", distractors: ["No seu coração", "Nas suas mãos"], reference: "Eclesiastes 2:14" },
            { question: "Qual a conclusão sobre o trabalho do homem, mesmo que seja com sabedoria?", answer: "É vaidade e aflição de espírito", distractors: ["É a única salvação", "É um fardo leve"], reference: "Eclesiastes 2:17" }
        ],
        3: [
            { question: "O que há para tudo debaixo do céu?", answer: "Um tempo determinado", distractors: ["Um destino incerto", "Um acaso constante"], reference: "Eclesiastes 3:1" },
            { question: "Como Deus fez todas as coisas, segundo o versículo 11?", answer: "Formosas em seu tempo", distractors: ["Rápidas e passageiras", "Sempre iguais"], reference: "Eclesiastes 3:11" },
            { question: "O que Deus pôs no coração do homem, embora ele não possa descobrir a obra de Deus?", answer: "A eternidade (o mundo)", distractors: ["A dúvida", "O medo da morte"], reference: "Eclesiastes 3:11" }
        ],
        4: [
            { question: "Por que 'melhor são dois do que um'?", answer: "Porque têm melhor paga do seu trabalho", distractors: ["Porque fazem mais barulho", "Porque não sentem fome"], reference: "Eclesiastes 4:9" },
            { question: "O que se diz sobre o cordão de três dobras?", answer: "Não se quebra tão depressa", distractors: ["É muito pesado", "É mais caro que o de seda"], reference: "Eclesiastes 4:12" },
            { question: "Quem é melhor: o jovem pobre e sábio ou o rei velho e tolo?", answer: "O jovem pobre e sábio", distractors: ["O rei velho e tolo", "Ambos são iguais"], reference: "Eclesiastes 4:13" }
        ],
        5: [
            { question: "O que devemos fazer ao entrar na Casa de Deus?", answer: "Guardar o pé e estar pronto para ouvir", distractors: ["Falar o mais alto possível", "Trazer muitas ofertas"], reference: "Eclesiastes 5:1" },
            { question: "O que o Pregador aconselha sobre fazer votos a Deus?", answer: "Não tardes em cumpri-los", distractors: ["Podes esquecê-los", "Deus não se importa"], reference: "Eclesiastes 5:4" },
            { question: "O que acontece com quem ama o dinheiro?", answer: "Nunca se fartará de dinheiro", distractors: ["Terá paz eterna", "Será amado por todos"], reference: "Eclesiastes 5:10" }
        ],
        6: [
            { question: "O que o texto diz sobre o homem a quem Deus dá riquezas mas não lhe dá poder para comer delas?", answer: "É vaidade e mau mal", distractors: ["É um homem prudente", "É uma benção oculta"], reference: "Eclesiastes 6:2" },
            { question: "O que é melhor: o que os olhos veem ou o que a alma deseja (o vaguear do desejo)?", answer: "O que os olhos veem", distractors: ["O que a alma deseja", "Nenhum dos dois"], reference: "Eclesiastes 6:9" }
        ],
        7: [
            { question: "O que é melhor do que o melhor óleo?", answer: "O bom nome", distractors: ["A grande riqueza", "A fama mundial"], reference: "Eclesiastes 7:1" },
            { question: "Por que é melhor ir à casa onde há luto do que à de banquete?", answer: "Porque nela se vê o fim de todos os homens", distractors: ["Porque é mais silencioso", "Porque não se gasta dinheiro"], reference: "Eclesiastes 7:2" },
            { question: "O que o Pregador diz sobre o homem justo sobre a terra?", answer: "Não há homem justo que faça o bem e nunca peque", distractors: ["Existem muitos", "Deus encontrou apenas um"], reference: "Eclesiastes 7:20" }
        ],
        8: [
            { question: "O que a sabedoria faz ao rosto do homem?", answer: "Alumia o seu rosto", distractors: ["Torna-o triste", "Envelhece-o"], reference: "Eclesiastes 8:1" },
            { question: "Onde está a palavra do rei, o que há ali?", answer: "Poder", distractors: ["Dúvida", "Falsidade"], reference: "Eclesiastes 8:4" },
            { question: "Por que o coração do homem se dispõe a fazer o mal?", answer: "Porque não se executa logo o juízo sobre a má obra", distractors: ["Porque o homem nasceu assim", "Porque não há leis"], reference: "Eclesiastes 8:11" }
        ],
        9: [
            { question: "O que o texto diz sobre o cão vivo em relação ao leão morto?", answer: "Melhor é o cão vivo", distractors: ["Melhor é o leão morto", "Ambos têm o mesmo valor"], reference: "Eclesiastes 9:4" },
            { question: "Como o Pregador aconselha a fazer tudo o que vier à mão?", answer: "Faze-o conforme as tuas forças", distractors: ["Faze-o amanhã", "Pede para outro fazer"], reference: "Eclesiastes 9:10" },
            { question: "O que sucede igualmente a todos, ao justo e ao ímpio?", answer: "O mesmo sucesso (destino)", distractors: ["A mesma riqueza", "A mesma alegria"], reference: "Eclesiastes 9:2" }
        ],
        10: [
            { question: "O que faz com que o óleo do perfumador exale mau cheiro?", answer: "Moscas mortas", distractors: ["O tempo quente", "Falta de tampa"], reference: "Eclesiastes 10:1" },
            { question: "Onde está o coração do sábio?", answer: "À sua mão direita", distractors: ["À sua mão esquerda", "No seu bolso"], reference: "Eclesiastes 10:2" },
            { question: "O que o preguiçoso faz acontecer ao teto da casa?", answer: "O teto cai e a casa tem goteiras", distractors: ["O teto fica mais forte", "O teto brilha"], reference: "Eclesiastes 10:18" }
        ],
        11: [
            { question: "O que devemos fazer com o nosso pão, segundo o versículo 1?", answer: "Lança o teu pão sobre as águas", distractors: ["Guarda-o num cofre", "Dá-o apenas aos amigos"], reference: "Eclesiastes 11:1" },
            { question: "O que acontece com quem observa o vento e as nuvens?", answer: "Nunca semeará nem segará", distractors: ["Será um bom lavrador", "Saberá quando vai chover"], reference: "Eclesiastes 11:4" },
            { question: "O que o jovem deve saber enquanto se alegra na mocidade?", answer: "Que Deus o trará a juízo por todas estas coisas", distractors: ["Que a vida nunca acaba", "Que não há consequências"], reference: "Eclesiastes 11:9" }
        ],
        12: [
            { question: "Quando o jovem deve se lembrar do seu Criador?", answer: "Nos dias da sua mocidade", distractors: ["Apenas na velhice", "Quando ficar doente"], reference: "Eclesiastes 12:1" },
            { question: "Para onde o espírito volta após a morte?", answer: "Para Deus, que o deu", distractors: ["Para o vazio eterno", "Para a terra"], reference: "Eclesiastes 12:7" },
            { question: "Qual é o fim de tudo o que se tem ouvido (o dever do homem)?", answer: "Teme a Deus e guarda os seus mandamentos", distractors: ["Acumula sabedoria e riquezas", "Busca a felicidade acima de tudo"], reference: "Eclesiastes 12:13" }
        ]
    },
    cantares: {
        1: [
            { question: "Como a noiva descreve o amor do amado em relação ao vinho?", answer: "Melhor é o teu amor do que o vinho", distractors: ["O vinho é mais doce", "São iguais em prazer"], reference: "Cantares 1:2" },
            { question: "Como a noiva se descreve em relação à sua cor e beleza?", answer: "Eu sou morena, mas formosa", distractors: ["Sou pálida como o lírio", "Minha beleza é oculta"], reference: "Cantares 1:5" },
            { question: "O que as companheiras sugerem se a noiva não sabe onde o amado apascenta?", answer: "Sair pelas pisadas das ovelhas", distractors: ["Ficar à porta da cidade", "Subir ao monte mais alto"], reference: "Cantares 1:8" }
        ],
        2: [
            { question: "Com quais flores a noiva se identifica no início do capítulo 2?", answer: "A rosa de Sarom e o lírio dos vales", distractors: ["A flor do deserto", "A tulipa do campo"], reference: "Cantares 2:1" },
            { question: "A que o amado é comparado entre os filhos (jovens)?", answer: "A uma macieira entre as árvores do bosque", distractors: ["A um carvalho frondoso", "A uma videira rasteira"], reference: "Cantares 2:3" },
            { question: "O que o texto pede para ser apanhado porque danifica as vinhas?", answer: "As raposinhas", distractors: ["Os lobos", "Os pássaros"], reference: "Cantares 2:15" },
            { question: "Como o amado descreve a mudança da estação?", answer: "O inverno passou, a chuva cessou e se foi", distractors: ["O sol escaldante chegou", "As folhas caíram no chão"], reference: "Cantares 2:11" }
        ],
        3: [
            { question: "Onde a noiva buscou o seu amado durante a noite?", answer: "No seu leito", distractors: ["No jardim de especiarias", "Nas muralhas da cidade"], reference: "Cantares 3:1" },
            { question: "Quantos valentes de Israel rodeavam a liteira de Salomão?", answer: "Sessenta valentes", distractors: ["Doze valentes", "Cem valentes"], reference: "Cantares 3:7" }
        ],
        4: [
            { question: "Que frase de afirmação o amado diz sobre a perfeição da noiva?", answer: "Toda és formosa, meu amor, e em ti não há mancha", distractors: ["Tua beleza é passageira", "Teus olhos são como o sol"], reference: "Cantares 4:7" },
            { question: "A que o amado compara a noiva, simbolizando exclusividade e pureza?", answer: "Um jardim fechado, uma fonte selada", distractors: ["Um campo aberto", "Um rio caudaloso"], reference: "Cantares 4:12" },
            { question: "O que está debaixo da língua da noiva, segundo a descrição poética?", answer: "Mel e leite", distractors: ["Sabedoria e fé", "Fogo e gelo"], reference: "Cantares 4:11" }
        ],
        5: [
            { question: "O que aconteceu quando a noiva finalmente abriu a porta ao seu amado?", answer: "Ele já se tinha retirado e ido", distractors: ["Ele entrou com presentes", "Ele estava dormindo à porta"], reference: "Cantares 5:6" },
            { question: "Qual o pedido da noiva às filhas de Jerusalém caso encontrassem o amado?", answer: "Dizer que ela estava enferma de amor", distractors: ["Dizer para ele voltar logo", "Dizer que ela estava zangada"], reference: "Cantares 5:8" },
            { question: "Como o amado é descrito no final do capítulo 5?", answer: "Ele é totalmente desejável", distractors: ["Ele é o mais rico de todos", "Ele é um guerreiro terrível"], reference: "Cantares 5:16" }
        ],
        6: [
            { question: "De quem a noiva afirma ser e quem afirma ser dela?", answer: "Eu sou do meu amado, e o meu amado é meu", distractors: ["Eu sou de mim mesma", "Eu sou do mundo"], reference: "Cantares 6:3" },
            { question: "Como a noiva aparece na descrição do capítulo 6?", answer: "Como a alva do dia, formosa como a lua, brilhante como o sol", distractors: ["Como uma estrela cadente", "Como a sombra da tarde"], reference: "Cantares 6:10" }
        ],
        7: [
            { question: "O que é elogiado no primeiro versículo do capítulo 7?", answer: "A formosura dos pés nas sandálias", distractors: ["O brilho da coroa", "A força dos braços"], reference: "Cantares 7:1" },
            { question: "Para onde a noiva convida o amado para irem juntos?", answer: "Para o campo, para as aldeias", distractors: ["Para o centro do palácio", "Para a ilha distante"], reference: "Cantares 7:11" }
        ],
        8: [
            { question: "Onde a noiva deseja ser posta pelo amado?", answer: "Como selo sobre o seu coração e sobre o seu braço", distractors: ["Num trono elevado", "Em um quadro de ouro"], reference: "Cantares 8:6" },
            { question: "Quão forte é o amor, segundo o texto?", answer: "Forte como a morte", distractors: ["Leve como o vento", "Eterno como a montanha"], reference: "Cantares 8:6" },
            { question: "O que as muitas águas não podem fazer ao amor?", answer: "Não poderiam apagar o amor nas inundá-lo os rios", distractors: ["Não podem esfriar o desejo", "Não podem levar a lembrança"], reference: "Cantares 8:7" }
        ]
    }
};
