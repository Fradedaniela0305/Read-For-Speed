import { Link } from "react-router-dom";

export default function TrainButton({ to, label, image }) {

    return (
        <Link to={to} className="train-button">
            <img src={image} className="train-button-img" />
            <span>{label}</span>
        </Link>

    );



}