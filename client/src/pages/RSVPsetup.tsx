import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/rsvp.css"
import { RSVPReaderState } from "../types/RSVP"

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
        <div className="rsvp-setup-page">
            <div className="rsvp-setup-card">
                <h1 className="rsvp-setup-title">Paste your text</h1>
                <p className="rsvp-setup-subtitle">
                    Enter the passage you want to read in RSVP mode.
                </p>

                <textarea
                    className="rsvp-textarea"
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setText(e.target.value)
                    }
                    placeholder="Paste your text here..."
                />

                <button className="rsvp-start-button" onClick={handleStart} disabled={!text.trim()}>
                    Start
                </button>
            </div>
        </div>
    );
}