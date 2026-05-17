import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";

import "../styles/stats.css";

type ProgressGraphPoint = {
  id: string;
  effective_wpm: number;
  created_at: string;
};

type ProgressGraphProps = {
  data: ProgressGraphPoint[];
};

export default function ProgressGraph({ data }: ProgressGraphProps) {
  if (data.length === 0) {
    return (
      <p className="progress-graph-empty">
        No progress tests yet.
      </p>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="progress-graph-container">
      <h2 className="progress-graph-title">
        Effective Reading Speed Progress
      </h2>

      <p className="progress-graph-subtitle">
        Your effective WPM across your latest progress tests
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />

          <XAxis
            dataKey="date"
            stroke="var(--text)"
          />

          <YAxis
            stroke="var(--text)"
          />

          <Tooltip
            contentStyle={{
              background: "var(--panel-dark)",
              border: "1px solid var(--accent)",
              borderRadius: "12px",
              color: "var(--text)",
            }}
          />

          <Line
            type="monotone"
            dataKey="effective_wpm"
            stroke="var(--accent)"
            strokeWidth={4}
            dot={{
              r: 6,
              fill: "var(--accent)",
            }}
            activeDot={{
              r: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}