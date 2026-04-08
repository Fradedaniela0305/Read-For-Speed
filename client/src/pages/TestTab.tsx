import ProgressBar from "../components/ProgessBar";
import { useProfile } from "../context/ProfileContext";
import "../styles/testPage.css";
import { useNavigate } from "react-router-dom"

import { REQUIRED_SESSIONS_FOR_TEST, canUserTakeTest } from "../shared/testElegibility";;


export default function TestTab() {
    const { profile, loadingProfile } = useProfile();

    const navigate = useNavigate();

    const numberOfTrainsTaken = profile?.completed_session_count ?? 0;

    const canTakeTest = canUserTakeTest(numberOfTrainsTaken);

    const remainingSessions = Math.max(
        REQUIRED_SESSIONS_FOR_TEST - numberOfTrainsTaken,
        0
    );

    if (loadingProfile) {
        return <p>Loading...</p>;
    }



    return (
        <div className="test-page">
            <div className="test-left">
                <div className="test-action-group">

                    
                    <button className="take-test-button" disabled={!canTakeTest} onClick={() => {navigate("/progresstest")}}>
                        Take Test
                    </button>

                    <ProgressBar
                        completedSessions={numberOfTrainsTaken}
                        requiredSessions={REQUIRED_SESSIONS_FOR_TEST}
                    />
                </div>
            </div>

            <div className="test-right">
                <div className="mascot-placeholder">
                    <h1>MASCOT</h1>
                </div>

                <div className="test-message">
                    {canTakeTest ? (
                        <p>
                            The path is open <br />
                            Take the test and see whether you can raise your speed.
                        </p>
                    ) : (
                        <p>
                            Complete <strong>{remainingSessions}</strong> more training
                            session{remainingSessions !== 1 ? "s" : ""} to unlock your next test.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}