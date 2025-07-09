import Layout from "./Layout";
import { ROUTES } from "@/routes/routes";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  // Check if we're on the landing page
  const isLandingPage = location.pathname === ROUTES.LANDING;

  if (isLandingPage) {
    // For landing page, render without the regular layout
    return <>{children}</>;
  }

  // For all other pages, use the regular layout
  return <Layout>{children}</Layout>;
}
