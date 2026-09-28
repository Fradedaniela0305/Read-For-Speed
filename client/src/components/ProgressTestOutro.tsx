import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
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
        if (diff > 0) return "text-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]";
        if (diff < 0) return "text-[#ff8a8a] bg-[rgba(255,90,90,0.12)]";
        return "text-text bg-[rgba(255,255,255,0.08)]";
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
        <div className="min-h-screen flex justify-center items-center p-[2rem_1rem] text-text">
            <div className="w-[min(900px,100%)] bg-gradient-to-b from-panel to-panel-dark border border-[var(--accent-glow)] rounded-[20px] p-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.25),0_0_20px_var(--accent-glow)] text-center">
                <h1 className="m-0 mb-[0.5rem] text-[2rem] text-[var(--accent)]">Progress Test Complete</h1>
                <p className="m-0 mb-[2rem] text-text opacity-85">
                    Here’s how this session compares to your previous test.
                </p>

                <div className="grid grid-cols-3 gap-[1rem] mb-[2rem] max-[768px]:grid-cols-1">
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-[1.25rem_1rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <p className="m-0 mb-[0.5rem] text-[0.9rem] uppercase tracking-[0.08em] opacity-75">WPM</p>
                        <h2 className="m-0 text-[2rem] text-[var(--accent)]">{wpm}</h2>
                        <p className="m-[0.6rem_0_0.75rem] text-[0.95rem] opacity-80">Previous: {prevWPM}</p>
                        <span className={`inline-block p-[0.35rem_0.7rem] rounded-[999px] text-[0.9rem] font-semibold ${diffClass(wpmDiff)}`}>
                            {formatDiff(wpmDiff)}
                        </span>
                    </div>

                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-[1.25rem_1rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <p className="m-0 mb-[0.5rem] text-[0.9rem] uppercase tracking-[0.08em] opacity-75">Accuracy</p>
                        <h2 className="m-0 text-[2rem] text-[var(--accent)]">{Math.round(accuracy * 100)}%</h2>
                        <p className="m-[0.6rem_0_0.75rem] text-[0.95rem] opacity-80">
                            Previous: {Math.round(prevAccuracy * 100)}%
                        </p>
                        <span className={`inline-block p-[0.35rem_0.7rem] rounded-[999px] text-[0.9rem] font-semibold ${diffClass(accuracyDiff)}`}>
                            {formatDiff(accuracyDiff, true)}
                        </span>
                    </div>

                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-[1.25rem_1rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <p className="m-0 mb-[0.5rem] text-[0.9rem] uppercase tracking-[0.08em] opacity-75">Effective WPM</p>
                        <h2 className="m-0 text-[2rem] text-[var(--accent)]">{effectiveWPM}</h2>
                        <p className="m-[0.6rem_0_0.75rem] text-[0.95rem] opacity-80">Previous: {prevEffectiveWPM}</p>
                        <span className={`inline-block p-[0.35rem_0.7rem] rounded-[999px] text-[0.9rem] font-semibold ${diffClass(effectiveWPMDiff)}`}>
                            {formatDiff(effectiveWPMDiff)}
                        </span>
                    </div>
                </div>

                <button
                    className="bg-[var(--accent)] text-[var(--bg-bottom)] border-none rounded-[999px] p-[0.9rem_1.4rem] text-[1rem] font-bold cursor-pointer shadow-[0_0_16px_var(--accent-glow)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] hover:-translate-y-[1px] hover:shadow-[0_0_24px_var(--accent-glow)]"
                    onClick={handleFinish}
                >
                    Continue Training →
                </button>
            </div>
        </div>
    );
}