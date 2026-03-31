import QuestionButton from "./QuestionButton"
import "../styles/baselineTest.css"

export default function QuestionCard({ question_text = "the question", options = ["a", "b", "c", "d"], answer = "a" }) {
    return (
        <div className="question-card-wrapper">
            <div className="question-card">
                <div className="question-banner">
                    <h2 className="question-text">{question_text}</h2>
                </div>

                <div className="question-options">
                    {options.map((option, index) => (
                        <QuestionButton key={index} option={option} />
                    ))}
                </div>
            </div>
        </div>
    )
}