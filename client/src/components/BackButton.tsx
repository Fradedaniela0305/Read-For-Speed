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
    <button className="back-button" onClick={handleClick}>
      ← Back
    </button>
  );
}