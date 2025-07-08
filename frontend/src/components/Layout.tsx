import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  userRole?: "admin" | "user" | null;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isAuthenticated = false,
  userRole = null,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogout={onLogout}
      />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;
