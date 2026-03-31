import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function PreventBaseline() {

    const { profile } = useProfile()


    if (profile?.has_completed_baseline) {
        return <Navigate to="/test" />
    }

    return <Outlet />;
}