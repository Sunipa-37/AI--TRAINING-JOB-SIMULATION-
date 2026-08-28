import { Link } from "react-router-dom";

const STEPS = [
  ["1", "Create your account", "Sign up in under a minute — with Google or your email."],
  ["2", "Apply to a project", "Browse AI-training projects by topic and pick one that fits you."],
  ["3", "Take a quick assessment", "20 short questions to check you're ready to start."],
  ["4", "Start training AI", "Get matched, get to work, and get paid for your contribution."],
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1180px] mx-auto px-6 pt-14 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="tag mb-4 inline-block">🎓 For students, by students</span>
          <h1 className="font-display font-bold text-[34px] sm:text-[44px] leading-[1.1] mb-4">
            here students <span className="text-teal">train AI</span>
          </h1>
          <p className="text-inksoft text-[16px] mb-7 max-w-[440px]">
            Trainly connects you with real AI-training projects — label data, review model
            outputs, and build practical skills, all while still in school.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/projects" className="btn-primary">Browse Projects</Link>
            <Link to="/how-it-works" className="btn-outline">How It Works</Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://images.pexels.com/photos/4622108/pexels-photo-4622108.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Students collaborating together outdoors with a laptop"
            className="w-full h-[320px] sm:h-[380px] object-cover"
          />
        </div>
      </section>

      {/* How it works, image-supported */}
      <section className="max-w-[1180px] mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
          <img
            src="https://images.pexels.com/photos/33745692/pexels-photo-33745692.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Students studying together at a library"
            className="w-full h-[300px] sm:h-[360px] object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="font-display font-bold text-2xl mb-6">How it works</h2>
          <div className="flex flex-col gap-4">
            {STEPS.map(([n, title, desc]) => (
              <div key={n} className="flex gap-3.5">
                <div className="w-8 h-8 shrink-0 rounded-full bg-ink text-white dark:bg-white dark:text-ink font-mono font-bold text-sm flex items-center justify-center">
                  {n}
                </div>
                <div>
                  <div className="font-semibold text-[15px]">{title}</div>
                  <div className="text-inksoft text-[13.5px]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1180px] mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-ink text-white p-10 sm:p-14 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Ready to start training AI?</h2>
          <p className="text-[#C9CCDC] mb-7 max-w-[480px] mx-auto">
            Join students across India already contributing to real AI projects.
          </p>
          <Link to="/signup" className="btn-primary inline-block">Create Your Account</Link>
        </div>
      </section>
    </div>
  );
}
