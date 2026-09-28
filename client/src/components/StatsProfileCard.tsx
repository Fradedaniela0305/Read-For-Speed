import { useProfile } from "../context/ProfileContext"

type StatsProfileCardProps = {
    wpm: number;
    accuracy: number;
    effectiveSpeed: number;
    imageSrc: string;
};


export default function StatsProfileCard({ wpm = 0, accuracy = 0, effectiveSpeed = 0, imageSrc = "" }: StatsProfileCardProps) {
    const { profile, loadingProfile } = useProfile();

    return (
        <div className="w-full py-10 px-7 rounded-[18px] bg-gradient-to-b from-panel to-panel-dark border border-accent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.45)] flex flex-col items-center gap-7 max-[700px]:max-w-[380px]">
            <div className="w-full flex justify-center">
                {/* <div className="w-[130px] h-[130px] max-[700px]:w-[110px] max-[700px]:h-[110px] rounded-full overflow-hidden border-2 border-accent shadow-[0_0_14px_rgba(255,210,140,0.12),0_6px_18px_rgba(0,0,0,0.35)] bg-[rgba(0,0,0,0.18)] flex justify-center items-center">
                    <img src={imageSrc} alt="Profile avatar" className="w-full h-full object-cover block" />
                </div> */}
                <h1>{profile?.nickname}'s Stats</h1>
            </div>

            <div className="w-full flex flex-col gap-4">
                <div className="py-[18px] px-5 rounded-xl bg-black/20 border border-accent flex flex-col items-center gap-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_4px_14px_rgba(0,0,0,0.25)] [transition:transform_0.18s_ease,box-shadow_0.2s_ease,border-color_0.2s_ease] hover:-translate-y-0.5 hover:border-[var(--tab-hover)] hover:shadow-[0_0_12px_var(--accent-glow),0_0_24px_var(--accent-glow),0_6px_18px_rgba(0,0,0,0.35)]">
                    <span className="text-[0.9rem] tracking-[0.8px] opacity-75 uppercase">Effective WPM: </span>
                    <span className="text-[1.8rem] max-[700px]:text-[1.55rem] font-bold leading-[1.1] text-text">{effectiveSpeed}</span>
                </div>
                <div className="py-[18px] px-5 rounded-xl bg-black/20 border border-accent flex flex-col items-center gap-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_4px_14px_rgba(0,0,0,0.25)] [transition:transform_0.18s_ease,box-shadow_0.2s_ease,border-color_0.2s_ease] hover:-translate-y-0.5 hover:border-[var(--tab-hover)] hover:shadow-[0_0_12px_var(--accent-glow),0_0_24px_var(--accent-glow),0_6px_18px_rgba(0,0,0,0.35)]">
                    <span className="text-[0.9rem] tracking-[0.8px] opacity-75 uppercase">WPM: </span>
                    <span className="text-[1.8rem] max-[700px]:text-[1.55rem] font-bold leading-[1.1] text-text">{wpm}</span>
                </div>

                <div className="py-[18px] px-5 rounded-xl bg-black/20 border border-accent flex flex-col items-center gap-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_4px_14px_rgba(0,0,0,0.25)] [transition:transform_0.18s_ease,box-shadow_0.2s_ease,border-color_0.2s_ease] hover:-translate-y-0.5 hover:border-[var(--tab-hover)] hover:shadow-[0_0_12px_var(--accent-glow),0_0_24px_var(--accent-glow),0_6px_18px_rgba(0,0,0,0.35)]">
                    <span className="text-[0.9rem] tracking-[0.8px] opacity-75 uppercase">Accuracy: </span>
                    <span className="text-[1.8rem] max-[700px]:text-[1.55rem] font-bold leading-[1.1] text-text">{Math.round(accuracy * 100)}%</span>
                </div>

            </div>
        </div>
    )


}