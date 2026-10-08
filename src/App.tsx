import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { pageMetadata } from "./lib/pageMetadata";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { ArticlePage } from "./pages/ArticlePage";
import { CategoryPage } from "./pages/CategoryPage";
import { SearchPage } from "./pages/SearchPage";
import { AuthorPage } from "./pages/AuthorPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import {
  AboutPage,
  ContactPage,
  CorrectionsPolicyPage,
  EditorialPolicyPage,
  PrivacyPage,
  TermsPage,
} from "./pages/InfoPages";
import {
  AdminOverview,
  ApprovalsPage,
  AutomationPage,
  DiscoveryPage,
  DraftsPage,
  MediaPage,
  PublishedAdminPage,
  ResearchPage,
  SeoPage,
  SettingsPage,
} from "./pages/admin/AdminPages";

function RouteSync() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Backward compatibility: If visitor opened a bookmark with a hash, e.g. /#/category/ai
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith("#/")) {
      const cleanPath = window.location.hash.slice(1);
      navigate(cleanPath, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const metadata = pageMetadata(pathname);
    document.title = metadata.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", metadata.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", metadata.canonicalUrl);

    const setMetaTag = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMetaTag("property", "og:title", metadata.title);
    setMetaTag("property", "og:description", metadata.description);
    setMetaTag("property", "og:url", metadata.canonicalUrl);
    setMetaTag("property", "og:type", metadata.ogType);
    setMetaTag("property", "og:image", metadata.ogImage);
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", metadata.title);
    setMetaTag("name", "twitter:description", metadata.description);
    setMetaTag("name", "twitter:image", metadata.ogImage);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <RouteSync />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            {/* Clean SEO Article URL pattern: /:category/:slug (e.g., /ai/ai-power-bottleneck-data-centers) */}
            <Route path="/:category/:slug" element={<ArticlePage />} />
            {/* Legacy alias for backwards compatibility */}
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/author/:slug" element={<AuthorPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
            <Route path="/corrections-policy" element={<CorrectionsPolicyPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="discovery" element={<DiscoveryPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="drafts" element={<DraftsPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="published" element={<PublishedAdminPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="seo" element={<SeoPage />} />
            <Route path="automation" element={<AutomationPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          {/* Explicit 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
