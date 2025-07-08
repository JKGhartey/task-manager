interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-muted">
      <main className="w-full min-h-screen">{children}</main>
    </div>
  );
};

export default Layout;
