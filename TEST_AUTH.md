# Authentication Testing Guide

## Quick Test (5 Minutes)

### Prerequisites
- Backend running: `python app.py` (Port 5000)
- Frontend running: `npm start` (Port 3000)
- Test user exists in database

---

## Test 1: Login ✅

1. Open browser: `http://localhost:3000/login`
2. Enter credentials:
   - Username: `abhijeet`
   - Password: `abhi@kentrix`
3. Click "Sign In"

**Expected:**
- ✅ Alert: "Login successful!"
- ✅ Redirected to home page
- ✅ Navbar visible at top

**If Failed:**
- Check backend console for errors
- Check Network tab for 401/500 errors
- Verify database has user

---

## Test 2: Navbar Display ✅

After logging in, check top-right navbar:

**Expected:**
- ✅ Company name displayed (e.g., "Kentrix")
- ✅ User avatar with initials
- ✅ Click avatar → Shows username and role

**If Failed:**
- Open DevTools → Console
- Look for: "User data: {...}"
- Check if user_name and company_name are in response

---

## Test 3: Page Refresh ✅ (CRITICAL TEST)

1. After logging in, press `F5` or `CTRL+R`
2. Wait for page to reload

**Expected:**
- ✅ Stay logged in
- ✅ Home page loads
- ✅ Navbar shows data
- ✅ NO redirect to login

**If Failed - Check:**

### Check #1: Network Request
- Open DevTools → Network tab
- Refresh page
- Look for: `auth/protected`
- Status should be: `200 OK`
- Response should have: `user_name`, `company_name`, `role`

### Check #2: Console Errors
- Open DevTools → Console
- Look for red errors
- Common errors:
  - `404` = Wrong endpoint path
  - `401` = Token validation failed
  - `Network Error` = Backend not running

### Check #3: Cookies
- Open DevTools → Application → Cookies
- Should see:
  - `token` (HttpOnly: true)
  - `csrf_token` (HttpOnly: false)
- If missing = Login didn't set cookies

---

## Test 4: Navigation ✅

1. Click around the app
2. Navigate between pages

**Expected:**
- ✅ All protected pages load
- ✅ Stay logged in
- ✅ Navbar persists

---

## Test 5: Logout ✅

1. Click avatar in top-right
2. Click "Logout"

**Expected:**
- ✅ Redirected to login page
- ✅ Cookies cleared
- ✅ Can't access protected pages

**Verify:**
- DevTools → Application → Cookies
- Both `token` and `csrf_token` should be deleted

---

## Test 6: Close and Reopen ✅

1. Login successfully
2. Close browser tab completely
3. Open new tab and go to `http://localhost:3000`

**Expected:**
- ✅ Still logged in
- ✅ Home page loads automatically
- ✅ Navbar shows data

**Note:** This only works within 8 hours (token expiration)

---

## Detailed Debugging

### If Auth Check Fails

**Step 1: Check Backend Endpoint**

```bash
# In backend directory
cd backend
python app.py
```

Look for:
```
* Running on http://0.0.0.0:5000
```

**Step 2: Test Endpoint Directly**

Login first, then copy cookies from DevTools and test:

```bash
# Replace <csrf> and <jwt> with actual values from cookies
curl -v http://localhost:5000/api/auth/protected \
  -H "X-CSRF-TOKEN: <csrf-token>" \
  -H "Cookie: token=<jwt-token>; csrf_token=<csrf-token>"
```

Should return:
```json
{
  "message": "Welcome abhijeet, you are authenticated.",
  "user_id": 1,
  "user_name": "abhijeet",
  "company_name": "Kentrix",
  "role": "Admin"
}
```

**Step 3: Check Frontend Code**

Open: `frontend/src/apiClient.js`

Line 209 should be:
```javascript
const response = await apiClient.get("/auth/protected");  // ✅ CORRECT
```

NOT:
```javascript
const response = await apiClient.get("/protected");  // ❌ WRONG
```

**Step 4: Check Response Interceptor**

Open: `frontend/src/apiClient.js`

Lines 41-56 should have smart redirect logic:
```javascript
if (error.response?.status === 401) {
  const currentPath = window.location.pathname;
  if (!currentPath.includes('/login') &&
      !currentPath.includes('/admin') &&
      !error.config.url.includes('/auth/protected')) {
    window.location.href = "/login";
  }
}
```

---

## Common Error Messages

### Error: "404 Not Found"

**Meaning:** Endpoint doesn't exist

**Fix:**
1. Check `apiClient.js` line 209
2. Should be: `/auth/protected`
3. Restart frontend: `npm start`

### Error: "401 Unauthorized"

