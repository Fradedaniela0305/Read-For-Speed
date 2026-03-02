import { useEffect, useState } from "react";
import { createAttempt, getAttempts } from "./api";

export default function App() {
  // MVP “auth”: later replace with real login
  const userId = "demo@example.com";

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const data = await getAttempts(userId, 10);
      setAttempts(data);
    } catch (e) {
      setError(e.message ?? "Failed to load attempts");
    } finally {
      setLoading(false);
    }
  }

  async function addDemoAttempt() {
    setError(null);
    setLoading(true);
    try {
      await createAttempt({
        userId,
        drillType: "rsvp_single",
        targetWpm: 300,
        accuracy: 0.8,
      });
      await refresh();
    } catch (e) {
      setError(e.message ?? "Failed to create attempt");
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Speed Reading Gym</h1>
          <p className="text-sm opacity-70">User: {userId}</p>
        </header>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/15"
            onClick={addDemoAttempt}
            disabled={loading}
          >
            Add demo attempt
          </button>

          <button
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/15"
            onClick={refresh}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {error && <div className="p-3 rounded bg-red-500/20">{error}</div>}

        <section className="p-4 rounded bg-white/5">
          <h2 className="text-xl font-semibold mb-3">Recent attempts</h2>

          {loading && <div className="opacity-70">Loading…</div>}
          {!loading && attempts.length === 0 && (
            <div className="opacity-70">No attempts yet.</div>
          )}

          <ul className="space-y-2">
            {attempts.map((a) => (
              <li key={a.id} className="p-3 rounded bg-white/5">
                <div className="flex justify-between flex-wrap gap-2">
                  <div className="font-medium">{a.drill_type}</div>
                  <div className="text-sm opacity-70">
                    {new Date(a.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  targetWPM: <b>{a.target_wpm}</b> · accuracy:{" "}
                  <b>{Number(a.accuracy).toFixed(2)}</b> · effective:{" "}
                  <b>{Number(a.effective_speed).toFixed(0)}</b>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}