import Login from "./pages/Login";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import Home from "./pages/Home";
import UserManagement from "./pages/UserManagement";
import AdminManagement from "./pages/AdminManagement";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { getProtectedData } from "./apiClient";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Make request to protected route to validate auth
  const checkAuth = async () => {
    try {
      // Use getProtectedData from apiClient (has interceptors and correct endpoint)
      const result = await getProtectedData();

      if (result.success && result.data) {
        // Check role (case-insensitive comparison)
        const role = result.data.role?.toLowerCase();
        setIsSuperAdmin(role === 'superadmin');
        setIsAdmin(role === 'admin' || role === 'superadmin');
        setIsAuthenticated(true);
      } else {
        // Only logout on actual auth failure
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only logout on 401 (unauthorized), not on network errors
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      // For network errors, keep user state unchanged
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={<Login onLoginSuccess={checkAuth} />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && isAdmin ? (
              <UserManagement
                onLoginSuccess={checkAuth}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : (
              <Admin onLoginSuccess={checkAuth} />
            )
          }
        />
        <Route
          path="/super_admin"
          element={
            isAuthenticated && isSuperAdmin ? (
              <Navigate to="/super_admin/dashboard" replace />
            ) : (
              <SuperAdmin onLoginSuccess={checkAuth} />
            )
          }
        />
        <Route
          path="/super_admin/dashboard"
          element={
            isAuthenticated && isSuperAdmin ? (
              <AdminManagement
                onLoginSuccess={checkAuth}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : (
              <Navigate to="/super_admin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
