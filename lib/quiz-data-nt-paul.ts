import { BankQuestion } from "./quiz-data";

export const QUIZ_BANK_NT_PAUL: Record<string, Record<number, BankQuestion[]>> = {
    filemom: {
        1: [
            { question: "Quem escreveu a carta a Filemom?", answer: "Paulo", distractors: ["Pedro", "João"], reference: "Filemom 1:1" },
            { question: "Como Paulo se descreve no início da carta?", answer: "Prisioneiro de Cristo Jesus", distractors: ["Apóstolo das nações", "Doutor da lei"], reference: "Filemom 1:1" },
            { question: "Por quem Paulo intercede junto a Filemom?", answer: "Onésimo", distractors: ["Timóteo", "Tito"], reference: "Filemom 1:10" },
            { question: "O que o nome Onésimo significa no contexto da utilidade mencionada por Paulo?", answer: "Útil (antes inútil, agora útil)", distractors: ["Fiel", "Livre"], reference: "Filemom 1:11" },
            { question: "Como Paulo pede que Filemom receba Onésimo ao retornar?", answer: "Não como escravo, mas como irmão amado", distractors: ["Como um servo disciplinado", "Como um estranho"], reference: "Filemom 1:16" },
            { question: "O que Paulo diz sobre qualquer dano ou dívida de Onésimo?", answer: "Põe isso à minha conta", distractors: ["Ele trabalhará para pagar", "Perdoa sem restrições"], reference: "Filemom 1:18" }
        ]
    },
    "1tessalonicenses": {
        1: [
            { question: "O que Paulo menciona sobre a fé e o trabalho dos tessalonicenses?", answer: "Obra de fé e trabalho de amor", distractors: ["Riqueza e poder", "Tradição e lei"], reference: "1 Tessalonicenses 1:3" },
            { question: "Como o evangelho chegou aos tessalonicenses, além de em palavras?", answer: "Em poder e no Espírito Santo", distractors: ["Em barulho e confusão", "Em segredo e mistério"], reference: "1 Tessalonicenses 1:5" }
        ],
        2: [
            { question: "Como Paulo se comportou entre os tessalonicenses, comparando-se a uma figura familiar?", answer: "Como a mãe que amamenta seus filhos", distractors: ["Como um soldado rigoroso", "Como um rei distante"], reference: "1 Tessalonicenses 2:7" },
            { question: "Por que Paulo e seus companheiros trabalhavam noite e dia?", answer: "Para não sermos pesados a nenhum de vós", distractors: ["Para acumular riquezas", "Para construir um templo"], reference: "1 Tessalonicenses 2:9" }
        ],
        3: [
            { question: "Quem Paulo enviou para confortar e exortar os tessalonicenses na fé?", answer: "Timóteo", distractors: ["Tito", "Silas"], reference: "1 Tessalonicenses 3:2" }
        ],
        4: [
            { question: "Qual é a vontade de Deus para o crente, segundo 1 Tessalonicenses 4?", answer: "A vossa santificação", distractors: ["A vossa riqueza", "A vossa fama"], reference: "1 Tessalonicenses 4:3" },
            { question: "O que acontecerá com os mortos em Cristo quando o Senhor descer do céu?", answer: "Ressuscitarão primeiro", distractors: ["Ficarão dormindo", "Serão esquecidos"], reference: "1 Tessalonicenses 4:16" },
            { question: "Como os que ficarem vivos serão levados ao encontro do Senhor?", answer: "Arrebatados nas nuvens", distractors: ["Caminhando sobre as águas", "Em carros de fogo"], reference: "1 Tessalonicenses 4:17" }
        ],
        5: [
            { question: "Como o dia do Senhor virá?", answer: "Como o ladrão de noite", distractors: ["Com data marcada nos jornais", "Apenas no verão"], reference: "1 Tessalonicenses 5:2" },
            { question: "Qual a recomendação de Paulo sobre a oração?", answer: "Orai sem cessar", distractors: ["Orai uma vez por dia", "Orai apenas nos feriados"], reference: "1 Tessalonicenses 5:17" },
            { question: "Em que situações devemos dar graças?", answer: "Em tudo", distractors: ["Apenas nas vitórias", "Apenas quando pedirem"], reference: "1 Tessalonicenses 5:18" }
        ]
    },
    "2tessalonicenses": {
        1: [
            { question: "O que Deus retribuirá aos que atribulam os crentes?", answer: "Com tribulação", distractors: ["Com riquezas", "Com indiferença"], reference: "2 Tessalonicenses 1:6" }
        ],
        2: [
            { question: "O que deve acontecer antes da vinda do Dia do Senhor?", answer: "Venha primeiro a apostasia e se manifeste o homem do pecado", distractors: ["Haja paz mundial", "Todos se tornem ricos"], reference: "2 Tessalonicenses 2:3" },
            { question: "Como o homem do pecado é chamado em 2 Tessalonicenses 2?", answer: "Filho da perdição", distractors: ["Príncipe da paz", "Anjo de luz"], reference: "2 Tessalonicenses 2:3" }
        ],
        3: [
            { question: "Qual a regra estabelecida por Paulo sobre o trabalho?", answer: "Se alguém não quiser trabalhar, não coma também", distractors: ["Todos devem descansar sempre", "O trabalho é opcional"], reference: "2 Tessalonicenses 3:10" }
        ]
    },
    "1timoteo": {
        1: [
            { question: "Por que Cristo Jesus veio ao mundo?", answer: "Para salvar os pecadores", distractors: ["Para julgar as nações", "Para fundar um império"], reference: "1 Timóteo 1:15" }
        ],
        2: [
            { question: "Quantos mediadores há entre Deus e os homens?", answer: "Um só, Jesus Cristo homem", distractors: ["Muitos mediadores", "Três mediadores"], reference: "1 Timóteo 2:5" }
        ],
        3: [
            { question: "O que se diz daquele que deseja o episcopado?", answer: "Excelente obra deseja", distractors: ["Deseja um fardo pesado", "Deseja ser servido"], reference: "1 Timóteo 3:1" },
            { question: "Como se descreve o mistério da piedade?", answer: "Deus se manifestou em carne", distractors: ["Um segredo guardado", "Uma lenda antiga"], reference: "1 Timóteo 3:16" }
        ],
        4: [
            { question: "O que Paulo diz sobre o exercício corporal em relação à piedade?", answer: "O exercício para pouco aproveita; a piedade para tudo", distractors: ["O exercício é mais importante", "A piedade não tem utilidade física"], reference: "1 Timóteo 4:8" },
            { question: "O que Timóteo não deveria deixar ninguém desprezar?", answer: "A sua mocidade", distractors: ["A sua riqueza", "A sua descendência"], reference: "1 Timóteo 4:12" }
        ],
        5: [
            { question: "Como o crente deve tratar as mulheres idosas?", answer: "Como a mães", distractors: ["Como estranhas", "Com indiferença"], reference: "1 Timóteo 5:2" }
        ],
        6: [
            { question: "O que é a raiz de todos os males?", answer: "O amor ao dinheiro", distractors: ["A falta de conhecimento", "O excesso de trabalho"], reference: "1 Timóteo 6:10" },
            { question: "O que Paulo exorta Timóteo a combater?", answer: "O bom combate da fé", distractors: ["Os exércitos inimigos", "As tradições dos pais"], reference: "1 Timóteo 6:12" }
        ]
    },
    "2timoteo": {
        1: [
            { question: "Qual espírito Deus nos deu?", answer: "De fortaleza, de amor e de moderação", distractors: ["De temor e medo", "De dúvida e incerteza"], reference: "2 Timóteo 1:7" }
        ],
        2: [
            { question: "Como o cristão deve sofrer as aflições?", answer: "Como bom soldado de Jesus Cristo", distractors: ["Como uma vítima indefesa", "Reclamando de tudo"], reference: "2 Timóteo 2:3" },
            { question: "O que o obreiro deve fazer para ser aprovado por Deus?", answer: "Manejar bem a palavra da verdade", distractors: ["Ganhar muito dinheiro", "Ser famoso entre os homens"], reference: "2 Timóteo 2:15" }
        ],
        3: [
            { question: "Como serão os tempos nos últimos dias?", answer: "Trabalhosos (difíceis)", distractors: ["De facilidades", "De paz constante"], reference: "2 Timóteo 3:1" },
            { question: "Para que a Escritura é proveitosa?", answer: "Para ensinar, redarguir, corrigir e instruir em justiça", distractors: ["Apenas para curiosidade", "Para causar divisões"], reference: "2 Timóteo 3:16" }
        ],
        4: [
            { question: "Qual a declaração final de Paulo sobre o seu combate?", answer: "Combati o bom combate, acabei a carreira, guardei a fé", distractors: ["Perdi a batalha", "Esqueci a promessa"], reference: "2 Timóteo 4:7" }
        ]
    },
    tito: {
        1: [
            { question: "Onde Paulo deixou Tito para pôr em ordem as coisas restantes?", answer: "Creta", distractors: ["Roma", "Éfeso"], reference: "Tito 1:5" },
            { question: "O que se diz sobre todas as coisas para os puros?", answer: "Todas as coisas são puras", distractors: ["Todas as coisas são perigosas", "Tudo é permitido"], reference: "Tito 1:15" }
        ],
        2: [
            { question: "O que a graça de Deus traz ao se manifestar?", answer: "Salvação a todos os homens", distractors: ["Riqueza apenas aos judeus", "Condenação ao mundo"], reference: "Tito 2:11" }
        ],
        3: [
            { question: "Pelo que Deus nos salvou, segundo Tito 3?", answer: "Pela sua misericórdia (lavagem da regeneração)", distractors: ["Pelas obras de justiça que fizemos", "Pela nossa sabedoria"], reference: "Tito 3:5" }
        ]
    }
};
