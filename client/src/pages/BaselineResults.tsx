import { useLocation } from "react-router-dom";
import "../styles/test.css";
import { useNavigate } from "react-router-dom";


export default function BaselineResults() {
    type BaselineResultsLocationState = {
        success?: true;
        wpm?: number;
        accuracy?: number;
        efficientWPM?: number;
    };

    const location = useLocation();
    const state = location.state as BaselineResultsLocationState | null;

    const navigate = useNavigate();

    const success = state?.success;
    const wpm = state?.wpm;
    const accuracy = state?.accuracy;
    const efficientWPM = state?.efficientWPM;

    if (!success) {
        return <h1 className="error-text">Something went wrong</h1>;
    }

    return (
        <div className="baseline-results-wrapper">
            <div className="baseline-results-card">
                <h1 className="baseline-title">✨ Baseline Complete ✨</h1>
                <p className="baseline-subtitle">
                    Here’s how you performed:
                </p>

                <div className="baseline-stats">
                    <div className="stat-box">
                        <span className="stat-label">WPM</span>
                        <span className="stat-value">{wpm}</span>
                    </div>

                    <div className="stat-box">
                        <span className="stat-label">Accuracy</span>
                        <span className="stat-value">
                            {Math.round((accuracy ?? 0) * 100)}%
                        </span>
                    </div>

                    <div className="stat-box">
                        <span className="stat-label">Effective</span>
                        <span className="stat-value">{efficientWPM}</span>
                    </div>
                </div>

                <button
                    className="start-training-button"
                    onClick={() => navigate("/train")}
                >
                    Start Training →
                </button>
            </div>
        </div>
    );
}