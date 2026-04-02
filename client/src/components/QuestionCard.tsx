import QuestionButton from "./QuestionButton"
import "../styles/test.css"


type QuestionCardProps = {
    question_text? : string;
    options? : string[];
    isLocked : boolean
    onAnswer? : (selectedAnswer : string) => void;
}

export default function QuestionCard({ question_text = "the question", options = ["a", "b", "c", "d"], isLocked=false, onAnswer = (selectedAnswer : string) => {} } : QuestionCardProps) {
    return (
        <div className="question-card-wrapper">
            <div className="question-card">
                <div className="question-banner">
                    <h2 className="question-text">{question_text}</h2>
                </div>

                <div className="question-options">
                    {options.map((option, index) => (
                        <QuestionButton key={index} option={option} isLocked={isLocked} onAnswer={onAnswer} />
                    ))}
                </div>
            </div>
        </div>
    )
}