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
  AdminPanelSettings,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/images/white_logo.png";
import { loginUser } from "../apiClient";

const Admin = ({ onLoginSuccess }) => {
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
      // const res = await axios.post(
      //   "http://localhost:5000/api/auth/login",
      //   { username, password },
      //   { withCredentials: true }
      // );
      const res = await loginUser({ username, password });

      if (res.data.message === "Login successful") {
        setAlertData({ message: "Login successful!", type: "success" });
        if (res.data.user.role == "Admin") {
          onLoginSuccess?.();
          navigate("/admin");
        } else {
          setAlertData({
            message: "Permission Denied: Admin access required.",
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
      {/* Left Section - Admin themed gradient */}
      <Box
        sx={{
          width: "50%",
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <AdminPanelSettings
            sx={{
              fontSize: 60,
              color: "#e0e7ff",
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              color: "#e0e7ff",
              fontWeight: 600,
              textAlign: "center",
              mb: 1,
            }}
          >
            Admin Portal
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#c7d2fe",
              textAlign: "center",
            }}
          >
            Secure Administrative Access
          </Typography>
        </Box> */}
        <Box>
          {/* <Typography
                      variant="h1"
                      sx={{
                        color: "#ffffffff",
                        textAlign: "center",
                        fontWeight: 400,
                      }}
                    >
                      KENTRIX
                    </Typography> */}
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
          {/* Login Heading with Admin Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <AdminPanelSettings
              sx={{
                fontSize: 32,
                color: "#4c1d95",
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
              Admin Login
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
            Enter your administrative credentials to access the control panel
            and manage system resources.
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
              placeholder="Admin Username"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7c3aed",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4c1d95",
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
              placeholder="Admin Password"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7c3aed",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4c1d95",
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
                background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
                color: "white",
                fontWeight: 600,
                py: 1.5,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 14px 0 rgba(124, 58, 237, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #3730a3 0%, #6d28d9 100%)",
                  boxShadow: "0 6px 20px 0 rgba(124, 58, 237, 0.4)",
                },
              }}
            >
              Access Admin Panel
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
              href="/login"
              sx={{
                color: "#7c3aed",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                  color: "#4c1d95",
                },
              }}
            >
              User Login
            </Link>
            <Typography sx={{ color: "#d1d5db" }}>|</Typography>
            <Link
              href="#"
              sx={{
                color: "#4b5563",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#374151",
                },
              }}
            >
              Forgot password
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Bottom Help Button - Admin themed */}
      <Fab
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
          color: "white",
          fontSize: "0.875rem",
          "&:hover": {
            background: "linear-gradient(135deg, #3730a3 0%, #6d28d9 100%)",
          },
        }}
      >
        <Help />
      </Fab>
    </Box>
  );
};

export default Admin;
