import "./App.css";

import { AppRoutes } from "./components/AppRoutes";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "./components/Layout";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
