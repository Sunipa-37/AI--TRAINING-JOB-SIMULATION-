import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { api } from "../api";

export default function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const flow = location.state;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getQuiz().then(setQuestions).catch((e) => setError(e.message));
  }, []);

  if (!flow || !flow.applicationId) {
    // Guard: quiz must be reached via the apply flow so we have an applicationId.
    return <Navigate to="/projects" replace />;
  }

  const answeredCount = Object.keys(answers).length;
  const pct = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const result = await api.submitQuiz({ applicationId: flow.applicationId, answers });
      navigate("/results", { state: { ...flow, ...result } });
    } catch (err) {
      setError(err.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-12">
      <p className="text-inksoft text-[13.5px] mb-1.5">Step 2 of 2 — Skills check</p>
      <h2 className="font-display font-bold text-2xl mb-4">Quick assessment</h2>
      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-7">
        <div className="h-full bg-teal transition-all" style={{ width: pct + "%" }} />
      </div>

      {error && <p className="text-coral text-sm mb-4">{error}</p>}

      {questions.map((q, i) => (
        <div className="card mb-3.5" key={q.id}>
          <div className="font-mono text-[11px] text-violet uppercase tracking-wide mb-1.5">
            {q.category} · Q{i + 1}
          </div>
          <div className="font-semibold text-[15px] mb-3.5">{q.prompt}</div>
          {q.options.map((opt, idx) => (
            <label
              key={idx}
              className={
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-[1.5px] mb-2 cursor-pointer text-sm " +
                (answers[q.id] === idx
                  ? "border-teal bg-[#EFFBF9] dark:bg-teal/10"
                  : "border-border dark:border-white/15")
              }
            >
              <input
                type="radio"
                name={String(q.id)}
                className="accent-teal"
                checked={answers[q.id] === idx}
                onChange={() => setAnswers({ ...answers, [q.id]: idx })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button
          className="btn-primary w-full mt-2"
          disabled={answeredCount < questions.length || submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? "Submitting…"
            : answeredCount < questions.length
            ? `Answer all questions (${answeredCount}/${questions.length})`
            : "Submit assessment"}
        </button>
      )}
    </div>
  );
}
