import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import GoogleButton from "../components/GoogleButton";

export default function LoginPage() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await api.login({ email, password });
      loginWithToken(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleGoogleSuccess(data) {
    loginWithToken(data.token, data.user);
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-[420px] form-card">
        <h1 className="font-display font-bold text-2xl mb-1 text-center">Welcome back</h1>
        <p className="text-inksoft text-sm text-center mb-6">Log in to continue training AI</p>

        <div className="mb-5">
          <GoogleButton onSuccess={handleGoogleSuccess} onError={setError} />
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-border dark:bg-white/10 flex-1" />
          <span className="text-xs text-inksoft">or</span>
          <div className="h-px bg-border dark:bg-white/10 flex-1" />
        </div>

        {error && (
          <div className="mb-4 text-sm text-coral bg-coral/10 border border-coral/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-1">
            {submitting ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-inksoft mt-6">
          New to Trainly?{" "}
          <Link to="/signup" className="text-teal font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
