import { useEffect, useState } from "react";
import { fetchHealth } from "../api/client";

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
    <section className="card">
      <h2>Server Status</h2>
      {loading ? <p>Checking backend health...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {health ? (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      ) : null}
    </section>
  );
}

export default StatusPage;