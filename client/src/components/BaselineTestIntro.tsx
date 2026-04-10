import "../App.css";
import "../styles/test.css"



type baselineTestIntroProps = {
    setStart: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BaselineTestIntro({ setStart }: baselineTestIntroProps) {

    return (
        <div className="baseline-container">
            <div className="baseline-card">
                <h1>WELCOME TO Read. For Speed</h1>
                <h3>Find Your Reading Speed</h3>

                <p className="preserve-format">
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

                <button onClick={() => setStart(true)}>LET'S GO</button>
            </div>

            <div className="baseline-mascot">
                <img
                    src="/test-intro-wizard.png"
                    alt="Wizard mascot"
                    className="baseline-mascot-image"
                />
            </div>
        </div>
    );

}