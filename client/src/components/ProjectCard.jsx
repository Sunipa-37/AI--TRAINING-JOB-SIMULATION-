import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-inksoft font-mono truncate">{project.company}</div>
        {project.trustBadge && (
          <span className="flex items-center gap-1 text-[10.5px] font-semibold text-teal shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1.2 13.2L7.5 12l1.4-1.4 1.9 1.9 4.3-4.3L16.5 9.6l-5.7 5.6Z" />
            </svg>
            {project.trustBadge}
          </span>
        )}
      </div>
      <div className="text-[17px] font-bold leading-snug">{project.title}</div>
      <span className="tag self-start">{project.category}</span>
      <div className="text-[13.5px] text-inksoft flex-1">{project.description}</div>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-[13px] text-inksoft">
        <span>📍 {project.location}</span>
        <span className="font-mono font-semibold text-ink dark:text-white">{project.pay}</span>
      </div>
      {typeof project.applicantsCount === "number" && (
        <div className="text-[12px] text-inksoft">
          👥 {project.applicantsCount} students already applied
        </div>
      )}
      <Link to={`/apply/${project.id}`} className="btn-dark text-center">
        Apply Now
      </Link>
    </div>
  );
}
