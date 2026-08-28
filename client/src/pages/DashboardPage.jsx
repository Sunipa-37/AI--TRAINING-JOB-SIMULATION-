import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const TABS = [
  ["overview", "Overview"],
  ["applications", "Applications"],
  ["users", "Students"],
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState(null);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    api.getAdminStats().then(setStats).catch((e) => setError(e.message));
  }, [user]);

  useEffect(() => {
    if (!user || !user.isAdmin) return;
    if (tab === "applications" && applications === null) {
      api.getAdminApplications().then(setApplications).catch((e) => setError(e.message));
    }
    if (tab === "users" && users === null) {
      api.getAdminUsers().then(setUsers).catch((e) => setError(e.message));
    }
  }, [tab, user, applications, users]);

  if (loading) return <div className="text-center py-24 text-inksoft">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: "/dashboard" }} replace />;
  if (!user.isAdmin) {
    return (
      <div className="max-w-[520px] mx-auto px-6 py-24 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h1 className="font-display font-bold text-xl mb-2">Facilitators only</h1>
        <p className="text-inksoft text-sm mb-6">
          This dashboard is available to Trainly facilitator/admin accounts. If you're a
          facilitator, sign up using your admin code.
        </p>
        <Link to="/" className="btn-outline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <div className="font-mono text-xs text-teal uppercase tracking-wide mb-1">Facilitator Dashboard</div>
          <h1 className="font-display font-bold text-2xl">Welcome back, {user.name.split(" ")[0]}</h1>
        </div>
        <div className="flex gap-1 bg-white border border-border rounded-full p-1 dark:bg-[#141935] dark:border-white/10">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={
                "px-4 py-1.5 rounded-full text-sm font-semibold transition " +
                (tab === key ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-inksoft hover:text-ink dark:hover:text-white")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="text-coral text-sm mb-6">{error}</div>}

      {tab === "overview" && <Overview stats={stats} />}
      {tab === "applications" && <ApplicationsTable applications={applications} />}
      {tab === "users" && <UsersTable users={users} />}
    </div>
  );
}

function Overview({ stats }) {
  if (!stats) return <div className="text-inksoft py-16 text-center">Loading stats…</div>;
  const cards = [
    ["Total students", stats.students, "🎓", "teal"],
    ["Applications received", stats.applications, "📩", "violet"],
    ["Students selected", stats.selected, "✅", "amber"],
    ["Active projects", stats.projects, "🗂️", "coral"],
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map(([label, value, icon]) => (
        <div className="card" key={label}>
          <div className="text-2xl">{icon}</div>
          <div className="font-display font-bold text-3xl">{value}</div>
          <div className="text-inksoft text-[13.5px]">{label}</div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsTable({ applications }) {
  if (applications === null) return <div className="text-inksoft py-16 text-center">Loading applications…</div>;
  if (applications.length === 0) return <div className="text-inksoft py-16 text-center">No applications yet.</div>;
  return (
    <div className="card !p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-border dark:border-white/10">
            <Th>Student</Th><Th>Project</Th><Th>School / Board / Class</Th><Th>Score</Th><Th>Status</Th><Th>Applied</Th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id} className="border-b border-border/60 dark:border-white/5 last:border-0">
              <Td>
                <div className="font-semibold">{a.first_name} {a.last_name}</div>
                <div className="text-inksoft text-xs">{a.email}</div>
              </Td>
              <Td>
                <div className="font-medium">{a.project_title}</div>
                <div className="text-inksoft text-xs">{a.project_company}</div>
              </Td>
              <Td>{a.school} · {a.board} · Class {a.class_level}</Td>
              <Td className="font-mono">{a.percent !== null ? `${a.percent}%` : "—"}</Td>
              <Td>
                {a.status === "quiz_completed" ? (
                  <span className={"tag " + (a.selected ? "!bg-teal/15 !text-teal" : "")}>
                    {a.selected ? "Selected" : "Not selected"}
                  </span>
                ) : (
                  <span className="tag">Applied</span>
                )}
              </Td>
              <Td className="text-inksoft text-xs">{new Date(a.created_at).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ users }) {
  if (users === null) return <div className="text-inksoft py-16 text-center">Loading students…</div>;
  if (users.length === 0) return <div className="text-inksoft py-16 text-center">No students yet.</div>;
  return (
    <div className="card !p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-inksoft text-xs uppercase tracking-wide border-b border-border dark:border-white/10">
            <Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>School</Th><Th>Board / Class</Th><Th>Signed up</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border/60 dark:border-white/5 last:border-0">
              <Td className="font-semibold">{u.name}{u.is_admin && <span className="tag ml-2">Admin</span>}</Td>
              <Td>{u.email}</Td>
              <Td>{u.phone || "—"}</Td>
              <Td>{u.school || "—"}</Td>
              <Td>{u.board || "—"} {u.class_level ? `· Class ${u.class_level}` : ""}</Td>
              <Td className="text-inksoft text-xs">{new Date(u.created_at).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={"px-4 py-3 align-top " + className}>{children}</td>;
}
