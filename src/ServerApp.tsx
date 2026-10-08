import { StaticRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppRoutes } from "./App";

export function ServerApp({ location }: { location: string }) {
  return (
    <AppProvider>
      <StaticRouter location={location}>
        <AppRoutes />
      </StaticRouter>
    </AppProvider>
  );
}
