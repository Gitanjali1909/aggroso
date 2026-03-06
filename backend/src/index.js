import "dotenv/config";
import express from "express";
import cors from "cors";
import timeout from "connect-timeout";

import { askCodeQuestion } from "./services/openaiService.js";
import { extractCodebaseFromRepo } from "./services/repoService.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(timeout("15s"));
app.use(rateLimitMiddleware);

function toLogValue(value) {
  if (value === undefined || value === null || value === "") {
    return "n/a";
  }

  if (value instanceof Error) {
    return value.message;
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function logEvent(level, route, metadata = {}) {
  const timestamp = new Date().toISOString();
  const pairs = Object.entries(metadata).map(
    ([key, value]) => `${key}=${toLogValue(value)}`
  );
  const suffix = pairs.length ? ` ${pairs.join(" ")}` : "";
  const message = `[${timestamp}] [${route}]${suffix}`;

  if (level === "error") {
    console.error(message);
  } else {
    console.log(message);
  }
}

app.get("/health", (_req, res) => {
  const timestamp = new Date().toISOString();
  logEvent("info", "GET /health", { Status: "ok" });

  res.json({
    status: "ok",
    service: "codebase-qa-backend",
    timestamp,
  });
});

app.post("/ask", async (req, res) => {
  const { codebase, question, repoUrl } = req.body || {};

  const questionLength =
    typeof question === "string" ? question.trim().length : 0;

  const hasRepoUrl =
    typeof repoUrl === "string" && repoUrl.trim().length > 0;

  logEvent("info", "POST /ask", {
    QuestionLength: questionLength,
    RepoUrl: hasRepoUrl,
  });

  try {
    if (!question || typeof question !== "string") {
      logEvent("error", "POST /ask", {
        QuestionLength: questionLength,
        RepoUrl: hasRepoUrl,
        Error: "question is required",
      });

      return res.status(400).json({
        error: "question is required",
      });
    }

    let resolvedCodebase =
      typeof codebase === "string" ? codebase.trim() : "";

    if (!resolvedCodebase && hasRepoUrl) {
      resolvedCodebase = await extractCodebaseFromRepo(
        repoUrl.trim()
      );
    }

    if (!resolvedCodebase) {
      logEvent("error", "POST /ask", {
        QuestionLength: questionLength,
        RepoUrl: hasRepoUrl,
        Error: "missing codebase and repoUrl",
      });

      return res.status(400).json({
        error:
          "Provide either codebase text or a repository URL.",
      });
    }

    const aiResult = await askCodeQuestion({
      codebase: resolvedCodebase,
      question,
    });

    logEvent("info", "POST /ask", {
      QuestionLength: questionLength,
      RepoUrl: hasRepoUrl,
      Status: "success",
    });

    return res.json({
      question,
      ...aiResult,
      sourceType: codebase
        ? "pasted"
        : repoUrl
        ? "github"
        : "unknown",
    });
  } catch (error) {
    logEvent("error", "POST /ask", {
      QuestionLength: questionLength,
      RepoUrl: hasRepoUrl,
      Error:
        error instanceof Error
          ? error.message
          : String(error),
    });

    return res.status(500).json({
      error: "Failed to process request",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});


app.listen(port, () => {
  logEvent("info", "SERVER", {
    Message: `Backend listening on http://localhost:${port}`,
  });
});
