import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { session } = useAuth()

  if ( session === undefined) {
    return (
        <div>
            Loading...
        </div>
    )
  }

  if (!session) {
    return <Navigate to="/signin" />
  }
  return <Outlet />;
}