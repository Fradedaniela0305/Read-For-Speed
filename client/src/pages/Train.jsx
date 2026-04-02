import TrainButton from "../components/TrainButton"

import mascot from "../assets/mascot.png";
import mascot_rsvp from "../assets/mascot_rsvp.png";
import mascot_chunked from "../assets/mascot_chunked.png";
import mascot_drill from "../assets/mascot_drill.png";
import "../styles/train.css";



export default function Train() {

    const buttons = [
        { to: "/rsvpsetup", label: "RSVP", image: mascot_rsvp },
        { to: "/chunked", label: "Chunked RSVP", image: mascot_chunked },
        { to: "/drills", label: "Speed Drills", image: mascot_drill },
    ];

    return (
        <>
            <div className="train-button-container">
                {buttons.map((b) => (
                    <TrainButton key={b.to} to={b.to} label={b.label} image={b.image} />
                ))}
            </div >
        </>

    );

}