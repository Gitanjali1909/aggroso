import "dotenv/config";
import express from "express";
import cors from "cors";
import { askCodeQuestion } from "./services/openaiService.js";
import { extractCodebaseFromRepo } from "./services/repoService.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "codebase-qa-backend", timestamp: new Date().toISOString() });
});

app.post("/ask", async (req, res) => {
  try {
    const { codebase, question, repoUrl } = req.body || {};

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question is required" });
    }

    let resolvedCodebase = typeof codebase === "string" ? codebase.trim() : "";

    if (!resolvedCodebase && typeof repoUrl === "string" && repoUrl.trim()) {
      resolvedCodebase = await extractCodebaseFromRepo(repoUrl.trim());
    }

    if (!resolvedCodebase) {
      return res.status(400).json({ error: "Provide either codebase text or a repository URL." });
    }

    const aiResult = await askCodeQuestion({ codebase: resolvedCodebase, question });

    return res.json({
      question,
      ...aiResult,
      sourceType: codebase ? "pasted" : repoUrl ? "github" : "unknown",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to process request",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
