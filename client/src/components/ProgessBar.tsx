type ProgressBarProps = {
  completedSessions: number;
  requiredSessions?: number;
};

export default function ProgressBar({
  completedSessions,
  requiredSessions = 5,
}: ProgressBarProps) {
  const progress = Math.min((completedSessions / requiredSessions) * 100, 100);

  return (
    <div className="w-full max-w-none box-border">
      <p className="m-0 mb-[8px] w-full text-center text-[0.95rem] text-tab">
        {completedSessions} / {requiredSessions} sessions completed
      </p>

      <div className="group w-full h-[22px] box-border bg-gradient-to-b from-panel to-panel-dark rounded-[999px] overflow-hidden border border-accent shadow-[inset_0_2px_6px_rgba(0,0,0,0.65),inset_0_-1px_3px_rgba(255,255,255,0.05),0_0_10px_var(--accent-glow)] [transition:transform_0.25s_ease,box-shadow_0.25s_ease] hover:scale-[1.03] hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.65),inset_0_-1px_3px_rgba(255,255,255,0.05),0_0_16px_var(--accent-glow),0_0_26px_var(--accent-glow)]">
        <div
          className="relative h-full rounded-[999px] bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow),0_0_18px_var(--accent-glow),inset_0_1px_3px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2)] [transition:width_0.45s_ease,transform_0.25s_ease,box-shadow_0.25s_ease,filter_0.25s_ease] overflow-hidden group-hover:scale-y-[1.08] group-hover:brightness-[1.08] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(255,255,255,0.28)] before:via-[rgba(255,255,255,0.08)] before:via-35% before:to-transparent before:to-70% before:pointer-events-none after:content-[''] after:absolute after:top-0 after:left-[-35%] after:w-[35%] after:h-full after:bg-gradient-to-r after:from-transparent after:via-[rgba(255,255,255,0.45)] after:to-transparent after:[transform:skewX(-20deg)] after:animate-shine after:pointer-events-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}