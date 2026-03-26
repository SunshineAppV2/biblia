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

// ---------------------------------------------------------------------------
// Lazy imports — each file is only loaded when needed
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EXTRA_BANKS: Array<Record<string, Record<number, BankQuestion[]>>> = [];

let _banksLoaded = false;
async function ensureBanksLoaded() {
    if (_banksLoaded) return;
    _banksLoaded = true;
    const mods = await Promise.allSettled([
        import("./quiz-data-nt-general").then(m => m.QUIZ_BANK_NT_GENERAL),
        import("./quiz-data-pentateuch").then(m => m.QUIZ_BANK_PENTATEUCH).catch(() => null),
        import("./quiz-data-hist1").then(m => m.QUIZ_BANK_HIST1).catch(() => null),
        import("./quiz-data-hist2").then(m => m.QUIZ_BANK_HIST2).catch(() => null),
        import("./quiz-data-wisdom-minor").then(m => m.QUIZ_BANK_WISDOM_MINOR).catch(() => null),
        import("./quiz-data-salmos").then(m => m.QUIZ_BANK_SALMOS).catch(() => null),
        import("./quiz-data-prophets").then(m => m.QUIZ_BANK_PROPHETS).catch(() => null),
        import("./quiz-data-gospels").then(m => m.QUIZ_BANK_GOSPELS).catch(() => null),
        import("./quiz-data-nt-paul").then(m => m.QUIZ_BANK_NT_PAUL).catch(() => null),
        import("./quiz-data-1sam").then(m => m.QUIZ_BANK_1SAM).catch(() => null),
        import("./quiz-data-2sam").then(m => m.QUIZ_BANK_2SAM).catch(() => null),
        import("./quiz-data-1reis").then(m => m.QUIZ_BANK_1REIS).catch(() => null),
    ]);
    for (const r of mods) {
        if (r.status === "fulfilled" && r.value) EXTRA_BANKS.push(r.value);
    }
}

function getAllBanks(): Array<Record<string, Record<number, BankQuestion[]>>> {
    return [QUIZ_BANK, ...EXTRA_BANKS];
}

export function getQuizBank(bookId: string, chapter: number): BankQuestion[] | null {
    for (const bank of getAllBanks()) {
        const result = bank[bookId]?.[chapter];
        if (result && result.length > 0) return result;
    }
    return null;
}

export async function getQuizBankAsync(bookId: string, chapter: number): Promise<BankQuestion[] | null> {
    await ensureBanksLoaded();
    return getQuizBank(bookId, chapter);
}

/** Returns { totalQuestions, chaptersCovered } across all static quiz bank entries. */
export function getQuizBankStats(): { totalQuestions: number; chaptersCovered: number } {
    let totalQuestions = 0;
    let chaptersCovered = 0;
    for (const bank of getAllBanks()) {
        for (const book of Object.values(bank)) {
            for (const questions of Object.values(book)) {
                chaptersCovered++;
                totalQuestions += questions.length;
            }
        }
    }
    return { totalQuestions, chaptersCovered };
}

/** Returns all bookId/chapter pairs that have static questions. */
export function getQuizBankKeys(): Array<{ bookId: string; chapter: number }> {
    const keys: Array<{ bookId: string; chapter: number }> = [];
    for (const bank of getAllBanks()) {
        for (const [bookId, chapters] of Object.entries(bank)) {
            for (const chapter of Object.keys(chapters)) {
                keys.push({ bookId, chapter: Number(chapter) });
            }
        }
    }
    return keys;
}

/** Async version — ensures all lazy banks are loaded first. */
export async function getQuizBankKeysAsync(): Promise<Array<{ bookId: string; chapter: number }>> {
    await ensureBanksLoaded();
    return getQuizBankKeys();
}

/** Async version — ensures all lazy banks are loaded first. */
export async function getQuizBankStatsAsync(): Promise<{ totalQuestions: number; chaptersCovered: number }> {
    await ensureBanksLoaded();
    return getQuizBankStats();
}

