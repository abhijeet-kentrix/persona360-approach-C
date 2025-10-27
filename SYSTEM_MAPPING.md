# P360 Dashboard - Complete System Mapping & Authentication Flow

## 🔍 Issue Identified: Logout on Refresh

### Root Cause
**The frontend is calling the WRONG endpoint during authentication check on refresh.**

In `frontend/src/App.js` line 25:
```javascript
const res = await axios.get("http://localhost:5000/api/protected", {
```

**Problem:** This bypasses the `apiClient.js` interceptor and doesn't use the correct baseURL!

### Expected vs Actual Behavior

| Expected | Actual |
|----------|--------|
| Should call `/api/auth/protected` | Calling `/api/protected` |
| Should use apiClient with interceptors | Using raw axios |
| Should auto-add CSRF token | Manually adding CSRF token |

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Frontend                           │
│                      (Port: 3000)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  App.js (Main Router)                                            │
│  ├── Login.jsx                                                   │
│  ├── Home.jsx (Protected)                                        │
│  ├── Admin.jsx                                                   │
│  └── UserManagement.jsx (Protected)                              │
│                                                                  │
│  apiClient.js (Axios Instance)                                   │
│  ├── Request Interceptor (adds CSRF token)                       │
│  └── Response Interceptor (handles 401)                          │
│                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │ Cookies: token, csrf_token
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Flask Backend API                           │
│                      (Port: 5000)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  app.py (Main Application)                                       │
│  ├── CORS Middleware                                             │
│  └── Blueprint Registration                                      │
│                                                                  │
│  Routes:                                                         │
│  ├── auth_routes.py (/api/auth/*)                               │
│  ├── user_routes.py (/api/users/*, /api/get_users)              │
│  ├── preset_routes.py (/api/presets/*)                          │
│  └── audience_routes.py (/api/build-audience)                   │
│                                                                  │
│  Middleware:                                                     │
│  └── auth.py (@token_required, @admin_required)                 │
│                                                                  │
│  Utils:                                                          │
│  └── auth_utils.py (hash_password, check_password)              │
│                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│                                                                  │
│  Tables:                                                         │
│  ├── users (id, username, password, role, company_name)         │
│  └── presets (preset_id, preset_name, preset_filter_json)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow (Current vs Fixed)

### 1. Login Flow ✅ (Working Correctly)

```
User enters credentials
    │
    ▼
Login.jsx (line 54)
    │
    └──► loginUser({ username, password })
         │
         ▼
apiClient.js (line 311-326)
    │
    └──► POST /api/auth/login
         │
         ▼
Backend: auth_routes.py (line 21-116)
    │
    ├──► Validate credentials
    ├──► Hash password check
    ├──► Generate JWT token
    ├──► Generate CSRF token
    ├──► Set httponly cookies
    │    ├── token (JWT)
    │    └── csrf_token
    │
    └──► Return user data
         │
         ▼
Frontend: Login.jsx (line 56-59)
    │
    ├──► onLoginSuccess()
    └──► navigate("/")
```

**✅ This works perfectly!**

---

### 2. Auth Check on Refresh ❌ (BROKEN - Current Implementation)

```
Page Refresh / App Mount
    │
    ▼
App.js useEffect (line 19-49)
    │
    └──► checkAuth()
         │
         ├──► Get CSRF token from cookie
         │
         └──► axios.get("http://localhost:5000/api/protected") ❌ WRONG!
              │
              ├──► Hardcoded URL (bypasses baseURL)
              ├──► Raw axios (bypasses interceptors)
              ├──► Manual CSRF header
              │
              ▼
Backend: ??? Which endpoint?
    │
    ├──► /api/protected ❌ Does NOT exist in refactored code!
    │    (Should be /api/auth/protected)
    │
    └──► 404 Not Found or wrong handler
         │
         ▼
Frontend catches error (line 42-45)
    │
    └──► setIsAuthenticated(false) ❌
         └──► User gets logged out!
```

**❌ This is BROKEN!**

---

### 3. Auth Check on Refresh ✅ (FIXED - Should Be)

```
Page Refresh / App Mount
    │
    ▼
App.js useEffect
    │
    └──► checkAuth()
         │
         └──► getProtectedData() from apiClient ✅ CORRECT!
              │
              ├──► Uses apiClient instance
              ├──► Auto-adds CSRF via interceptor
              ├──► Correct baseURL
              │
              ▼
apiClient.js (line 207-221)
    │
    └──► GET /auth/protected ✅ (Note: /api prefix added by baseURL)
         │
         ▼
Backend: routes/auth_routes.py (line 128-143)
    │
    ├──► @token_required decorator validates:
    │    ├── JWT token from cookie
    │    ├── CSRF token from cookie & header
    │    └── Token expiration
    │
    └──► Returns user data
         │
         ▼
Frontend: App.js
    │
    ├──► setIsAuthenticated(true) ✅
    ├──► setIsAdmin(based on role)
    └──► User stays logged in! ✅
```

**✅ This will work correctly!**

---

## 📂 File Structure Mapping

### Frontend Structure

```
frontend/
├── src/
│   ├── App.js ⚠️                    # NEEDS FIX: Line 25, 207
│   ├── index.js                     # Entry point
│   ├── apiClient.js ✅              # Axios instance with interceptors
│   │
│   ├── pages/
│   │   ├── Login.jsx ✅             # Login form (working)
│   │   ├── Home.jsx ✅              # Main dashboard (protected)
│   │   ├── Admin.jsx                # Admin login
│   │   └── UserManagement.jsx ✅    # User CRUD (protected)
│   │
│   └── components/
│       ├── Navbar.jsx ✅            # Navigation with logout
│       ├── Filters.jsx              # Filter components
│       ├── Dropdown.jsx             # Dropdown UI
│       └── AlertMessage.jsx         # Alert notifications
│
└── package.json
```

### Backend Structure

```
backend/
├── app.py ✅                        # Main application (refactored)
├── config.py ✅                     # Configuration management
├── db.py ✅                         # Database connection
├── requirements.txt ✅              # Python dependencies
│
├── middleware/
│   └── auth.py ✅                   # @token_required decorator
│
├── utils/
│   └── auth_utils.py ✅            # Password hashing
│
└── routes/
    ├── auth_routes.py ✅            # Authentication endpoints
    │   ├── POST /api/auth/login
    │   ├── POST /api/auth/logout
    │   └── GET  /api/auth/protected ✅ This is the CORRECT endpoint!
    │
    ├── user_routes.py ✅
    │   ├── GET    /api/get_users
    │   ├── POST   /api/users
    │   └── DELETE /api/users/<id>
    │
    ├── preset_routes.py ✅
    │   ├── GET    /api/presets
    │   ├── GET    /api/presets/list
    │   ├── GET    /api/presets/<id>
    │   ├── POST   /api/presets
    │   ├── PUT    /api/presets/<id>
    │   └── DELETE /api/presets/<id>
    │
    └── audience_routes.py ✅
        └── POST /api/build-audience
```

---

## 🔄 API Endpoint Mapping

### Authentication Endpoints

| Frontend Call | Backend Endpoint | File Location | Status |
|---------------|------------------|---------------|--------|
| `loginUser()` | `POST /api/auth/login` | `routes/auth_routes.py:21` | ✅ Working |
| `logoutUser()` | `POST /api/auth/logout` | `routes/auth_routes.py:119` | ✅ Working |
| `getProtectedData()` | `GET /api/auth/protected` | `routes/auth_routes.py:128` | ✅ Exists but not called! |

### User Management Endpoints

| Frontend Call | Backend Endpoint | File Location | Status |
|---------------|------------------|---------------|--------|
| `listUser()` | `GET /api/get_users` | `routes/user_routes.py:12` | ✅ Working |
| `createUser()` | `POST /api/users` | `routes/user_routes.py:41` | ✅ Working |
| `deleteUser()` | `DELETE /api/users/<id>` | `routes/user_routes.py:122` | ✅ Working |

### Preset Management Endpoints

| Frontend Call | Backend Endpoint | File Location | Status |
|---------------|------------------|---------------|--------|
| `getPresetsList()` | `GET /api/presets/list` | `routes/preset_routes.py:74` | ✅ Working |
| `getAllPresets()` | `GET /api/presets` | `routes/preset_routes.py:120` | ✅ Working |
| `getPresetById()` | `GET /api/presets/<id>` | `routes/preset_routes.py:231` | ✅ Working |
| `createPreset()` | `POST /api/presets` | `routes/preset_routes.py:11` | ✅ Working |
| `updatePreset()` | `PUT /api/presets/<id>` | `routes/preset_routes.py:293` | ✅ Working |
| `deletePreset()` | `DELETE /api/presets/<id>` | `routes/preset_routes.py:376` | ✅ Working |

### Audience Endpoints

| Frontend Call | Backend Endpoint | File Location | Status |
|---------------|------------------|---------------|--------|
| `buildAudience()` | `POST /api/build-audience` | `routes/audience_routes.py:9` | ✅ Working |

---

## 🔧 Authentication Token Flow

### Cookie Management

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Cookies                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  token (JWT)                                                     │
│  ├── HttpOnly: true ✅ (Cannot be accessed by JavaScript)       │
│  ├── Secure: false (set to true in production)                  │
│  ├── SameSite: Lax                                               │
│  ├── Max-Age: 28800 seconds (8 hours)                           │
│  └── Contains: { user_id, username, company_name, role, exp }   │
│                                                                  │
│  csrf_token                                                      │
│  ├── HttpOnly: false ✅ (Can be read by JavaScript)             │
│  ├── Secure: false (set to true in production)                  │
│  ├── SameSite: Lax                                               │
│  ├── Max-Age: 28800 seconds (8 hours)                           │
│  └── Random hex token for CSRF protection                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Token Validation Process

```
Protected Request Flow:

1. Request Initiated
   ├── Browser automatically includes JWT cookie (httponly)
   └── apiClient interceptor adds CSRF header

2. Arrives at Backend
   └── @token_required decorator (middleware/auth.py:13)

3. Token Extraction
   ├── Extract JWT from request.cookies.get('token')
   ├── Extract CSRF from request.cookies.get('csrf_token')
   └── Extract CSRF from request.headers.get('X-CSRF-TOKEN')

4. Validation Steps
   ├── Check all tokens present
   │   └── Missing? → 401 Unauthorized
   ├── Check CSRF match
   │   └── Mismatch? → 403 Forbidden
   └── Decode JWT
       ├── Valid? → Extract user info
       ├── Expired? → 401 Token expired
       └── Invalid? → 401 Invalid token

5. Success
   └── Inject user info into route handler:
       ├── current_user_id
       ├── current_username
       ├── current_role
       └── company_name
```

---

## 🐛 The Bug: Detailed Analysis

### What's Happening Now (BROKEN)

**File:** `frontend/src/App.js`
**Lines:** 19-49

```javascript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const csrfToken = getCookie("csrf_token");
      const res = await axios.get("http://localhost:5000/api/protected", { // ❌ WRONG!
        withCredentials: true,
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (res.data.message) {
        if (res.data.role === "admin") {  // ❌ Checking wrong field!
          setIsAdmin(true);
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);  // ❌ Logs out on ANY error!
    }
  };

  checkAuth();
}, []);
```

**Problems:**

1. ❌ **Wrong URL**: Hardcoded `http://localhost:5000/api/protected`
   - Should be: `/auth/protected` (with apiClient baseURL)
   - Bypasses the apiClient interceptor

2. ❌ **Wrong Import**: Uses raw `axios` instead of `apiClient`
   - Misses automatic CSRF injection
   - Misses 401 redirect handler

3. ❌ **Endpoint Doesn't Exist**: `/api/protected` route not registered!
   - After refactoring, it's at `/api/auth/protected`
   - Results in 404 or wrong handler

4. ❌ **Wrong Role Check**: `res.data.role === "admin"`
   - Backend returns `res.data.role` which could be "Admin", "User", "Manager"
   - Case-sensitive mismatch!

5. ❌ **Error Handling**: Logs out on ANY error
   - Network issues = logout
   - CORS issues = logout
   - Should differentiate between 401 vs network errors

---

## ✅ The Fix

### Fix for `frontend/src/App.js`

**REPLACE THIS:**
```javascript
// Lines 19-49 (BROKEN CODE)
useEffect(() => {
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
```

**WITH THIS:**
```javascript
// Lines 19-49 (FIXED CODE)
useEffect(() => {
  const checkAuth = async () => {
    try {
      // Use getProtectedData from apiClient (has interceptors)
      const result = await getProtectedData();

      if (result.success && result.data) {
        // Check role (case-insensitive)
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
      // Only logout on 401 (unauthorized)
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      // For network errors, keep user logged in
    }
  };

  checkAuth();
}, []);
```

**Also REMOVE THIS:**
```javascript
// Lines 51-56 (Not needed anymore)
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? match[2] : null;
}
```

**Reason:** The `apiClient` handles CSRF token extraction automatically.

---

## 🔍 How getProtectedData Works

**File:** `frontend/src/apiClient.js`
**Lines:** 207-221

```javascript
export const getProtectedData = async () => {
  try {
    const response = await apiClient.get("/auth/protected");
    //                                    ^^^^^^^^^^^^^^^^
    //                                    This becomes:
    //                                    http://localhost:5000/api/auth/protected
    //                                    Because baseURL is: http://localhost:5000/api

    return {
      success: true,
      data: response.data,  // Contains: user_id, user_name, role, company_name
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Access denied",
      status: error.response?.status,
    };
  }
};
```

### Request Interceptor Flow

**File:** `frontend/src/apiClient.js`
**Lines:** 27-38

```javascript
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();  // Extract from cookie
    if (csrfToken) {
      config.headers["X-CSRF-TOKEN"] = csrfToken;  // Auto-add header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**This means:**
- ✅ Every request automatically gets CSRF token
- ✅ No need to manually extract cookie
- ✅ Consistent across all API calls

---

## 📊 Data Flow Comparison

### Current (Broken) Flow

```
App.js Mount
    │
    └──► axios.get("http://localhost:5000/api/protected")
         │
         ├──► Hardcoded full URL
         ├──► Manual CSRF extraction
         └──► No interceptors
         │
         ▼
Network Request:
    URL: http://localhost:5000/api/protected ❌ (Wrong endpoint!)
    Headers:
      X-CSRF-TOKEN: <manually extracted>
    Cookies:
      token: <jwt token>
    │
    ▼
Backend:
    Looking for route: /api/protected
    ❌ NOT FOUND! (Should be /api/auth/protected)
    │
    └──► 404 or wrong handler
         │
         ▼
Frontend:
    catch (error) → setIsAuthenticated(false)
    │
    └──► USER GETS LOGGED OUT! ❌
```

### Fixed Flow

```
App.js Mount
    │
    └──► getProtectedData() from apiClient
         │
         ├──► Uses apiClient instance
         ├──► Auto-adds baseURL
         └──► Interceptors run
         │
         ▼
Request Interceptor:
    ├──► Extract CSRF from cookie
    └──► Add X-CSRF-TOKEN header automatically
    │
    ▼
Network Request:
    URL: http://localhost:5000/api/auth/protected ✅ (Correct!)
    Headers:
      X-CSRF-TOKEN: <auto-added>
    Cookies:
      token: <jwt token>
    │
    ▼
Backend:
    Route: /api/auth/protected ✅
    Handler: routes/auth_routes.py:128
    │
    ├──► @token_required decorator
    │    ├──► Validate JWT
    │    └──► Validate CSRF
    │
    └──► Return user data ✅
         │
         ▼
Response Interceptor:
    ├──► Check status
    └──► Return data
    │
    ▼
Frontend:
    result.success = true ✅
    setIsAuthenticated(true) ✅
    │
    └──► USER STAYS LOGGED IN! ✅
```

---

## 🎯 Summary of Issues & Fixes

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | Wrong endpoint URL | `App.js:25` | Use `getProtectedData()` from apiClient |
| 2 | Bypassing interceptors | `App.js:25` | Use apiClient instead of raw axios |
| 3 | Manual CSRF handling | `App.js:24` | Remove - interceptor handles it |
| 4 | Wrong role check | `App.js:32` | Check for `'admin'` OR `'super_admin'` |
| 5 | Case sensitivity | `App.js:32` | Use `.toLowerCase()` comparison |
| 6 | Logs out on network error | `App.js:42-45` | Only logout on 401, not all errors |
| 7 | Unused getCookie function | `App.js:51-56` | Remove - not needed |
| 8 | Missing import | `App.js:13` | Already imported! Just not used |

---

## 🚀 Complete Working Flow

### 1. User Logs In
```
Login.jsx → loginUser() → POST /api/auth/login
    ↓
Backend validates → Sets cookies (token, csrf_token)
    ↓
Frontend receives success → navigate("/")
    ↓
User authenticated ✅
```

### 2. User Refreshes Page
```
App.js mounts → useEffect runs → checkAuth()
    ↓
getProtectedData() → GET /api/auth/protected
    ↓
Backend validates tokens → Returns user data
    ↓
Frontend receives success → setIsAuthenticated(true)
    ↓
User stays logged in ✅
```

### 3. User Makes Protected Request
```
Component calls API → apiClient.get/post()
    ↓
Interceptor adds CSRF header automatically
    ↓
Backend validates → Returns data
    ↓
User gets data ✅
```

### 4. Token Expires
```
User makes request → Backend returns 401
    ↓
Response interceptor catches 401
    ↓
Redirects to /login automatically ✅
```

### 5. User Logs Out
```
Navbar → handleLogout() → logoutUser()
    ↓
POST /api/auth/logout → Clears cookies
    ↓
setIsAuthenticated(false) → navigate("/login")
    ↓
User logged out ✅
```

---

## 📝 Testing Checklist

After applying the fix, test:

- [ ] ✅ Login successfully
- [ ] ✅ Navigate to home page
- [ ] ✅ Refresh page (CTRL+R) - should stay logged in
- [ ] ✅ Close tab and reopen - should stay logged in (if not expired)
- [ ] ✅ Wait 8 hours - should get logged out (token expired)
- [ ] ✅ Click logout - should logout properly
- [ ] ✅ Try accessing protected route without login - should redirect
- [ ] ✅ Check network tab - should see correct endpoints
- [ ] ✅ Check cookies - should see token and csrf_token

---

## 🔒 Security Considerations

| Feature | Status | Notes |
|---------|--------|-------|
| JWT in HttpOnly Cookie | ✅ | Cannot be accessed by JavaScript |
| CSRF Protection | ✅ | Separate token prevents CSRF attacks |
| Password Hashing | ✅ | Bcrypt with salt |
| SQL Injection Prevention | ✅ | Parameterized queries |
| Token Expiration | ✅ | 8 hours |
| CORS | ✅ | Configured for credentials |
| HTTPS | ⚠️ | Should be enabled in production |
| Rate Limiting | ❌ | Consider adding Flask-Limiter |
| Logging | ⚠️ | Basic - consider structured logging |

---

## 🎉 Conclusion

The authentication issue is caused by:
1. Using wrong endpoint (`/api/protected` instead of `/api/auth/protected`)
2. Bypassing the apiClient interceptor
3. Manual CSRF handling instead of automatic

**Solution:** Use `getProtectedData()` from `apiClient.js` which:
- ✅ Uses correct endpoint
- ✅ Auto-adds CSRF token
- ✅ Handles errors properly
- ✅ Maintains consistent API calls

After applying the fix, users will stay logged in after refresh! 🎊
