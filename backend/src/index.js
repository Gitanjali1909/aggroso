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
app.use(timeout("30s"));
app.use(rateLimitMiddleware);

// 🛑 IMPORTANT: stop processing if request already timed out
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

app.use(haltOnTimedout);

// ---------------- LOGGING ----------------

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

// ---------------- ROUTES ----------------

app.get("/health", (_req, res) => {
  logEvent("info", "GET /health", { Status: "ok" });

  res.json({
    status: "ok",
    service: "codebase-qa-backend",
    timestamp: new Date().toISOString(),
  });
});

app.post("/ask", async (req, res) => {
  if (req.timedout) return; // 🛑 prevent crash

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
    // 🟡 Validate question
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "question is required",
      });
    }

    // 🟡 Safe codebase
    let resolvedCodebase =
      typeof codebase === "string" ? codebase.trim() : "";

    // 🟡 Extract repo (safe)
    if (!resolvedCodebase && hasRepoUrl) {
      try {
        resolvedCodebase = await extractCodebaseFromRepo(
          repoUrl.trim()
        );
      } catch (repoError) {
        logEvent("error", "REPO_EXTRACTION", {
          Error: repoError.message,
        });

        return res.status(500).json({
          error: "Failed to fetch repository",
        });
      }
    }

    if (!resolvedCodebase) {
      return res.status(400).json({
        error:
          "Provide either codebase text or a repository URL.",
      });
    }

    // 🟡 Call AI safely
    const aiResult = await askCodeQuestion({
      codebase: resolvedCodebase,
      question,
    });

    if (req.timedout) return; // 🛑 prevent sending after timeout

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
    if (req.timedout) return;

    logEvent("error", "POST /ask", {
      Error: error?.message || "unknown",
    });

    return res.status(500).json({
      error: "Failed to process request",
      details: error?.message || "unknown error",
    });
  }
});

// ---------------- SERVER ----------------

app.listen(port, () => {
  logEvent("info", "SERVER", {
    Message: `Backend running on port ${port}`,
  });
});