import { useNavigate } from "react-router-dom";

type BaselineTestOutroProps = {
  data: {
    success: boolean;
    wpm: number;
    accuracy: number;
    effectiveWPM: number;
  };
};

export default function BaselineTestOutro({ data }: BaselineTestOutroProps) {
  const navigate = useNavigate();

  const { success, wpm, accuracy, effectiveWPM } = data;

  if (!success) {
    return <h1 className="text-center mt-[100px]">Something went wrong</h1>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-[40px_20px]">
      <div className="w-[min(700px,100%)] p-[40px_32px] rounded-[16px] bg-gradient-to-b from-panel to-panel-dark border border-accent shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.03)] flex flex-col items-center gap-[24px]">
        <h1 className="text-[2rem] text-center tracking-[0.5px] [text-shadow:0_0_8px_rgba(255,200,120,0.4)]">Baseline Complete</h1>
        <p className="opacity-80 text-[0.95rem]">
          Here’s how you performed:
        </p>

        <div className="w-full grid grid-cols-3 gap-[20px] mt-[10px]">
          <div className="bg-[rgba(0,0,0,0.25)] border border-accent rounded-[12px] p-[20px] text-center flex flex-col gap-[8px] [transition:transform_0.15s_ease,box-shadow_0.15s_ease] hover:-translate-y-[2px] hover:border-[var(--tab-hover)] hover:shadow-[0_0_12px_var(--accent-glow),0_0_24px_var(--accent-glow),0_8px_20px_rgba(0,0,0,0.4)]">
            <span className="text-[0.85rem] opacity-70 tracking-[1px]">WPM</span>
            <span className="text-[1.6rem] font-bold">{wpm}</span>
          </div>

          <div className="bg-[rgba(0,0,0,0.25)] border border-accent rounded-[12px] p-[20px] text-center flex flex-col gap-[8px] [transition:transform_0.15s_ease,box-shadow_0.15s_ease] hover:-translate-y-[2px] hover:border-[var(--tab-hover)] hover:shadow-[0_0_12px_var(--accent-glow),0_0_24px_var(--accent-glow),0_8px_20px_rgba(0,0,0,0.4)]">
            <span className="text-[0.85rem] opacity-70 tracking-[1px]">Accuracy</span>
            <span className="text-[1.6rem] font-bold">
              {Math.round((accuracy ?? 0) * 100)}%
            </span>
          </div>

          <div className="bg-[rgba(0,0,0,0.25)] border border-accent rounded-[12px] p-[20px] text-center flex flex-col gap-[8px] [transition:transform_0.15s_ease,box-shadow_0.15s_ease] hover:-translate-y-[2px] hover:border-[var(--tab-hover)] hover:shadow-[0_0_12px_var(--accent-glow),0_0_24px_var(--accent-glow),0_8px_20px_rgba(0,0,0,0.4)]">
            <span className="text-[0.85rem] opacity-70 tracking-[1px]">Effective WPM</span>
            <span className="text-[1.6rem] font-bold">{effectiveWPM}</span>
          </div>
        </div>

        <button
          className="mt-[20px] p-[14px_28px] text-[16px] font-[inherit] tracking-[0.5px] text-text bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-[10px] cursor-pointer shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_6px_18px_rgba(0,0,0,0.4)] [transition:transform_0.18s_ease,box-shadow_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease] hover:-translate-y-[2px] hover:border-[var(--tab-hover)] hover:text-tab-hover hover:shadow-[0_0_18px_var(--accent-glow),0_6px_18px_rgba(0,0,0,0.5)] active:translate-y-0 active:shadow-[inset_0_0_6px_rgba(255,255,255,0.05),0_3px_10px_rgba(0,0,0,0.4)]"
          onClick={() => navigate("/train")}
        >
          Start Training →
        </button>
      </div>
    </div>
  );
}