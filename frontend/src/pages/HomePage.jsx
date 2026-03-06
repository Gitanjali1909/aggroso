import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function HomePage() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [codebase, setCodebase] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [history] = useState(() => loadHistory());

  const canSubmit = useMemo(
    () => Boolean(question.trim() && (repoUrl.trim() || codebase.trim())),
    [question, repoUrl, codebase]
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedQuestion = question.trim();
    const trimmedRepoUrl = repoUrl.trim();
    const trimmedCodebase = codebase.trim();

    if (!trimmedQuestion) {
      setError("Question is required.");
      return;
    }

    if (!trimmedRepoUrl && !trimmedCodebase) {
      setError("Provide either a repository URL or pasted codebase text.");
      return;
    }

    navigate("/result", {
      state: {
        payload: {
          repoUrl: trimmedRepoUrl || undefined,
          codebase: trimmedCodebase || undefined,
          question: trimmedQuestion,
        },
      },
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Ask About a Codebase</h2>
          <p className="mt-1 text-sm text-slate-500">Submit a repository URL or raw code, then ask a focused question.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            GitHub Repository URL
            <input
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/owner/repo"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Codebase Text
            <textarea
              value={codebase}
              onChange={(event) => setCodebase(event.target.value)}
              rows={10}
              placeholder="Paste code files or snippets here"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Question
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              placeholder="What does the auth middleware validate?"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ask AI
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Recent Q&A</h2>
          <p className="mt-1 text-sm text-slate-500">Last 10 interactions for quick revisit.</p>
        </div>
        <HistoryList items={history} onSelect={(item) => navigate("/result", { state: { result: item } })} />
      </section>
    </div>
  );
}

export default HomePage;
