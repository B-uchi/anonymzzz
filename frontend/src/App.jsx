import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./lib/auth";
import { useTheme } from "./lib/theme";
import { profilePath } from "./lib/format";
import AppHeader from "./components/AppHeader";
import Loading from "./components/Loading";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
import Send from "./pages/Send";
import NotFound from "./pages/NotFound";

function SignedInLayout() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <Loading label="Opening your inbox" />;
  if (status === "offline") {
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold">The server isn&apos;t responding</h1>
          <p className="mt-2 text-ink-soft">Check your connection, then try again.</p>
          <button type="button" className="btn-primary mt-6" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (status !== "authed") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}

function SignedOutOnly({ children }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "authed") return <Navigate to={location.state?.from ?? "/inbox"} replace />;
  return children;
}

// v1 links looked like /:username/zzz and are still out there in bios.
function LegacyProfileRedirect() {
  const { username } = useParams();
  return <Navigate to={profilePath(username)} replace />;
}

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="top-center" richColors closeButton />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<SignedOutOnly><Auth key="login" mode="login" /></SignedOutOnly>} />
            <Route path="/register" element={<SignedOutOnly><Auth key="register" mode="register" /></SignedOutOnly>} />
            <Route path="/u/:username" element={<Send />} />
            <Route path="/:username/zzz" element={<LegacyProfileRedirect />} />
            <Route path="/dashboard" element={<Navigate to="/inbox" replace />} />
            <Route element={<SignedInLayout />}>
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ThemedToaster />
      </AuthProvider>
    </MotionConfig>
  );
}
