import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { askQuestion } from "../api/client";
import HistoryList from "../components/HistoryList";

const HISTORY_KEY = "qa_history";

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 10)));
}

function HomePage() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [codebase, setCodebase] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => loadHistory());

  const canSubmit = useMemo(() => question.trim() && (repoUrl.trim() || codebase.trim()), [question, repoUrl, codebase]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Provide a question plus either repo URL or codebase text.");
      return;
    }

    setLoading(true);
    try {
      const result = await askQuestion({
        repoUrl: repoUrl.trim() || undefined,
        codebase: codebase.trim() || undefined,
        question: question.trim(),
      });

      const nextItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...result,
      };

      const nextHistory = [nextItem, ...history].slice(0, 10);
      setHistory(nextHistory);
      saveHistory(nextHistory);

      navigate("/result", { state: { result: nextItem } });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to ask question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid-two-col">
      <section className="card">
        <h2>Ask About a Codebase</h2>
        <form onSubmit={onSubmit} className="form-stack">
          <label>
            GitHub Repository URL
            <input
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/owner/repo"
            />
          </label>

          <label>
            Codebase Text
            <textarea
              value={codebase}
              onChange={(event) => setCodebase(event.target.value)}
              rows={10}
              placeholder="Paste code files or snippets here"
            />
          </label>

          <label>
            Question
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              placeholder="What does the auth middleware validate?"
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" disabled={!canSubmit || loading}>
            {loading ? "Analyzing..." : "Ask AI"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Recent Q&A (Last 10)</h2>
        <HistoryList items={history} onSelect={(item) => navigate("/result", { state: { result: item } })} />
      </section>
    </div>
  );
}

export default HomePage;