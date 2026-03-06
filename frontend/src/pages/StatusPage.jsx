import { useEffect, useState } from "react";
import { fetchHealth } from "../utils/api";

function StatusPage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await fetchHealth();
        if (active) setHealth(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Health check failed");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">Server Status</h2>
      <p className="mt-1 text-sm text-slate-500">Backend health endpoint response.</p>
      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
          <span>Checking backend health...</span>
        </div>
      ) : null}
      {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {health ? (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
          {JSON.stringify(health, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}

export default StatusPage;
