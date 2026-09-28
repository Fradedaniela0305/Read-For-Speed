
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
        <button
            className="min-h-[130px] p-[28px] flex items-center justify-center bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-[10px] text-text text-[20px] font-[inherit] tracking-[0.5px] cursor-pointer shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_6px_18px_rgba(0,0,0,0.4)] [transition:transform_0.18s_ease,box-shadow_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease] hover:-translate-y-[2px] hover:border-[var(--tab-hover)] hover:text-tab-hover hover:shadow-[0_0_18px_var(--accent-glow),0_6px_18px_rgba(0,0,0,0.5)] active:translate-y-0 active:shadow-[inset_0_0_6px_rgba(255,255,255,0.05),0_3px_10px_rgba(0,0,0,0.4)]"
            onClick={() => onSelect(option)}
            disabled={isLocked}
        >
            {option}
        </button>
    )
}