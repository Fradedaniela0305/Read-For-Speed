import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "../styles/rsvp.css"

type RSVPResultPageState = {
    wpm: number;
    wordCount: number;
};

export default function RSVPResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as RSVPResultPageState | null;

    if (!state) {
        return <Navigate to="/train" replace />;
    }

    const { wpm, wordCount } = state;

    return (
        <div className="rsvp-result-page">
            <div className="rsvp-result-card">
                <h1 className="rsvp-result-title">
                    Training Completed
                </h1>


                <div className="rsvp-result-content">


                    <div className="rsvp-result-left">
                        <div className="rsvp-result-stat-box">
                            <p className="rsvp-result-stat-label">WPM</p>
                            <h2 className="rsvp-result-stat-value">{wpm}</h2>
                        </div>

                        <div className="rsvp-result-stat-box">
                            <p className="rsvp-result-stat-label">Word Count</p>
                            <h2 className="rsvp-result-stat-value">{wordCount}</h2>
                        </div>

                        <div className="rsvp-result-buttons">
                            <button onClick={() => navigate("/train")}>Back to Training</button>
                        </div>
                    </div>


                    <div className="rsvp-result-right">
                        <div className="rsvp-mascot-placeholder">
                            <h2>Mascot</h2>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

}