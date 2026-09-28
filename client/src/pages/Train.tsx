import TrainButton from "../components/TrainButton";

type TrainButtonConfig = {
  to: string;
  label: string;
  image: string;
  comingSoon: boolean;
};

export default function Train() {

  const buttons: TrainButtonConfig[] = [
    { to: "/rsvpsetup", label: "RSVP", image: "/icon-wizard.png", comingSoon: false },
    { to: "/chunked", label: "Chunked RSVP", image: "/icon-wizard.png", comingSoon: true},
    { to: "/drills", label: "Speed Drills", image: "/icon-wizard.png", comingSoon: true},
  ];

  return (
    <div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 flex justify-center items-center">
        <img src="/train-wizard.png" alt="Training Wizard" className="w-[1000px] max-w-full h-auto" />
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[35%] max-w-[900px] flex flex-col gap-8">
        {buttons.map((b) => (
          <TrainButton
            key={b.to}
            to={b.to}
            label={b.label}
            image={b.image}
            comingSoon={b.comingSoon}
          />
        ))}
      </div>

    </div>
  );
}