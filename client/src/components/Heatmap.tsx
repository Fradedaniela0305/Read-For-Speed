import type { HeatmapStats } from "../types/stats.ts";

type HeatmapProps = {
    data: HeatmapStats[];
};

export default function Heatmap({ data }: HeatmapProps) {
    const maxTotal = Math.max(...data.map((item) => item.total), 1);

    function getHeatmapColor(total: number) {

        if (total === 0) return "var(--heatmap-0)";
        if (total < 3) return "var(--heatmap-1)";
        if (total < 5) return "var(--heatmap-2)";
        if (total < 10) return "var(--heatmap-3)";
        return "var(--heatmap-4)";
    }

    return (
        <div className="flex-1 min-w-0 p-6 rounded-[20px] flex flex-col gap-[18px]">

            <h2 className="m-0 text-text text-[1.4rem]">
                Activity Heatmap
            </h2>

            <p className="m-0 text-text opacity-75">
                Your daily reading activity
            </p>

            <div className="flex flex-wrap gap-1.5 max-w-[350px] ml-auto">
                {data.map((item) => (
                    <div key={item.day} className="relative group">
                        <div
                            className="w-[18px] h-[18px] rounded cursor-pointer [transition:transform_0.15s_ease] hover:scale-[1.15] hover:shadow-[0_0_8px_rgba(255,216,77,0.6)]"
                            style={{
                                backgroundColor: getHeatmapColor(item.total),
                            }}
                        />

                        <div className="absolute bottom-[130%] left-1/2 -translate-x-1/2 bg-[#111] text-white py-2 px-2.5 rounded-lg text-[0.8rem] whitespace-nowrap opacity-0 pointer-events-none [transition:opacity_0.15s_ease] z-[100] group-hover:opacity-100">
                            <p className="m-0">{item.day}</p>
                            <p className="m-0">
                                {item.total} {item.total === 1 ? "activity" : "activities"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}