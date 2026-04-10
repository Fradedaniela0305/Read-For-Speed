import TrainButton from "../components/TrainButton";
import "../styles/train.css";

type TrainButtonConfig = {
  to: string;
  label: string;
  image: string;
};

export default function Train() {

  const buttons: TrainButtonConfig[] = [
    { to: "/rsvpsetup", label: "RSVP", image: "/icon-wizard.png" },
    { to: "/chunked", label: "Chunked RSVP", image: "/icon-wizard.png" },
    { to: "/drills", label: "Speed Drills", image: "/icon-wizard.png" },
  ];

  return (
    <div className="train-page">

      <div className="train-wizard">
        <img src="/train-wizard.png" alt="Training Wizard" />
      </div>

      <div className="train-button-container">
        {buttons.map((b) => (
          <TrainButton
            key={b.to}
            to={b.to}
            label={b.label}
            image={b.image}
          />
        ))}
      </div>

    </div>
  );
}