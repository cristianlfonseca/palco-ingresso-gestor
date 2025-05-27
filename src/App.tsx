
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TheaterProvider } from "./context/TheaterContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Sale from "./pages/Sale";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import PasswordControl from "./pages/PasswordControl";
import Panel from "./pages/Panel";
import SalesManagement from "./pages/SalesManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <TheaterProvider>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/panel" element={<Panel />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/students" element={<Students />} />
                      <Route path="/sale" element={<Sale />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/sales-management" element={<SalesManagement />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/password-control" element={<PasswordControl />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </TheaterProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
