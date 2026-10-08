import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { brand } from "../../config/brand";
import { scrollToId } from "../../lib/dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-emerald focus:px-3 focus:py-2 focus:text-paper"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("main");
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="bg-emerald px-4 py-1 text-center font-sans text-[10px] leading-snug tracking-wide text-paper sm:text-[11px]">
        <span className="sm:hidden">{brand.demoNoticeShort}</span>
        <span className="hidden sm:inline">{brand.demoNotice}</span>
      </div>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
