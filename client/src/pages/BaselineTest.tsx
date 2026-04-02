import "../App.css";
import "../styles/test.css"
import { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { useNavigate } from "react-router-dom";

type TestStatus = "idle" | "running" | "finished";

type BaselineTestResponse = {
    id: number | string;
    passage_text: string;
    word_count: number;
};

export default function BaselineTest() {
    const navigate = useNavigate();

    const [start, setStart] = useState<boolean>(false);
    const [testStatus, setTestStatus] = useState<TestStatus>("idle");

    const [baselineText, setBaselineText] = useState<string>("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState<number>(0);

    const [baselineTestId, setBaselineTestId] = useState<number | string>("");
    const [readingTimeSeconds, setReadingTimeSeconds] = useState<number>(0);
    const [wordCount, setWordCount] = useState<number>(0);

    useEffect(() => {
        const fetchText = async () => {
            try {
                const { id, passage_text, word_count } =
                    await apiRequest<BaselineTestResponse>("/baseline/test");

                setBaselineText(passage_text);
                setWordCount(word_count);
                setBaselineTestId(id);
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

    if (!start) {
        return (
            <div className="baseline-container">
                <div className="baseline-card">
                    <h1>WELCOME TO Read. For Speed</h1>
                    <h3>Find Your Reading Speed</h3>

                    <p className="preserve-format">
                        Before you begin training, we need to understand how you read right now.
                        <br />
                        <br />
                        You’ll read a short passage.
                        <br />
                        You control the timer — click Start when you begin and Stop when you finish.
                        <br />
                        Then you’ll answer a few comprehension questions.
                        <br />
                        <br />
                        We use your results to calculate:
                        <br />
                        <br />• your reading speed (WPM)
                        <br />• your comprehension (Accuracy)
                        <br />• your ideal training speed
                        <br />
                        <br />
                        Read naturally — not too fast, not too slow.
                        <br />
                        Accuracy matters just as much as speed.
                    </p>

                    <button onClick={() => setStart(true)}>LET&apos;S GO</button>
                </div>

                <div className="baseline-mascot">mascot placeholder</div>
            </div>
        );
    }

    return (
        <div className="baseline-test-page">
            <div className="baseline-scroll-stage">
                {testStatus === "idle" && (
                    <div className="scroll-shell">
                        <div className="scroll-image-placeholder">
                            <span>Scroll Image Placeholder</span>
                        </div>

                        <div className="scroll-text-window scroll-text-window-idle">
                            <p className="scroll-placeholder-text">
                                Click Start when you are ready to begin reading.
                            </p>
                        </div>
                    </div>
                )}

                {testStatus === "running" && (
                    <div className="scroll-shell">
                        <div className="scroll-image-placeholder">
                            <span>Scroll Image Placeholder</span>
                        </div>

                        <div className="scroll-text-window">
                            <p className="scroll-reading-text">{baselineText}</p>
                        </div>
                    </div>
                )}

                {testStatus === "finished" && (
                    <div className="scroll-finished-card">
                        <p>IMAGE YAYYY YOU DID IT, NOW QUESTIONS</p>
                        <button
                            className="baseline-next-button"
                            onClick={() => {
                                navigate("/baselinetestquestions", {
                                    replace: true,
                                    state: {
                                        baselineTestId,
                                        readingTimeSeconds,
                                        wordCount,
                                    },
                                });
                            }}
                        >
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