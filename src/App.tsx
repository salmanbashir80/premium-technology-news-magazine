import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { pageMetadata } from "./lib/pageMetadata";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { ArticlePage } from "./pages/ArticlePage";
import { CategoryPage } from "./pages/CategoryPage";
import { SearchPage } from "./pages/SearchPage";
import { AuthorPage } from "./pages/AuthorPage";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    const metadata = pageMetadata(pathname);
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
