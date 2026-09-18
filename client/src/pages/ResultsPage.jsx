import { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import GaugeScore from "../components/GaugeScore";

export default function ResultsPage() {
  const { state } = useLocation();
  const [showModal, setShowModal] = useState(true);

  if (!state || state.percent === undefined) {
    return <Navigate to="/projects" replace />;
  }

  const { percent, score, total, selected, projectTitle, firstName, email } = state;

  return (
    <div className="max-w-[640px] mx-auto px-6 py-12">
      <div className="form-card text-center">
        <div className="flex flex-col items-center py-5 pb-2">
          <GaugeScore percent={percent} />
          <div className="font-mono text-xs uppercase tracking-wide text-inksoft mt-1">match score</div>
        </div>
        <p className="text-inksoft text-sm mt-4">
          You answered {score} out of {total} questions correctly.
        </p>

        {!showModal && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/projects" className="btn-outline">Browse more projects</Link>
            <Link to="/" className="btn-dark">Back to home</Link>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-ink/55 z-[300] flex items-center justify-center p-5">
          <div className="surface rounded-2xl p-9 max-w-[420px] w-full text-center shadow-2xl">
            <div className="text-[44px] mb-2">{selected ? "🎉" : "📋"}</div>
            <div className="font-display font-bold text-xl mb-2.5">
              {selected ? "You're selected!" : "Thanks for applying"}
            </div>
            <div className="text-inksoft text-sm mb-6">
              {selected
                ? `Congratulations${firstName ? ", " + firstName : ""}! You've been selected for "${projectTitle || "the project"}." Check ${email || "your email"} and your Trainly notifications for next steps.`
                : `You scored ${percent}% on this project's assessment. Every project has its own bar — try browsing others that might be a better fit.`}
            </div>
            <button className="btn-primary w-full" onClick={() => setShowModal(false)}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
