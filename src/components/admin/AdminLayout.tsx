import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CheckSquare,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  Radar,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "../brand/Logo";
import { brand } from "../../config/brand";

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

export function AdminLayout() {
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
      <aside className="hidden w-64 shrink-0 flex-col bg-[#161615] text-paper md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo inverted to="/admin" size="sm" />
          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.18em] text-white/55">
            Editorial desk · demo
          </p>
        </div>
        <nav className="flex-1 px-3 py-4" aria-label="Admin">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `mb-0.5 flex items-center gap-2.5 px-3 py-2 font-sans text-[13px] ${
                  isActive ? "bg-emerald text-paper" : "text-white/70 hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              <item.icon size={15} aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 px-5 py-4 text-[11px] text-white/55">
          <p>No live backends connected.</p>
          <p className="mt-1">{brand.demoNotice}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-rule bg-paper px-4 py-3 sm:px-6">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-widest text-faint">Newsroom · Demo</p>
            <p className="font-display text-lg tracking-tight">Signal Desk desk</p>
          </div>
          <NavLink to="/" className="font-sans text-xs font-semibold uppercase tracking-wide text-emerald">
            View public site
          </NavLink>
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
