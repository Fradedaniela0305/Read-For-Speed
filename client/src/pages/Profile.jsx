import "../styles/profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";


export default function Profile({ theme }) {
  const navigate = useNavigate();
  const { profile, loadingProfile } = useProfile();
  const { signOut } = useAuth();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingProfile) {
    return <div className="profile-loading">Summoning your profile...</div>;
  }

  return (
    <div className={`profile-page ${theme}`}>
      <div className="profile-left">
        <div className="profile-card">
          <h2 className="profile-title">
            Welcome back,
            <span className="profile-name">
              {profile?.nickname || "Traveler"}
            </span>
          </h2>

          <div className="profile-actions">
            <Link to="/settheme" className="profile-link">
              Change Theme
            </Link>

            <button className="profile-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="profile-right">
        <img src="/test-intro-wizard.png" alt="Wizard" />
      </div>
    </div>
  );
}