/** Returns question count for a specific bookId/chapter, across all loaded banks. */
export function getQuizBankChapterCount(bookId: string, chapter: number): number {
    for (const bank of getAllBanks()) {
        const result = bank[bookId]?.[chapter];
        if (result && result.length > 0) return result.length;
    }
    return 0;
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
        11: [
            { question: "Como se chamava o lugar onde os homens decidiram construir a torre?", answer: "Planície de Sinear", distractors: ["Vale do Jordão", "Monte Arará"] },
            { question: "Por que os homens queriam construir uma torre que chegasse ao céu?", answer: "Para fazer um nome para si e não se dispersarem", distractors: ["Para homenagear a Deus", "Para se proteger de inundações"] },
            { question: "O que Deus fez para deter a construção da torre de Babel?", answer: "Confundiu a linguagem deles", distractors: ["Destruiu a torre com fogo", "Enviou um grande vento"] },
            { question: "O que significa o nome 'Babel'?", answer: "Confusão", distractors: ["Grandeza", "Paz"] },
            { question: "Quem era o pai de Abrão?", answer: "Terá", distractors: ["Naor", "Harã"] },
            { question: "De onde Terá saiu com sua família?", answer: "De Ur dos Caldeus", distractors: ["De Harã", "De Babel"] },
            { question: "Para onde Terá planejava ir, mas parou em Harã?", answer: "Para a terra de Canaã", distractors: ["Para o Egito", "Para a Assíria"] },
            { question: "Com quantos anos morreu Terá?", answer: "Com 205 anos", distractors: ["Com 175 anos", "Com 120 anos"] },
        ],
        12: [
            { question: "O que Deus prometeu a Abrão ao chamá-lo?", answer: "Fazer dele uma grande nação e abençoá-lo", distractors: ["Dar-lhe longa vida e saúde", "Torná-lo rei de Canaã"] },
            { question: "Com quantos anos Abrão saiu de Harã?", answer: "Com 75 anos", distractors: ["Com 60 anos", "Com 90 anos"] },
            { question: "Quem acompanhou Abrão na saída de Harã?", answer: "Sarai, Ló e toda a casa que tinham adquirido", distractors: ["Apenas Sarai e seus servos", "Naor e seus filhos"] },
            { question: "Onde Deus apareceu a Abrão e prometeu dar aquela terra à sua descendência?", answer: "Em Siquém, no carvalho de Moré", distractors: ["Em Belém, no vale do Jordão", "Em Hebrom, junto ao carvalho"] },
            { question: "Por que Abrão pediu a Sarai que se apresentasse como irmã no Egito?", answer: "Tinha medo de ser morto por causa da beleza dela", distractors: ["Para enganar o faraó e ficar rico", "Porque era costume no Egito"] },
            { question: "O que o faraó deu a Abrão por causa de Sarai?", answer: "Ovelhas, bois, jumentos, servos e camelos", distractors: ["Ouro e prata", "Terras e palácios"] },
            { question: "Como Deus interveio quando Sarai estava no palácio do faraó?", answer: "Feriu o faraó e sua casa com grandes pragas", distractors: ["Enviou um anjo para avisá-la", "Falou em sonho ao faraó"] },
            { question: "Após sair do Egito, para onde Abrão foi primeiro?", answer: "Para o Neguebe, depois para Betel", distractors: ["Diretamente para Canaã", "Para Siquém"] },
        ],
        13: [
            { question: "Por que Abrão e Ló decidiram se separar?", answer: "A terra não comportava os dois — havia contenda entre os pastores", distractors: ["Deus mandou Ló para outra região", "Ló queria se tornar independente"] },
            { question: "Qual região Ló escolheu para si?", answer: "Toda a campina do Jordão, em direção a Sodoma", distractors: ["A terra de Canaã à direita", "As montanhas do Neguebe"] },
            { question: "Após a separação de Ló, o que Deus prometeu a Abrão?", answer: "Que toda a terra que ele via seria de sua descendência", distractors: ["Que teria um filho em breve", "Que seus inimigos seriam vencidos"] },
            { question: "Onde Abrão se estabeleceu após a separação de Ló?", answer: "Em Hebrom, junto ao carvalho de Manre", distractors: ["Em Betel", "Em Siquém"] },
            { question: "Como era descrita a campina do Jordão que Ló escolheu?", answer: "Toda regada, como o jardim do Senhor e como o Egito", distractors: ["Árida e pobre em pastos", "Coberta de florestas densas"] },
            { question: "Perto de qual cidade Ló armou suas tendas?", answer: "Perto de Sodoma", distractors: ["Perto de Gomorra", "Perto de Zoar"] },
            { question: "O que Deus disse sobre a descendência de Abrão em Gênesis 13?", answer: "Que seria como o pó da terra — incontável", distractors: ["Que seriam tão numerosos quanto as estrelas", "Que formariam doze tribos"] },
        ],
        14: [
            { question: "Por que Ló foi capturado?", answer: "Estava em Sodoma quando os reis a atacaram e saquearam", distractors: ["Tentou resistir sozinho ao exército inimigo", "Foi traído por seus servos"] },
            { question: "Quem foi Melquisedeque?", answer: "Rei de Salém e sacerdote do Deus Altíssimo", distractors: ["Um profeta de Canaã", "Rei de Sodoma e aliado de Abrão"] },
            { question: "O que Melquisedeque trouxe a Abrão?", answer: "Pão e vinho", distractors: ["Ouro e incenso", "Armas e provisões"] },
            { question: "Quanto do espólio Abrão deu a Melquisedeque?", answer: "O dízimo de tudo", distractors: ["A metade", "Um quinto"] },
            { question: "Por que Abrão recusou receber bens do rei de Sodoma?", answer: "Para que o rei não dissesse que tinha enriquecido Abrão", distractors: ["Porque Deus lhe ordenou recusar", "Porque já tinha riqueza suficiente"] },
            { question: "Quantos homens treinados Abrão levou para resgatar Ló?", answer: "318 homens", distractors: ["500 homens", "100 homens"] },
            { question: "Até onde Abrão perseguiu os reis que capturaram Ló?", answer: "Até Dã e depois até Hobá, ao norte de Damasco", distractors: ["Até o rio Eufrates", "Até as fronteiras do Egito"] },
        ],
        15: [
            { question: "Qual foi a primeira palavra de Deus a Abrão na visão de Gênesis 15?", answer: "Não temas, Abrão; eu sou o teu escudo", distractors: ["Levanta-te e caminha pela terra", "Obedece-me e serei teu Deus"] },
            { question: "Com o que Deus comparou a descendência de Abrão?", answer: "Com as estrelas do céu", distractors: ["Com as areias do mar", "Com o pó da terra"] },
            { question: "O que Deus considerou a Abrão como justiça?", answer: "Sua fé no Senhor", distractors: ["Seus sacrifícios e ofertas", "Sua obediência ao deixar Ur"] },
            { question: "Que animais Abrão usou no ritual da aliança?", answer: "Uma novilha, uma cabra, um carneiro, uma rola e um pombinho", distractors: ["Um boi, um cordeiro e uma pomba", "Doze carneiros e doze pombas"] },
            { question: "O que passou entre os pedaços dos animais ao firmar a aliança?", answer: "Uma labareda de fogo", distractors: ["A presença de um anjo", "Um forte vento do norte"] },
            { question: "Por quantos anos Deus disse que a descendência de Abrão seria escrava numa terra estranha?", answer: "Quatrocentos anos", distractors: ["Quarenta anos", "Duzentos anos"] },
            { question: "Qual terra Deus prometeu à descendência de Abrão na aliança?", answer: "Desde o rio do Egito até o grande rio Eufrates", distractors: ["Apenas a terra de Canaã", "O Egito e a terra de Canaã"] },
        ],
        16: [
            { question: "Como se chamava a serva egípcia de Sarai?", answer: "Agar", distractors: ["Zilpa", "Bila"] },
            { question: "Por que Sarai deu Agar a Abrão?", answer: "Porque era estéril e queria filhos por meio da serva", distractors: ["Porque Deus assim ordenou", "Para pagar uma dívida a Abrão"] },
            { question: "O que Agar fez quando ficou grávida?", answer: "Desprezou Sarai, sua senhora", distractors: ["Fugiu para o Egito imediatamente", "Pediu liberdade a Abrão"] },
            { question: "Onde o anjo do Senhor encontrou Agar quando ela fugiu?", answer: "Junto a uma fonte de água no deserto, perto de Sur", distractors: ["Às margens do rio Nilo", "No vale de Hebrom"] },
            { question: "Que nome Agar deu à fonte onde encontrou o anjo?", answer: "Beer-laai-roí", distractors: ["Betel", "Massá"] },
            { question: "Que nome Deus mandou Agar dar ao filho?", answer: "Ismael", distractors: ["Isaque", "Eliézer"] },
            { question: "Quantos anos tinha Abrão quando Ismael nasceu?", answer: "86 anos", distractors: ["99 anos", "75 anos"] },
            { question: "O que o anjo disse sobre o caráter de Ismael?", answer: "Seria um homem selvagem, sua mão contra todos e a mão de todos contra ele", distractors: ["Seria um grande rei sobre muitas nações", "Seria um sábio e pacífico líder"] },
        ],
        17: [
            { question: "Por que Deus mudou o nome 'Abrão' para 'Abraão'?", answer: "Porque o tornaria pai de muitas nações", distractors: ["Porque ele foi fiel na aliança da circuncisão", "Para marcar sua saída de Ur"] },
            { question: "Qual sinal Deus estabeleceu para a aliança com Abraão?", answer: "A circuncisão", distractors: ["O sacrifício anual de um carneiro", "Um altar de pedras não talhadas"] },
            { question: "Por que Deus mudou o nome 'Sarai' para 'Sara'?", answer: "Porque a abençoaria e ela seria mãe de nações", distractors: ["Porque ela obedeceu à ordem da circuncisão", "Para marcar os 90 anos de idade dela"] },
            { question: "Quantos anos tinha Abraão quando recebeu a aliança da circuncisão?", answer: "99 anos", distractors: ["75 anos", "86 anos"] },
            { question: "O que Abraão fez ao ouvir que Sara teria um filho?", answer: "Prostrou-se e riu, dizendo em seu coração que isso era impossível", distractors: ["Chorou de alegria", "Saiu imediatamente para anunciar a notícia"] },
            { question: "Qual aliança Deus prometeu estabelecer com Isaque?", answer: "A aliança eterna, como com Abraão", distractors: ["Uma aliança menor que a de Abraão", "Uma aliança apenas com os descendentes de Isaque"] },
            { question: "Com quantos anos os homens da casa de Abraão foram circuncidados?", answer: "Abraão tinha 99 e Ismael 13 anos no mesmo dia", distractors: ["Todos tinham a mesma idade", "Isaque e Ismael foram circuncidados juntos"] },
        ],
        18: [
            { question: "Quantos visitantes apareceram a Abraão junto aos carvalhos de Manre?", answer: "Três homens", distractors: ["Dois anjos e o Senhor", "Doze anjos"] },
            { question: "O que Sara fez quando ouviu que teria um filho?", answer: "Riu dentro de si", distractors: ["Chorou de alegria", "Saiu correndo para contar a Abraão"] },
            { question: "Por que o Senhor disse que visitaria Sodoma?", answer: "Para ver se o clamor contra ela era verdadeiro", distractors: ["Para destruí-la imediatamente", "Para oferecer perdão aos seus habitantes"] },
            { question: "A partir de quantos justos Abraão fez Deus prometer não destruir Sodoma?", answer: "Dez justos", distractors: ["Cinquenta justos", "Um único justo"] },
            { question: "Qual era o clamor que chegou até Deus sobre Sodoma e Gomorra?", answer: "Era grande e o seu pecado, muito grave", distractors: ["Eles adoravam ídolos de ouro", "Oprimiam os estrangeiros"] },
            { question: "O que Sara preparou para os visitantes?", answer: "Abraão matou um novilho e Sara fez pães", distractors: ["Apenas água e frutos secos", "Um banquete de sete pratos"] },
            { question: "O que o visitante prometeu sobre Sara?", answer: "Que na mesma época do ano seguinte ela teria um filho", distractors: ["Que ainda naquele ano teria o filho", "Que teria um filho assim que voltasse a ser jovem"] },
        ],
        19: [
            { question: "O que os anjos ordenaram a Ló que fizesse?", answer: "Sair da cidade com sua família antes da destruição", distractors: ["Permanecer em casa de portas fechadas", "Advertir os habitantes de Sodoma"] },
            { question: "O que aconteceu com a mulher de Ló?", answer: "Olhou para trás e transformou-se em estátua de sal", distractors: ["Morreu nas chamas ao sair tarde", "Foi levada pelos anjos de volta à cidade"] },
            { question: "Para qual cidade Ló pediu para fugir em vez do monte?", answer: "Zoar", distractors: ["Gomorra", "Belém"] },
            { question: "Como Deus destruiu Sodoma e Gomorra?", answer: "Com enxofre e fogo do céu", distractors: ["Com uma grande inundação", "Com um terremoto e fogo"] },
            { question: "De onde Abraão viu a fumaça subindo como fumaça de uma fornalha?", answer: "Do lugar onde havia estado diante do Senhor", distractors: ["Do alto do monte Sinai", "Da cidade de Hebrom"] },
            { question: "Por que Deus se lembrou de Abraão ao livrar Ló?", answer: "Tirou Ló do meio da destruição, lembrando-se de Abraão", distractors: ["Porque Ló era o mais justo da cidade", "Porque Ló havia feito sacrifícios a Deus"] },
            { question: "O que os filhos que nasceram do relacionamento de Ló com suas filhas se tornaram?", answer: "Os antepassados de Moabe e Amom", distractors: ["Os antepassados dos filisteus", "Os antepassados dos edomitas"] },
        ],
        20: [
            { question: "Para onde Abraão foi após a destruição de Sodoma?", answer: "Para a região entre Cades e Sur, morou em Gerar", distractors: ["Voltou para Harã", "Desceu para o Egito"] },
            { question: "Quem era Abimeleque?", answer: "Rei de Gerar", distractors: ["Rei dos filisteus na época de Davi", "Sacerdote cananeu"] },
            { question: "O que Deus disse a Abimeleque em sonho sobre Sara?", answer: "Que ela era mulher casada e que ele seria morto se a retivesse", distractors: ["Que ela era irmã de Abraão", "Que Abraão seria punido por sua mentira"] },
            { question: "Como Abimeleque se defendeu diante de Deus?", answer: "Disse que agiu com coração íntegro e mãos limpas", distractors: ["Disse que era rei e tinha direito", "Prometeu um grande sacrifício"] },
            { question: "O que Abraão disse sobre Sara para Abimeleque?", answer: "Que ela era sua irmã — o que era parcialmente verdade", distractors: ["Que ela era viúva de um amigo", "Que ela era serva de Deus"] },
            { question: "O que Abraão recebeu de Abimeleque?", answer: "Ovelhas, bois, servos e mil moedas de prata", distractors: ["Terras e um poço de água", "Ouro e pedras preciosas"] },
            { question: "Qual bênção Abraão trouxe sobre a casa de Abimeleque?", answer: "Orou a Deus e as mulheres voltaram a ter filhos", distractors: ["Abençoou os campos com chuva", "Livrou-os de uma praga de gafanhotos"] },
        ],
        21: [
            { question: "Como se chamou o filho que Sara teve?", answer: "Isaque", distractors: ["Ismael", "Jacó"] },
            { question: "O que o nome 'Isaque' significa?", answer: "Riso", distractors: ["Prometido de Deus", "Filho da aliança"] },
            { question: "Com quantos anos Abraão circuncidou Isaque?", answer: "Com oito dias de vida", distractors: ["Com trinta dias", "Com um ano"] },
            { question: "Por que Sara pediu que Abraão expulsasse Agar e Ismael?", answer: "Porque Ismael zombava de Isaque", distractors: ["Porque Agar tentou matar Isaque", "Por ciúmes dos bens que Agar receberia"] },
            { question: "O que o anjo disse a Agar no deserto quando a água acabou?", answer: "Que Deus ouviu o choro do menino e mostraria um poço", distractors: ["Que deveriam voltar à casa de Abraão", "Que o menino morreria mas seu espírito viveria"] },
            { question: "Qual aliança Abraão fez com Abimeleque em Berseba?", answer: "Uma aliança de paz sobre o poço que Abraão cavou", distractors: ["Uma aliança de não guerrear por cinquenta anos", "Uma aliança de comércio e fronteiras"] },
            { question: "O que significa o nome 'Berseba'?", answer: "Poço do juramento", distractors: ["Fonte da paz", "Terra dos filisteus"] },
        ],
        22: [
            { question: "O que Deus pediu a Abraão que fizesse com Isaque?", answer: "Que o oferecesse em holocausto no monte Moriá", distractors: ["Que o enviasse para estudar com Melquisedeque", "Que o desse como servo ao sacerdote"] },
            { question: "O que Isaque carregou na subida ao monte?", answer: "A lenha para o holocausto", distractors: ["O altar e as pedras", "O fogo e a faca"] },
            { question: "O que Deus proveu no lugar de Isaque?", answer: "Um carneiro preso pelos chifres num matagal", distractors: ["Um cordeiro branco sem mancha", "Uma novilha de três anos"] },
            { question: "Que nome Abraão deu ao lugar do sacrifício?", answer: "Jeová-Jirê (O Senhor proverá)", distractors: ["Betel (Casa de Deus)", "Peniel (Face de Deus)"] },
            { question: "O que o anjo disse a Abraão após ele não poupar seu filho?", answer: "Que Deus o abençoaria e multiplicaria sua descendência como as estrelas", distractors: ["Que Isaque se tornaria rei de Canaã", "Que todos os seus inimigos seriam destruídos ainda em vida"] },
            { question: "Por que o anjo disse que Abraão seria abençoado?", answer: "Porque obedeceu à voz de Deus e não reteve seu único filho", distractors: ["Porque construiu um altar perfeito", "Porque caminhou quarenta dias sem reclamar"] },
            { question: "O que Abraão respondeu a Isaque quando perguntou sobre o cordeiro para o holocausto?", answer: "Que Deus mesmo providenciaria o cordeiro", distractors: ["Que o carneiro estava amarrado mais adiante", "Que o sacrifício seria diferente desta vez"] },
        ],
        23: [
            { question: "Com quantos anos morreu Sara?", answer: "127 anos", distractors: ["90 anos", "137 anos"] },
            { question: "Onde Sara morreu?", answer: "Em Quiriate-Arba, que é Hebrom", distractors: ["Em Berseba", "Em Gerar"] },
            { question: "Que campo Abraão comprou para sepultar Sara?", answer: "O campo de Macpela, com a caverna, de Efrom o heteu", distractors: ["O campo de Manre, junto aos carvalhos", "O campo de Moriá, onde ofereceu Isaque"] },
            { question: "Quanto Abraão pagou pelo campo de Macpela?", answer: "Quatrocentas moedas de prata", distractors: ["Mil moedas de ouro", "Cinquenta moedas de prata"] },
            { question: "Como se chamava o dono do campo que Abraão comprou?", answer: "Efrom, filho de Zoar, o heteu", distractors: ["Abimeleque, rei de Gerar", "Hamor, príncipe dos heveus"] },
            { question: "Por que a compra do campo foi feita formalmente diante das testemunhas?", answer: "Para que Abraão tivesse posse legal reconhecida pelos filhos de Hete", distractors: ["Por exigência da lei de Canaã", "Para que ninguém contestasse o preço pago"] },
        ],
        24: [
            { question: "Para onde Abraão enviou seu servo a buscar esposa para Isaque?", answer: "Para sua terra natal, a Mesopotâmia, à cidade de Naor", distractors: ["Para o Egito", "Para a terra dos filisteus"] },
            { question: "Qual sinal o servo pediu a Deus para identificar a esposa certa?", answer: "Que a moça que oferecesse água a ele e aos camelos fosse a escolhida", distractors: ["Que a moça cantasse uma canção específica", "Que a moça aparecesse de véu branco"] },
            { question: "Como se chamava a esposa que Deus indicou para Isaque?", answer: "Rebeca", distractors: ["Lia", "Raquel"] },
            { question: "De quem Rebeca era filha e neta?", answer: "Filha de Betuel e neta de Naor, irmão de Abraão", distractors: ["Filha de Labão e neta de Betuel", "Filha de Hamor e neta de Efrom"] },
            { question: "O que Isaque fez ao receber Rebeca?", answer: "Amou-a e se consolou da morte de sua mãe", distractors: ["Festejou por sete dias", "Ofereceu um sacrifício a Deus"] },
            { question: "O que o servo fez ao chegar ao poço antes de falar com alguém?", answer: "Orou a Deus pedindo direção e um sinal", distractors: ["Descansou por três dias", "Anunciou sua missão à cidade"] },
            { question: "O que o pai e irmão de Rebeca disseram ao ouvir tudo o que o servo contou?", answer: "Isso vem do Senhor — não podemos dizer nem sim nem não", distractors: ["Precisamos perguntar a Rebeca antes de decidir", "Aceitamos, desde que recebamos boa compensação"] },
        ],
        25: [
            { question: "Com quantos anos Abraão morreu?", answer: "175 anos", distractors: ["160 anos", "200 anos"] },
            { question: "Quem eram os gêmeos filhos de Isaque e Rebeca?", answer: "Esaú e Jacó", distractors: ["Rubem e Simeão", "Sem e Cam"] },
            { question: "Por que os gêmeos brigavam no ventre de Rebeca?", answer: "Deus revelou que duas nações lutariam no ventre dela", distractors: ["Rebeca estava doente", "Era um sinal de punição divina"] },
            { question: "Como Esaú era descrito ao nascer?", answer: "Ruivo e todo coberto de pelo", distractors: ["Loiro e com olhos claros", "Moreno e de estatura alta"] },
            { question: "Por que Esaú vendeu seu direito de primogenitura?", answer: "Estava com fome e queria o caldo vermelho de Jacó", distractors: ["Precisava de dinheiro para uma viagem", "Jacó o ameaçou com uma espada"] },
            { question: "Por quanto Esaú vendeu sua primogenitura?", answer: "Por um prato de lentilhas e pão", distractors: ["Por dez moedas de prata", "Por um carneiro e vinho"] },
            { question: "Quantos anos tinha Isaque quando Esaú e Jacó nasceram?", answer: "60 anos", distractors: ["40 anos", "75 anos"] },
            { question: "Onde foi enterrado Abraão?", answer: "Na caverna de Macpela, junto a Sara", distractors: ["No monte Moriá", "Em Berseba"] },
        ],
        26: [
            { question: "Por que Isaque foi para Gerar e não para o Egito durante a fome?", answer: "O Senhor apareceu e ordenou que não fosse ao Egito", distractors: ["Os egípcios não recebiam estrangeiros", "O caminho para o Egito estava bloqueado"] },
            { question: "O que Isaque disse sobre Rebeca aos homens de Gerar?", answer: "Que era sua irmã, pois tinha medo de ser morto por ela", distractors: ["Que era sua serva fiel", "Que era viúva de seu irmão"] },
            { question: "O que Isaque semeou naquele ano de fome e colheu?", answer: "Cem vezes mais, pois o Senhor o abençoou", distractors: ["Apenas o suficiente para sua família", "Uma colheita razoável para o tempo"] },
            { question: "Por que os filisteus pediram a Isaque que fosse embora?", answer: "Porque ele havia enriquecido muito e eles tinham inveja", distractors: ["Porque Isaque atacou suas cidades", "Por causa de um litígio de terras"] },
            { question: "Por que Esaú foi uma mágoa para Isaque e Rebeca?", answer: "Casou com mulheres hetéias", distractors: ["Abandonou a família para morar sozinho", "Tornou-se adorador de ídolos cananeus"] },
            { question: "O que Deus reafirmou a Isaque em Gerar?", answer: "A mesma aliança feita com Abraão: multiplicar e abençoar sua descendência", distractors: ["Uma nova aliança diferente da de Abraão", "Que Isaque seria mais abençoado que Abraão"] },
        ],
        27: [
            { question: "Por que Isaque queria abençoar Esaú antes de morrer?", answer: "Era velho e seus olhos estavam fracos — não sabia quando morreria", distractors: ["Deus ordenou que benzesse o primogênito primeiro", "Era costume abençoar ao completar 100 anos"] },
            { question: "Quem tramou para que Jacó recebesse a bênção de Isaque?", answer: "Rebeca, mãe de Jacó", distractors: ["Jacó por conta própria", "Um servo da casa"] },
            { question: "Como Jacó se disfarçou para enganar Isaque?", answer: "Colocou peles de cabritos nos braços e pescoço e vestes de Esaú", distractors: ["Pintou a pele de vermelho como Esaú", "Usou barba postiça e roupas pesadas"] },
            { question: "O que Isaque percebeu que era estranho quando Jacó entrou?", answer: "A voz era de Jacó mas as mãos eram de Esaú", distractors: ["O cheiro era de Jacó, não de Esaú", "O passo era mais leve que de Esaú"] },
            { question: "O que aconteceu quando Esaú voltou e descobriu que Jacó roubou a bênção?", answer: "Esaú chorou em alta voz e pediu também uma bênção", distractors: ["Atacou Jacó imediatamente", "Declarou a bênção inválida diante de Isaque"] },
            { question: "O que Esaú planejou fazer após a morte de Isaque?", answer: "Matar Jacó", distractors: ["Expulsar Jacó de Canaã", "Reclamar as bênçãos na presença de testemunhas"] },
            { question: "Para onde Rebeca mandou Jacó fugir?", answer: "Para a casa de Labão, irmão dela, em Harã", distractors: ["Para o Egito, com o servo fiel de Abraão", "Para a terra dos heveus a leste"] },
        ],
        28: [
            { question: "O que Jacó viu em sonho em Betel?", answer: "Uma escada que ia da terra ao céu com anjos subindo e descendo", distractors: ["Um grande fogo e a voz de Deus", "Uma nuvem com a glória do Senhor"] },
            { question: "O que Deus prometeu a Jacó no sonho de Betel?", answer: "Dar-lhe a terra, multiplicar sua descendência e estar com ele onde fosse", distractors: ["Torná-lo rei de Canaã logo que retornasse", "Abençoá-lo desde que não se casasse com cananeia"] },
            { question: "O que Jacó fez com a pedra que estava sob sua cabeça ao acordar?", answer: "Levantou-a como memorial e derramou azeite sobre ela", distractors: ["Atirou-a para marcar a saída da terra", "Construiu com ela um altar e fez sacrifício"] },
            { question: "Que nome Jacó deu ao lugar onde sonhou?", answer: "Betel (Casa de Deus)", distractors: ["Peniel (Face de Deus)", "Moriá (Visto por Deus)"] },
            { question: "O que Jacó prometeu em voto a Deus?", answer: "Se Deus o guardasse e trouxesse de volta, o Senhor seria seu Deus e ele daria o dízimo", distractors: ["Que construiria um templo em Betel ao retornar", "Que não comeria carne até voltar a Canaã"] },
            { question: "Por que Isaque mandou Jacó não se casar com mulher cananeia?", answer: "Queria que ele se casasse com filha de Labão, irmão de Rebeca", distractors: ["As cananéias adoravam ídolos", "Era a lei da aliança com Abraão"] },
        ],
        29: [
            { question: "Quem eram as duas filhas de Labão com as quais Jacó conviveu?", answer: "Lia e Raquel", distractors: ["Sara e Rebeca", "Débora e Miriã"] },
            { question: "Por quantos anos Jacó trabalhou para casar com Raquel?", answer: "Sete anos — e pareceram poucos por amá-la", distractors: ["Três anos", "Quatorze anos na primeira vez"] },
            { question: "Qual engano Labão fez com Jacó na noite do casamento?", answer: "Deu Lia em vez de Raquel", distractors: ["Pediu mais sete anos antes de dar Raquel", "Substituiu Raquel por uma serva disfarçada"] },
            { question: "Quantos anos no total Jacó trabalhou para ter as duas filhas de Labão?", answer: "Quatorze anos", distractors: ["Dez anos", "Vinte anos"] },
            { question: "Quem Deus abriu o ventre para ter filhos primeiro — Lia ou Raquel?", answer: "Lia, porque era a desprezada", distractors: ["Raquel, a amada", "Ambas engravidaram ao mesmo tempo"] },
            { question: "Como se chamaram os primeiros quatro filhos de Lia?", answer: "Rubem, Simeão, Levi e Judá", distractors: ["Gade, Aser, Issacar e Zebulom", "José, Benjamim, Dã e Naftali"] },
            { question: "Como Raquel se sentiu por não ter filhos?", answer: "Com inveja de sua irmã Lia e disse a Jacó: dá-me filhos ou morro", distractors: ["Alegre e confiante que Deus proveria a seu tempo", "Triste mas em paz com a vontade de Deus"] },
        ],
        30: [
            { question: "Qual filho de Raquel foi o primeiro que ela teve de Jacó?", answer: "José", distractors: ["Benjamim", "Dã"] },
            { question: "Com quantos filhos Jacó pediu permissão para partir para sua terra?", answer: "Tinha onze filhos naquele momento", distractors: ["Seis filhos", "Doze filhos"] },
            { question: "Como Jacó enriqueceu às custas de Labão com o rebanho?", answer: "Separou para si os animais malhados e pintados, conforme acordo, usando varas", distractors: ["Comprou o gado mais forte com seu salário", "Labão deu metade do rebanho como presente"] },
            { question: "Que acordo Jacó fez com Labão sobre o salário?", answer: "Ficaria com os animais malhados e pintados que nascessem", distractors: ["Receberia um terço do rebanho ao ano", "Ficaria com os mais fortes e saudáveis"] },
            { question: "Quais servos Lia e Raquel deram a Jacó para ter mais filhos?", answer: "Zilpa (de Lia) e Bila (de Raquel)", distractors: ["Agar e Quetura", "Nenhuma, pois era proibido"] },
            { question: "Pelo que Lia 'comprou' Jacó por uma noite?", answer: "Por mandrágoras que Rubem encontrou no campo", distractors: ["Por um carneiro de Raquel", "Por joias de ouro que possuía"] },
        ],
        31: [
            { question: "Por que Jacó decidiu fugir de Labão secretamente?", answer: "O rosto de Labão não era mais o mesmo com ele, e Deus ordenou que partisse", distractors: ["Labão ameaçou ficar com seus filhos", "Os servos de Labão tentaram roubar seu rebanho"] },
            { question: "O que Raquel roubou ao sair da casa de Labão?", answer: "Os ídolos domésticos de seu pai", distractors: ["Ouro e prata da câmara de Labão", "Os melhores animais do rebanho"] },
            { question: "O que Deus disse a Labão em sonho quando ele perseguiu Jacó?", answer: "Que não dissesse nem bem nem mal a Jacó", distractors: ["Que Jacó tinha razão em partir", "Que devolvesse os ídolos e deixasse Jacó ir"] },
            { question: "Que monumento Jacó e Labão erigiram ao firmar o acordo de paz?", answer: "Um monte de pedras como testemunha da aliança", distractors: ["Um altar para oferecer sacrifício", "Uma árvore plantada como memória"] },
            { question: "Como se chamou o lugar onde Jacó e Labão fizeram a aliança?", answer: "Galeede ou Mizpá", distractors: ["Betel", "Peniel"] },
            { question: "Por quantas vezes Labão havia mudado o salário de Jacó?", answer: "Dez vezes", distractors: ["Três vezes", "Sete vezes"] },
        ],
        32: [
            { question: "Com quem Jacó lutou a noite toda junto ao vau de Jaboque?", answer: "Com um homem — o anjo do Senhor", distractors: ["Com Esaú e seus servos", "Com um líder dos cananeus"] },
            { question: "Que nome o anjo deu a Jacó após a luta?", answer: "Israel — porque lutou com Deus e com homens e prevaleceu", distractors: ["Abrão — porque seria pai de muitas nações", "Peniel — porque viu a face de Deus"] },
            { question: "O que ficou machucado em Jacó após a luta?", answer: "A articulação do quadril foi deslocada", distractors: ["O braço direito foi quebrado", "Perdeu a visão de um olho"] },
            { question: "Que nome Jacó deu ao lugar da luta?", answer: "Peniel (Face de Deus), pois viu a Deus face a face e sobreviveu", distractors: ["Betel (Casa de Deus)", "Galeede (Monte da Testemunha)"] },
            { question: "Quantos homens vinham com Esaú ao encontro de Jacó?", answer: "Quatrocentos homens", distractors: ["Cinquenta homens", "Mil homens"] },
            { question: "Como Jacó organizou sua família antes de encontrar Esaú?", answer: "Colocou as servas e seus filhos na frente, Lia depois, e Raquel e José por último", distractors: ["Mandou todos adiante e ficou sozinho", "Colocou Raquel e José na frente como favoritos"] },
        ],
        33: [
            { question: "Como Esaú reagiu ao encontrar Jacó?", answer: "Correu ao encontro, abraçou-o, lançou-se sobre o pescoço e o beijou", distractors: ["Exigiu que Jacó devolvesse a bênção", "Ficou em silêncio e desconfiado"] },
            { question: "Quantas vezes Jacó se prostrou antes de chegar a Esaú?", answer: "Sete vezes", distractors: ["Três vezes", "Uma vez"] },
            { question: "Onde Jacó comprou um pedaço de terra após encontrar Esaú?", answer: "Em Siquém, dos filhos de Hamor", distractors: ["Em Hebrom, dos filhos de Hete", "Em Betel, dos cananeus"] },
            { question: "O que Jacó construiu em Siquém?", answer: "Um altar chamado El-Elohé-Israel", distractors: ["Uma cidade para sua família", "Uma torre de vigilância"] },
            { question: "Para onde Esaú voltou após encontrar Jacó?", answer: "Para Seir", distractors: ["Para Hebrom", "Para Gerar"] },
            { question: "Por que Jacó recusou a companhia de Esaú na viagem?", answer: "As crianças eram frágeis e o rebanho lento — não podiam marchar rápido", distractors: ["Não confiava plenamente em Esaú ainda", "Deus ordenou que viajasse sozinho"] },
        ],
        34: [
            { question: "O que Siquém, filho de Hamor, fez com Diná, filha de Jacó?", answer: "A humilhou (violou)", distractors: ["Quis desposá-la sem o consentimento da família", "A sequestrou para casar por força"] },
            { question: "Qual foi a condição que os filhos de Jacó impuseram para aceitar o casamento?", answer: "Que todos os homens de Siquém fossem circuncidados", distractors: ["Que Hamor pagasse cem ovelhas como dote", "Que Siquém vivesse na tenda de Jacó por um ano"] },
            { question: "O que Simeão e Levi fizeram quando os homens de Siquém ainda estavam com dores?", answer: "Mataram todos os homens da cidade com a espada", distractors: ["Roubaram o rebanho e fugiram", "Resgataram Diná e fugiram sem violência"] },
            { question: "Como Jacó reagiu à vingança de Simeão e Levi?", answer: "Ficou com medo de represálias dos cananeus e ferezeus", distractors: ["Os elogiou por defender a honra da irmã", "Os expulsou da família"] },
            { question: "O que os outros filhos de Jacó fizeram após o massacre?", answer: "Saquearam a cidade, tomaram mulheres, filhos e rebanhos", distractors: ["Fugiram imediatamente com Diná", "Enterraram os mortos e pediram desculpas"] },
        ],
        35: [
            { question: "O que Jacó fez com os ídolos estrangeiros antes de ir a Betel?", answer: "Mandou que sua casa os entregasse e os enterrou sob um carvalho", distractors: ["Destruiu-os no fogo", "Devolveu-os a Labão pelos servos"] },
            { question: "O que Deus confirmou para Jacó em Betel?", answer: "Que seu nome seria Israel e que a terra seria de sua descendência", distractors: ["Que seu filho mais velho seria o herdeiro", "Que retornaria a Harã para buscar sua família"] },
            { question: "Onde Raquel morreu?", answer: "No caminho para Efrate (Belém), após o parto de Benjamim", distractors: ["Em Hebrom, de doença", "Em Siquém, logo após o nascimento de José"] },
            { question: "Com que nome Raquel chamou seu último filho?", answer: "Benoni (filho da minha dor)", distractors: ["Benjamim (filho da direita)", "Rauel (filho amado)"] },
            { question: "O que Rubem fez que ofendeu muito Jacó?", answer: "Dormiu com Bila, concubina de seu pai", distractors: ["Vendeu parte do rebanho sem permissão", "Trouxe esposa cananeia para a família"] },
            { question: "Com quantos anos morreu Isaque?", answer: "180 anos", distractors: ["175 anos", "120 anos"] },
        ],
        36: [
            { question: "Quem era Esaú, segundo Gênesis 36?", answer: "O mesmo que Edom, ancestral dos edomitas", distractors: ["O mesmo que Moabe, ancestral dos moabitas", "O mesmo que Amom, ancestral dos amonitas"] },
            { question: "Por que Esaú e Jacó se separaram definitivamente?", answer: "A terra não comportava os dois — seus rebanhos eram muito grandes", distractors: ["Deus ordenou que Esaú se separasse", "Esaú quis fundar sua própria nação"] },
            { question: "Onde Esaú se estabeleceu com sua família?", answer: "Na região serrana de Seir", distractors: ["Na terra de Moabe", "Nas planícies do Neguebe"] },
            { question: "O que a listagem de Gênesis 36 registra além dos filhos de Esaú?", answer: "Os reis e chefes que reinaram em Edom antes de qualquer rei em Israel", distractors: ["As batalhas de Esaú contra os cananeus", "As cidades fundadas pelos filhos de Esaú"] },
        ],
        37: [
            { question: "Qual presente especial Jacó deu a José?", answer: "Uma túnica de muitas cores (ou com mangas longas)", distractors: ["Um cajado de ouro", "Um anel de sinete"] },
            { question: "O que José sonhou no primeiro sonho?", answer: "Os molhos dos irmãos se curvavam para o molho de José", distractors: ["O sol, a lua e onze estrelas se curvavam a ele", "Um faraó o colocava no trono"] },
            { question: "O que os irmãos chamavam José por causa dos sonhos?", answer: "Senhor dos sonhos (Mestre dos sonhadores)", distractors: ["Filho favorito", "O enganador"] },
            { question: "O que Rubem sugeriu como alternativa a matar José?", answer: "Jogá-lo numa cisterna seca, planejando resgatá-lo depois", distractors: ["Enviá-lo de volta para Jacó", "Vendê-lo a mercadores"] },
            { question: "A quem os irmãos venderam José?", answer: "A ismaelitas (madianitas) por vinte moedas de prata", distractors: ["Ao faraó do Egito diretamente", "A comerciantes hititas por trinta moedas"] },
            { question: "O que os irmãos fizeram com a túnica de José?", answer: "Molharam-na no sangue de um cabrito e levaram a Jacó", distractors: ["Queimaram-na para esconder o crime", "Guardaram-na como prova de que ele havia fugido"] },
            { question: "Para onde José foi após ser vendido?", answer: "Para o Egito, como escravo de Potifar, capitão da guarda do faraó", distractors: ["Para a Babilônia", "Para a Assíria"] },
        ],
        38: [
            { question: "Por que Deus matou Er, filho primogênito de Judá?", answer: "Porque era mau aos olhos do Senhor", distractors: ["Porque se recusou a casar com Tamar", "Porque roubou da família"] },
            { question: "Como se chamava a nora de Judá que ficou viúva?", answer: "Tamar", distractors: ["Raquel", "Débora"] },
            { question: "O que Judá prometeu a Tamar mas não cumpriu?", answer: "Dar seu filho mais novo Selá como marido quando crescesse", distractors: ["Pagar a ela um preço de noiva justo", "Tratá-la como filha em sua casa"] },
            { question: "O que Tamar recebeu de Judá como penhor?", answer: "Seu sinete, seu cordão e seu cajado", distractors: ["Ouro e prata", "Um anel e um véu"] },
            { question: "Como se chamavam os filhos gêmeos que Tamar teve de Judá?", answer: "Perez e Zerá", distractors: ["Er e Onã", "Selá e Perez"] },
            { question: "Qual detalhe marcou o nascimento dos gêmeos?", answer: "Zerá pôs o braço primeiro, mas Perez nasceu primeiro — por isso se chamou Perez (brecha)", distractors: ["Nasceram em dias diferentes", "Perez nasceu com um sinal vermelho no braço"] },
        ],
        39: [
            { question: "De quem José era escravo no Egito?", answer: "De Potifar, capitão da guarda do faraó", distractors: ["Do próprio faraó", "De um comerciante rico de Mênfis"] },
            { question: "Por que a casa de Potifar foi abençoada?", answer: "Por causa de José, pois o Senhor estava com ele", distractors: ["Potifar era um homem justo que adorava a Deus", "Potifar havia libertado escravos hebreus"] },
            { question: "O que a mulher de Potifar tentou fazer com José repetidas vezes?", answer: "Seduzi-lo para dormir com ela", distractors: ["Acusá-lo de roubo perante o faraó", "Persuadi-lo a fugir do Egito"] },
            { question: "O que a mulher de Potifar fez quando José recusou e fugiu?", answer: "Usou a capa de José como prova falsa para acusá-lo de assédio", distractors: ["Chorou e pediu perdão a José", "Vendeu José a outro senhor"] },
            { question: "Para onde José foi após ser acusado?", answer: "Para a prisão do rei, onde estavam os presos do faraó", distractors: ["Foi vendido para minas de pedras", "Foi expulso do Egito"] },
            { question: "O que aconteceu com José mesmo na prisão?", answer: "O Senhor estava com ele e o fez prosperar; o carcereiro lhe confiou tudo", distractors: ["José sofreu muito sem nenhum favor divino", "Permaneceu na obscuridade durante anos"] },
        ],
        40: [
            { question: "Quem foram os dois companheiros de prisão de José?", answer: "O copeiro-mor e o padeiro-mor do faraó", distractors: ["Dois generais que conspiraram contra o faraó", "O tesoureeiro e o escriba do faraó"] },
            { question: "O que o copeiro sonhou?", answer: "Uma videira com três ramos que floresceu e ele espremeu uvas no cálice do faraó", distractors: ["Sete vacas gordas e sete vacas magras", "Uma escada indo ao céu com anjos"] },
            { question: "O que José interpretou como significado do sonho do copeiro?", answer: "Em três dias o faraó o restabeleceria ao seu cargo", distractors: ["Em três dias o faraó o puniria com morte", "Em três anos seria livre da prisão"] },
            { question: "O que José pediu ao copeiro como favor?", answer: "Que se lembrasse dele e o mencionasse ao faraó", distractors: ["Que trouxesse comida melhor para a prisão", "Que enviasse uma mensagem à família de José"] },
            { question: "O que o padeiro sonhou?", answer: "Três cestos de pão na cabeça — e aves comiam do cesto de cima", distractors: ["Uma árvore carregada de frutos que se deterioravam", "O faraó recusando comer seu pão"] },
            { question: "O que aconteceu com o padeiro, conforme a interpretação de José?", answer: "Foi enforcado em três dias e as aves comeram sua carne", distractors: ["Foi restabelecido ao cargo e esqueceu José", "Foi exilado para outro país"] },
            { question: "O que o copeiro fez após ser solto?", answer: "Esqueceu-se de José", distractors: ["Mencionou José ao faraó imediatamente", "Enviou comida e roupas a José na prisão"] },
        ],
        41: [
            { question: "O que o faraó sonhou na primeira vez?", answer: "Sete vacas gordas devoradas por sete vacas magras", distractors: ["Sete espigas boas comidas por sete espigas murchas", "Uma cheia do Nilo seguida de seca total"] },
            { question: "O que José interpretou sobre os dois sonhos do faraó?", answer: "Sete anos de fartura seguidos de sete anos de grande fome", distractors: ["Sete anos de paz e sete anos de guerra", "Sete reis bons e sete reis tiranos"] },
            { question: "Que cargo o faraó deu a José?", answer: "Administrador de todo o Egito — segundo em poder depois do faraó", distractors: ["Chefe da guarda pessoal do faraó", "Supervisor dos celeiros reais"] },
            { question: "Que nome o faraó deu a José?", answer: "Zafenate-Paneia", distractors: ["Ramsés", "Abner"] },
            { question: "Com quem José se casou no Egito?", answer: "Com Asenate, filha de Potífera, sacerdote de Om", distractors: ["Com uma princesa filha do faraó", "Com a filha do copeiro-mor"] },
            { question: "Como se chamavam os dois filhos de José no Egito?", answer: "Manassés e Efraim", distractors: ["Rubem e Simeão", "Gade e Aser"] },
            { question: "Quantos anos tinha José quando foi nomeado pelo faraó?", answer: "30 anos", distractors: ["25 anos", "40 anos"] },
        ],
        42: [
            { question: "Por que os irmãos de José foram ao Egito?", answer: "Por causa da fome — para comprar grãos", distractors: ["Para resgatar José da prisão", "Para pagar uma dívida a Potifar"] },
            { question: "De que acusou José os irmãos?", answer: "De serem espias", distractors: ["De terem fugido de Canaã", "De roubarem o grão dos outros compradores"] },
            { question: "O que José exigiu para provar que eram honestos?", answer: "Que voltassem com o irmão mais novo (Benjamim)", distractors: ["Que trouxessem seu pai Jacó", "Que deixassem dois irmãos como reféns"] },
            { question: "Qual irmão ficou preso enquanto os outros voltavam para Canaã?", answer: "Simeão", distractors: ["Rubem", "Levi"] },
            { question: "O que os irmãos encontraram nos sacos ao parar para pousar?", answer: "O dinheiro que haviam pago estava de volta nos sacos", distractors: ["Cartas de José acusando-os", "Armas escondidas pelo mordomo"] },
            { question: "Como os irmãos se sentiram ao encontrar o dinheiro nos sacos?", answer: "Com o coração desmaiado — temeram", distractors: ["Alegres por terem a mercadoria grátis", "Indiferentes, pois era comum no Egito"] },
        ],
        43: [
            { question: "Por que os irmãos precisaram voltar ao Egito com Benjamim?", answer: "A fome continuou pesada e o grão havia acabado", distractors: ["Simeão enviou mensagem pedindo socorro", "José enviou soldados para buscá-los"] },
            { question: "O que Judá prometeu a Jacó para convencê-lo a deixar Benjamim ir?", answer: "Que seria responsável por Benjamim — perderia seu lugar na família se ele não voltasse", distractors: ["Que voltariam em três dias", "Que Deus havia prometido proteção em sonho"] },
            { question: "O que aconteceu com José quando viu Benjamim?", answer: "Sentiu saudade e precisou sair para chorar em particular", distractors: ["Revelou sua identidade imediatamente", "Ficou em silêncio fingindo não reconhecê-lo"] },
            { question: "Como os irmãos foram recebidos por José?", answer: "Foram levados à casa de José e servidos com uma refeição", distractors: ["Foram novamente presos como espigas", "Tiveram que esperar dias para ser recebidos"] },
            { question: "Por que os irmãos ficaram assustados ao ser levados à casa de José?", answer: "Temiam ser punidos por causa do dinheiro que havia voltado nos sacos", distractors: ["Pensavam que seriam escravizados", "Temiam que José os reconhecesse"] },
            { question: "Em que ordem os irmãos foram servidos à mesa?", answer: "Do mais velho ao mais novo, para espanto deles", distractors: ["Em ordem aleatória", "Os egípcios foram servidos primeiro, separados dos hebreus"] },
        ],
        44: [
            { question: "O que José mandou esconder no saco de Benjamim?", answer: "Sua taça de prata", distractors: ["Uma bolsa de ouro", "Uma carta acusando os irmãos"] },
            { question: "Qual era a taça que José usava para adivinhar?", answer: "Uma taça de prata", distractors: ["Uma taça de ouro com o selo real", "Um cálice de bronze"] },
            { question: "O que o mordomo de José disse quando alcançou os irmãos?", answer: "Que eles haviam roubado a taça de prata de José", distractors: ["Que o faraó os mandava prender", "Que faltava grão nos sacos e precisavam devolver"] },
            { question: "O que Judá disse ao se jogar diante de José?", answer: "Pediu que ele ficasse com Judá como escravo e libertasse Benjamim, pois seu pai morreria de desgosto", distractors: ["Confessou que haviam vendido José anos antes", "Jurou que Benjamim não havia roubado a taça"] },
            { question: "Por que Judá disse que não poderia voltar sem Benjamim?", answer: "Porque seu pai Jacó morreria de desgosto — sua alma estava ligada à alma de Benjamim", distractors: ["Porque havia feito voto a Deus na viagem", "Por medo de punição de José"] },
        ],
        45: [
            { question: "Como José se revelou a seus irmãos?", answer: "Mandou sair todos os egípcios e disse em choro: Eu sou José!", distractors: ["Mostrou a túnica de muitas cores que ainda guardava", "Revelou seu nome ao copeiro-mor em presença deles"] },
            { question: "O que José disse sobre o propósito de ter sido vendido?", answer: "Foi Deus quem o enviou para preservar a vida", distractors: ["Que era punição pelos pecados dos irmãos", "Que foi resultado da vontade do faraó"] },
            { question: "O que José pediu que os irmãos fizessem?", answer: "Que fossem buscar seu pai Jacó e toda a família para vir ao Egito", distractors: ["Que ficassem no Egito imediatamente", "Que contassem ao faraó o que haviam feito"] },
            { question: "Onde o faraó disse que José poderia estabelecer sua família?", answer: "Na melhor terra do Egito, em Gósen", distractors: ["Perto do palácio do faraó em Mênfis", "Na terra de Cam, ao sul do Egito"] },
            { question: "Como os irmãos reagiram ao ouvir que era José?", answer: "Ficaram perturbados e não conseguiam responder", distractors: ["Pediram imediatamente perdão com muitas lágrimas", "Não acreditaram e exigiram prova"] },
            { question: "Quantos anos faltavam para acabar a fome quando José se revelou?", answer: "Cinco anos", distractors: ["Dois anos", "Sete anos"] },
        ],
        46: [
            { question: "O que Deus disse a Jacó em visão noturna em Berseba?", answer: "Não temas descer ao Egito — farei de ti uma grande nação e tornarei a te fazer subir", distractors: ["Que deveria enviar seus filhos mas permanecer em Canaã", "Que o Egito seria destruído e ele deveria partir logo"] },
            { question: "Quantas pessoas da família de Jacó foram para o Egito?", answer: "Setenta pessoas (sem contar as esposas dos filhos de Jacó)", distractors: ["Setenta e dois", "Cinquenta e dois"] },
            { question: "Qual filho Jacó mandou à frente para preparar a chegada?", answer: "Judá", distractors: ["Rubem", "José"] },
            { question: "Como foi o reencontro de José e Jacó?", answer: "José correu ao encontro, lançou-se ao pescoço do pai e chorou muito", distractors: ["Jacó caiu desmaiado ao ver José", "José prostrou-se diante de seu pai"] },
            { question: "Que profissão a família de Jacó declarou ao faraó?", answer: "Pastores de gado", distractors: ["Agricultores e comerciantes", "Guerreiros e caçadores"] },
            { question: "Por que os pastores eram abomináveis aos egípcios?", answer: "Era costume no Egito desprezar pastores", distractors: ["Pastores haviam invadido o Egito antes", "Os deuses egípcios proibiam a criação de gado"] },
        ],
        47: [
            { question: "Em que terra o faraó estabeleceu a família de Jacó?", answer: "Na terra de Ramsés (região de Gósen)", distractors: ["Em Mênfis, perto do palácio", "No delta do rio Nilo, em Tanis"] },
            { question: "Com quantos anos Jacó foi apresentado ao faraó?", answer: "130 anos", distractors: ["110 anos", "150 anos"] },
            { question: "O que o povo do Egito deu em troca de grão quando o dinheiro acabou?", answer: "Primeiro os rebanhos, depois a terra e depois eles próprios como escravos", distractors: ["Ouro e joias", "Metais e ferramentas de trabalho"] },
            { question: "Que lei José estabeleceu sobre a terra do Egito?", answer: "Um quinto de tudo pertencia ao faraó como imposto", distractors: ["Metade da colheita ia ao faraó", "Um décimo do lucro era imposto anual"] },
            { question: "O que Jacó pediu a José antes de morrer?", answer: "Que não o enterrasse no Egito, mas o levasse à sepultura de seus pais", distractors: ["Que desse a bênção especial ao filho mais velho", "Que libertasse todos os servos de sua casa"] },
            { question: "Quantos anos Jacó viveu no Egito?", answer: "17 anos", distractors: ["12 anos", "25 anos"] },
        ],
        48: [
            { question: "Quem Jacó abençoou com a mão direita, colocando-a sobre o mais novo?", answer: "Efraim, o mais novo filho de José", distractors: ["Manassés, o mais velho", "O próprio José"] },
            { question: "Por que José ficou descontente com o cruzar das mãos de Jacó?", answer: "Porque Manassés era o primogênito e a mão direita era a do primogênito", distractors: ["Porque Jacó estava fraco e não via bem", "Porque a tradição proibia cruzar as mãos"] },
            { question: "O que Jacó disse sobre os dois filhos de José?", answer: "Que seriam como Rubem e Simeão para ele — contados entre seus filhos", distractors: ["Que seriam os mais abençoados de todos", "Que liderariam as doze tribos"] },
            { question: "Qual seria a maior entre as descendências de Efraim e Manassés, segundo a bênção de Jacó?", answer: "A de Efraim, o mais novo, seria maior", distractors: ["A de Manassés, o mais velho, por ser primogênito", "Seriam iguais em grandeza"] },
            { question: "O que Jacó deu especificamente a José além da bênção?", answer: "Uma parte a mais que seus irmãos — Siquém que tomou dos amorreus", distractors: ["Os celeiros que havia administrado no Egito", "A terra de Hebrom onde estava a sepultura dos patriarcas"] },
        ],
        49: [
            { question: "A quem Jacó disse que o cetro não se apartaria até que viesse Siló?", answer: "A Judá", distractors: ["A José", "A Levi"] },
            { question: "Qual filho de Jacó foi comparado a uma serpente no caminho?", answer: "Dã", distractors: ["Naftali", "Gade"] },
            { question: "Qual filho foi abençoado com ser o mais fértil entre os irmãos?", answer: "José", distractors: ["Judá", "Issacar"] },
            { question: "O que Jacó disse sobre Rubem por ter dormido com sua concubina?", answer: "Que não teria preeminência, pois profanou o leito paterno", distractors: ["Que seria o mais abençoado por ser o primogênito", "Que sua tribo seria a mais numerosa"] },
            { question: "Onde Jacó pediu ser enterrado?", answer: "Na caverna de Macpela, em Hebrom, com Abraão, Sara, Isaque e Rebeca", distractors: ["Em Betel, onde sonhou com a escada", "Em Berseba, junto ao poço do juramento"] },
            { question: "Qual filho foi chamado 'filhote de leão' por Jacó?", answer: "Judá", distractors: ["Dã", "Benjamim"] },
            { question: "Qual filho foi comparado a um lobo que divide a presa?", answer: "Benjamim", distractors: ["Gade", "Aser"] },
        ],
        50: [
            { question: "Por quantos dias os egípcios choraram a morte de Jacó?", answer: "Setenta dias", distractors: ["Quarenta dias", "Sete dias"] },
            { question: "Onde Jacó foi sepultado, conforme seu pedido?", answer: "Na caverna de Macpela, em Hebrom", distractors: ["Em Gósen, no Egito", "Em Siquém, na terra comprada por Jacó"] },
            { question: "O que os irmãos temeram após a morte de Jacó?", answer: "Que José se vingasse deles por tê-lo vendido", distractors: ["Que perderiam suas terras no Egito", "Que o faraó os expulsaria do Egito"] },
            { question: "Como José respondeu ao pedido de perdão de seus irmãos?", answer: "Chorou e disse que não estava no lugar de Deus para julgá-los — Deus transformou o mal em bem", distractors: ["Exigiu que trabalhassem para ele como compensação", "Ficou em silêncio e os deixou partir"] },
            { question: "Com quantos anos José morreu?", answer: "110 anos", distractors: ["120 anos", "90 anos"] },
            { question: "Qual instrução José deu antes de morrer sobre seus ossos?", answer: "Que quando Deus os visitasse, levassem seus ossos dali (do Egito)", distractors: ["Que fossem enterrados em Hebrom junto a Jacó", "Que fossem lançados ao Nilo como oferenda"] },
            { question: "Qual promessa José reafirmou a seus irmãos antes de morrer?", answer: "Que Deus certamente os visitaria e os faria subir da terra do Egito", distractors: ["Que seus filhos governariam o Egito para sempre", "Que a fome nunca mais atingiria a família"] },
        ],
    },
    joao: {
        1: [
            { question: "Com que palavras começa o Evangelho de João?", answer: "No princípio era o Verbo", distractors: ["O registro de Jesus Cristo", "No décimo quinto ano do imperador Tibério"] },
            { question: "Quem João disse que era quando perguntado?", answer: "Uma voz que clama no deserto: endireitai o caminho do Senhor", distractors: ["O Elias que havia de vir", "O Cristo prometido por Moisés"] },
            { question: "Qual sinal João disse que reconheceria o Messias?", answer: "Aquele sobre quem o Espírito desceu e permaneceu — esse batiza no Espírito Santo", distractors: ["Aquele que andasse sobre as águas", "Aquele que curasse os leprosos pelo nome de Deus"] },
            { question: "O que João disse quando viu Jesus aproximar-se?", answer: "Eis o Cordeiro de Deus que tira o pecado do mundo", distractors: ["Eis o Filho de Deus que vem ao mundo", "Prepara o caminho do Senhor"] },
            { question: "Como Natanael reagiu quando Filipe disse que encontraram o Messias de Nazaré?", answer: "Perguntou: De Nazaré pode sair alguma coisa boa?", distractors: ["Correu imediatamente para ver Jesus", "Disse que esperaria mais sinais antes de crer"] },
            { question: "Como Jesus chamou Natanael?", answer: "Um verdadeiro israelita em quem não há dolo", distractors: ["O escolhido desde o princípio", "Aquele que seguiria até o fim"] },
            { question: "O que Jesus disse que Natanael veria?", answer: "Os céus abertos e os anjos de Deus subindo e descendo sobre o Filho do Homem", distractors: ["Grandes milagres que nenhum olho viu antes", "O Reino de Deus estabelecido em Israel"] },
        ],
        2: [
            { question: "Onde Jesus realizou seu primeiro milagre?", answer: "Em Caná da Galileia, em uma festa de casamento", distractors: ["Em Cafarnaum, na sinagoga", "Em Jerusalém, no templo"] },
            { question: "Quem pediu a Jesus que ajudasse na falta de vinho?", answer: "Sua mãe Maria", distractors: ["O mestre-sala da festa", "Os discípulos"] },
            { question: "Quantas talhas de pedra havia na festa?", answer: "Seis", distractors: ["Doze", "Três"] },
            { question: "O que o mestre-sala disse sobre o vinho que Jesus fez?", answer: "Que guardou o bom vinho até o fim, ao contrário do costume", distractors: ["Que era o melhor vinho que havia provado na vida", "Que era vinho milagroso que nunca acabaria"] },
            { question: "O que Jesus fez no templo de Jerusalém?", answer: "Expulsou os vendilhões e os cambistas, derrubando as mesas", distractors: ["Curou doentes no pátio do templo", "Ensinou por três dias seguidos"] },
            { question: "O que Jesus disse sobre o templo quando desafiado?", answer: "Destruí este templo e em três dias o levantarei", distractors: ["Este templo será purificado pela minha presença", "O templo de Deus não pode ser destruído"] },
            { question: "Após o sinal das bodas de Caná, o que diz João sobre os discípulos?", answer: "Creram nele", distractors: ["Ainda duvidavam de quem ele era", "Pediram mais sinais para crer"] },
        ],
        3: [
            { question: "Quem era Nicodemos?", answer: "Um fariseu e líder (mestre) dos judeus que foi a Jesus de noite", distractors: ["Um escriba que queria testar Jesus", "Um sacerdote que secretamente cria em Jesus"] },
            { question: "O que Jesus disse que é necessário para ver o reino de Deus?", answer: "Nascer de novo (nascer d'água e do Espírito)", distractors: ["Guardar os mandamentos com fidelidade", "Arrepender-se e ser batizado com água"] },
            { question: "Com que Jesus comparou o nascer do Espírito?", answer: "Com o vento — que sopra onde quer e não se sabe de onde vem", distractors: ["Com a chuva que revive a terra seca", "Com a luz que ilumina as trevas"] },
            { question: "Qual é o versículo mais famoso de João 3?", answer: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito (Jo 3:16)", distractors: ["Eu sou o caminho, a verdade e a vida (Jo 14:6)", "No princípio era o Verbo (Jo 1:1)"] },
            { question: "O que João o Batista disse sobre a relação entre ele e Jesus?", answer: "Convém que ele cresça e que eu diminua", distractors: ["Sou indigno de desatar a correia de suas sandálias", "Eu batizo com água, ele batizará com o Espírito"] },
            { question: "A que Jesus comparou ser levantado para que todos que creem tenham vida?", answer: "À serpente que Moisés levantou no deserto", distractors: ["À luz que ilumina as trevas", "Ao grão de trigo que cai na terra"] },
        ],
        4: [
            { question: "Com quem Jesus conversou no poço de Jacó?", answer: "Uma mulher samaritana", distractors: ["Um fariseu que passava por Samaria", "Seus discípulos que foram comprar comida"] },
            { question: "O que Jesus ofereceu à mulher samaritana?", answer: "Água viva que se torna fonte que salta para a vida eterna", distractors: ["Perdão de todos os seus pecados passados", "Salvação da casa de Samaria"] },
            { question: "Quantos maridos a mulher samaritana havia tido?", answer: "Cinco maridos — e o que tinha não era seu marido", distractors: ["Três maridos", "Sete maridos"] },
            { question: "O que Jesus disse sobre o verdadeiro culto a Deus?", answer: "Que os verdadeiros adoradores adorarão em espírito e em verdade", distractors: ["Que deveriam adorar em Jerusalém, no templo", "Que a forma do culto não importa, mas a sinceridade"] },
            { question: "Qual milagre Jesus fez em Caná, beneficiando um oficial real de Cafarnaum?", answer: "Curou o filho do oficial que estava para morrer, de longe", distractors: ["Multiplicou pão para a família do oficial", "Ressuscitou o filho do oficial que já havia morrido"] },
            { question: "O que a mulher samaritana foi fazer após encontrar Jesus?", answer: "Foi à cidade e chamou as pessoas dizendo: Vinde ver um homem que me disse tudo", distractors: ["Ficou ao lado do poço para ouvir mais", "Foi contar apenas à família"] },
        ],
        5: [
            { question: "Onde Jesus curou um paralítico em Jerusalém?", answer: "No tanque de Betesda, com cinco pórticos", distractors: ["No tanque de Siloé, ao sul do templo", "Na piscina real perto do palácio"] },
            { question: "Há quanto tempo o paralítico estava doente?", answer: "Trinta e oito anos", distractors: ["Doze anos", "Vinte anos"] },
            { question: "O que Jesus disse ao paralítico curado?", answer: "Levanta-te, toma o teu leito e anda", distractors: ["Vai e não peques mais", "Tua fé te salvou"] },
            { question: "Por que os judeus perseguiam Jesus após essa cura?", answer: "Porque curou no sábado", distractors: ["Porque disse ser igual a Deus publicamente", "Porque turbou a multidão junto ao templo"] },
            { question: "O que Jesus disse sobre sua relação com o Pai?", answer: "O Pai ama o Filho e mostra-lhe tudo — o Filho não pode fazer nada por si mesmo", distractors: ["Eu e o Pai somos um — quem me vê vê o Pai", "O Pai está em mim e eu no Pai"] },
            { question: "Quem Jesus disse ser a testemunha maior sobre ele do que João?", answer: "As obras que o Pai lhe deu para fazer", distractors: ["O Espírito Santo que desceu sobre ele", "As Escrituras que falam dele"] },
        ],
        6: [
            { question: "Quantas pessoas foram alimentadas com cinco pães e dois peixes?", answer: "Cerca de cinco mil homens", distractors: ["Mais de dez mil pessoas", "Duas mil famílias"] },
            { question: "Quantos cestos de sobras sobraram após a multiplicação dos pães?", answer: "Doze cestos", distractors: ["Sete cestos", "Cinco cestos"] },
            { question: "O que Jesus disse ser o pão da vida?", answer: "Ele mesmo — quem vem a ele não terá fome, quem crê nele nunca terá sede", distractors: ["A Palavra de Deus escrita por Moisés", "O pão da Páscoa que veio do céu"] },
            { question: "O que os discípulos disseram quando viram Jesus andando sobre o mar?", answer: "Ficaram com medo (pensaram que era um fantasma)", distractors: ["Adoraram-no e disseram: tu és o Filho de Deus", "Rubem saiu do barco para ir ao encontro dele"] },
            { question: "Por que muitos discípulos pararam de seguir Jesus após o discurso do pão da vida?", answer: "Acharam que as palavras sobre comer sua carne e beber seu sangue eram duras demais", distractors: ["Jesus os expulsou por não crerem nos milagres", "O fariseus convenceram a multidão a abandoná-lo"] },
            { question: "O que Pedro respondeu quando Jesus perguntou se os doze também queriam ir embora?", answer: "Senhor, a quem iremos? Tu tens as palavras da vida eterna", distractors: ["Nós cremos e sabemos que tu és o Cristo", "Tu és a ressurreição e a vida — para sempre te seguiremos"] },
        ],
        7: [
            { question: "Por que os irmãos de Jesus o desafiaram a ir à festa?", answer: "Para que seus discípulos vissem seus milagres — pois nem seus irmãos criam nele", distractors: ["Porque o povo de Jerusalém pedia a presença dele", "Para que Jesus se revelasse publicamente como Messias"] },
            { question: "Qual festa Jesus foi secretamente?", answer: "A festa dos tabernáculos", distractors: ["A festa da Páscoa", "A festa das semanas (Pentecostes)"] },
            { question: "O que Jesus disse sobre quem tivesse sede no último dia da festa?", answer: "Que viesse a ele e bebesse — rios de água viva correriam do seu interior", distractors: ["Que receberia o Espírito Santo imediatamente", "Que seria saciado pelo pão que desce do céu"] },
            { question: "Quem João diz que era a água viva prometida por Jesus?", answer: "O Espírito Santo, que ainda não havia sido dado", distractors: ["A Palavra de Deus que purifica a alma", "As bênçãos do Pai que Jesus derramaria"] },
            { question: "O que Nicodemos disse quando os fariseus queriam prender Jesus?", answer: "Que a lei não condena ninguém sem primeiro ouvi-lo", distractors: ["Que Jesus era um profeta enviado por Deus", "Que deveriam esperar até que terminasse a festa"] },
        ],
        8: [
            { question: "O que Jesus disse à mulher apanhada em adultério?", answer: "Nem eu te condeno; vai e não peques mais", distractors: ["Tua fé te salvou; vai em paz", "Volta para tua casa e guarda os mandamentos"] },
            { question: "O que Jesus disse ser quando afirmou ser a luz do mundo?", answer: "Quem o segue não andará nas trevas, mas terá a luz da vida", distractors: ["A porta do aprisco pelo qual as ovelhas entram", "O caminho, a verdade e a vida"] },
            { question: "O que Jesus disse sobre a verdade e a liberdade?", answer: "Conhecereis a verdade e a verdade vos libertará", distractors: ["A lei de Moisés é a verdade que liberta", "O amor é o único caminho para a liberdade"] },
            { question: "O que Jesus disse sobre Abraão e sua existência?", answer: "Antes que Abraão existisse, Eu Sou", distractors: ["Abraão viu meus dias e se alegrou antes de morrer", "Sou descendente de Abraão segundo a carne"] },
            { question: "O que os judeus fizeram quando Jesus disse 'Antes que Abraão fosse, Eu Sou'?", answer: "Pegaram pedras para apedrejá-lo", distractors: ["Adoraram-no como Messias", "Chamaram os fariseus para prendê-lo"] },
        ],
        9: [
            { question: "O que os discípulos perguntaram sobre o cego de nascença?", answer: "Quem pecou, ele ou seus pais, para que nascesse cego?", distractors: ["Por que Deus permite o sofrimento dos inocentes?", "Quando este homem seria curado, se é da vontade de Deus?"] },
            { question: "O que Jesus respondeu sobre o motivo da cegueira?", answer: "Não foi por pecado, mas para que as obras de Deus se manifestassem nele", distractors: ["Seria curado no tempo certo de Deus", "Seus pais haviam pecado mas Deus usaria isso para bem"] },
            { question: "O que Jesus usou para curar o cego de nascença?", answer: "Lama feita com saliva e terra — mandou lavar no tanque de Siloé", distractors: ["Tocou os olhos e declarou cura em nome de Deus", "Orou e o homem recuperou a vista instantaneamente"] },
            { question: "Por que os fariseus rejeitaram o milagre?", answer: "Porque foi feito no sábado", distractors: ["Porque o cego não era judeu de nascença", "Porque Jesus não havia orado no templo antes de curar"] },
            { question: "O que o cego curado disse sobre Jesus quando pressionado?", answer: "Se é pecador não sei; uma coisa sei: eu era cego e agora vejo", distractors: ["Ele é o Filho de Deus — eu creio!", "Não conheço este homem de quem falais"] },
        ],
        10: [
            { question: "Como Jesus descreveu o bom pastor em relação às ovelhas?", answer: "O bom pastor dá a sua vida pelas ovelhas", distractors: ["O bom pastor conhece cada ovelha pelo nome e nunca se perde", "O bom pastor reúne todas as ovelhas dispersas em um só rebanho"] },
            { question: "Como Jesus descreveu a si mesmo em João 10?", answer: "A porta das ovelhas e o bom pastor", distractors: ["O caminho, a verdade e a vida", "A luz do mundo e o pão da vida"] },
            { question: "O que Jesus disse sobre suas ovelhas?", answer: "Conhece as suas ovelhas, elas ouvem sua voz e ele as conhece", distractors: ["Suas ovelhas jamais se perderão enquanto viverem", "Suas ovelhas são as mais numerosas de todos os rebanhos"] },
            { question: "O que Jesus disse sobre ter poder de dar e retomar sua vida?", answer: "Ninguém lha tira, mas ele a dá voluntariamente, e tem poder de a retomar", distractors: ["Seu pai tem o poder sobre sua vida e morte", "Os romanos tirarão sua vida mas Deus a restaurará"] },
            { question: "O que Jesus disse quando acusado de blasfêmia por dizer ser Filho de Deus?", answer: "O Pai está em mim e eu no Pai — o Pai e eu somos um", distractors: ["Minhas obras testificam por mim mais que minhas palavras", "Eu sou apenas aquele que o Pai enviou para cumprir as Escrituras"] },
        ],
        11: [
            { question: "Como se chamavam os irmãos e a irmã de Lázaro?", answer: "Marta e Maria", distractors: ["Maria e Madalena", "Joana e Suzana"] },
            { question: "O que Jesus disse que era a ressurreição e a vida?", answer: "Ele mesmo — quem crê nele ainda que morra viverá", distractors: ["O Espírito Santo que Deus enviaria", "A fé que move montanhas e desfaz a morte"] },
            { question: "Qual foi o versículo mais curto da Bíblia, em João 11?", answer: "Jesus chorou", distractors: ["Eis o Cordeiro de Deus", "Deus é amor"] },
            { question: "Por que Jesus disse que se alegrou de não ter estado lá quando Lázaro morreu?", answer: "Para que os discípulos cressem após ver o milagre", distractors: ["Para que Marta e Maria aprendessem a confiar mais nele", "Porque havia chegado o tempo de Lázaro ser ressuscitado"] },
            { question: "Há quantos dias Lázaro estava no sepulcro quando Jesus chegou?", answer: "Quatro dias", distractors: ["Três dias", "Dois dias"] },
            { question: "O que os principais sacerdotes decidiram após a ressurreição de Lázaro?", answer: "Que era melhor um homem morrer pelo povo do que a nação perecer", distractors: ["Que deveriam prender Lázaro também", "Que reconheceriam Jesus como profeta mas não como Messias"] },
        ],
        12: [
            { question: "O que Maria fez com o ungüento de nardo puro?", answer: "Ungiu os pés de Jesus e os enxugou com seus cabelos", distractors: ["Ungiu a cabeça de Jesus antes da Páscoa", "Derramou-o sobre a túnica de Jesus"] },
            { question: "Quem reclamou do desperdício do perfume?", answer: "Judas Iscariotes", distractors: ["Os discípulos em geral", "Marta, que preferia guardá-lo"] },
            { question: "O que Jesus disse sobre o ungüento de Maria?", answer: "Guardou-o para o dia da sua sepultura", distractors: ["Que foi um ato de adoração que nunca seria esquecido", "Que o cheiro do perfume ficaria no templo para sempre"] },
            { question: "O que a multidão aclamou na entrada de Jesus em Jerusalém?", answer: "Hosana! Bendito o que vem em nome do Senhor, o Rei de Israel!", distractors: ["Gloria ao Filho de Davi! Bendito seja o Messias!", "Viva o rei! Hosana ao Filho de Abraão!"] },
            { question: "O que Jesus disse sobre o grão de trigo em João 12?", answer: "Se não cair na terra e morrer, fica só; se morrer, dá muito fruto", distractors: ["O que é plantado com lágrimas será colhido com alegria", "O semeador que sai a semear encontrará terreno fértil"] },
            { question: "O que a voz do céu declarou quando Jesus orou que o Pai glorificasse seu nome?", answer: "Já o glorifiquei e o glorificarei outra vez", distractors: ["Este é meu Filho amado, ouvi-o", "Faça-se a tua vontade, como no céu também na terra"] },
        ],
        13: [
            { question: "O que Jesus fez aos discípulos na última ceia?", answer: "Lavou os pés deles", distractors: ["Partiu o pão e o distribuiu a cada um", "Orou pelo nome de cada discípulo individualmente"] },
            { question: "Por que Pedro resistiu inicialmente ao ter os pés lavados por Jesus?", answer: "Disse que Jesus nunca lhe lavaria os pés", distractors: ["Porque achava que era tarefa de um servo, não do Mestre", "Porque seus pés estavam feridos e com vergonha"] },
            { question: "O que Jesus disse ao lavar os pés dos discípulos?", answer: "Se eu, o Senhor e Mestre, lavei os vossos pés, vós deveis lavar os pés uns dos outros", distractors: ["Quem quiser ser grande entre vós, seja servo de todos", "Amem-se uns aos outros como eu os amei"] },
            { question: "Como Jesus identificou quem o trairia?", answer: "Aquele a quem eu der o bocado molhado", distractors: ["Aquele que saísse da sala naquela noite", "Aquele que não cresse no milagre dos pães"] },
            { question: "Qual novo mandamento Jesus deu aos discípulos?", answer: "Que se amassem uns aos outros como ele os amou", distractors: ["Que pregassem o Evangelho a todas as nações", "Que batizassem em nome do Pai, do Filho e do Espírito Santo"] },
            { question: "Quantas vezes Jesus disse que Pedro o negaria antes do galo cantar?", answer: "Três vezes", distractors: ["Duas vezes", "Uma vez"] },
        ],
        14: [
            { question: "O que Jesus disse ser o caminho, a verdade e a vida?", answer: "Ele mesmo — ninguém vem ao Pai senão por ele", distractors: ["A Palavra de Deus escrita pelas Escrituras", "O Espírito Santo que guiaria a toda verdade"] },
            { question: "O que Jesus prometeu enviar em seu nome após partir?", answer: "O Consolador (Espírito Santo) que ensinaria todas as coisas", distractors: ["Anjos guardiões para cada discípulo", "Outro profeta que completaria seu ensino"] },
            { question: "Qual paz Jesus prometeu deixar aos discípulos?", answer: "A sua paz — não como o mundo dá", distractors: ["A paz que passa todo entendimento", "A paz que vem da obediência aos mandamentos"] },
            { question: "O que Jesus prometeu aos que o amam e guardam seus mandamentos?", answer: "Ele e o Pai viriam e fariam morada com ele", distractors: ["Que receberiam tudo que pedissem em seu nome", "Que seriam preservados de todo mal no mundo"] },
            { question: "O que Filipe pediu a Jesus?", answer: "Que mostrasse o Pai e isso lhes bastaria", distractors: ["Que fizesse um grande sinal para que todos cressem", "Que explicasse como voltaria após a morte"] },
            { question: "O que Jesus disse sobre as obras que seus discípulos fariam?", answer: "Fariam obras maiores do que as dele, porque ia ao Pai", distractors: ["Fariam obras iguais às dele em nome do Pai", "Suas obras seriam menores mas mais numerosas"] },
        ],
        15: [
            { question: "Com o que Jesus se comparou em João 15?", answer: "Com a videira verdadeira — o Pai é o agricultor", distractors: ["Com o pão que desce do céu e dá vida", "Com o pastor que dá a vida pelas ovelhas"] },
            { question: "O que acontece com os ramos que não dão fruto?", answer: "O Pai os corta e são lançados fora e queimados", distractors: ["São podados para que possam dar fruto depois", "São deixados como estão, sem podação"] },
            { question: "Qual é o maior amor segundo Jesus em João 15?", answer: "Dar a vida pelos amigos", distractors: ["Amar os inimigos e orar por eles", "Perdoar setenta vezes sete"] },
            { question: "Por que Jesus chamou os discípulos de amigos e não de servos?", answer: "Porque lhes revelou tudo o que ouviu do Pai", distractors: ["Porque eles o seguiram desde o princípio", "Porque guardaram todos os seus mandamentos"] },
            { question: "O que o mundo faria com os discípulos, segundo Jesus?", answer: "Os odiaria, como odiou a Jesus primeiro", distractors: ["Os perseguiria mas Deus sempre os livraria", "Os tentaria a abandonar a fé com riquezas"] },
        ],
        16: [
            { question: "Por que Jesus disse que era bom para os discípulos que ele partisse?", answer: "Para que viesse o Consolador — se não fosse, o Consolador não viria", distractors: ["Para que os discípulos crescessem na fé sem depender dele", "Para que o Pai enviasse anjos em seu lugar"] },
            { question: "O que o Espírito Santo convenceria o mundo?", answer: "De pecado, de justiça e de juízo", distractors: ["De amor, paz e redenção", "De arrependimento, batismo e salvação"] },
            { question: "O que Jesus disse que o Espírito de verdade faria?", answer: "Guiaria a toda a verdade e anunciaria as coisas por vir", distractors: ["Daria poder para fazer milagres maiores que os de Jesus", "Permaneceria na terra até o fim dos tempos"] },
            { question: "Qual metáfora Jesus usou para descrever a tristeza e alegria dos discípulos?", answer: "A mulher que tem dores no parto — depois do parto a dor é esquecida pela alegria", distractors: ["O viajante que sofre na jornada mas chega à casa com alegria", "A semente que morre na terra antes de germinar"] },
            { question: "O que Jesus prometeu que os discípulos teriam no mundo?", answer: "Tribulação — mas que se animassem pois ele venceu o mundo", distractors: ["Paz em abundância como recompensa da fé", "Proteção divina contra todo inimigo"] },
        ],
        17: [
            { question: "O que Jesus pediu ao Pai para si mesmo no início da oração de João 17?", answer: "Que o glorificasse com a glória que tinha antes da criação do mundo", distractors: ["Que o preservasse do poder do inimigo", "Que enviasse doze legiões de anjos para protegê-lo"] },
            { question: "O que é a vida eterna, segundo a definição de Jesus em João 17?", answer: "Conhecer ao único Deus verdadeiro e a Jesus Cristo que ele enviou", distractors: ["Crer em Jesus e guardar seus mandamentos", "Amar a Deus e ao próximo de todo coração"] },
            { question: "O que Jesus pediu ao Pai para os discípulos em relação ao mundo?", answer: "Que não os tirasse do mundo, mas que os guardasse do mal", distractors: ["Que os levasse para onde ele estava", "Que os protegesse de toda perseguição"] },
            { question: "Qual unidade Jesus pediu para seus discípulos?", answer: "Que fossem um, assim como o Pai e o Filho são um", distractors: ["Que se amassem como irmãos de sangue", "Que nunca se separassem até o fim dos tempos"] },
            { question: "Por quem mais Jesus orou, além dos doze discípulos?", answer: "Por todos os que creriam por meio da palavra deles", distractors: ["Pela nação de Israel que não o havia recebido", "Pelos pobres e oprimidos do mundo inteiro"] },
        ],
        18: [
            { question: "Onde Jesus foi preso?", answer: "Num horto além do ribeiro Cedrom", distractors: ["No jardim do Getsêmani no monte das Oliveiras", "No pátio do templo de Jerusalém"] },
            { question: "Quem cortou a orelha do servo do sumo sacerdote?", answer: "Pedro", distractors: ["Tiago", "João"] },
            { question: "Como se chamava o servo que teve a orelha cortada?", answer: "Malco", distractors: ["Anás", "Caifás"] },
            { question: "Quantas vezes Pedro negou Jesus naquela noite?", answer: "Três vezes", distractors: ["Duas vezes", "Uma vez"] },
            { question: "O que Pilatos disse ao questionar o que era a verdade?", answer: "Saiu e disse aos judeus: não acho nenhum crime neste homem", distractors: ["Disse que lavaria as mãos de todo o caso", "Mandou açoitar Jesus antes de tomar decisão"] },
            { question: "O que a multidão escolheu ao invés de Jesus?", answer: "Barrabás, que era ladrão", distractors: ["Simão de Cirene, um criminoso", "Dismas, condenado por rebelião"] },
        ],
        19: [
            { question: "Qual inscrição Pilatos colocou na cruz?", answer: "Jesus Nazareno, Rei dos Judeus", distractors: ["Este é o Rei dos Judeus que blasfemou", "Condenado por blasfêmia e sedição"] },
            { question: "Em quantas línguas estava escrita a inscrição da cruz?", answer: "Três: hebraico, latim e grego", distractors: ["Duas: hebraico e latim", "Quatro: hebraico, latim, grego e aramaico"] },
            { question: "Quem ficou ao pé da cruz de Jesus?", answer: "Sua mãe, a irmã da mãe, Maria Madalena e o discípulo amado", distractors: ["Apenas Maria Madalena e as outras mulheres", "Os discípulos Pedro, Tiago e João"] },
            { question: "O que Jesus disse de cima da cruz ao ver sua mãe e o discípulo amado?", answer: "Mulher, eis aí o teu filho. Depois disse ao discípulo: eis aí a tua mãe", distractors: ["Mãe, vai em paz — ele cuidará de ti", "Mulher, não chores — em três dias ressuscitarei"] },
            { question: "Qual foi a última frase de Jesus na cruz segundo João?", answer: "Está consumado!", distractors: ["Pai, em tuas mãos entrego o meu espírito", "Pai, perdoa-lhes, porque não sabem o que fazem"] },
            { question: "Quem pediu o corpo de Jesus a Pilatos para sepultá-lo?", answer: "José de Arimateia — discípulo secreto por medo dos judeus", distractors: ["Nicodemos, que trouxe mirra e aloés", "Maria Madalena e as outras mulheres"] },
        ],
        20: [
            { question: "Quem chegou primeiro ao sepulcro na manhã da ressurreição?", answer: "Maria Madalena", distractors: ["Pedro", "O discípulo amado (João)"] },
            { question: "O que Pedro e João encontraram no sepulcro vazio?", answer: "As faixas e o sudário dobrado separado", distractors: ["Apenas o sepulcro vazio sem nada", "Um anjo sentado no lugar onde Jesus havia sido posto"] },
            { question: "Como Jesus se revelou a Maria Madalena?", answer: "Chamou-a pelo nome: Maria!", distractors: ["Apareceu em forma gloriosa e radiante", "Mostrou as marcas das mãos e do lado"] },
            { question: "O que Jesus fez quando apareceu aos discípulos no cenáculo?", answer: "Mostrou as mãos e o lado, soprou sobre eles e disse: Recebei o Espírito Santo", distractors: ["Partiu o pão com eles e explicou as Escrituras", "Abençoou a todos e os enviou a pregar"] },
            { question: "Por que Tomé duvidou da ressurreição?", answer: "Não estava presente quando Jesus apareceu e queria ver e tocar as marcas", distractors: ["Os outros discípulos não eram de confiança para ele", "Havia visto visões antes e não queria se enganar novamente"] },
            { question: "O que Jesus disse a Tomé após ele declarar fé?", answer: "Porque me viste, creste; bem-aventurados os que não viram e creram", distractors: ["Tua fé, embora tardia, é genuína e aceita", "Vai e conta a todos que Jesus ressuscitou dos mortos"] },
        ],
        21: [
            { question: "Quantos peixes foram apanhados na pesca milagrosa?", answer: "Cento e cinquenta e três peixes grandes", distractors: ["Setenta e dois peixes", "Doze cestos cheios de peixes"] },
            { question: "Como João reconheceu que era o Senhor na margem?", answer: "Disse ao Pedro: é o Senhor! (por causa do milagre da pesca)", distractors: ["Viu a forma gloriosa e reconheceu sua voz", "Pedro o reconheceu primeiro e João confirmou"] },
            { question: "O que Jesus perguntou a Pedro três vezes?", answer: "Amas-me?", distractors: ["Vais me seguir até o fim?", "Por que me negaste naquela noite?"] },
            { question: "O que Jesus disse a Pedro sobre sua morte?", answer: "Que quando fosse velho, outros o cingiriam e levariam para onde não queria ir (martírio)", distractors: ["Que viveria muitos anos pregando o Evangelho", "Que morreria em paz rodeado de seus filhos espirituais"] },
            { question: "O que Jesus disse sobre o discípulo amado quando Pedro perguntou sobre ele?", answer: "Se eu quiser que ele fique até que eu venha, que te importa? Segue-me tu.", distractors: ["Ele também sofrerá como tu sofrerás", "Ele guardará tudo que te disse para que não te esqueças"] },
            { question: "Como termina o Evangelho de João?", answer: "Dizendo que se tudo fosse escrito, o mundo não caberia os livros", distractors: ["Com a promessa do retorno de Jesus em glória", "Com a lista dos milagres que Jesus fez diante dos discípulos"] },
        ],
    },
};
