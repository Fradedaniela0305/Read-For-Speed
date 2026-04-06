import "../styles/stats.css"
import { useProfile } from "../context/ProfileContext"

type StatsProfileCardProps = {
    wpm: number;
    accuracy: number;
    effectiveSpeed: number;
    imageSrc: string;
};


export default function StatsProfileCard({ wpm = 0, accuracy = 0, effectiveSpeed = 0, imageSrc = "" }: StatsProfileCardProps) {
    const { profile, loadingProfile } = useProfile();

    return (
        <div className="stats-profile-card">
            <div className="stats-profile-avatar-section">
                {/* <div className="stats-profile-avatar-frame">
                    <img src={imageSrc} alt="Profile avatar" className="stats-profile-avatar" />
                </div> */}
                <h1>{profile?.nickname}'s Stats</h1>
            </div>

            <div className="stats-profile-metrics">
                <div className="stats-profile-metric">
                    <span className="stats-profile-label">Effective WPM: </span>
                    <span className="stats-profile-value">{effectiveSpeed}</span>
                </div>
                <div className="stats-profile-metric">
                    <span className="stats-profile-label">WPM: </span>
                    <span className="stats-profile-value">{wpm}</span>
                </div>

                <div className="stats-profile-metric">
                    <span className="stats-profile-label">Accuracy: </span>
                    <span className="stats-profile-value">{Math.round(accuracy * 100)}%</span>
                </div>

            </div>
        </div>
    )


}