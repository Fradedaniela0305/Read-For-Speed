import { useNavigate } from "react-router-dom";

type TrainButtonProps = {
  to: string;
  label: string;
  image: string;
  comingSoon: boolean;
};

export default function TrainButton({
  to,
  label,
  image,
  comingSoon,
}: TrainButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className="flex items-center gap-6 w-4/5 py-8 px-9 bg-gradient-to-r from-panel to-panel-dark border border-accent rounded-lg text-text text-[30px] font-medium tracking-[1px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_8px_28px_rgba(0,0,0,0.55)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-x-2 hover:border-tab-hover hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_0_24px_var(--accent-glow),0_8px_28px_rgba(0,0,0,0.65)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:border-accent disabled:hover:shadow-none"
      onClick={() => navigate(to)}
      disabled={comingSoon}
    >
      <img
        src={image}
        alt={label}
        className="w-[85px] h-[85px] object-contain drop-shadow-[0_0_8px_var(--accent-glow)]"
      />
      <span>{label}</span>
      {comingSoon && <span>(Coming Soon)</span>}
    </button>
  );
}