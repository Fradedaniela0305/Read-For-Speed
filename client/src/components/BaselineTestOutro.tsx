import "../styles/test.css";
import { useNavigate } from "react-router-dom";

type BaselineTestOutroProps = {
  data: {
    success: boolean;
    wpm: number;
    accuracy: number;
    efficientWPM: number;
  };
};

export default function BaselineTestOutro({ data }: BaselineTestOutroProps) {
  const navigate = useNavigate();

  const { success, wpm, accuracy, efficientWPM } = data;

  if (!success) {
    return <h1 className="error-text">Something went wrong</h1>;
  }

  return (
    <div className="baseline-results-wrapper">
      <div className="baseline-results-card">
        <h1 className="baseline-title">Baseline Complete</h1>
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
            <span className="stat-label">Effective WPM</span>
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