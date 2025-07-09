import "./App.css";

import { AppLayout } from "./components/AppLayout";
import { AppRoutes } from "./components/AppRoutes";
import { AuthProvider } from "@/context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
          <AppRoutes />
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
