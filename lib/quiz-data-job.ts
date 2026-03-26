import { BankQuestion } from "./quiz-data";

export const QUIZ_BANK_JOB: Record<string, Record<number, BankQuestion[]>> = {
    job: {
        1: [
            { question: "Onde vivia o homem chamado Jó?", answer: "Na terra de Uz", distractors: ["Em Ur dos Caldeus", "No deserto de Zur"] },
            { question: "O que Deus disse a Satanás sobre o caráter de Jó?", answer: "Homem íntegro, reto, temente a Deus e que se desvia do mal", distractors: ["O homem mais rico do oriente", "Aquele que nunca pecou"] },
            { question: "Quantos filhos e filhas Jó tinha antes do início de suas provações?", answer: "Sete filhos e três filhas", distractors: ["Dez filhos e cinco filhas", "Doze filhos e doze filhas"] },
            { question: "Qual foi a primeira tragédia que atingiu os filhos de Jó?", answer: "Um grande vento derrubou a casa sobre eles enquanto banqueteavam", distractors: ["Foram levados cativos pelos sabeus", "Morreram de uma praga repentina"] },
            { question: "O que Jó fez ao saber da perda de seus bens e filhos?", answer: "Rasgou o manto, rapou a cabeça e adorou a Deus", distractors: ["Amaldiçoou o dia em que nasceu", "Pediu justiça contra os sabeus"] },
            { question: "Qual foi a frase famosa de Jó após as primeiras perdas?", answer: "O Senhor o deu, e o Senhor o tomou; bendito seja o nome do Senhor", distractors: ["Deus é injusto com quem o serve", "Por que isso aconteceu comigo?"] },
        ],
        2: [
            { question: "Com que enfermidade Satanás feriu o corpo de Jó na segunda prova?", answer: "Uma chaga (sarna) maligna desde a planta do pé até o alto da cabeça", distractors: ["Cegueira total", "Paralisia das pernas"] },
            { question: "O que a mulher de Jó disse a ele no auge do sofrimento?", answer: "Amaldiçoa a Deus e morre", distractors: ["Pede perdão e serás curado", "Fog de Uz e busca refúgio"] },
            { question: "Como Jó respondeu à sugestão de sua mulher de amaldiçoar a Deus?", answer: "Como fala qualquer doida, falas tu; receberemos o bem de Deus, e não o mal?", distractors: ["Tens razão, minha vida não tem mais sentido", "Deus me abandonou por causa de meus pecados"] },
            { question: "Quem eram os três amigos de Jó que foram consolá-lo?", answer: "Elifas, Bildade e Zofar", distractors: ["Eliú, Arão e Naor", "Naamã, Elifaz e Coré"] },
            { question: "Por quantos dias os amigos de Jó ficaram sentados com ele em silêncio antes de falarem?", answer: "Sete dias e sete noites", distractors: ["Três dias", "Quarenta dias"] },
        ],
        3: [
            { question: "O que Jó fez quando finalmente abriu a boca no capítulo 3?", answer: "Amaldiçoou o dia do seu nascimento", distractors: ["Pediu perdão a Deus", "Expulsou seus amigos"] },
            { question: "O que Jó desejava que tivesse acontecido no dia em que nasceu?", answer: "Que as trevas o tivessem coberto e nunca tivesse visto a luz", distractors: ["Que tivesse nascido em uma família pobre", "Que Deus o tivesse levado imediatamente"] },
            { question: "Para onde Jó diz que os ímpios cessam de perturbar e os cansados repousam?", answer: "Para a sepultura (morte)", distractors: ["Para o céu", "Para o deserto"] },
        ],
        4: [
            { question: "Quem foi o primeiro amigo a falar com Jó?", answer: "Elifas, o temanita", distractors: ["Bildade, o suíta", "Zofar, o naamatita"] },
            { question: "Qual foi o argumento central de Elifas no seu primeiro discurso?", answer: "Quem jamais pereceu sendo inocente? Os que semeiam o mal, isso colhem", distractors: ["Deus é amor e perdoará Jó", "O sofrimento de Jó é um teste de fé"] },
        ],
        5: [
            { question: "Segundo Elifas, o que o homem deve fazer diante da aflição?", answer: "Buscar a Deus e a Ele entregar a sua causa", distractors: ["Lutar com suas próprias forças", "Questionar a justiça divina"] },
            { question: "Como Elifas descreveu a condição do homem em relação ao sofrimento?", answer: "O homem nasce para o sofrimento, como as faúlhas das brasas voam para cima", distractors: ["O homem é predestinado à alegria eterna", "O sofrimento é apenas uma ilusão"] },
        ],
        6: [
            { question: "Como Jó descreveu o peso da sua angústia?", answer: "Mais pesada do que a areia dos mares", distractors: ["Como uma montanha de ferro", "Leve diante da glória de Deus"] },
            { question: "O que Jó desejava que Deus fizesse para acabar com seu sofrimento?", answer: "Que Deus o esmagasse e cortasse o fio da sua vida", distractors: ["Que Deus o curasse imediatamente", "Que Deus explicasse seus motivos"] },
        ],
        7: [
            { question: "A que Jó comparou a vida do homem na terra?", answer: "A um serviço militar (ou trabalho escravo) e seus dias como os de um mercenário", distractors: ["A um banquete real", "A um sono tranquilo"] },
            { question: "O que Jó perguntou a Deus sobre a vigilância divina sobre o homem?", answer: "Que é o homem para que o vigies cada manhã e o ponhas à prova cada momento?", distractors: ["Por que me amas tanto apesar do mal?", "Onde estavas quando fui ferido?"] },
        ],
        8: [
            { question: "Quem foi o segundo amigo a falar com Jó?", answer: "Bildade, o suíta", distractors: ["Zofar", "Eliú"] },
            { question: "O que Bildade sugeriu sobre os filhos de Jó?", answer: "Que eles pecaram e por isso foram entregues ao poder da sua transgressão", distractors: ["Que eles estavam em um lugar melhor", "Que Jó deveria ter orado mais por eles"] },
        ],
        9: [
            { question: "O que Jó reconheceu sobre a justiça de Deus em relação ao homem?", answer: "Como pode o homem ser justo para com Deus? Ele é sábio e poderoso", distractors: ["O homem pode provar sua inocência diante de Deus", "A justiça de Deus é igual à dos homens"] },
            { question: "O que Jó disse sobre a força de Deus na criação?", answer: "Ele move as montanhas e sacode a terra do seu lugar", distractors: ["Deus apenas observa o mundo", "O homem domina sobre a natureza"] },
        ],
        10: [
            { question: "O que Jó pediu que Deus fizesse em vez de apenas condená-lo?", answer: "Faze-me saber por que contendes comigo", distractors: ["Perdoa-me sem explicações", "Leva-me logo para a sepultura"] },
            { question: "Como Jó descreveu a forma como Deus o criou?", answer: "Como barro me formaste e como leite me vazaste e como queijo me coalhaste", distractors: ["Do pó da terra com sopro de vida", "À imagem dos anjos celestiais"] },
        ],
        11: [
            { question: "Quem foi o terceiro amigo a falar com Jó?", answer: "Zofar, o naamatita", distractors: ["Elifas", "Eliú"] },
            { question: "O que Zofar disse a Jó sobre o seu sofrimento e o pecado?", answer: "Que Deus estava sendo menos rigoroso do que a iniquidade de Jó merecia", distractors: ["Que Jó era o homem mais justo da terra", "Que o sofrimento era um mistério divino"] },
        ],
        12: [
            { question: "Como Jó rebateu a suposta sabedoria de seus amigos?", answer: "Vós sois o povo, e convosco morrerá a sabedoria!", distractors: ["Aprendo muito com vossas palavras", "Não sei nada comparado a vós"] },
            { question: "Segundo Jó, onde se encontra a sabedoria e a força?", answer: "Com Deus está a sabedoria e a força; d'Ele é o conselho e o entendimento", distractors: ["Nos livros dos antigos", "No coração dos homens bons"] },
        ],
        13: [
            { question: "O que Jó chamou os seus amigos por causa de seus conselhos?", answer: "Médicos que não valem nada e forjadores de mentiras", distractors: ["Sábios conselheiros", "Irmãos de alma"] },
            { question: "Qual foi a declaração de confiança de Jó mesmo em meio à morte?", answer: "Ainda que Ele me mate, n'Ele esperarei", distractors: ["Não temo a morte pois fui justo", "Deus me salvará na última hora"] },
        ],
        14: [
            { question: "Como Jó descreveu a brevidade da vida humana?", answer: "O homem nasce da mulher, vive poucos dias e está cheio de inquietação", distractors: ["A vida é longa para quem é justo", "O homem vive para sempre na terra"] },
            { question: "A que Jó comparou a esperança de uma árvore cortada em relação ao homem?", answer: "A árvore cortada pode brotar de novo, mas o homem, ao morrer, acaba-se", distractors: ["O homem é como a palmeira que floresce", "A árvore morre mas o homem revive logo"] },
        ],
        15: [
            { question: "No seu segundo discurso, Elifas acusou Jó de quê?", answer: "De aniquilar o temor de Deus e impedir a oração diante d'Ele", distractors: ["De roubar dos pobres em segredo", "De adorar falsos deuses"] },
        ],
        16: [
            { question: "Como Jó descreveu a atitude de seus amigos?", answer: "Consoladores molestos", distractors: ["Amigos fiéis", "Homens de visão"] },
        ],
        17: [
            { question: "Onde Jó disse que seria a sua casa (o seu leito)?", answer: "Nas trevas (na sepultura)", distractors: ["No palácio dos reis", "Nas montanhas de Uz"] },
        ],
        18: [
            { question: "Qual foi o foco do segundo discurso de Bildade?", answer: "O terrível fim do homem perverso", distractors: ["A misericórdia de Deus", "A vida após a morte"] },
        ],
        19: [
            { question: "Qual foi a declaração profética de Jó sobre o seu Redentor?", answer: "Eu sei que o meu Redentor vive, e que por fim se levantará sobre a terra", distractors: ["Deus virá me libertar da prisão", "Espero que minha família seja restaurada"] },
            { question: "O que Jó disse que aconteceria mesmo depois de sua pele ser consumida?", answer: "Ainda em minha carne verei a Deus", distractors: ["Meus ossos clamariam por justiça", "Minha alma seria esquecida"] },
        ],
        20: [
            { question: "O que Zofar disse sobre o triunfo dos perversos?", answer: "É breve e a alegria dos ímpios dura apenas um momento", distractors: ["Os perversos reinarão por gerações", "Deus não castiga os ímpios nesta vida"] },
        ],
        21: [
            { question: "O que Jó observou sobre a prosperidade dos ímpios que contradizia seus amigos?", answer: "Por que vivem os ímpios, envelhecem e ainda se tornam poderosos em bens?", distractors: ["Os ímpios sempre sofrem logo no início", "Apenas os justos ficam ricos"] },
        ],
        22: [
            { question: "De qual pecado grave Elifas acusou Jó sem provas no terceiro ciclo?", answer: "De ter explorado o pobre, o órfão e a viúva", distractors: ["De ter mentido ao rei de Uz", "De ter negligenciado os sacrifícios"] },
        ],
        23: [
            { question: "O que Jó disse sobre a sua busca por Deus?", answer: "Se vou para o oriente, não O encontro; se para o ocidente, não O percebo", distractors: ["Deus está sempre ao meu lado visivelmente", "Deus fala comigo em todos os sonhos"] },
            { question: "O que Jó disse sobre o resultado da sua aprovação por Deus?", answer: "Prova-me, e sairei como o ouro", distractors: ["Serei consumido pelo fogo", "Ficarei em silêncio para sempre"] },
        ],
        24: [
            { question: "O que Jó observou sobre as injustiças no mundo?", answer: "Os perversos removem limites, roubam rebanhos e oprimem o necessitado", distractors: ["O mundo é perfeitamente justo", "Deus impede o mal antes que aconteça"] },
        ],
        25: [
            { question: "Qual foi o curto argumento final de Bildade?", answer: "Como pode o homem ser justo para com Deus? Até as estrelas não são limpas aos seus olhos", distractors: ["Deus perdoará Jó se ele se calar", "A vida é um sonho passageiro"] },
        ],
        26: [
            { question: "Como Jó descreveu o poder de Deus sobre o universo?", answer: "Ele estende o norte sobre o vazio e suspende a terra sobre o nada", distractors: ["Deus criou o mundo sobre colunas de ouro", "A terra é sustentada pelas águas"] },
        ],
        27: [
            { question: "O que Jó jurou sobre a sua retidão?", answer: "Até que eu morra, nunca afastarei de mim a minha integridade", distractors: ["Pequei e agora me arrependo", "Não sei se fui justo ou não"] },
        ],
        28: [
            { question: "Segundo Jó 28, onde se encontra a verdadeira sabedoria?", answer: "O temor do Senhor é a sabedoria, e apartar-se do mal é o entendimento", distractors: ["Nas profundezas das minas de ouro", "No fundo do mar com as pérolas"] },
        ],
        29: [
            { question: "O que Jó relembrou com saudade do seu passado?", answer: "Os meses passados quando a luz de Deus brilhava sobre sua cabeça", distractors: ["Apenas a sua grande riqueza", "O tempo em que não conhecia a Deus"] },
        ],
        30: [
            { question: "Como os jovens e desprezíveis tratavam Jó agora?", answer: "Zombavam dele e o desprezavam", distractors: ["Continuavam a honrá-lo como mestre", "Pediam esmolas a ele"] },
        ],
        31: [
            { question: "Que pacto Jó disse ter feito com os seus olhos?", answer: "De não olhar para uma jovem (virgem) com desejo", distractors: ["De nunca chorar diante dos amigos", "De não ver o mal acontecendo"] },
        ],
        32: [
            { question: "Quem era o quarto homem que esperou para falar por ser o mais jovem?", answer: "Eliú, filho de Baraquel", distractors: ["Eliézer", "Enos"] },
            { question: "Por que Eliú ficou aceso em ira contra Jó?", answer: "Porque Jó se justificava a si mesmo mais do que a Deus", distractors: ["Porque Jó amaldiçoou a família de Eliú", "Porque Jó se recusou a pagar uma dívida"] },
        ],
        33: [
            { question: "O que Eliú disse sobre como Deus fala com o homem?", answer: "Pelo sonho, pela visão noturna e pela dor no leito", distractors: ["Apenas por meio de profetas famosos", "Deus nunca fala com o homem diretamente"] },
        ],
        34: [
            { question: "Segundo Eliú, Deus pode praticar a injustiça?", answer: "Longe de Deus o praticar a maldade, e do Todo-Poderoso o cometer injustiça", distractors: ["Deus às vezes comete erros", "A justiça de Deus é arbitrária"] },
        ],
        35: [
            { question: "Eliú argumentou que os gritos dos oprimidos às vezes não são ouvidos por quê?", answer: "Por causa da soberba dos maus que não buscam a Deus seriamente", distractors: ["Deus está muito ocupado no céu", "Deus não se importa com os pobres"] },
        ],
        36: [
            { question: "Como Eliú descreveu a grandeza de Deus na tempestade?", answer: "Eis que Deus é grande e não O compreendemos; o número dos Seus anos é incalculável", distractors: ["Deus é como um homem gigante nas nuvens", "O poder de Deus é limitado pelo tempo"] },
        ],
        37: [
            { question: "O que Eliú aconselhou Jó a fazer quanto às obras de Deus?", answer: "Para e considera as maravilhas de Deus", distractors: ["Foge para longe da tempestade", "Questiona Deus até obteres resposta"] },
        ],
        38: [
            { question: "De onde o Senhor respondeu a Jó?", answer: "Do meio de um redemoinho (tempestade)", distractors: ["De um fogo que não se consumia", "De uma voz mansa e delicada"] },
            { question: "O que Deus perguntou a Jó sobre a fundação da terra?", answer: "Onde estavas tu, quando eu fundava a terra?", distractors: ["Quem te deu permissão para orar?", "Quanto ouro puseste no mundo?"] },
        ],
        39: [
            { question: "Quais são alguns dos animais que Deus menciona para mostrar a Jó a Sua sabedoria e providência?", answer: "O leão, as cabras monteses, o jumento selvagem e o pavão", distractors: ["O camelo, a serpente e a ovelha", "O urso e o lobo"] },
        ],
        40: [
            { question: "Qual foi a primeira resposta de Jó após Deus falar pela primeira vez?", answer: "Sou indigno; que te responderia eu? Ponho a mão sobre a minha boca", distractors: ["Sou inocente e aqui estão minhas provas", "Por que demoraste tanto a aparecer?"] },
            { question: "Que criatura colossal Deus descreve a Jó, dizendo que come erva como o boi e sua força está nos lombos?", answer: "Beemote (ou hipopótamo)", distractors: ["Leviatã", "Unicórnio"] },
        ],
        41: [
            { question: "Qual criatura marinha terrível Deus descreve, da qual sai fogo da boca e solta fumaça pelas narinas?", answer: "Leviatã", distractors: ["Beemote", "Baleia"] },
            { question: "Quem pode pescar o Leviatã com anzol, segundo o desafio de Deus?", answer: "Ninguém entre os homens", distractors: ["Apenas os pescadores mais fortes", "Qualquer homem com coragem"] },
        ],
        42: [
            { question: "Qual foi a declaração final de Jó sobre o seu conhecimento de Deus?", answer: "Antes eu te conhecia só de ouvir falar, mas agora os meus olhos Te veem", distractors: ["Sempre soube tudo sobre Ti", "Ainda tenho dúvidas sobre o sofrimento"] },
            { question: "O que Deus ordenou que os três amigos de Jó fizessem?", answer: "Que oferecessem sacrifícios e que Jó orasse por eles", distractors: ["Que fossem expulsos da terra de Uz", "Que se tornassem servos de Jó"] },
            { question: "O que aconteceu com os bens de Jó no final de sua provação?", answer: "O Senhor deu a Jó o dobro de tudo o que antes possuíra", distractors: ["Jacó deu metade de seus bens a Jó", "Jó continuou pobre mas feliz"] },
            { question: "Como se chamavam as três filhas que Jó teve após a restauração?", answer: "Jemima, Quezia e Quéren-Hapuque", distractors: ["Hadassa, Sara e Raquel", "Lia, Zilpa e Bila"] },
            { question: "Como era a beleza das filhas de Jó em toda aquela terra?", answer: "Não se acharam mulheres tão formosas como as filhas de Jó", distractors: ["Eram comuns como as outras", "Eram sábias mas não bonitas"] },
        ],
    },
};
