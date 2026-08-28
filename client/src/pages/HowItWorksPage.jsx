const STEPS = [
  ["01", "Browse projects", "Explore real AI-training projects across categories like NLP, computer vision, speech, and more."],
  ["02", "Apply in minutes", "Share your name, email, school, board, and class — no resume needed to get started."],
  ["03", "Take a quick assessment", "20 short questions covering maths, science, SST, and general reasoning to check readiness."],
  ["04", "Get matched and start", "Clear the bar and you're notified you've been selected, with next steps in your account."],
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-[1080px] mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-[28px] mb-2">How it works</h1>
      <p className="text-inksoft text-[15px] mb-8">Four simple steps from browsing to your first project.</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {STEPS.map(([num, title, body]) => (
          <div className="card" key={num}>
            <div className="font-mono text-violet text-[13px] font-bold">{num}</div>
            <div className="font-bold">{title}</div>
            <div className="text-inksoft text-[13.5px]">{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
