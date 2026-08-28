import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import AccountMenu from "./AccountMenu";

const LINKS = [
  ["/", "Home"],
  ["/projects", "Projects"],
  ["/how-it-works", "How It Works"],
  ["/community", "Community"],
  ["/about", "About Us"],
];

export default function Nav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isProjectsFlow = ["/apply", "/quiz", "/results"].some((p) => location.pathname.startsWith(p));

  return (
    <div className="sticky top-0 z-40 bg-ink/90 backdrop-blur text-white px-4 sm:px-6 py-3">
      <div className="max-w-[1180px] mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg shrink-0">
          <span className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-teal to-violet flex items-center justify-center font-mono text-xs">
            T
          </span>
          Trainly
        </NavLink>

        <div className="hidden md:flex justify-center">
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            {LINKS.map(([to, label]) => {
              const active = to === "/projects" ? location.pathname === "/projects" || isProjectsFlow : location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={
                    "px-3.5 py-1.5 rounded-full text-sm font-medium transition " +
                    (active ? "bg-white/15 text-white" : "text-[#C9CCDC] hover:bg-white/10 hover:text-white")
                  }
                >
                  {label}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <AccountMenu />
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-1 max-w-[1180px] mx-auto">
          {LINKS.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#C9CCDC] hover:bg-white/10 hover:text-white"
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
