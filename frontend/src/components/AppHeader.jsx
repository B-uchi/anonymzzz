import { NavLink, useNavigate } from "react-router";
import { PiGearSixBold, PiSignOutBold, PiTrayBold } from "react-icons/pi";
import { useAuth } from "../lib/auth";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navClass = ({ isActive }) =>
  `icon-btn ${isActive ? "bg-ink/[0.07] text-ink" : ""}`;

export default function AppHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <Logo to="/inbox" />
      <nav className="flex items-center gap-1" aria-label="Account">
        <NavLink to="/inbox" className={navClass} aria-label="Inbox" title="Inbox">
          <PiTrayBold />
        </NavLink>
        <NavLink to="/settings" className={navClass} aria-label="Settings" title="Settings">
          <PiGearSixBold />
        </NavLink>
        <ThemeToggle />
        <button
          type="button"
          className="icon-btn"
          aria-label="Log out"
          title="Log out"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <PiSignOutBold />
        </button>
      </nav>
    </header>
  );
}
