import "../App.css";
import "../styles/test.css"
import { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { useNavigate } from "react-router-dom";
import scrollImg from "../assets/scroll.png";


type IntroProps = {
    setStart: React.Dispatch<React.SetStateAction<boolean>>;
};

type ReadingTestProps = {
    IntroComponent: React.ComponentType<IntroProps>;
    fetchEndpoint: string;
    navigateTo : string;
}

type TestStatus = "idle" | "running" | "finished";

type TestResponse = {
    id: number | string;
    passage_text: string;
    word_count: number;
};

export default function ReadingTest({ IntroComponent, fetchEndpoint, navigateTo }: ReadingTestProps) {
    const navigate = useNavigate();

    const [start, setStart] = useState<boolean>(false);
    const [testStatus, setTestStatus] = useState<TestStatus>("idle");

    const [text, setText] = useState<string>("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState<number>(0);

    const [testId, setTestId] = useState<number | string>("");
    const [readingTimeSeconds, setReadingTimeSeconds] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);

    useEffect(() => {
        const fetchText = async () => {
            try {
                const { id, passage_text, word_count } =
                    await apiRequest<TestResponse>(fetchEndpoint);

                setText(passage_text);
                setWordCount(word_count);
                setTestId(id);
            } catch (err) {
                console.error(err);
            }
        };

        fetchText();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (testStatus === "running" && startTime !== null) {
            interval = setInterval(() => {
                setElapsed((Date.now() - startTime) / 1000);
            }, 100);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [testStatus, startTime]);

    const handleStop = (): void => {
        if (startTime === null) return;

        const end = Date.now();
        setEndTime(end);
        setTestStatus("finished");

        const readingTimeSeconds = (end - startTime) / 1000;
        setReadingTimeSeconds(readingTimeSeconds);
    };

    const handleFinish = () => {
        navigate(navigateTo, {
            replace: true,
            state: {
                testId,
                readingTimeSeconds,
                wordCount
            },
        });
    }

    if (!start) {
        return <IntroComponent setStart={setStart} />;
    }

    return (
        <div className="baseline-test-page">
            <div className="baseline-scroll-stage">
                {testStatus === "idle" && (
                    <div className="scroll-shell">


                        <div className="scroll-text-window scroll-text-window-idle">
                            <p className="scroll-placeholder-text">
                                Click Start when you are ready to begin reading.
                            </p>
                        </div>
                    </div>
                )}

                {testStatus === "running" && (
                    <div className="scroll-shell">
                        <div className="scroll-text-window">
                            <p className="scroll-reading-text">{text}</p>
                        </div>
                    </div>
                )}

                {testStatus === "finished" && (
                    <div className="scroll-finished-card">
                        <p>Well Done! Time for Questions</p>
                        <button
                            className="baseline-next-button"
                            onClick={handleFinish}>
                            TAKE TEST
                        </button>
                    </div>
                )}
            </div>

            <div className="baseline-controls">
                <div className="baseline-controls-left">
                    {testStatus === "idle" && (
                        <button
                            className="baseline-action-button"
                            onClick={() => {
                                setStartTime(Date.now());
                                setTestStatus("running");
                            }}
                        >
                            START
                        </button>
                    )}

                    {testStatus === "running" && (
                        <button
                            className="baseline-action-button"
                            onClick={handleStop}
                        >
                            STOP
                        </button>
                    )}
                </div>

                <div className="baseline-controls-right">
                    {testStatus === "running" && (
                        <p className="baseline-timer">Time: {elapsed.toFixed(1)}s</p>
                    )}
                </div>
            </div>
        </div>
    );
}