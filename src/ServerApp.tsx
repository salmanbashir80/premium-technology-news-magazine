import { StaticRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppRoutes } from "./App";
import type { Article } from "./types";

export function ServerApp({
  location,
  initialArticles,
}: {
  location: string;
  initialArticles?: Article[];
}) {
  return (
    <AppProvider initialArticles={initialArticles}>
      <StaticRouter location={location}>
        <AppRoutes />
      </StaticRouter>
    </AppProvider>
  );
}
