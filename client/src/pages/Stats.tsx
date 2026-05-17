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

        <div className="stats-page">
            <div className="stats-left">
                <StatsProfileCard
                    wpm={profile?.current_wpm}
                    accuracy={profile?.current_accuracy}
                    effectiveSpeed={profile?.current_effective_wpm}
                    imageSrc={profile?.avatar_url}
                />
            </div>

            <div className="stats-right">
                <img
                    src="/stats-wizard.png"
                    alt="Stats Wizard"
                    className="stats-wizard"
                />

                <div className="stats-graphs-row">
                    <Heatmap data={heatmapStats} />

                    <ProgressGraph data={graphData} />
                </div>
            </div>
        </div>
    );
}