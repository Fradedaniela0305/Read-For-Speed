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

    const actionButtonClasses = "p-[16px_34px] min-w-[190px] bg-gradient-to-r from-panel to-panel-dark border border-accent rounded-[8px] text-text text-[20px] tracking-[1px] cursor-pointer shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] [transition:transform_0.15s_ease,box-shadow_0.2s_ease,border-color_0.2s_ease] hover:-translate-y-[2px] hover:border-[var(--tab-hover)] hover:shadow-[0_0_16px_var(--accent-glow),0_8px_24px_rgba(0,0,0,0.5)]";

    return (
        <div className="min-h-screen p-[40px_clamp(24px,5vw,80px)_30px] box-border flex flex-col justify-center gap-[28px]">
            <div className="w-full flex justify-center">
                {testStatus === "idle" && (
                    <div className="relative w-[min(1100px,95vw)] h-[min(80vh,900px)] flex items-center justify-center max-[900px]:h-[68vh]">


                        <div
                            className="scroll-text-window relative w-[78%] h-[82%] overflow-y-auto p-[90px_100px_80px_100px] box-border text-[#2b1d11] bg-[length:145%_120%] bg-no-repeat bg-center rounded-[12px] max-[700px]:w-[92%] max-[700px]:h-[90%] flex items-center justify-center text-center"
                            style={{ backgroundImage: `url(${scrollImg})` }}
                        >
                            <p className="relative z-[1] m-0 whitespace-pre-line text-[24px] leading-[1.9] tracking-[0.2px] max-[900px]:text-[20px]">
                                Click Start when you are ready to begin reading.
                            </p>
                        </div>
                    </div>
                )}

                {testStatus === "running" && (
                    <div className="relative w-[min(1100px,95vw)] h-[min(80vh,900px)] flex items-center justify-center max-[900px]:h-[68vh]">
                        <div
                            className="scroll-text-window relative w-[78%] h-[82%] overflow-y-auto p-[90px_100px_80px_100px] box-border text-[#2b1d11] bg-[length:145%_120%] bg-no-repeat bg-center rounded-[12px] max-[700px]:w-[92%] max-[700px]:h-[90%]"
                            style={{ backgroundImage: `url(${scrollImg})` }}
                        >
                            <p className="relative z-[1] m-0 whitespace-pre-line text-[24px] leading-[1.9] tracking-[0.2px] max-[900px]:text-[20px]">{text}</p>
                        </div>
                    </div>
                )}

                {testStatus === "finished" && (
                    <div className="w-[min(700px,90vw)] p-[38px_40px] text-center bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-[12px] text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_12px_34px_rgba(0,0,0,0.55)] flex flex-col items-center gap-[22px]">
                        <p className="m-0 text-[24px] text-tab">Well Done! Time for Questions</p>
                        <button
                            className={actionButtonClasses}
                            onClick={handleFinish}>
                            TAKE TEST
                        </button>
                    </div>
                )}
            </div>

            <div className="w-[min(900px,90vw)] mx-auto flex justify-between items-center max-[900px]:w-[90vw] max-[700px]:flex-col max-[700px]:gap-[18px]">
                <div className="flex items-center max-[700px]:w-full max-[700px]:justify-center">
                    {testStatus === "idle" && (
                        <button
                            className={actionButtonClasses}
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
                            className={actionButtonClasses}
                            onClick={handleStop}
                        >
                            STOP
                        </button>
                    )}
                </div>

                <div className="flex items-center max-[700px]:w-full max-[700px]:justify-center">
                    {testStatus === "running" && (
                        <p className="m-0 min-w-[180px] text-right text-[28px] text-tab-hover tracking-[1px] [text-shadow:0_0_12px_var(--accent-glow)] max-[900px]:text-[24px] max-[700px]:text-center">Time: {elapsed.toFixed(1)}s</p>
                    )}
                </div>
            </div>
        </div>
    );
}