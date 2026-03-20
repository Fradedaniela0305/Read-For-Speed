import "../App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useProfile } from "../context/ProfileContext"

export default function Profile({ theme }) {
    const navigate = useNavigate()

    const { profile, loadingProfile } = useProfile();
    const { signOut } = useAuth();


    const handleSignOut = async (e) => {
        e.preventDefault()

        try {
            await signOut()
            navigate("/signin")
        } catch (err) {
            console.error(err)
        }
    }

      if (loadingProfile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Link to="/settheme">Set Theme</Link>
      <h2>Hello, {profile?.nickname || "..."}</h2>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  );

}