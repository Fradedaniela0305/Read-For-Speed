import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { RSVPReaderState } from "../types/RSVP"
import { useProfile } from "../context/ProfileContext";
import { apiRequest } from "../api/client";


type RSVPResultRequest = {
    wpm: number;
    wordCount: number;
};

type RSVPResultResponse = {
    success: boolean;
};

export default function RSVP() {

    const location = useLocation();
    const state = location.state as RSVPReaderState | null;
    const { profile, loadingProfile } = useProfile();

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [wpm, setWpm] = useState(200);
    const startTimeRef = useRef<number | null>(null);

    const [isFinished, setIsFinished] = useState(false);
    const intervalRef = useRef<number | null>(null);

    if (!state?.passageText.trim()) {
        return <Navigate to="/rsvp" replace />;
    }

    const passageText = state.passageText;
    const words = passageText.trim().split(/\s+/);
    const msPerWord = 60000 / wpm;



    const saveResults = async (): Promise<void> => {

        const payload: RSVPResultRequest = {
            wpm: wpm,
            wordCount: words.length
        }

        await apiRequest<RSVPResultResponse>("/rsvp/results", {
            method: "POST",
            body: JSON.stringify({
                wpm,
                wordCount: words.length,
            }),
        });
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
        <div>
            <h1>{words[currentWordIndex]}</h1>
            <button onClick={() => { setIsPlaying(true) }}>START </button>
            <button onClick={() => { setIsPlaying(false) }}> Pause </button>
        </div>
    );


}