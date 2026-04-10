import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import "../styles/test.css";
import { apiRequest } from "../api/client";

type SubmitTestResponse = {
    success: boolean;
    wpm: number;
    accuracy: number;
    effectiveWPM: number;
};

type ProgressTestOutroProps = {
    data: SubmitTestResponse;
};

type ProgressTestUpdateReq = {
    wpm: number;
    accuracy: number;
    effectiveWPM: number;
}

type ProgressTestUpdateRes = {
    success: boolean;
};

export default function ProgressTestOutro({ data }: ProgressTestOutroProps) {
    const navigate = useNavigate();
    const { profile, refreshProfile } = useProfile();

    const { success, wpm, accuracy, effectiveWPM } = data;

    if (!success) {
        return <h1>Something went wrong</h1>;
    }

    const prevWPM = profile?.current_wpm ?? 0;
    const prevAccuracy = profile?.current_accuracy ?? 0;
    const prevEffectiveWPM = profile?.current_effective_wpm ?? 0;

    const wpmDiff = wpm - prevWPM;
    const accuracyDiff = accuracy - prevAccuracy;
    const effectiveWPMDiff = effectiveWPM - prevEffectiveWPM;

    function formatDiff(diff: number, isPercent = false) {
        const rounded = isPercent ? Math.round(diff * 100) : Math.round(diff);

        if (rounded > 0) return `↑ +${rounded}${isPercent ? "%" : ""}`;
        if (rounded < 0) return `↓ ${rounded}${isPercent ? "%" : ""}`;
        return "No change";
    }

    function diffClass(diff: number) {
        if (diff > 0) return "progress-positive";
        if (diff < 0) return "progress-negative";
        return "progress-neutral";
    }

    const handleFinish = async () => {

        try {

            const payload: ProgressTestUpdateReq = {
                wpm: wpm,
                accuracy: accuracy,
                effectiveWPM: effectiveWPM,
            }

            const response = await apiRequest<ProgressTestUpdateRes>("/progress/update", {
                method: "POST",
                body: JSON.stringify(payload)
            })

            await refreshProfile();

            if (response.success) {
                navigate("/train");
            }
        } catch (err) {
            console.error("Failed to update progress:", err);
        }

    }

    return (
        <div className="progress-outro">
            <div className="progress-outro-panel">
                <h1 className="progress-outro-title">Progress Test Complete</h1>
                <p className="progress-outro-subtitle">
                    Here’s how this session compares to your previous test.
                </p>

                <div className="progress-stats-grid">
                    <div className="progress-stat-card">
                        <p className="progress-stat-label">WPM</p>
                        <h2 className="progress-stat-value">{wpm}</h2>
                        <p className="progress-stat-previous">Previous: {prevWPM}</p>
                        <span className={`progress-diff ${diffClass(wpmDiff)}`}>
                            {formatDiff(wpmDiff)}
                        </span>
                    </div>

                    <div className="progress-stat-card">
                        <p className="progress-stat-label">Accuracy</p>
                        <h2 className="progress-stat-value">{Math.round(accuracy * 100)}%</h2>
                        <p className="progress-stat-previous">
                            Previous: {Math.round(prevAccuracy * 100)}%
                        </p>
                        <span className={`progress-diff ${diffClass(accuracyDiff)}`}>
                            {formatDiff(accuracyDiff, true)}
                        </span>
                    </div>

                    <div className="progress-stat-card">
                        <p className="progress-stat-label">Effective WPM</p>
                        <h2 className="progress-stat-value">{effectiveWPM}</h2>
                        <p className="progress-stat-previous">Previous: {prevEffectiveWPM}</p>
                        <span className={`progress-diff ${diffClass(effectiveWPMDiff)}`}>
                            {formatDiff(effectiveWPMDiff)}
                        </span>
                    </div>
                </div>

                <button
                    className="progress-outro-button"
                    onClick={handleFinish}
                >
                    Continue Training →
                </button>
            </div>
        </div>
    );
}