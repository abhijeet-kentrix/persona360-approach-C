import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { grey } from "@mui/material/colors";
import {
  Stack,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { logoutUser, getProtectedData } from "../apiClient";

const Navbar = ({ setLoginUser, inProgressFlag, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    company_name: "",
    role: "",
    initials: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getProtectedData();
      console.log("User data:", res);
      
      if (res.success && res.data) {
        const { user_name, company_name, role } = res.data;
        
        // Generate initials from username
        const initials = generateInitials(user_name);
        
        setUserData({
          username: user_name || "",
          company_name: company_name || "",
          role: role || "",
          initials: initials,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Generate initials from username
  const generateInitials = (name) => {
    if (!name) return "U";
    
    // If username contains dots (e.g., john.doe)
    if (name.includes(".")) {
      const parts = name.split(".");
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
    // If username contains spaces (e.g., John Doe)
    if (name.includes(" ")) {
      const parts = name.split(" ");
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    
    // If username contains underscore (e.g., john_doe)
    if (name.includes("_")) {
      const parts = name.split("_");
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
    // Otherwise just take first two characters
    return name.substring(0, 2).toUpperCase();
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        height: "72px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "72px",
          maxWidth: "1400px",
          mx: "auto",
          px: 4,
        }}
      >
        {/* Left side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Persona360
          </Typography>
        </Box>

        {/* Right side - User info and actions */}
        <Stack direction="row" spacing={3} alignItems="center">
          {/* Company name */}
          <Typography
            variant="body2"
            sx={{
              color: grey[600],
              fontWeight: 500,
              display: { xs: "none", sm: "block" },
            }}
          >
            {userData.company_name || "Loading..."}
          </Typography>

          {/* Refresh Button */}
          <IconButton
            onClick={handleRefresh}
            sx={{
              color: grey[600],
              "&:hover": {
                backgroundColor: grey[50],
              },
            }}
            title="Refresh page"
          >
            <RefreshIcon fontSize="small" />
          </IconButton>

          {/* User Avatar and Dropdown */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "50px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: grey[50],
              },
            }}
            onClick={handleAvatarClick}
          >
            <Avatar
              sx={{
                bgcolor: "transparent",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                width: 36,
                height: 36,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {(userData.initials?.[0] || "U").toUpperCase()}
            </Avatar>
            <ArrowDropDownIcon
              sx={{
                ml: 0.5,
                color: grey[600],
                fontSize: "1.2rem",
              }}
            />
          </Box>
        </Stack>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            mt: 1,
            "& .MuiPaper-root": {
              borderRadius: 2,
              minWidth: 220,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
            },
          }}
        >
          {/* User Info Section */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: grey[800] }}
            >
              {userData.username || "User"}
            </Typography>
            <Typography variant="caption" sx={{ color: grey[500] }}>
              {userData.role || "User"}
            </Typography>
          </Box>

          <Divider />

          {/* Logout Option */}
          <MenuItem
            onClick={() => {
              handleLogout();
              handleMenuClose();
            }}
            sx={{
              py: 1.5,
              px: 2,
              "&:hover": {
                backgroundColor: grey[50],
              },
            }}
          >
            <LogoutIcon
              sx={{ mr: 1.5, fontSize: "1.1rem", color: grey[600] }}
            />
            <Typography variant="body2" fontWeight={500}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>

      {/* Progress Bar */}
      {inProgressFlag && (
        <LinearProgress
          sx={{
            height: 2,
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            },
          }}
        />
      )}
    </Box>
  );
};

export default Navbar;