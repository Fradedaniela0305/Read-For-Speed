import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RSVPReaderState } from "../types/RSVP"
import BackButton from "../components/BackButton";

export default function RSVPSetupPage() {
    const [text, setText] = useState<string>("");
    const navigate = useNavigate();
    
    const handleStart = (): void => {
        if (!text.trim()) return;

        localStorage.setItem("rsvpText", text);

        navigate("/rsvp/read", {
            state: {
                passageText: text,
            } satisfies RSVPReaderState,
        });
    };

    return (
        <div className="min-h-screen flex justify-center items-center py-10 px-6 box-border">
            <BackButton navigateBackTo={"/train"}/>
            <div className="w-[min(900px,95vw)] py-10 px-9 flex flex-col gap-5 bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_16px_40px_rgba(0,0,0,0.6)]">
                <h1 className="text-[2rem] tracking-[1px]">Paste your text</h1>
                <p className="opacity-70 text-[0.95rem]">
                    Enter the passage you want to read in RSVP mode.
                </p>

                <textarea
                    className="w-full min-h-[260px] resize-y py-[18px] px-5 box-border rounded-xl border border-white/[0.08] bg-black/35 text-text text-base leading-[1.6] outline-none [transition:all_0.2s_ease] focus:border-accent focus:shadow-[0_0_0_1px_var(--accent)]"
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setText(e.target.value)
                    }
                    placeholder="Paste your text here..."
                />

                <button
                    className="mt-2.5 self-end py-3.5 px-7 rounded-xl border border-accent bg-panel text-text text-base font-semibold cursor-pointer [transition:all_0.2s_ease] enabled:hover:scale-[1.04] enabled:hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleStart}
                    disabled={!text.trim()}
                >
                    Start
                </button>
            </div>
        </div>
    );
}