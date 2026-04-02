
type QuestionButtonProps = {
    option? : string;
    onAnswer? : (selectedAnswer : string) => void;
    isLocked : boolean;
};


export default function QuestionButton({ option = "A", onAnswer, isLocked=false} : QuestionButtonProps) {

    const onSelect = (option : string) => {
        onAnswer(option);
    }


    return (
        <button className="question-button" onClick={() => onSelect(option)}  disabled={isLocked}>
            {option}
        </button>
    )
}