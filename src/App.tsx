import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { MobileHeader } from "./components/MobileHeader";
import { Dashboard } from "./components/Dashboard";
import { Bets } from "./components/Bets";
import { Draws } from "./components/Draws";
import { Analytics } from "./components/Analytics";
import Login from "./components/auth/Login";
import { ResetPassword } from "./components/auth/ResetPassword";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { Winnings } from "./components/Winnings";
import { PlayersBets } from "./components/PlayersBets";
import { Users } from "./components/Users";
import { HierarchyView } from "./components/HierarchyView";
import { HierarchySecond } from "./components/HierarchySecond";
import { HierarchyThird } from "./components/HierarchyThird";
import { HierarchyFourth } from "./components/HierarchyFourth";
import { AdminManagement } from "./components/AdminManagement";
import { useAuth0 } from "@auth0/auth0-react";
import { GamesTypes } from "./components/GamesTypes";
import { TransactionsCashin } from "./components/TransactionsCashin";
import { TransactionsCashOut } from "./components/TransactionsCashout";
import { WinnerBets } from "./components/WinnersBets";
import { Agents } from "./components/Agents";
import { Clients } from "./components/Clients";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div>...</div>; // Prevent flickering before authentication check
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                  <Sidebar />
                </div>

                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white">
                  <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
                </div>

                {/* Mobile Sidebar */}
                {isSidebarOpen && (
                  <div className="fixed inset-0 z-50 md:hidden">
                    <div 
                      className="absolute inset-0 bg-gray-600 bg-opacity-75" 
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-64 bg-white">
                      <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bets" element={<Bets />} />
                    <Route path="/gametypes" element={<GamesTypes />} />
                    <Route path="/draws" element={<Draws />} />
                    <Route path="/cashinhistory" element={<TransactionsCashin />} />
                    <Route path="/cashouthistory" element={<TransactionsCashOut />} />
                    <Route path="/logs" element={<Analytics />} />
                    <Route path="/winnings" element={<Winnings />} />
                    <Route path="/playersbets" element={<PlayersBets />} />
                    <Route path="/winners" element={<WinnerBets />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/agents" element={<Agents />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/hierarchy" element={<HierarchyView />} />
                    <Route path="/hierarchysecond" element={<HierarchySecond />} />
                    <Route path="/hierarchythird" element={<HierarchyThird />} />
                    <Route path="/hierarchyfourth" element={<HierarchyFourth />} />
                    <Route path="/adminmanagement" element={<AdminManagement />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
