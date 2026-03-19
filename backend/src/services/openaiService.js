import Groq from "groq-sdk";
import { systemPrompt } from "../prompts/systemPrompt.js";

function tryParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function trimContext(codebase) {
  const MAX_CONTEXT_LENGTH = 2000;
  if (!codebase) return "";

  return codebase.length > MAX_CONTEXT_LENGTH
    ? codebase.slice(0, MAX_CONTEXT_LENGTH)
    : codebase;
}

export async function askCodeQuestion({ codebase, question }) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    // ✅ Fallback if no API key
    if (!apiKey) {
      return {
        answer:
          "AI service is not configured. Set GROQ_API_KEY in backend/.env.",
        citations: [],
        model: "simulation"
      };
    }

    const client = new Groq({ apiKey });

    const safeCodebase = codebase || "";
const trimmedContext = trimContext(safeCodebase);

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
${trimmedContext}
`;

    const model = "llama3-8b-8192";

    // ✅ Timeout control
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await client.chat.completions.create(
      {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const outputText =
      response?.choices?.[0]?.message?.content?.trim() || "";

    if (!outputText) {
      return {
        answer: "Model returned an empty response.",
        citations: [],
        model
      };
    }

    const parsed = tryParseJson(outputText);

    // ✅ If valid JSON
    if (parsed && typeof parsed.answer === "string") {
      return {
        answer: parsed.answer,
        citations: Array.isArray(parsed.citations)
          ? parsed.citations
          : [],
        model
      };
    }

    // ✅ Fallback if not JSON
    return {
      answer: outputText,
      citations: [],
      model
    };

  } catch (error) {
    if (error.name === "AbortError") {
      console.error("GROQ_TIMEOUT_ERROR");
      return {
        answer: "AI request timed out. Please try again.",
        citations: [],
        model: "timeout"
      };
    }

    console.error("ASK_CODE_QUESTION_ERROR:", error.message);

    return {
      answer:
        "Server encountered an error while processing AI request. Please try again later.",
      citations: [],
      model: "error-safe"
    };
  }
}