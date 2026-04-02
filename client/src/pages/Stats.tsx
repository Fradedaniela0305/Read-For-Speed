import { useProfile } from "../context/ProfileContext"
import StatsProfileCard from "../components/StatsProfileCard";
import { useEffect, useState } from "react"
import { apiRequest } from "../api/client";
import type { HeatmapStats } from "../types/stats";
import Heatmap from "../components/Heatmap"


type HeatmapStatsResponse = {
     data: HeatmapStats[];
}

export default function Stats() {




    const { profile, loadingProfile } = useProfile();
    const [heatmapStats, setHeatmapStats] = useState<HeatmapStats[]>(null);

    useEffect(() => {
        const fetchHeatmapStats = async () => {
            try {
                const heatMapStats = await apiRequest<HeatmapStatsResponse>("/stats/heatmap");
                setHeatmapStats(heatMapStats.data);
            } catch (err) {
                console.error(err);
            }
        }

        console.log(heatmapStats);

        fetchHeatmapStats();

    }, []);


    if (!heatmapStats) {
        return<h1>Loading...</h1>
    }


    return (

        <div className="stats-page">
            <div className="stats-left">
                <StatsProfileCard
                    wpm={profile?.wpm}
                    accuracy={profile?.accuracy}
                    effectiveSpeed={profile?.efficient_wpm}
                    imageSrc={profile?.avatar_url}
                />
            </div>

            <div className="stats-right">
                <h1>Image place holder</h1>

                <Heatmap data={heatmapStats}/>
                <h1>HeatMap Coming Soon</h1>



            </div>
        </div>
    );
}