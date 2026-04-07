import "../App.css";
import "../styles/test.css";

type ProgressTestIntroProps = {
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProgressTestIntro({ setStart }: ProgressTestIntroProps) {
  return (
    <div className="baseline-container">
      <div className="baseline-card">
        <h1>WELCOME BACK TO Read. For Speed</h1>
        <h3>Check Your Progress</h3>

        <p className="preserve-format">
          You’ve completed enough training sessions to unlock a progress test.
          <br />
          <br />
          This test helps us see how your reading speed and comprehension are changing.
          <br />
          <br />
          You’ll read a short passage.
          <br />
          You control the timer — click Start when you begin and Stop when you finish.
          <br />
          Then you’ll answer a few comprehension questions.
          <br />
          <br />
          We use your results to:
          <br />
          <br />• measure your current reading speed (WPM)
          <br />• check your comprehension (Accuracy)
          <br />• update your ideal training speed
          <br />
          <br />
          Read naturally — not too fast, not too slow.
          <br />
          Focus on understanding as much as speed.
        </p>

        <button onClick={() => setStart(true)}>LET'S GO</button>
      </div>

      <div className="baseline-mascot">mascot placeholder</div>
    </div>
  );
}