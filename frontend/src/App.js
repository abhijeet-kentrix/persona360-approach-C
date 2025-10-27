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
import axios from "axios";
import { getProtectedData } from "./apiClient";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Make request to protected route on load to validate auth

    const checkAuth = async () => {
      try {
        const csrfToken = getCookie("csrf_token");
        const res = await axios.get("http://localhost:5000/api/protected", {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        });
        if (res.data.message) {
          if (res.data.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

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
