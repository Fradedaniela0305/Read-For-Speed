import "../styles/testPage.css"

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
    <div className="progress-wrapper">
      <p className="progress-label">
        {completedSessions} / {requiredSessions} sessions completed
      </p>

      <div className="progress-bar-background">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}