import { NavLink } from "react-router-dom";

export default function NavigationBar() {
    return (
        <nav className="top-nav">
            <NavLink to="/train" className="tab">Train</NavLink>
            <NavLink to="/test" className="tab">Test</NavLink>
            <NavLink to="/stats" className="tab">Stats</NavLink>
            <NavLink to="/profile" className="tab">Profile</NavLink>
        </nav>
    )

}