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
    <div className="min-h-[80vh] flex justify-center items-center">
      <div className="w-[420px] py-9 px-10 bg-gradient-to-b from-panel to-panel-dark border border-accent rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_6px_24px_rgba(0,0,0,0.45)] flex flex-col gap-[18px]">
        <h1 className="m-0 text-[32px] tracking-[1px] text-tab-hover">
          <span className="text-[44px] font-semibold tracking-[2px] text-tab-hover hover:[text-shadow:0_0_10px_var(--accent-glow),0_0_20px_var(--accent-glow),0_0_40px_var(--accent-glow)] hover:scale-[1.03]">Forgot Password :(</span>
        </h1>

        <p className="m-0 mb-2.5 text-[15px] text-tab">
          Enter your email
        </p>

        <form onSubmit={handleSendResetEmail}>
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="email" className="text-sm text-tab tracking-[0.5px]">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-2.5 bg-black/35 border border-accent rounded text-text text-[15px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-tab-hover focus:shadow-[0_0_8px_var(--accent-glow)]"
            />
          </div>

          <button
            className="mt-2.5 p-3 bg-gradient-to-r from-panel to-panel-dark border border-accent rounded text-text text-base tracking-[0.5px] cursor-pointer transition-[border-color,transform,box-shadow] duration-200 enabled:hover:border-tab-hover enabled:hover:shadow-[0_0_12px_var(--accent-glow)] enabled:hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {error && <p className="mt-1 text-sm text-[#ff6b6b]">{error}</p>}
          {message && <p className="mt-1 text-sm text-green-400">{message}</p>}
        </form>
      </div>
    </div>
  );
}