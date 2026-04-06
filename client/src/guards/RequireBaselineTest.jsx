import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function RequireBaselineTest() {
  const { profile, loadingProfile } = useProfile();

  if (loadingProfile) {
    return <div>Loading...</div>;
  }

  if (!profile?.has_completed_baseline) {
    return <Navigate to="/baselinetest" replace />;
  }

  return <Outlet />;
}