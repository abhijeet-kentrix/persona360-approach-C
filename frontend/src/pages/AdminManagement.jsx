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
  InputAdornment,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  SupervisorAccount,
  Edit as EditIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { createUser, listUser, deleteUser, updateUser } from "../apiClient";

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
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
    dsp: false,
  });
  const [editAdmin, setEditAdmin] = useState({
    id: null,
    username: "",
    password: "",
    dsp: false,
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
          dsp: false,
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

  const handleOpenDeleteConfirm = (admin) => {
    setAdminToDelete(admin);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setAdminToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteUser(adminToDelete.id).then((res) => {
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
        handleCloseDeleteConfirm();
      });
    }
  };

  const handleOpenEdit = (admin) => {
    setEditAdmin({
      id: admin.id,
      username: admin.username,
      password: "",
      dsp: admin.dsp || false,
    });
    setEditOpen(true);
  };

  const handleUpdateAdmin = () => {
    if (!editAdmin.password) {
      setSnackbar({
        open: true,
        message: "Password is required",
        severity: "error",
      });
      return;
    }

    updateUser(editAdmin.id, {
      password: editAdmin.password,
      dsp: editAdmin.dsp,
    }).then((res) => {
      if (res.success) {
        setSnackbar({
          open: true,
          message: "Admin updated successfully",
          severity: "success",
        });
        fetchData();
        setEditOpen(false);
        setEditAdmin({
          id: null,
          username: "",
          password: "",
          dsp: false,
        });
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
                  DSP
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
                    <Chip
                      label={admin.dsp ? "Enabled" : "Disabled"}
                      color={admin.dsp ? "success" : "default"}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit admin">
                      <IconButton
                        onClick={() => handleOpenEdit(admin)}
                        sx={{
                          color: "#3b82f6",
                          "&:hover": { bgcolor: "#eff6ff" },
                        }}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete admin">
                      <IconButton
                        onClick={() => handleOpenDeleteConfirm(admin)}
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
              type={showPassword ? "text" : "password"}
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newAdmin.dsp}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, dsp: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="DSP (Show Audience Count)"
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

      {/* Edit Admin Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Admin - {editAdmin.username}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Alert severity="info" sx={{ mb: 1 }}>
              Update password and DSP flag for this admin
            </Alert>
            <TextField
              label="New Password"
              type={showEditPassword ? "text" : "password"}
              value={editAdmin.password}
              onChange={(e) =>
                setEditAdmin({ ...editAdmin, password: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
              helperText="Enter a new password to reset"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      edge="end"
                    >
                      {showEditPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editAdmin.dsp}
                  onChange={(e) =>
                    setEditAdmin({ ...editAdmin, dsp: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="DSP (Show Audience Count)"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateAdmin}
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
            Update Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#dc2626" }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography variant="body1">
            Are you sure you want to delete admin{" "}
            <strong>{adminToDelete?.username}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
            Company: {adminToDelete?.company_name}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDeleteConfirm}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              background: "#dc2626",
              "&:hover": {
                background: "#b91c1c",
              },
            }}
          >
            Delete Admin
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
