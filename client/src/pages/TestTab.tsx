import ProgressBar from "../components/ProgessBar";
import { useProfile } from "../context/ProfileContext";
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
        <div className="min-h-screen grid grid-cols-[1.05fr_0.95fr] gap-[40px] p-[48px] box-border text-text">
            <div className="flex justify-center items-center">
                <div className="w-[430px] flex flex-col items-stretch gap-[10px]">


                    <button
                        className="w-full min-h-[180px] border border-accent rounded-[26px] bg-gradient-to-b from-panel to-panel-dark text-text text-[2rem] font-bold tracking-[0.04em] box-border shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_var(--accent-glow),0_12px_28px_rgba(0,0,0,0.35)] [transition:transform_0.22s_ease,box-shadow_0.22s_ease,filter_0.22s_ease] hover:-translate-y-[2px] hover:scale-[1.01] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_var(--accent-glow),0_16px_34px_rgba(0,0,0,0.42)] hover:brightness-[1.05] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_6px_18px_rgba(0,0,0,0.25)]"
                        disabled={!canTakeTest}
                        onClick={() => { navigate("/progresstest") }}
                    >
                        Take Test
                    </button>

                    <ProgressBar
                        completedSessions={numberOfTrainsTaken}
                        requiredSessions={REQUIRED_SESSIONS_FOR_TEST}
                    />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-[20px]">
                <div>
                    <img
                        src={canTakeTest ? "/test-open-wizard.png" : "/test-closed-wizard.png"}
                        alt="Test Wizard"
                        className={`w-[800px] max-w-full h-auto object-contain [transition:transform_0.3s_ease,filter_0.3s_ease] ${canTakeTest ? "drop-shadow-[0_0_20px_var(--accent-glow)] animate-float" : ""}`}
                    />
                </div>

                <div className="max-w-[420px] text-center leading-[1.7] text-[1.3rem] font-medium text-text [text-shadow:0_0_10px_var(--accent-glow),0_0_20px_var(--accent-glow),0_0_40px_rgba(255,255,255,0.08)]">
                    {canTakeTest ? (
                        <p className="m-0 tracking-[0.02em]">
                            The path is open <br />
                            Test your new speed traveller
                        </p>
                    ) : (
                        <p className="m-0 tracking-[0.02em]">
                            Complete <strong>{remainingSessions}</strong> more training
                            session{remainingSessions !== 1 ? "s" : ""} to unlock your next test.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}