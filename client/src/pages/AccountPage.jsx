import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const TABS = [
  ["history", "Application history"],
  ["notifications", "Notifications"],
  ["account", "Account details"],
];

// Dedicated Account page. This used to be a small dropdown menu (see
// components/AccountMenu.jsx, which now just links here) — the same three
// tabs and functionality have been moved over as-is.
export default function AccountPage() {
  const { user, loading, logout, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("history");
  const [history, setHistory] = useState(null);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    if (tab === "history" && history === null) {
      api.getMyApplications().then(setHistory).catch(() => setHistory([]));
    }
    if (tab === "notifications" && notifications === null) {
      api.getNotifications().then(setNotifications).catch(() => setNotifications([]));
      api.markNotificationsRead().catch(() => {});
    }
  }, [tab, history, notifications]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const unread = notifications ? notifications.filter((n) => !n.read).length : 0;

  return (
    <div className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-[28px] mb-6">Your account</h1>

      <div className="surface rounded-2xl shadow-xl border border-border dark:border-white/10 overflow-hidden">
        <div className="p-5 border-b border-border dark:border-white/10 flex items-center gap-3">
          <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
          <div className="min-w-0">
            <div className="font-semibold truncate">{user.name}</div>
            <div className="text-xs text-inksoft truncate">{user.email}</div>
          </div>
        </div>

        <div className="flex border-b border-border dark:border-white/10 text-xs font-semibold">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={
                "flex-1 py-2.5 relative " +
                (tab === key ? "text-teal" : "text-inksoft hover:text-ink dark:hover:text-white")
              }
            >
              {label}
              {key === "notifications" && unread > 0 && (
                <span className="ml-1 inline-block w-4 h-4 leading-4 text-[10px] rounded-full bg-coral text-white">
                  {unread}
                </span>
              )}
              {tab === key && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-teal" />}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === "history" && <HistoryTab history={history} />}
          {tab === "notifications" && <NotificationsTab notifications={notifications} />}
          {tab === "account" && <AccountTab user={user} onToggleTheme={toggleTheme} />}
        </div>

        <div className="p-4 border-t border-border dark:border-white/10">
          <button
            className="btn-outline w-full !py-2 text-sm"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ history }) {
  if (history === null) return <Loading />;
  if (history.length === 0) return <Empty text="No applications yet. Browse projects to get started." />;
  return (
    <div className="flex flex-col gap-2">
      {history.map((h) => (
        <div key={h.id} className="p-2.5 rounded-lg border border-border dark:border-white/10 text-sm">
          <div className="font-semibold">{h.project_title}</div>
          <div className="text-xs text-inksoft mb-1">{h.project_company}</div>
          <div className="flex items-center justify-between text-xs">
            <span className="tag">{h.status === "quiz_completed" ? "Assessment complete" : "Applied"}</span>
            {h.percent !== null && (
              <span className={"font-mono font-semibold " + (h.selected ? "text-teal" : "text-inksoft")}>
                {h.percent}% {h.selected ? "· Selected" : ""}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsTab({ notifications }) {
  if (notifications === null) return <Loading />;
  if (notifications.length === 0) return <Empty text="You're all caught up." />;
  return (
    <div className="flex flex-col gap-2">
      {notifications.map((n) => (
        <div key={n.id} className="p-2.5 rounded-lg border border-border dark:border-white/10 text-sm">
          <div className="font-semibold">{n.title}</div>
          <div className="text-xs text-inksoft mt-0.5">{n.body}</div>
          {n.title.includes("Terms & Conditions") && (
            <Link
              to="/terms"
              className="inline-block mt-2 text-xs font-semibold text-teal hover:underline"
            >
              View Terms & Conditions →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

function AccountTab({ user, onToggleTheme }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <Row label="Name" value={user.name} />
      <Row label="Email" value={user.email} />
      <Row label="Phone" value={user.phone || "—"} />
      <Row label="School" value={user.school || "—"} />
      <Row label="Board" value={user.board || "—"} />
      <Row label="Class" value={user.classLevel || "—"} />

      <div className="pt-2 border-t border-border dark:border-white/10">
        <div className="label mb-2">Appearance</div>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="radio" name="theme" checked={user.theme === "light"} onChange={() => user.theme !== "light" && onToggleTheme()} />
            Light
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="radio" name="theme" checked={user.theme === "dark"} onChange={() => user.theme !== "dark" && onToggleTheme()} />
            Dark
          </label>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-inksoft">{label}</span>
      <span className="font-medium truncate max-w-[180px] text-right">{value}</span>
    </div>
  );
}

function Loading() {
  return <div className="text-sm text-inksoft py-6 text-center">Loading…</div>;
}
function Empty({ text }) {
  return <div className="text-sm text-inksoft py-6 text-center">{text}</div>;
}
