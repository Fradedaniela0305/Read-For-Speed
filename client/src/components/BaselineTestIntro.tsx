type baselineTestIntroProps = {
    setStart: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BaselineTestIntro({ setStart }: baselineTestIntroProps) {

    return (
        <div className="flex items-center justify-between min-h-screen p-[60px_clamp(30px,6vw,100px)] box-border">
            <div className="w-[45%] max-w-[650px] p-[40px_42px] bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-[10px] text-text text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_10px_40px_rgba(0,0,0,0.6)] flex flex-col gap-[18px]">
                <h1 className="m-0 text-[34px] text-tab-hover tracking-[1px]">WELCOME TO Read. For Speed</h1>
                <h3 className="m-0 text-[20px] text-tab">Find Your Reading Speed</h3>

                <p className="block whitespace-pre-line text-[16px] leading-[1.8] text-tab mt-[10px] mx-0 mb-[1em]">
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

                <button
                    className="mt-[12px] p-[14px_18px] self-start min-w-[180px] bg-gradient-to-r from-panel to-panel-dark border border-accent rounded-[6px] text-text text-[16px] tracking-[1px] cursor-pointer [transition:transform_0.15s_ease,box-shadow_0.2s_ease,border-color_0.2s_ease] hover:-translate-y-[2px] hover:border-[var(--tab-hover)] hover:shadow-[0_0_14px_var(--accent-glow)]"
                    onClick={() => setStart(true)}
                >
                    LET'S GO
                </button>
            </div>

            <div className="w-[40%] min-h-[500px] flex justify-center items-center">
                <img
                    src="/test-intro-wizard.png"
                    alt="Wizard mascot"
                    className="w-[700px] h-auto block"
                />
            </div>
        </div>
    );

}