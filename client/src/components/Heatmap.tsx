import type { HeatmapStats } from "../types/stats.ts";
import "../styles/stats.css";

type HeatmapProps = {
    data: HeatmapStats[];
};

export default function Heatmap({ data }: HeatmapProps) {
    const maxTotal = Math.max(...data.map((item) => item.total), 1);

    function getHeatmapColor(total: number) {
        const intensity = total / maxTotal;

        if (total === 0) return "var(--heatmap-0)";
        if (intensity < 0.25) return "var(--heatmap-1)";
        if (intensity < 0.5) return "var(--heatmap-2)";
        if (intensity < 0.75) return "var(--heatmap-3)";
        return "var(--heatmap-4)";
    }

    return (
        <div className="heatmap-container">

            <h2 className="heatmap-title">
                Activity Heatmap
            </h2>

            <p className="heatmap-subtitle">
                Your daily reading activity
            </p>

            <div className="heatmap">
                {data.map((item) => (
                    <div key={item.day} className="heatmap-wrapper">
                        <div
                            className="heatmap-block"
                            style={{
                                backgroundColor: getHeatmapColor(item.total),
                            }}
                        />

                        <div className="heatmap-tooltip">
                            <p>{item.day}</p>
                            <p>
                                {item.total} {item.total === 1 ? "activity" : "activities"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}