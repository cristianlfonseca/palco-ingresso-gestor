
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { TheaterProvider } from './context/TheaterContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Index from './pages/Index';
import Students from './pages/Students';
import Sale from './pages/Sale';
import SalesManagement from './pages/SalesManagement';
import SeatSearch from './pages/SeatSearch';
import Dashboard from './pages/Dashboard';
import PasswordControl from './pages/PasswordControl';
import Panel from './pages/Panel';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TheaterProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/students" element={<Students />} />
                      <Route path="/sale" element={<Sale />} />
                      <Route path="/sales-management" element={<SalesManagement />} />
                      <Route path="/seat-search" element={<SeatSearch />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/password-control" element={<PasswordControl />} />
                      <Route path="/panel" element={<Panel />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </TheaterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
