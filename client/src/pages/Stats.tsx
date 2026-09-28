import { useProfile } from "../context/ProfileContext"
import StatsProfileCard from "../components/StatsProfileCard";
import { useEffect, useState } from "react"
import { apiRequest } from "../api/client";
import type { HeatmapStats } from "../types/stats";
import Heatmap from "../components/Heatmap"
import ProgressGraph from "../components/ProgressGraph";

type HeatmapStatsResponse = {
    data: HeatmapStats[];
}

type ProgressGraphPoint = {
    id: string;
    effective_wpm: number;
    created_at: string;
}

type ProgressGraphResponse = {
    data: ProgressGraphPoint[];
}

export default function Stats() {


    const { profile, loadingProfile } = useProfile();
    const [heatmapStats, setHeatmapStats] = useState<HeatmapStats[]>([]);
    const [graphData, setGraphData] = useState<ProgressGraphPoint[]>([]);

    useEffect(() => {
        const fetchHeatmapStats = async () => {
            try {
                const heatMapStats = await apiRequest<HeatmapStatsResponse>("/stats/heatmap");
                setHeatmapStats(heatMapStats.data);
                console.log(heatMapStats.data);
            } catch (err) {
                console.error(err);
            }
        }

        console.log(heatmapStats);

        fetchHeatmapStats();

    }, []);


    useEffect(() => {

        const fetchStats = async () => {
            try {

                const [heatmapResponse, graphResponse] = await Promise.all([
                    apiRequest<HeatmapStatsResponse>("/stats/heatmap"),
                    apiRequest<ProgressGraphResponse>("/stats/graph"),
                ]);

                setHeatmapStats(heatmapResponse.data);
                setGraphData(graphResponse.data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();

    }, []);

    if (loadingProfile) {
        return <>Loading...</>
    }




    return (

        <div className="h-screen flex gap-10 p-10 items-start overflow-y-auto box-border">
            <div className="flex-[0_0_380px] mt-20">
                <StatsProfileCard
                    wpm={profile?.current_wpm}
                    accuracy={profile?.current_accuracy}
                    effectiveSpeed={profile?.current_effective_wpm}
                    imageSrc={profile?.avatar_url}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-start gap-6">
                <img
                    src="/stats-wizard.png"
                    alt="Stats Wizard"
                    className="w-[600px] max-w-full h-auto object-contain"
                />

                <div className="w-full flex gap-6 items-stretch">
                    <Heatmap data={heatmapStats} />

                    <ProgressGraph data={graphData} />
                </div>
            </div>
        </div>
    );
}