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
  Person as PersonIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { createUser, listUser, deleteUser } from "../apiClient";

const UserManagement = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const fetchData = async () => {
    const res = await listUser();
    setUsers(res.data.users);
    console.log(res.data.users); // or set state with res.data
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [users, setUsers] = useState([]);
  // Sample user data
  //   const [users, setUsers] = useState([
  //     {
  //       id: 1,
  //       name: "John Doe",
  //       email: "john.doe@example.com",
  //       companyName: "Tech Corp",
  //       username: "johndoe",
  //       role: "Admin",
  //       status: "Active",
  //       createdDate: "2024-01-15",
  //       lastLoginDate: "2024-03-10",
  //     },
  //     {
  //       id: 2,
  //       name: "Sarah Wilson",
  //       email: "sarah.wilson@startup.io",
  //       companyName: "Startup Inc",
  //       username: "sarahw",
  //       role: "User",
  //       status: "Active",
  //       createdDate: "2024-02-20",
  //       lastLoginDate: "2024-03-09",
  //     },
  //     {
  //       id: 3,
  //       name: "Michael Chen",
  //       email: "michael.chen@enterprise.com",
  //       companyName: "Enterprise Ltd",
  //       username: "mchen",
  //       role: "Manager",
  //       status: "Inactive",
  //       createdDate: "2024-01-08",
  //       lastLoginDate: "2024-02-28",
  //     },
  //   ]);

  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "User",
  });

  const handleCreateUser = () => {
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.username ||
      !newUser.password
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }
    createUser(newUser).then((res) => {
      if (res.success) {
        setSnackbar({
          open: true,
          message: "User created successfully",
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

    setOpen(false);
  };

  const handleOpenDeleteConfirm = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id).then((res) => {
        if (res.success) {
          setSnackbar({
            open: true,
            message: "User deleted successfully",
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

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
    navigate("/login");
    setSnackbar({
      open: true,
      message: "Logged out successfully",
      severity: "success",
    });

    // Here you would typically handle the actual logout logic
    // such as clearing tokens, redirecting to login page, etc.
    console.log("Logout clicked");
  };

  const getStatusColor = (status) => {
    return status === true ? "success" : "default";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "error";
      case "Manager":
        return "warning";
      default:
        return "primary";
    }
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
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1 }}
          >
            User Management
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Manage user accounts, roles, and permissions
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
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Add User
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
                  User
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
                {/* <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#475569",
                    fontSize: "0.875rem",
                  }}
                >
                  Status
                </TableCell> */}
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
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { bgcolor: "#f8fafc" },
                    "& td": { borderColor: "#e2e8f0" },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "#667eea", width: 40, height: 40 }}
                      >
                        {getInitials(user.first_name + " " + user.last_name)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1a1a1a" }}
                        >
                          {user.first_name + " " + user.last_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {user.last_name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BusinessIcon sx={{ color: "#94a3b8", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "#475569" }}>
                        {user.company_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", color: "#475569" }}
                    >
                      @{user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  {/* <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    />
                  </TableCell> */}
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      {new Date(user.created_date).toLocaleString("en-IN", {
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
                      {user.lastLoginDate === "Never"
                        ? "Never"
                        : new Date(user.last_login_date).toLocaleString(
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
                    <Tooltip title="Delete user">
                      <IconButton
                        onClick={() => handleOpenDeleteConfirm(user)}
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

      {/* Create User Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="First Name"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            {/* <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            /> */}
            <TextField
              label="Last Name"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Role"
              select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              fullWidth
              variant="outlined"
              SelectProps={{ native: true }}
            >
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Create User
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
            Are you sure you want to delete user{" "}
            <strong>{userToDelete?.username}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
            Name: {userToDelete?.first_name} {userToDelete?.last_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Role: {userToDelete?.role}
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
            Delete User
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

export default UserManagement;
