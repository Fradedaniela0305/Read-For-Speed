import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";


export default function Train() {


    return (
        <>
            <div className="train-button-container">
                <Link to="/rsvp" className="train-button">RSVP</Link>
                <Link to="/chunked" className="train-button">ChunkedRSVP</Link>
                <Link to="/drills" className="train-button">SpeedDrills</Link>
            </div >
        </>

    );

}