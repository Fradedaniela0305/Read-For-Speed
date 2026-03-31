import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function RequireBaselineTest() {

    const { profile } = useProfile()

    if (!profile?.has_completed_baseline) {
        return <Navigate to="/baselinetest" />
  }
    return <Outlet />;
}