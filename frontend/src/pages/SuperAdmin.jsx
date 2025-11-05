import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Fab,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Help,
  SupervisorAccount,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/images/white_logo.png";
import { loginUser } from "../apiClient";

const SuperAdmin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [alertData, setAlertData] = useState({ message: "", type: "" });

  const handlePasswordShowChange = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const login = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setAlertData({
        message: "Please enter username and password",
        type: "warning",
      });
      return;
    }

    try {
      const res = await loginUser({ username, password });

      if (res.data.message === "Login successful") {
        setAlertData({ message: "Login successful!", type: "success" });
        if (res.data.user.role === "SuperAdmin") {
          // Call onLoginSuccess and wait for auth check to complete
          if (onLoginSuccess) {
            await onLoginSuccess();
          }
          navigate("/super_admin/dashboard");
        } else {
          setAlertData({
            message: "Permission Denied: Super Admin access required.",
            type: "warning",
          });
        }
      } else {
        setAlertData({ message: "Invalid credentials", type: "warning" });
      }
    } catch (err) {
      setAlertData({ message: "Invalid credentials", type: "warning" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* Left Section - Super Admin themed gradient */}
      <Box
        sx={{
          width: "50%",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <img
            src={LogoImage}
            alt="Illustration"
            style={{
              width: "350px",
            }}
          />
        </Box>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            px: 4,
            py: 6,
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Login Heading with Super Admin Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <SupervisorAccount
              sx={{
                fontSize: 36,
                color: "#0f172a",
                mr: 1,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1f2937",
              }}
            >
              Super Admin Login
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontSize: "0.875rem",
              mb: 3,
            }}
          >
            Enter your super administrator credentials to access the system
            control panel and manage all organizations.
          </Typography>

          {/* Show Alerts */}
          {alertData.message && (
            <Alert
              severity={alertData.type === "success" ? "success" : "warning"}
              sx={{
                mb: 2,
                "& .MuiAlert-icon": {
                  color: alertData.type === "success" ? "#059669" : "#d97706",
                },
              }}
            >
              {alertData.message}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={login} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="text"
              value={username}
              onChange={handleUserNameChange}
              placeholder="Super Admin Username"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#334155",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0f172a",
                    borderWidth: 2,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Super Admin Password"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#334155",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0f172a",
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handlePasswordShowChange}
                      edge="end"
                      sx={{ color: "#6b7280" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                color: "white",
                fontWeight: 600,
                py: 1.5,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 14px 0 rgba(15, 23, 42, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #020617 0%, #1e293b 100%)",
                  boxShadow: "0 6px 20px 0 rgba(15, 23, 42, 0.4)",
                },
              }}
            >
              Access Super Admin Panel
            </Button>
          </Box>

          {/* Links */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              fontSize: "0.875rem",
              color: "#4b5563",
            }}
          >
            <Link
              href="/admin"
              sx={{
                color: "#334155",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                  color: "#0f172a",
                },
              }}
            >
              Admin Login
            </Link>
            <Typography sx={{ color: "#d1d5db" }}>|</Typography>
            <Link
              href="/login"
              sx={{
                color: "#334155",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                  color: "#0f172a",
                },
              }}
            >
              User Login
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Bottom Help Button - Super Admin themed */}
      <Fab
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
          color: "white",
          fontSize: "0.875rem",
          "&:hover": {
            background: "linear-gradient(135deg, #020617 0%, #1e293b 100%)",
          },
        }}
      >
        <Help />
      </Fab>
    </Box>
  );
};

export default SuperAdmin;
