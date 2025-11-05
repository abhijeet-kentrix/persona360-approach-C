import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  SupervisorAccount,
} from "@mui/icons-material";
import { createUser, listUser, deleteUser } from "../apiClient";

const AdminManagement = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const fetchData = async () => {
    const res = await listUser();
    // Filter only admins
    const adminUsers = res.data.users.filter(user => user.role === "Admin");
    setAdmins(adminUsers);
    console.log(adminUsers);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    companyName: "",
    role: "Admin",
  });

  const handleCreateAdmin = () => {
    if (
      !newAdmin.firstName ||
      !newAdmin.lastName ||
      !newAdmin.username ||
      !newAdmin.password ||
      !newAdmin.companyName
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    createUser(newAdmin).then((res) => {
      if (res.success) {
        setSnackbar({
          open: true,
          message: "Admin created successfully",
          severity: "success",
        });
        fetchData();
        setNewAdmin({
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          companyName: "",
          role: "Admin",
        });
      } else {
        setSnackbar({
          open: true,
          message: res.error,
          severity: "error",
        });
      }
    });

    setOpen(false);
  };

  const handleDeleteAdmin = (id) => {
    deleteUser(id).then((res) => {
      if (res.success) {
        setSnackbar({
          open: true,
          message: "Admin deleted successfully",
          severity: "success",
        });
        fetchData();
      } else {
        setSnackbar({
          open: true,
          message: res.error,
          severity: "error",
        });
      }
    });
  };

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
    navigate("/super_admin");
    setSnackbar({
      open: true,
      message: "Logged out successfully",
      severity: "success",
    });
    console.log("Logout clicked");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <SupervisorAccount sx={{ fontSize: 32, color: "#0f172a" }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "#1a1a1a" }}
            >
              Admin Management
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Manage company administrators and their access
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #020617 0%, #1e293b 100%)",
              },
            }}
          >
            Add Admin
          </Button>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderColor: "#dc2626",
              color: "#dc2626",
              "&:hover": {
                borderColor: "#b91c1c",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Admin
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Company
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Username
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Created
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Last Login
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow
                  key={admin.id}
                  sx={{
                    "&:hover": { bgcolor: "#f8fafc" },
                    "& td": { borderColor: "#e2e8f0" },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#0f172a", width: 40, height: 40 }}
                      >
                        {getInitials(admin.first_name + " " + admin.last_name)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1a1a1a" }}
                        >
                          {admin.first_name + " " + admin.last_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {admin.last_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#475569" }}>
                        {admin.company_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", color: "#475569" }}
                    >
                      @{admin.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={admin.role}
                      color="error"
                      size="small"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      {new Date(admin.created_date).toLocaleString("en-IN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      {admin.last_login_date === null
                        ? "Never"
                        : new Date(admin.last_login_date).toLocaleString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Kolkata",
                            }
                          )}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete admin">
                      <IconButton
                        onClick={() => handleDeleteAdmin(admin.id)}
                        sx={{
                          color: "#ef4444",
                          "&:hover": { bgcolor: "#fef2f2" },
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Admin Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Admin
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="First Name"
              value={newAdmin.firstName}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, firstName: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Last Name"
              value={newAdmin.lastName}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, lastName: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Company Name"
              value={newAdmin.companyName}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, companyName: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
              helperText="Assign this admin to a company"
            />
            <TextField
              label="Username"
              value={newAdmin.username}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, username: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateAdmin}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #020617 0%, #1e293b 100%)",
              },
            }}
          >
            Create Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminManagement;
