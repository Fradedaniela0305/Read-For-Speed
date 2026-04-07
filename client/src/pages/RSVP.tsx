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
    const [wpm, setWpm] = useState<number>(profile?.efficient_wpm);

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

    return (
        <div className="rsvp-page">
            <div className="rsvp-word-panel">
                <span className="rsvp-word">
                    {words[currentWordIndex]}
                </span>
            </div>

            <div className="rsvp-bottom-bar">
                <button className="rsvp-exit-button" onClick={handleExit}>
                    Exit
                </button>

                <div className="rsvp-controls">
                    <button onClick={() => setIsPlaying(true)} disabled={isFinished}>Start</button>
                    <button onClick={() => setIsPlaying(false)} disabled={isFinished}>Pause</button>
                    <button
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