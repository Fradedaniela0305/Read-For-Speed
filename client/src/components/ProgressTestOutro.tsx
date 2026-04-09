import { useNavigate } from "react-router-dom";

type SubmitTestResponse = {
  success: boolean;
  wpm: number;
  accuracy: number;
  effectiveWPM: number;
};

type ProgressTestOutroProps = {
  data: SubmitTestResponse;
};

export default function ProgressTestOutro({ data }: ProgressTestOutroProps) {
  const navigate = useNavigate();

  const { success, wpm, accuracy, effectiveWPM } = data;

  if (!success) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <div>
      <h1>Progress Test Complete</h1>

      <p>WPM: {wpm}</p>
      <p>Accuracy: {Math.round(accuracy * 100)}%</p>
      <p>Effective WPM: {effectiveWPM}</p>

      <button onClick={() => navigate("/train")}>
        Continue Training →
      </button>
    </div>
  );
}