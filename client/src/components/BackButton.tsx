import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  navigateBackTo: string; 
};

export default function BackButton({navigateBackTo = "/signin" } : BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigateBackTo);
  };

  return (
    <button
      className="self-start mb-2.5 border-none bg-transparent p-0 text-sm text-tab cursor-pointer transition-colors duration-200 hover:text-tab-hover hover:[text-shadow:0_0_6px_var(--accent-glow)]"
      onClick={handleClick}
    >
      ← Back
    </button>
  );
}