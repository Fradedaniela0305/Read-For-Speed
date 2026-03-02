const API_BASE = "http://localhost:3001";

export async function createAttempt({ userId, drillType, targetWpm, accuracy }) {
  const res = await fetch(`${API_BASE}/attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, drillType, targetWpm, accuracy }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  return await res.json();
}

export async function getAttempts(userId, limit = 10) {
  const res = await fetch(
    `${API_BASE}/attempts?userId=${encodeURIComponent(userId)}&limit=${limit}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.attempts;
}