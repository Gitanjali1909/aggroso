import OpenAI from "openai";
import { systemPrompt } from "../prompts/systemPrompt.js";

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function askCodeQuestion({ codebase, question }) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        answer:
          "OpenAI API key is not configured. Set OPENAI_API_KEY in backend/.env.",
        citations: [],
        model: "simulation"
      };
    }

    const client = new OpenAI({ apiKey });

    const prompt = `
Return ONLY valid JSON.

Schema:
{
  "answer": "string",
  "citations": [
    {
      "filePath": "string",
      "lineStart": 1,
      "lineEnd": 5,
      "snippet": "string"
    }
  ]
}

If line numbers are uncertain, estimate them.

Question:
${question}

Codebase context:
${codebase}
`;

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const outputText =
      response?.choices?.[0]?.message?.content?.trim() || "";

    const parsed = tryParseJson(outputText);

    if (parsed && typeof parsed.answer === "string") {
      return {
        answer: parsed.answer,
        citations: Array.isArray(parsed.citations)
          ? parsed.citations
          : [],
        model
      };
    }

    return {
      answer: outputText || "Model returned an empty response.",
      citations: [],
      model
    };
  } catch (error) {
    console.error("ASK_CODE_QUESTION_ERROR:", error.message);

    return {
      answer:
        "Server encountered an error while processing AI request. Please try again later.",
      citations: [],
      model: "error-safe"
    };
  }
}