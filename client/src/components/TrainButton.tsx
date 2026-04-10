import { Link } from "react-router-dom";

type TrainButtonProps = {
  to: string;
  label: string;
  image: string;
};

export default function TrainButton({ to, label, image }: TrainButtonProps) {
  return (
    <Link to={to} className="train-button">
      <img src={image} alt={label} className="train-button-img" />
      <span>{label}</span>
    </Link>
  );
}