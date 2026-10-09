import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CheckSquare,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  LogIn,
  LogOut,
  Radar,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Logo } from "../brand/Logo";
import { useApp } from "../../context/AppContext";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/discovery", label: "News discovery", icon: Radar },
  { to: "/admin/research", label: "Research queue", icon: Sparkles },
  { to: "/admin/drafts", label: "Draft articles", icon: FileText },
  { to: "/admin/approvals", label: "Editorial approvals", icon: CheckSquare },
  { to: "/admin/published", label: "Published articles", icon: FolderOpen },
  { to: "/admin/media", label: "Media library", icon: ImageIcon },
  { to: "/admin/seo", label: "SEO & analytics", icon: BarChart3 },
  { to: "/admin/automation", label: "Automation health", icon: Activity },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function StaffLoginModal({ onClose }: { onClose: () => void }) {
  const { signIn, resetPassword } = useApp();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      onClose();
    }
  };

  const handleRecovery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your registered staff email address.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("A secure password recovery link has been dispatched to your email address.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md border border-rule bg-paper p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <h2 id="modal-title" className="font-display text-xl font-medium">
            {mode === "login" ? "Editorial Staff Authentication" : "Account Password Recovery"}
          </h2>
          <button onClick={onClose} aria-label="Close dialog" className="text-muted hover:text-ink text-sm">
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 border border-red-200 bg-red-50 p-2 text-xs text-red-800">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-800">
            {successMsg}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            <div>
              <label htmlFor="staff-email-input" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Staff Email
              </label>
              <input
                id="staff-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editor@signaldesk.news"
                required
                autoComplete="username"
                className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/60"
              />
            </div>

            <div>
              <label htmlFor="staff-password-input" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Password
              </label>
              <input
                id="staff-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/60"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-[11.5px] text-muted hover:text-ink underline"
              >
                Forgot password or need recovery?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#161615] py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-emerald disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In with Supabase Auth"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRecovery} className="mt-4 space-y-3">
            <p className="text-xs text-muted">
              Enter your authorized staff or owner email address to receive a secure Supabase Auth password reset link.
            </p>
            <div>
              <label htmlFor="recovery-email-input" className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Staff Email
              </label>
              <input
                id="recovery-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@gmail.com"
                required
                autoComplete="email"
                className="mt-1 w-full border border-rule bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#161615] py-2 text-xs font-bold uppercase tracking-widest text-paper hover:bg-emerald disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Password Recovery Link"}
            </button>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-xs text-muted hover:text-ink underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 border-t border-rule pt-3 text-[11px] text-muted">
          <p className="font-medium text-ink">Strict Onboarding &amp; RBAC Notice</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Public editorial registration is strictly disabled. Staff accounts are provisioned via verified administrative invitation with enforced Row Level Security.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { user, profile, role, signOut } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F2EC] text-ink">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-emerald focus:px-3 focus:py-2 focus:text-paper"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("admin-main")?.focus();
        }}
      >
        Skip to newsroom content
      </a>

      {showLoginModal && <StaffLoginModal onClose={() => setShowLoginModal(false)} />}

      <aside className="hidden w-64 shrink-0 flex-col bg-[#161615] text-paper md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo inverted to="/admin" size="sm" />
          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.18em] text-white/55">
            Editorial desk · demo
          </p>
        </div>

        <div className="border-b border-white/10 px-5 py-3">
          {user ? (
            <div className="flex items-center gap-2">
              <UserCheck size={14} className="text-emerald shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/90">
                  {profile?.full_name || user.email?.split("@")[0]}
                </p>
                <p className="truncate text-[10px] text-white/50">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">Staff Access</span>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-1 border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:border-emerald hover:text-emerald"
              >
                <LogIn size={11} /> Sign In
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Admin">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `mb-0.5 flex items-center gap-2.5 px-3 py-2 font-sans text-[13px] ${
                  isActive ? "bg-emerald text-paper font-medium" : "text-white/70 hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              <item.icon size={15} aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 text-[11px] text-white/70">
          <div className="mb-3 flex items-center gap-1.5 text-white/80">
            <ShieldCheck size={13} className="text-[#34d399]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">
              Supabase Connected
            </span>
          </div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex w-full items-center justify-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-red-400 hover:text-red-300"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex w-full items-center justify-center gap-2 border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-white hover:text-white"
            >
              <LogIn size={13} />
              Staff Login
            </button>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-rule bg-paper px-4 py-3 sm:px-6">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-widest text-faint">Newsroom · Demo</p>
            <p className="font-display text-lg tracking-tight">Signal Desk desk</p>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="hidden sm:inline-block font-sans text-xs text-muted">
                Role: <strong className="text-ink">{role || "STAFF"}</strong>
              </span>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald hover:underline"
              >
                <LogIn size={13} /> Staff Sign In
              </button>
            )}
            <NavLink to="/" className="font-sans text-xs font-semibold uppercase tracking-wide text-emerald">
              View public site
            </NavLink>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-rule bg-paper px-3 py-2 md:hidden" aria-label="Admin sections">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-2 py-1 font-sans text-[11px] uppercase tracking-wide ${
                  isActive ? "bg-ink text-paper" : "text-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main id="admin-main" tabIndex={-1} className="min-w-0 flex-1 p-4 outline-none sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
