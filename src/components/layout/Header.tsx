import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "../brand/Logo";
import { brand } from "../../config/brand";
import { categories } from "../../data/categories";
import { todayLabel } from "../../lib/format";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

const extraNav = [
  { to: "/about", label: "About" },
  { to: "/admin", label: "Newsroom" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const dialog = menuRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      menuTriggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="border-b border-rule bg-paper">
      <div className="hidden border-b border-rule bg-canvas sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1 text-[11px] leading-5 tracking-wide text-muted sm:px-6">
          <p>
            {todayLabel()}
            <span className="mx-2 text-rule-strong">|</span>
            {brand.editionLabel}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/editorial-policy" className="hover:text-ink">
              Standards
            </Link>
            <Link to="/contact" className="hover:text-ink">
              Tips
            </Link>
            <Link to="/admin" className="hover:text-ink">
              Newsroom desk
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 sm:gap-3 sm:px-6 sm:py-3 md:py-4">
        <button
          ref={menuTriggerRef}
          type="button"
          className="-ml-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center text-ink lg:hidden"
          onClick={() => {
            setOpen((v) => !v);
            setSearchOpen(false);
          }}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={19} aria-hidden /> : <Menu size={19} aria-hidden />}
        </button>

        <div className="flex min-w-0 flex-1 justify-center lg:justify-start">
          <Logo size="masthead" />
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <p className="max-w-[11rem] text-right font-serif text-sm italic leading-snug text-muted">
            {brand.tagline}
          </p>
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center border border-rule text-ink hover:border-ink"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="masthead-search-panel"
          >
            <Search size={16} aria-hidden />
          </button>
        </div>

        <button
          type="button"
          className="-mr-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center text-ink lg:hidden"
          onClick={() => {
            setSearchOpen((v) => !v);
            setOpen(false);
          }}
          aria-label={searchOpen ? "Close search" : "Open search"}
          aria-expanded={searchOpen}
          aria-controls="masthead-search-panel"
        >
          <Search size={17} aria-hidden />
        </button>
      </div>

      <nav className="hidden border-t border-rule lg:block" aria-label="Primary">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <ul className="flex items-stretch">
            {categories.map((c) => (
              <li key={c.slug}>
                <NavLink
                  to={`/category/${c.slug}`}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-10 items-center px-3.5 font-sans text-[12.5px] font-semibold uppercase tracking-[0.05em] text-ink-soft hover:text-emerald",
                      isActive && "text-emerald shadow-[inset_0_-2px_0_0_var(--color-emerald)]",
                    )
                  }
                >
                  {c.navLabel}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="flex items-center">
            {extraNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="inline-flex h-10 items-center px-3 font-sans text-[12.5px] text-muted hover:text-ink"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <nav className="border-t border-rule lg:hidden" aria-label="Sections">
        <ul className="flex snap-x gap-0 overflow-x-auto px-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <li key={c.slug} className="snap-start">
              <NavLink
                to={`/category/${c.slug}`}
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-8 items-center whitespace-nowrap px-2 font-sans text-[11px] font-semibold uppercase tracking-[0.07em] text-ink-soft",
                    isActive && "text-emerald shadow-[inset_0_-2px_0_0_var(--color-emerald)]",
                  )
                }
              >
                {c.navLabel}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {searchOpen && (
        <div id="masthead-search-panel" className="border-t border-rule bg-canvas px-4 py-3 sm:px-6">
          <form onSubmit={onSearch} className="mx-auto flex max-w-7xl gap-2" role="search">
            <label className="sr-only" htmlFor="masthead-search">
              Search articles
            </label>
            <input
              id="masthead-search"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Signal Desk"
              className="h-11 min-w-0 flex-1 border border-rule bg-paper px-3 font-sans text-base sm:text-sm"
            />
            <button
              type="submit"
              className="h-11 shrink-0 bg-ink px-5 font-sans text-sm font-semibold text-paper"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {open && (
        <dialog
          ref={menuRef}
          id="mobile-menu"
          className="fixed inset-0 z-40 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-paper p-0 text-ink lg:hidden"
          aria-label="Menu"
          aria-modal="true"
          onCancel={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex="0"]',
            );
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <Logo size="md" />
            <button
              autoFocus
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center text-ink"
              aria-label="Close menu"
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <nav aria-label="Mobile" className="px-4 pb-10 pt-2">
            <p className="kicker py-3">Sections</p>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <NavLink
                    to={`/category/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-rule py-3.5 font-display text-xl tracking-tight text-ink"
                  >
                    {c.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <p className="kicker py-3 pt-6">The desk</p>
            <ul>
              {extraNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-rule py-3 font-sans text-sm text-muted"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block border-b border-rule py-3 font-sans text-sm text-muted"
                >
                  Send a tip
                </Link>
              </li>
            </ul>
            <p className="mt-6 font-sans text-[11px] leading-relaxed text-faint">{brand.demoNotice}</p>
          </nav>
        </dialog>
      )}
    </header>
  );
}
