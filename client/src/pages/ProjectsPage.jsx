import { useEffect, useState } from "react";
import { api } from "../api";
import ProjectCard from "../components/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState(null);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getProjectCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
      api
        .getProjects({ category, q: query })
        .then(setProjects)
        .catch((err) => setError(err.message));
    }, 250); // debounce search typing
    return () => clearTimeout(timeout);
  }, [category, query]);

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-12">
      <div className="text-center max-w-[620px] mx-auto mb-8">
        <h1 className="font-display font-bold text-[28px] sm:text-[32px] mb-2">AI Training Projects</h1>
        <p className="text-inksoft text-[15px]">
          Filter by topic or search to find a project that matches your interests.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 sticky top-[64px] z-30 bg-bg/90 dark:bg-[#0B0E1C]/90 backdrop-blur py-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-inksoft"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            className="input pl-9"
            placeholder="Search by title, company, or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input sm:w-[240px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-coral text-sm mb-6 text-center">{error}</div>}

      {projects === null ? (
        <div className="text-center text-inksoft py-16">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="text-center text-inksoft py-16">No projects match your filters. Try a different search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
