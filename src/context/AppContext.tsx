import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AdminItem, ArticleStatus } from "../types";
import { initialAdminItems } from "../data/admin";

interface AppContextValue {
  newsletterJoined: boolean;
  subscribe: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  adminItems: AdminItem[];
  updateAdminStatus: (id: string, status: ArticleStatus) => void;
  assignAdmin: (id: string, assignee: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [newsletterJoined, setNewsletterJoined] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminItems, setAdminItems] = useState<AdminItem[]>(initialAdminItems);

  const value = useMemo<AppContextValue>(
    () => ({
      newsletterJoined,
      subscribe: () => {
        setNewsletterJoined(true);
      },
      searchQuery,
      setSearchQuery,
      adminItems,
      updateAdminStatus: (id, status) => {
        setAdminItems((items) =>
          items.map((item) =>
            item.id === id
              ? { ...item, status, updatedAt: new Date().toISOString() }
              : item,
          ),
        );
      },
      assignAdmin: (id, assignee) => {
        setAdminItems((items) =>
          items.map((item) =>
            item.id === id
              ? { ...item, assignee, updatedAt: new Date().toISOString() }
              : item,
          ),
        );
      },
    }),
    [newsletterJoined, searchQuery, adminItems],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
