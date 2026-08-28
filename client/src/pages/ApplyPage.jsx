import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function ApplyPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", school: "", board: "", classLevel: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getProject(projectId).then(setProject).catch(() => setProject(null));
  }, [projectId]);

  // Prefill from the logged-in user's account so they don't retype everything.
  useEffect(() => {
    if (!user) return;
    const [first, ...rest] = (user.name || "").split(" ");
    setForm((f) => ({
      ...f,
      firstName: f.firstName || first || "",
      lastName: f.lastName || rest.join(" ") || "",
      email: f.email || user.email || "",
      school: f.school || user.school || "",
      board: f.board || user.board || "",
      classLevel: f.classLevel || (user.classLevel ? String(user.classLevel) : ""),
    }));
  }, [user]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.firstName || !form.lastName || !form.email || !form.school || !form.board || !form.classLevel) {
      setError("Please fill in every field to continue.");
      return;
    }
    const cls = parseInt(form.classLevel, 10);
    if (isNaN(cls) || cls <= 6) {
      setError("You must be in Class 7 or above to apply for this project.");
      return;
    }

    setSubmitting(true);
    try {
      const { applicationId } = await api.submitApplication({
        projectId: Number(projectId),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        school: form.school,
        board: form.board,
        classLevel: cls,
      });
      navigate("/quiz", {
        state: {
          applicationId,
          projectId: Number(projectId),
          projectTitle: project ? project.title : "",
          projectCompany: project ? project.company : "",
          firstName: form.firstName,
          email: form.email,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-12">
      <Link to="/projects" className="btn-outline inline-block mb-5">← Back to projects</Link>
      <div className="form-card">
        <div className="text-xs text-inksoft font-mono mb-1.5">
          {project ? project.company : "Loading project…"}
        </div>
        <h2 className="font-display font-bold text-2xl mb-1">{project ? project.title : "Apply"}</h2>
        <p className="text-inksoft text-[13.5px] mb-6">Step 1 of 2 — Tell us about yourself</p>

        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-3.5">
            <div className="mb-4">
              <label className="label">First name</label>
              <input className="input" value={form.firstName} onChange={handleChange("firstName")} />
            </div>
            <div className="mb-4">
              <label className="label">Last name</label>
              <input className="input" value={form.lastName} onChange={handleChange("lastName")} />
            </div>
          </div>
          <div className="mb-4">
            <label className="label">Email address</label>
            <input className="input" type="email" value={form.email} onChange={handleChange("email")} />
          </div>
          <div className="mb-4">
            <label className="label">School name</label>
            <input className="input" value={form.school} onChange={handleChange("school")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3.5">
            <div className="mb-4">
              <label className="label">Board</label>
              <select className="input" value={form.board} onChange={handleChange("board")}>
                <option value="">Select board</option>
                <option>CBSE</option>
                <option>ICSE</option>
                <option>State Board</option>
                <option>IB</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="label">Class</label>
              <input
                className="input" type="number" min="1" max="12"
                value={form.classLevel} onChange={handleChange("classLevel")}
                placeholder="Must be above 6"
              />
            </div>
          </div>
          {error && <p className="text-coral text-[12.5px] mb-3">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Continue to skills check →"}
          </button>
        </form>
      </div>
    </div>
  );
}
