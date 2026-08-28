const TEAM = [
  {
    name: "Ahana Basak",
    role: "Co-Founder & CEO",
    photo: "https://ui-avatars.com/api/?background=14B8A6&color=fff&bold=true&size=256&name=Ahana+Basak",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Sunipa Bose",
    role: "Co-Founder & Head of Product",
    photo: "https://ui-avatars.com/api/?background=7C5CFF&color=fff&bold=true&size=256&name=Sunipa+Bose",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Subhankar Das",
    role: "Co-Founder & CTO",
    photo: "https://ui-avatars.com/api/?background=FFB020&color=1a1300&bold=true&size=256&name=Subhankar+Das",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Satyajit Sarkar",
    role: "Co-Founder & Head of Operations",
    photo: "https://ui-avatars.com/api/?background=FF6B6B&color=fff&bold=true&size=256&name=Satyajit+Sarkar",
    linkedin: "https://www.linkedin.com/",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-[1080px] mx-auto px-6 py-14">
      <div className="text-center max-w-[640px] mx-auto mb-14">
        <div className="font-mono text-xs text-teal tracking-wide uppercase mb-3">About Us</div>
        <h1 className="font-display font-bold text-[30px] sm:text-[36px] mb-4">
          We're building the bridge between students and AI
        </h1>
        <p className="text-inksoft text-[15px]">
          Trainly connects students with real, well-defined AI-training projects — from labeling
          data to reviewing model outputs — so they can build practical skills and earn while
          they're still in school or college.
        </p>
      </div>

      <h2 className="font-display font-bold text-xl mb-6 text-center">Meet the team</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {TEAM.map((member) => (
          <div key={member.name} className="card items-center text-center">
            <img
              src={member.photo}
              alt={member.name}
              className="w-20 h-20 rounded-full mb-1 ring-4 ring-teal/15"
            />
            <div className="font-bold text-[15px]">{member.name}</div>
            <div className="text-inksoft text-[12.5px] mb-2">{member.role}</div>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-teal hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
              </svg>
              LinkedIn
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
