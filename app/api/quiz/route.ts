import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

const client = new Anthropic();

export async function POST(req: Request) {
    try {
        const { verses, bookName, chapter } = await req.json();

        const verseText = (verses as string[])
            .slice(0, 40)
            .map((v, i) => `${i + 1}. ${v}`)
            .join("\n");

        const response = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `Você é um professor de Bíblia criando um quiz sobre ${bookName} capítulo ${chapter}.

Versículos:
${verseText}

Crie EXATAMENTE 3 perguntas de múltipla escolha baseadas APENAS no texto acima.

Retorne SOMENTE JSON válido neste formato, sem texto adicional:
{"questions":[{"question":"texto da pergunta","options":["Opção A","Opção B","Opção C","Opção D"],"correctIndex":0},{"question":"texto","options":["A","B","C","D"],"correctIndex":2},{"question":"texto","options":["A","B","C","D"],"correctIndex":1}]}

Regras obrigatórias:
- Perguntas sobre fatos explícitos no texto (nomes, ações, números, lugares)
- A resposta correta deve estar claramente no texto
- Distratores plausíveis mas incorretos para quem leu com atenção
- Português claro e direto
- correctIndex é o índice (0-3) da resposta correta no array options`,
                },
            ],
        });

        const content = response.content[0];
        if (content.type !== "text") throw new Error("Unexpected response type");

        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");

        const data = JSON.parse(jsonMatch[0]) as { questions: QuizQuestion[] };
        return NextResponse.json(data);
    } catch (error) {
        console.error("Quiz generation error:", error);
        return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
    }
}
