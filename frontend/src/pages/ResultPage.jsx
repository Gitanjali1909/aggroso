import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AnswerCard from "../components/AnswerCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { askQuestion } from "../utils/api";

const HISTORY_KEY = "qa_history";

function appendHistory(item) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const items = Array.isArray(parsed) ? parsed : [];
    const nextItems = [item, ...items].slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextItems));
  } catch {
    // Ignore history write failures.
  }
}

function ResultPage() {
  const location = useLocation();
  const initialResult = location.state?.result || null;
  const payload = location.state?.payload || null;
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(!initialResult && Boolean(payload));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadResult() {
      if (!payload || initialResult) {
        return;
      }

      try {
        const data = await askQuestion(payload);
        if (!active) {
          return;
        }

        const nextItem = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...data,
        };

        appendHistory(nextItem);
        setResult(nextItem);
      } catch (requestError) {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to ask question"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadResult();

    return () => {
      active = false;
    };
  }, [payload, initialResult]);

  return (
    <div className="space-y-4">
      {loading ? <SkeletonLoader lines={7} /> : null}
      {!loading && error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      {!loading && !error ? <AnswerCard result={result} /> : null}
      <Link
        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
        to="/"
      >
        Ask another question
      </Link>
    </div>
  );
}

export default ResultPage;
