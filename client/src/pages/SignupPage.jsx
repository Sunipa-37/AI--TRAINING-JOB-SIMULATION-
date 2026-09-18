import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import GoogleButton from "../components/GoogleButton";

const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"];
const CLASSES = Array.from({ length: 6 }, (_, i) => i + 7); // 7–12

export default function SignupPage() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({
    name: "", email: "", phone: "", school: "", board: "CBSE", classLevel: "9",
    age: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (parseInt(form.age, 10) <= 6 || isNaN(parseInt(form.age, 10))) {
      setError("Age must be above 6 to create an account.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.signup(form);
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
      <div className="w-full max-w-[520px] form-card">
        <h1 className="font-display font-bold text-2xl mb-1 text-center">Create your account</h1>
        <p className="text-inksoft text-sm text-center mb-6">Join Trainly and start training AI</p>

        <div className="mb-5">
          <GoogleButton onSuccess={handleGoogleSuccess} onError={setError} />
        </div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-border dark:bg-white/10 flex-1" />
          <span className="text-xs text-inksoft">or sign up with email</span>
          <div className="h-px bg-border dark:bg-white/10 flex-1" />
        </div>

        {error && (
          <div className="mb-4 text-sm text-coral bg-coral/10 border border-coral/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full name">
            <input required className="input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Priya Sharma" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input required type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </Field>
            <Field label="Phone number">
              <input required type="tel" className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="98765 43210" />
            </Field>
          </div>

          <Field label="School name">
            <input required className="input" value={form.school} onChange={(e) => update("school", e.target.value)} placeholder="Delhi Public School" />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Board">
              <select required className="input" value={form.board} onChange={(e) => update("board", e.target.value)}>
                {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Class">
              <select required className="input" value={form.classLevel} onChange={(e) => update("classLevel", e.target.value)}>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Age">
              <input required type="number" min="7" className="input" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="15" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Password">
              <PasswordInput value={form.password} onChange={(e) => update("password", e.target.value)} autoComplete="new-password" />
            </Field>
            <Field label="Re-enter password">
              <PasswordInput value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} autoComplete="new-password" />
            </Field>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary mt-1">
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-inksoft mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-teal font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
