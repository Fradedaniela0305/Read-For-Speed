import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

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
        <div className="auth-container">
            <form onSubmit={handleSignUp} className="auth-panel">

                <h2 className="auth-title">Sign up to <br/> <span className="auth-title-glow"> Read. For Speed </span> </h2>

                <p className="auth-subtext">
                    Already have an account?
                    <Link to="/signin" className="auth-link"> Sign in</Link>
                </p>


                <div className="auth-field">
                    <label>Nickname</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>

                <div className="auth-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="auth-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="auth-button" disabled={loading}>
                    {loading ? "Signing up..." : "Sign up"}
                </button>

                {error && <p className="auth-error">{error}</p>}

            </form>
        </div>
    )

}