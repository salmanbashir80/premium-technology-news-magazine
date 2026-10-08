import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { brand } from "../../config/brand";
import { categories } from "../../data/categories";

const company = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/editorial-policy", label: "Editorial Policy" },
  { to: "/corrections-policy", label: "Corrections" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo inverted to="/" size="lg" />
            <p className="mt-5 max-w-sm font-serif text-[15px] leading-relaxed text-white/70">
              {brand.description}
            </p>
            <p className="mt-4 font-sans text-xs tracking-wide text-white/45">{brand.demoNotice}</p>
          </div>
          <div className="md:col-span-3">
            <p className="kicker !text-white/65">Sections</p>
            <ul className="mt-4 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/category/${c.slug}`} className="font-sans text-sm text-white/80 transition-colors hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="kicker !text-white/65">The Desk</p>
            <ul className="mt-4 space-y-2">
              {company.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="font-sans text-sm text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="kicker !text-white/65">Newsroom & Feeds</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <Link to="/admin" className="transition-colors hover:text-white">
                  Editorial Desk
                </Link>
              </li>
              <li>
                <a href={`mailto:${brand.contact.tips}`} className="transition-colors hover:text-white">
                  Send a Tip
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.contact.corrections}`} className="transition-colors hover:text-white">
                  Corrections
                </a>
              </li>
              <li className="pt-2 text-xs text-white/50 border-t border-white/10">
                <span className="block font-semibold uppercase tracking-wider text-[10px] text-white/60 mb-1">Syndication</span>
                <span className="block">RSS Feed (Demo)</span>
                <span className="block">XML Sitemap</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {brand.foundingYear} {brand.wordmark}. All rights reserved. Independent publication.
          </p>
          <p>
            {brand.address.london} · {brand.address.sanFrancisco}
          </p>
        </div>
      </div>
    </footer>
  );
}
