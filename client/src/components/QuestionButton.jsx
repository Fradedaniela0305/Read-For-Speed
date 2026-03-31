

export default function QuestionButton({ option = "A" }) {
    return (
        <button className="question-button">
            {option}
        </button>
    )
}