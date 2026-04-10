import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Reset link has been sent.");
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <h1 className="auth-title">
          <span className="auth-title-glow">Forgot Password :(</span>
        </h1>

        <p className="auth-subtext">
          Enter your email
        </p>

        <form onSubmit={handleSendResetEmail}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}
        </form>
      </div>
    </div>
  );
}