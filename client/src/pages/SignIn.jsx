import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "../styles/auth.css";
import { supabase } from "../lib/supabase";

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { session, signInUser } = useAuth()
    const navigate = useNavigate()

    const handleSignIn = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signInUser(email, password)

            if (result.success) {
                navigate("/train")
            } else {
                setError(result.error.message)
            }
        } catch (error) {
            console.log(error)
            setError("An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async () => {
        navigate("/signin/forgot-password");
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSignIn} className="auth-panel">

                <h2 className="auth-title">Welcome back to <br /> <span className="auth-title-glow"> Read. For Speed </span></h2>

                <p className="auth-subtext">
                    Don't have an account?
                    <Link to="/signup" className="auth-link"> Sign up</Link>
                </p>

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
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <p className="auth-forgot">
                    <button
                        type="button"
                        className="auth-forgot-button"
                        onClick={handleForgotPassword}
                    >
                        Forgot password?
                    </button>
                </p>

                {error && <p className="auth-error">{error}</p>}

            </form>
        </div>
    )
}