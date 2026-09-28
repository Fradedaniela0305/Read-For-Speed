import QuestionButton from "./QuestionButton"
import scrollQuestionImg from "../assets/scroll_question.png"


type QuestionCardProps = {
    question_text? : string;
    options? : string[];
    isLocked : boolean
    onAnswer? : (selectedAnswer : string) => void;
}

export default function QuestionCard({ question_text = "the question", options = ["a", "b", "c", "d"], isLocked=false, onAnswer = (selectedAnswer : string) => {} } : QuestionCardProps) {
    return (
        <div className="min-h-screen flex justify-center items-center p-[40px_24px] box-border">
            <div className="w-[min(1200px,95vw)] min-h-[50vh] p-[56px_60px] flex flex-col gap-[40px] bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_16px_48px_rgba(0,0,0,0.6)]">
                <div
                    className="w-full min-h-[200px] p-[50px_80px] box-border flex justify-center items-center text-center bg-[length:100%_180%] bg-no-repeat bg-center rounded-[10px]"
                    style={{ backgroundImage: `url(${scrollQuestionImg})` }}
                >
                    <h2 className="m-0 text-[#3c2813] tracking-[0.3px] text-[42px] leading-[1.35]">{question_text}</h2>
                </div>

                <div className="grid grid-cols-2 grid-rows-2 gap-[28px]">
                    {options.map((option, index) => (
                        <QuestionButton key={index} option={option} isLocked={isLocked} onAnswer={onAnswer} />
                    ))}
                </div>
            </div>
        </div>
    )
}