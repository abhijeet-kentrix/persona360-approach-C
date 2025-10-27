import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import UserManagement from "./pages/UserManagement";
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

  useEffect(() => {
    // Make request to protected route on load to validate auth
    const checkAuth = async () => {
      try {
        // Use getProtectedData from apiClient (has interceptors and correct endpoint)
        const result = await getProtectedData();

        if (result.success && result.data) {
          // Check role (case-insensitive comparison)
          const role = result.data.role?.toLowerCase();
          setIsAdmin(role === 'admin' || role === 'super_admin');
          setIsAuthenticated(true);
        } else {
          // Only logout on actual auth failure
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Only logout on 401 (unauthorized), not on network errors
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
        // For network errors, keep user state unchanged
      }
    };

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
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <UserManagement
                onLoginSuccess={() => setIsAuthenticated(true)}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : (
              <Admin onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          }

          // <Admin onLoginSuccess={() => setIsAuthenticated(true)} />}
        />
        {/* <Route
          path="/user_management"
          element={<UserManagement onLoginSuccess={() => setIsAuthenticated(true) } setIsAuthenticated={setIsAuthenticated} />}
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
