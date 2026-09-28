import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { RSVPReaderState } from "../types/RSVP"
import { useProfile } from "../context/ProfileContext";
import { apiRequest } from "../api/client";
import { useNavigate } from "react-router-dom";


type RSVPResultRequest = {
    wpm: number;
    wordCount: number;
    completed_at: string;
};

type RSVPResultResponse = {
    success: string;
};

export default function RSVP() {


    const { profile, loadingProfile, refreshProfile } = useProfile();

    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as RSVPReaderState | null;

    const passageText =
        state?.passageText || localStorage.getItem("rsvpText") || "";



    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [wpm, setWpm] = useState<number>(profile?.current_effective_wpm);

    const [isFinished, setIsFinished] = useState(false);
    const intervalRef = useRef<number | null>(null);

    if (!state?.passageText.trim()) {
        return <Navigate to="/rsvp" replace />;
    }


    const words = passageText.trim().split(/\s+/);
    const msPerWord = 60000 / wpm;


    const saveResults = async (): Promise<void> => {

        const payload: RSVPResultRequest = {
            wpm: wpm,
            wordCount: words.length,
            completed_at: new Date().toISOString()
        }

        await apiRequest<RSVPResultResponse>("/rsvp/results", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        refreshProfile();

    }


    const handleFinish = async (): Promise<void> => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setIsPlaying(false);
        setIsFinished(true);

        if (words.length >= 100) {
            await saveResults();
        }


    };

    const handleExit = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setIsPlaying(false);
        setIsFinished(false);
        setCurrentWordIndex(0);
        localStorage.removeItem("rsvpText");
        localStorage.removeItem("rsvpCurrentWordIndex");

        setIsPlaying(false);

        navigate("/train");
    };


    useEffect(() => {
        if (!isPlaying) return;
        if (words.length === 0) return;

        const msPerWord = 60000 / wpm;

        intervalRef.current = window.setInterval(() => {
            setCurrentWordIndex((prev) => prev + 1);
        }, msPerWord);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isPlaying, wpm, words.length]);

    useEffect(() => {
        if (currentWordIndex >= words.length - 1 && isPlaying) {
            handleFinish();
        }
    }, [currentWordIndex, words.length, isPlaying]);

    const controlButtonClasses =
        "py-3 px-5 rounded-[10px] border border-accent bg-panel text-text text-[0.95rem] font-semibold cursor-pointer [transition:all_0.2s_ease] enabled:hover:scale-105 enabled:hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none";

    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-10 p-10 box-border">
            <div className="relative w-[min(700px,90vw)] h-[180px] flex items-center justify-center bg-gradient-to-b from-[#f5e6c8] to-[#e8d6b0] border-2 border-[#c9b48a] rounded-[14px] shadow-[inset_0_0_10px_rgba(0,0,0,0.15),0_10px_30px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:w-0.5 before:h-2/5 before:top-0 before:[background:linear-gradient(to_bottom,rgba(0,0,0,0.15),transparent)] after:content-[''] after:absolute after:w-0.5 after:h-2/5 after:bottom-0 after:[background:linear-gradient(to_top,rgba(0,0,0,0.15),transparent)]">
                <span className="text-[3rem] font-semibold text-[#3a2f1b] text-center tracking-[1px]">
                    {words[currentWordIndex]}
                </span>
            </div>

            <div className="w-[min(700px,90vw)] flex justify-between items-center">
                <button
                    className="py-2.5 px-[18px] rounded-[10px] border border-[rgba(255,100,100,0.4)] bg-[rgba(80,20,20,0.4)] text-[#ffb3b3] text-[0.9rem] font-semibold cursor-pointer [transition:all_0.2s_ease] hover:scale-105 hover:bg-[rgba(120,30,30,0.6)] hover:shadow-[0_0_10px_rgba(255,80,80,0.2)]"
                    onClick={handleExit}
                >
                    Exit
                </button>

                <div className="w-[min(700px,90vw)] flex justify-end gap-4">
                    <button className={controlButtonClasses} onClick={() => setIsPlaying(true)} disabled={isFinished}>Start</button>
                    <button className={controlButtonClasses} onClick={() => setIsPlaying(false)} disabled={isFinished}>Pause</button>
                    <button
                        className={controlButtonClasses}
                        onClick={() =>
                            navigate("/rsvp/result", {
                                state: {
                                    wpm,
                                    wordCount: words.length,
                                },
                            })
                        }
                        disabled={!isFinished}
                    >
                        Continue
                    </button>

                </div>
            </div>
        </div>
    );

}