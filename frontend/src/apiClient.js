// apiClient.js - Axios configuration and API calls

import axios from "axios";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrf_token") {
      return value;
    }
  }
  return null;
};

// Request interceptor to add CSRF token
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers["X-CSRF-TOKEN"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we're not already on login/auth pages
    // and not during initial auth check
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on login or if it's the protected route check
      if (!currentPath.includes('/login') && !currentPath.includes('/admin') &&
          !error.config.url.includes('/auth/protected')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ========================================
// PRESET CRUD OPERATIONS
// ========================================

// GET PRESET LIST (Lightweight - only IDs and names)
export const getPresetsList = async () => {
  try {
    const response = await apiClient.get("/presets/list");
    return {
      success: true,
      data: response.data,
      message: "Preset list fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch preset list",
      status: error.response?.status,
    };
  }
};

// CREATE PRESET
export const createPreset = async (payload) => {
  try {
    const response = await apiClient.post("/presets", payload);
    return {
      success: true,
      data: response.data,
      message: "Preset created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to create preset",
      status: error.response?.status,
    };
  }
};

// GET ALL PRESETS (with pagination - for admin views)
export const getAllPresets = async (params = {}) => {
  try {
    const response = await apiClient.get("/presets", { params });
    return {
      success: true,
      data: response.data,
      message: "Presets fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch presets",
      status: error.response?.status,
    };
  }
};

// GET PRESET BY ID
export const getPresetById = async (presetId) => {
  try {
    const response = await apiClient.get(`/presets/${presetId}`);
    return {
      success: true,
      data: response.data,
      message: "Preset fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch preset",
      status: error.response?.status,
    };
  }
};

// UPDATE PRESET
export const updatePreset = async (presetId, presetData) => {
  try {
    const response = await apiClient.put(`/presets/${presetId}`, presetData);
    return {
      success: true,
      data: response.data,
      message: "Preset updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update preset",
      status: error.response?.status,
    };
  }
};

// DELETE PRESET
export const deletePreset = async (presetId) => {
  try {
    const response = await apiClient.delete(`/presets/${presetId}`);
    return {
      success: true,
      data: response.data,
      message: "Preset deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete preset",
      status: error.response?.status,
    };
  }
};

// GET PRESETS BY USERNAME
export const getPresetsByUsername = async (username) => {
  try {
    const response = await apiClient.get(`/presets/user/${username}`);
    return {
      success: true,
      data: response.data,
      message: "User presets fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch user presets",
      status: error.response?.status,
    };
  }
};

// ========================================
// BUILD AUDIENCE OPERATION
// ========================================

// Build Audience - sends filter data and receives segments
export const buildAudience = async (filterData) => {
  try {
    const response = await apiClient.post("/build-audience", filterData);
    return {
      success: true,
      data: response.data,
      message: "Audience built successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to build audience",
      status: error.response?.status,
    };
  }
};

// ========================================
// PROTECTED ROUTE
// ========================================

export const getProtectedData = async () => {
  try {
    const response = await apiClient.get("/auth/protected");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Access denied",
      status: error.response?.status,
    };
  }
};

// ========================================
// USER MANAGEMENT OPERATIONS
// ========================================

// LIST ALL USERS
export const listUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.per_page) queryParams.append("per_page", params.per_page);
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);
    if (params.status !== undefined) queryParams.append("status", params.status);

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiClient.get(url);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch users",
      status: error.response?.status,
    };
  }
};

// GET USERS BY COMPANY
export const listUser = async () => {
  try {
    const response = await apiClient.get("/get_users");
    return {
      success: true,
      data: response.data,
      message: "Data Fetched.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch users",
      status: error.response?.status,
    };
  }
};

// CREATE USER
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/users", userData);
    return {
      success: true,
      data: response.data,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to create user",
      status: error.response?.status,
    };
  }
};

// DELETE USER
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete user",
      status: error.response?.status,
    };
  }
};

// UPDATE USER
export const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return {
      success: true,
      data: response.data,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update user",
      status: error.response?.status,
    };
  }
};

// ========================================
// AUTHENTICATION OPERATIONS
// ========================================

// LOGIN
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return {
      success: true,
      data: response.data,
      message: "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Login failed",
      status: error.response?.status,
    };
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (username) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { username });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to send reset email",
      status: error.response?.status,
    };
  }
};

// RESET PASSWORD
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to reset password",
      status: error.response?.status,
    };
  }
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return {
      success: true,
      data: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to get user info",
      status: error.response?.status,
    };
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/auth/logout");
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Logout failed",
      status: error.response?.status,
    };
  }
};

export default apiClient;