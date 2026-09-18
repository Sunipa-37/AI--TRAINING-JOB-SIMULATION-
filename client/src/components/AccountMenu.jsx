import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Nav-bar trigger only. Logged-out visitors get a "Log in" button; logged-in
// users get their avatar, which links to the dedicated /account page (see
// pages/AccountPage.jsx for the application history / notifications /
// account details tabs that used to live in a dropdown here).
export default function AccountMenu() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Link to="/login" className="btn-primary !py-2 !px-4 text-sm">
        Log in
      </Link>
    );
  }

  return (
    <Link
      to="/account"
      className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-white/15 hover:bg-white/10 transition"
    >
      <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full" />
      <span className="text-sm font-medium text-white hidden sm:inline">{user.name.split(" ")[0]}</span>
    </Link>
  );
}
