export interface BankQuestion {
    question: string;
    answer: string;
    distractors: [string, string];
}

/**
 * Selects `count` random questions from bank and shuffles options.
 * Returns questions with shuffled options and the correct index tracked.
 */
export interface PreparedQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export function prepareQuiz(bank: BankQuestion[], count = 3): PreparedQuestion[] {
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    return selected.map(({ question, answer, distractors }) => {
        const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
        return {
            question,
            options,
            correctIndex: options.indexOf(answer),
        };
    });
}

export function getQuizBank(bookId: string, chapter: number): BankQuestion[] | null {
    return QUIZ_BANK[bookId]?.[chapter] ?? null;
}

// ---------------------------------------------------------------------------
// Question bank — add more books/chapters over time
// ---------------------------------------------------------------------------

const QUIZ_BANK: Record<string, Record<number, BankQuestion[]>> = {
    genesis: {
        1: [
            { question: "O que Deus criou no primeiro dia?", answer: "A luz", distractors: ["Os animais", "O sol e a lua"] },
            { question: "Em qual dia Deus criou o firmamento?", answer: "No segundo dia", distractors: ["No terceiro dia", "No primeiro dia"] },
            { question: "O que Deus criou no quarto dia?", answer: "O sol, a lua e as estrelas", distractors: ["As plantas e árvores", "Os peixes e aves"] },
            { question: "O que aconteceu no sétimo dia?", answer: "Deus descansou e santificou o dia", distractors: ["Deus criou os animais", "Deus criou o homem"] },
            { question: "Em qual dia Deus criou os animais terrestres e o homem?", answer: "No sexto dia", distractors: ["No quinto dia", "No sétimo dia"] },
            { question: "O que Deus disse ser 'muito bom' ao final da criação?", answer: "Tudo o que havia feito", distractors: ["Apenas o homem", "Apenas a luz"] },
            { question: "De que forma Deus criou o homem, segundo Gênesis 1?", answer: "À sua imagem e semelhança", distractors: ["Do pó da terra", "Da água dos mares"] },
            { question: "No terceiro dia, o que Deus fez surgir das águas?", answer: "A terra seca e as plantas", distractors: ["Os peixes", "Os animais"] },
        ],
        2: [
            { question: "Como se chamava o jardim onde Deus colocou o homem?", answer: "Éden", distractors: ["Canaã", "Gosém"] },
            { question: "De onde Deus formou o homem?", answer: "Do pó da terra", distractors: ["Da água", "De uma costela"] },
            { question: "De onde Deus formou a mulher?", answer: "De uma costela de Adão", distractors: ["Do pó da terra", "Da água do rio"] },
            { question: "Qual árvore Deus proibiu o homem de comer?", answer: "A árvore do conhecimento do bem e do mal", distractors: ["A árvore da vida", "A árvore do jardim"] },
            { question: "O que Deus disse que não era bom?", answer: "O homem estar só", distractors: ["A criação dos animais", "O jardim do Éden"] },
            { question: "O que Adão fez com todos os animais que Deus trouxe a ele?", answer: "Deu nomes a eles", distractors: ["Sacrificou alguns a Deus", "Ordenou que partissem"] },
            { question: "Qual era o nome do rio que regava o jardim do Éden e se dividia em quatro?", answer: "Um rio saía do Éden e se dividia em quatro braços", distractors: ["O Eufrates era o único rio", "Havia dois rios no Éden"] },
            { question: "Por que Adão chamou a mulher de 'mulher'?", answer: "Porque foi tirada do homem", distractors: ["Porque Deus assim a nomeou", "Porque era mais forte que ele"] },
        ],
        3: [
            { question: "Que animal enganou Eva?", answer: "A serpente", distractors: ["O leão", "O corvo"] },
            { question: "O que a serpente disse que aconteceria se comessem o fruto proibido?", answer: "Que seriam como Deus, conhecendo o bem e o mal", distractors: ["Que viveriam para sempre", "Que ganhariam força"] },
            { question: "O que Adão e Eva fizeram ao perceber que estavam nus?", answer: "Costuraram folhas de figueira para cobrir-se", distractors: ["Fugiram para o rio", "Pediram perdão a Deus"] },
            { question: "Para onde Deus expulsou Adão e Eva?", answer: "Para fora do jardim do Éden", distractors: ["Para o deserto de Zurma", "Para além do rio Eufrates"] },
            { question: "O que Deus colocou para guardar o jardim após a expulsão?", answer: "Querubins e uma espada flamejante", distractors: ["Anjos sem espada", "Um muro de pedras"] },
            { question: "Qual foi a punição dada à serpente?", answer: "Rastejar no pó e haver inimizade com a mulher", distractors: ["Ser transformada em pedra", "Ser exilada para o deserto"] },
            { question: "Que nome Adão deu à sua mulher após a queda?", answer: "Eva", distractors: ["Sara", "Miriã"] },
            { question: "O que Deus fez por Adão e Eva antes de expulsá-los?", answer: "Fez vestes de peles para vesti-los", distractors: ["Deu-lhes frutos para a jornada", "Ensinou-os a plantar"] },
        ],
        4: [
            { question: "Como se chamavam os dois primeiros filhos de Adão e Eva?", answer: "Caim e Abel", distractors: ["Sete e Enos", "Noé e Sem"] },
            { question: "O que Abel ofereceu a Deus?", answer: "Primogênitos do seu rebanho", distractors: ["Frutos da terra", "Pão e vinho"] },
            { question: "O que Caim fez com Abel?", answer: "Matou-o", distractors: ["Vendeu-o como escravo", "Expulsou-o de suas terras"] },
            { question: "Para onde Caim foi após matar Abel?", answer: "Para a terra de Node", distractors: ["Para o Egito", "Para além do rio Jordão"] },
            { question: "O que Deus pôs em Caim para que ninguém o matasse?", answer: "Um sinal", distractors: ["Uma marca de fogo", "Uma coroa de espinhos"] },
            { question: "Como se chamava o filho de Caim que deu nome a uma cidade?", answer: "Enoque", distractors: ["Sete", "Lameque"] },
            { question: "Quem foi Lameque?", answer: "Descendente de Caim que tinha duas esposas", distractors: ["Filho de Abel", "Primeiro filho de Adão e Eva"] },
            { question: "Quando se começou a invocar o nome do Senhor?", answer: "Nos dias de Enos, filho de Sete", distractors: ["Nos dias de Abel", "Nos dias de Caim"] },
        ],
        5: [
            { question: "Quantos anos viveu Matusalém?", answer: "969 anos", distractors: ["930 anos", "777 anos"] },
            { question: "Quem foi levado por Deus sem passar pela morte?", answer: "Enoque", distractors: ["Noé", "Sete"] },
            { question: "Quantos anos viveu Adão ao todo?", answer: "930 anos", distractors: ["969 anos", "777 anos"] },
            { question: "Quem era o pai de Noé?", answer: "Lameque", distractors: ["Matusalém", "Enoque"] },
            { question: "Quais eram os três filhos de Noé?", answer: "Sem, Cam e Jafé", distractors: ["Caim, Abel e Sete", "Enos, Cainã e Maalaleel"] },
            { question: "Quantos anos viveu Enoque antes de ser tomado por Deus?", answer: "365 anos", distractors: ["969 anos", "500 anos"] },
            { question: "Quantos anos viveu Lameque?", answer: "777 anos", distractors: ["930 anos", "365 anos"] },
            { question: "Quantos anos tinha Noé quando gerou Sem, Cam e Jafé?", answer: "500 anos", distractors: ["300 anos", "600 anos"] },
        ],
        6: [
            { question: "Por que Deus decidiu destruir a humanidade?", answer: "A maldade dos homens era grande na terra", distractors: ["Por causa de uma grande seca", "Porque os homens não trabalhavam"] },
            { question: "Quem encontrou graça aos olhos do Senhor?", answer: "Noé", distractors: ["Enoque", "Matusalém"] },
            { question: "De que material Deus mandou Noé construir a arca?", answer: "Madeira de gofer", distractors: ["Cedro do Líbano", "Madeira de carvalho"] },
            { question: "Quantos andares tinha a arca?", answer: "Três andares", distractors: ["Dois andares", "Cinco andares"] },
            { question: "Quantos animais de cada espécie Noé devia levar para a arca?", answer: "Dois de cada espécie, macho e fêmea", distractors: ["Sete de cada espécie", "Um de cada espécie"] },
            { question: "Como Deus descreveu o coração dos homens antes do dilúvio?", answer: "Toda imaginação era má continuamente", distractors: ["Os homens eram preguiçosos", "Os homens não adoravam a Deus"] },
            { question: "Qual era o comprimento da arca?", answer: "Trezentos côvados", distractors: ["Cem côvados", "Quinhentos côvados"] },
            { question: "Além dos animais, o que Noé devia levar para a arca?", answer: "Alimento de todo tipo para si e para os animais", distractors: ["Ouro e prata", "Apenas sementes de plantas"] },
        ],
        7: [
            { question: "Por quantos dias e noites choveu sobre a terra?", answer: "Quarenta dias e quarenta noites", distractors: ["Sete dias e sete noites", "Cem dias e cem noites"] },
            { question: "Quantos anos tinha Noé quando entrou na arca?", answer: "Seiscentos anos", distractors: ["Quinhentos anos", "Setecentos anos"] },
            { question: "Dos animais limpos, quantos pares Noé devia levar?", answer: "Sete pares", distractors: ["Um par", "Dois pares"] },
            { question: "Quem fechou a porta da arca?", answer: "O próprio Senhor", distractors: ["Noé", "Os filhos de Noé"] },
            { question: "Quantos dias as águas prevaleceram sobre a terra?", answer: "Cento e cinquenta dias", distractors: ["Quarenta dias", "Um ano"] },
            { question: "O que as águas cobriram completamente?", answer: "Todos os altos montes debaixo do céu", distractors: ["Apenas os vales e planícies", "As cidades dos ímpios"] },
            { question: "Quem entrou na arca?", answer: "Noé, sua família e todos os animais conforme Deus ordenou", distractors: ["Apenas Noé e sua esposa", "Noé e todos que quiseram entrar"] },
            { question: "Quinze côvados acima dos montes subiram as águas. O que isso significa?", answer: "As águas cobriram os montes mais altos em 15 côvados", distractors: ["Os montes cresceram 15 côvados", "A arca flutuou 15 côvados acima"] },
        ],
        8: [
            { question: "Que pássaro Noé soltou primeiro da arca?", answer: "Um corvo", distractors: ["Uma pomba", "Uma águia"] },
            { question: "Qual pássaro trouxe um ramo de oliveira para Noé?", answer: "A pomba", distractors: ["O corvo", "A andorinha"] },
            { question: "Onde a arca parou após o dilúvio?", answer: "Nos montes de Ararate", distractors: ["No monte Sinai", "No monte Carmelo"] },
            { question: "O que Noé construiu logo ao sair da arca?", answer: "Um altar ao Senhor", distractors: ["Uma casa para sua família", "Uma cidade"] },
            { question: "Quantas vezes Noé soltou a pomba?", answer: "Três vezes", distractors: ["Duas vezes", "Quatro vezes"] },
            { question: "O que a pomba trouxe na segunda vez que foi soltada?", answer: "Um ramo de oliveira no bico", distractors: ["Nada, voltou vazia", "Uma folha de figueira"] },
            { question: "O que Deus prometeu após o sacrifício de Noé?", answer: "Nunca mais amaldiçoar a terra por causa do homem", distractors: ["Dar terras férteis a Noé", "Enviar anjos para guardá-los"] },
            { question: "O que aconteceu quando a pomba foi solta pela terceira vez?", answer: "Não voltou mais", distractors: ["Trouxe uma pedra", "Voltou com um peixe"] },
        ],
        9: [
            { question: "Qual sinal Deus estabeleceu como sinal da aliança com Noé?", answer: "O arco-íris nas nuvens", distractors: ["A lua cheia", "Uma estrela especial"] },
            { question: "O que Deus autorizou o homem a comer após o dilúvio?", answer: "Carne dos animais, além das plantas", distractors: ["Apenas plantas e frutos", "Apenas peixes e aves"] },
            { question: "O que Noé plantou após o dilúvio?", answer: "Uma vinha", distractors: ["Um campo de trigo", "Um jardim de oliveiras"] },
            { question: "O que aconteceu com Noé depois de beber do vinho?", answer: "Embriagou-se e ficou descoberto em sua tenda", distractors: ["Adormeceu no campo", "Dançou diante do altar"] },
            { question: "Quem cobriu a nudez de Noé com respeito?", answer: "Sem e Jafé", distractors: ["Cam", "Todos os três filhos"] },
            { question: "O que aconteceu com Canaã por causa da atitude de Cam?", answer: "Foi amaldiçoado por Noé", distractors: ["Foi expulso da família", "Ficou doente"] },
            { question: "Quantos anos viveu Noé depois do dilúvio?", answer: "Trezentos e cinquenta anos", distractors: ["Duzentos anos", "Quinhentos anos"] },
            { question: "Qual era a lei que Deus deu sobre derramar sangue humano?", answer: "Quem derramar sangue humano, pelo homem terá o seu sangue derramado", distractors: ["Seria exilado da terra", "Pagaria com seus bens"] },
        ],
        10: [
            { question: "Quem foi descrito como o primeiro homem poderoso na terra?", answer: "Ninrode", distractors: ["Jabal", "Jubal"] },
            { question: "De qual filho de Noé descende Ninrode?", answer: "De Cam, pelo filho Cuxe", distractors: ["De Sem", "De Jafé"] },
            { question: "Qual cidade foi o início do reino de Ninrode?", answer: "Babel", distractors: ["Nínive", "Ur dos Caldeus"] },
            { question: "De qual filho de Noé descendem os cananeus?", answer: "De Cam", distractors: ["De Sem", "De Jafé"] },
            { question: "De qual filho de Noé descende Israel (linha semítica)?", answer: "De Sem", distractors: ["De Cam", "De Jafé"] },
            { question: "Como é chamada a listagem de Gênesis 10?", answer: "A tabela das nações", distractors: ["O livro das genealogias", "O registro dos reinos"] },
            { question: "Qual era a profissão conhecida de Ninrode?", answer: "Era caçador poderoso diante do Senhor", distractors: ["Era rei guerreiro", "Era sacerdote e profeta"] },
            { question: "Quantos filhos de Noé têm seus descendentes listados em Gênesis 10?", answer: "Três: Sem, Cam e Jafé", distractors: ["Apenas dois: Sem e Cam", "Apenas um: Sem"] },
        ],
    },
};
