import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname ] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { session, signUpNewUser } = useAuth();
    const navigate = useNavigate()


    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signUpNewUser(email, password, nickname);
            if (result.success) {
                navigate("/train");
            } else {
                setError(result.error.message);
            }
        } catch (error) {
            console.log(error);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-[80vh] flex justify-center items-center">
            <form onSubmit={handleSignUp} className="w-[420px] py-9 px-10 bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_6px_24px_rgba(0,0,0,0.45)] flex flex-col gap-[18px]">

                <h2 className="m-0 text-[32px] tracking-[1px] text-tab-hover">Sign up to <br/> <span className="text-[44px] font-semibold tracking-[2px] text-tab-hover hover:[text-shadow:0_0_10px_var(--accent-glow),0_0_20px_var(--accent-glow),0_0_40px_var(--accent-glow)] hover:scale-[1.03]"> Read. For Speed </span> </h2>

                <p className="m-0 mb-2.5 text-[15px] text-tab">
                    Already have an account?
                    <Link to="/signin" className="text-tab-hover no-underline hover:[text-shadow:0_0_8px_var(--accent-glow)]"> Sign in</Link>
                </p>


                <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-sm text-tab tracking-[0.5px]">Nickname</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="px-3 py-2.5 bg-black/35 border border-accent rounded text-text text-[15px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-tab-hover focus:shadow-[0_0_8px_var(--accent-glow)]"
                    />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-sm text-tab tracking-[0.5px]">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2.5 bg-black/35 border border-accent rounded text-text text-[15px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-tab-hover focus:shadow-[0_0_8px_var(--accent-glow)]"
                    />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-sm text-tab tracking-[0.5px]">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-3 py-2.5 bg-black/35 border border-accent rounded text-text text-[15px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-tab-hover focus:shadow-[0_0_8px_var(--accent-glow)]"
                    />
                </div>

                <button
                    className="mt-2.5 p-3 bg-gradient-to-r from-panel to-panel-dark border border-accent rounded text-text text-base tracking-[0.5px] cursor-pointer transition-[border-color,transform,box-shadow] duration-200 enabled:hover:border-tab-hover enabled:hover:shadow-[0_0_12px_var(--accent-glow)] enabled:hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>

                {error && <p className="mt-1 text-sm text-[#ff6b6b]">{error}</p>}

            </form>
        </div>
    )

}