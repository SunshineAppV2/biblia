import { getQuizBankAsync } from "./lib/quiz-data";

async function testSalmos() {
  console.log("Testando carregamento de Salmos...");
  const q1 = await getQuizBankAsync('salmos', 1);
  if (q1 && q1.length > 0) {
    console.log("✅ Salmo 1 carregado com sucesso!");
    console.log("Primeira pergunta:", q1[0].question);
  } else {
    console.log("❌ Falha ao carregar Salmo 1");
  }

  const q5 = await getQuizBankAsync('salmos', 5);
  if (q5 && q5.length > 0) {
    console.log("✅ Salmo 5 carregado com sucesso!");
  } else {
    console.log("❌ Falha ao carregar Salmo 5");
  }
}

testSalmos();
