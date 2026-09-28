import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";


export default function Profile() {
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
    return (
      <div className="h-screen flex items-center justify-center text-xl text-text-muted">
        Summoning your profile...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <div className="w-[45%] flex items-center justify-start pl-20">
        <div className="w-[520px] p-[50px] bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.7)] flex flex-col gap-10">
          <h2 className="text-[26px] text-text-muted">
            Welcome back,
            <span className="block text-[40px] text-text font-semibold mt-2">
              {profile?.nickname || "Traveler"}
            </span>
          </h2>

          <div className="flex flex-col gap-5">
            <Link
              to="/settheme"
              className="p-4 text-center border border-accent rounded-lg text-text no-underline text-lg transition-all duration-200 hover:border-tab-hover hover:shadow-[0_0_16px_var(--accent-glow)]"
            >
              Change Theme
            </Link>

            <button
              className="p-4 bg-transparent border border-[crimson] rounded-lg text-[crimson] text-lg font-medium cursor-pointer transition-all duration-200 hover:bg-[crimson] hover:text-white hover:shadow-[0_0_16px_crimson]"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="w-[55%] flex items-center justify-center">
        <img src="/test-intro-wizard.png" alt="Wizard" className="w-[900px] max-w-full h-auto" />
      </div>
    </div>
  );
}