**Possible Causes:**
1. Token expired (> 8 hours old)
2. Token invalid (corrupted)
3. CSRF token mismatch

**Fix:**
1. Clear cookies (DevTools → Application → Clear storage)
2. Login again
3. Test refresh

### Error: "CSRF token validation failed"

**Cause:** CSRF token not being sent or doesn't match

**Fix:**
1. Check cookies have `csrf_token`
2. Check request has `X-CSRF-TOKEN` header
3. Values should match

### Error: "Network Error"

**Cause:** Backend not running or wrong URL

**Fix:**
1. Start backend: `python app.py`
2. Check URL: `http://localhost:5000`
3. Check CORS settings

---

## Browser DevTools Cheat Sheet

### Check Cookies
```
F12 → Application → Cookies → http://localhost:3000
```

### Check Network Requests
```
F12 → Network → Reload page → Look for "auth/protected"
```

### Check Console Logs
```
F12 → Console → Look for errors or "Auth check" messages
```

### Check Request Headers
```
F12 → Network → Click request → Headers tab
Look for: X-CSRF-TOKEN, Cookie
```

### Check Response
```
F12 → Network → Click request → Response tab
Should see JSON with user_name, company_name, role
```

---

## Success Indicators

### ✅ Everything Working

**What you should see:**

1. **Login Page:**
   - Clean UI with username/password fields
   - "Sign In" button

2. **After Login:**
   - Redirected to home page
   - Navbar at top with company name
   - Avatar with user initials

3. **After Refresh:**
   - Stay on home page
   - NO redirect to login
   - Navbar still shows data

4. **Network Tab:**
   - `auth/protected` request: 200 OK
   - Response has user data

5. **Console:**
   - No red errors
   - May see: "Auth check completed"

---

## Performance Metrics

### Login Speed
- Should complete in < 500ms
- If slower, check database connection

### Auth Check Speed
- Should complete in < 200ms
- If slower, check backend performance

### Page Load
- First load: < 1 second
- Subsequent: < 500ms
- If slower, check bundle size

---

## Advanced Testing

### Test Token Expiration

**Simulate 8-hour expiration:**

1. Login successfully
2. Open DevTools → Application → Cookies
3. Edit `token` cookie
4. Change value to random string
5. Refresh page
6. **Expected:** Redirected to login

### Test CSRF Protection

**Simulate CSRF attack:**

1. Login successfully
2. Open DevTools → Network
3. Copy `auth/protected` request
4. Remove `X-CSRF-TOKEN` header
5. Send request
6. **Expected:** 403 Forbidden

### Test Concurrent Sessions

1. Login in Chrome
2. Login in Firefox with same account
3. Both should work simultaneously
4. Logout in Chrome
5. Firefox should still be logged in

---

## Automated Test Script

Save this as `test_auth.js` and run with node:

```javascript
const axios = require('axios');

async function testAuth() {
  try {
    // Test 1: Login
    console.log('Test 1: Login...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'abhijeet',
      password: 'abhi@kentrix'
    }, { withCredentials: true });

    const cookies = loginRes.headers['set-cookie'];
    console.log('✅ Login successful');

    // Test 2: Protected Route
    console.log('Test 2: Protected route...');
    const protectedRes = await axios.get('http://localhost:5000/api/auth/protected', {
      headers: {
        'Cookie': cookies.join('; '),
        'X-CSRF-TOKEN': extractCsrf(cookies)
      }
    });

    console.log('✅ Protected route accessible');
    console.log('User:', protectedRes.data.user_name);
    console.log('Company:', protectedRes.data.company_name);

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

function extractCsrf(cookies) {
  const csrfCookie = cookies.find(c => c.startsWith('csrf_token='));
  return csrfCookie.split('=')[1].split(';')[0];
}

testAuth();
```

Run:
```bash
npm install axios
node test_auth.js
```

---

## Troubleshooting Flowchart

```
Login works?
├─ YES → Check navbar shows data?
│   ├─ YES → Check page refresh works?
│   │   ├─ YES → ✅ Everything working!
│   │   └─ NO → Check console for errors
│   │       ├─ 404 → Wrong endpoint path
│   │       ├─ 401 → Token validation failed
│   │       └─ Network error → Backend not running
│   └─ NO → Check getProtectedData() response
│       └─ Missing fields → Check backend returns user_name, company_name
└─ NO → Check login credentials
    └─ Check database has user
```

---

## Support

If tests still fail after following this guide:

1. Check `FINAL_FIX.md` for detailed fixes
2. Check `SYSTEM_MAPPING.md` for architecture
3. Check browser console for specific errors
4. Check backend logs for server errors
5. Verify all files are saved and servers restarted

---

**Last Updated:** 2025-01-27
**Status:** Ready for Testing
