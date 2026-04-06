import ProgressBar from "../components/ProgessBar";
import { useProfile } from "../context/ProfileContext";
import "../styles/testPage.css";

export default function Test() {
    const { profile, loadingProfile } = useProfile();

    const REQUIRED_SESSIONS = 5;
    const numberOfTrainsTaken = profile?.completed_session_count ?? 0;
    const canTakeTest = numberOfTrainsTaken >= REQUIRED_SESSIONS;

    const remainingSessions = Math.max(
        REQUIRED_SESSIONS - numberOfTrainsTaken,
        0
    );

    if (loadingProfile) {
        return <p>Loading...</p>;
    }

    return (
        <div className="test-page">
            <div className="test-left">
                <div className="test-action-group">
                    <button className="take-test-button" disabled={!canTakeTest}>
                        Take Test
                    </button>

                    <ProgressBar
                        completedSessions={numberOfTrainsTaken}
                        requiredSessions={REQUIRED_SESSIONS}
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