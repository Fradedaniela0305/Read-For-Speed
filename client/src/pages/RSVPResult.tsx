import { Navigate, useLocation, useNavigate } from "react-router-dom";

type RSVPResultPageState = {
    wpm: number;
    wordCount: number;
};

export default function RSVPResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as RSVPResultPageState | null;

    if (!state) {
        return <Navigate to="/train" replace />;
    }

    const { wpm, wordCount } = state;

    return (
        <div className="min-h-screen flex justify-center items-center py-10 px-6">
            <div className="w-[min(1000px,95vw)] p-9 flex flex-col gap-7 bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_18px_45px_rgba(0,0,0,0.6)]">
                <h1 className="text-[3rem] text-center m-0 tracking-[2px] text-text [text-shadow:0_0_6px_rgba(255,255,255,0.15),0_0_12px_rgba(255,255,255,0.1),0_0_25px_rgba(255,255,255,0.05)]">
                    Training Completed
                </h1>


                <div className="flex gap-8 items-stretch">


                    <div className="flex-[1.2] flex flex-col gap-5">
                        <div className="p-[22px] bg-white/[0.04] border border-white/[0.08] rounded-2xl [transition:all_0.2s_ease] hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]">
                            <p className="m-0 mb-2 text-[0.9rem] opacity-60">WPM</p>
                            <h2 className="m-0 text-[2.4rem] font-bold">{wpm}</h2>
                        </div>

                        <div className="p-[22px] bg-white/[0.04] border border-white/[0.08] rounded-2xl [transition:all_0.2s_ease] hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]">
                            <p className="m-0 mb-2 text-[0.9rem] opacity-60">Word Count</p>
                            <h2 className="m-0 text-[2.4rem] font-bold">{wordCount}</h2>
                        </div>

                        <div className="mt-2.5 flex gap-4">
                            <button
                                className="py-3 px-[22px] rounded-xl border border-accent bg-panel text-text font-semibold cursor-pointer [transition:all_0.2s_ease] hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.08)]"
                                onClick={() => navigate("/train")}
                            >
                                Back to Training
                            </button>
                        </div>
                    </div>


                    <div className="flex-1 flex items-center justify-center">
                          <img src="/icon-wizard.png" alt="mascot" className="w-[min(300px,100%)] h-auto object-contain"/>
                    </div>

                </div>
            </div>
        </div>
    );

}