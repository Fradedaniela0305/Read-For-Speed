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
      className="train-button"
      onClick={() => navigate(to)}
      disabled={comingSoon}
    >
      <img src={image} alt={label} className="train-button-img" />
      <span>{label}</span>
      {comingSoon && <span className="badge">(Coming Soon)</span>}
    </button>
  );
}