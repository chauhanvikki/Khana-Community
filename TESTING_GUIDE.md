# Testing Guide - Verify All Fixes

## Quick Test Steps

### Test 1: User Data Isolation (Most Important!)

**Goal:** Verify that different users cannot see each other's data

**Steps:**
1. Create two donor accounts:
   - Donor A: `donor1@test.com` / `password123`
   - Donor B: `donor2@test.com` / `password123`

2. **Login as Donor A:**
   ```
   - Go to donor login page
   - Login with donor1@test.com
   - Create 2-3 donations with different food names
   - Note: Header should say "Welcome, Donor A" and "Role: donor"
   - Verify: You see ONLY your donations in the table
   - Click Logout
   ```

3. **Login as Donor B:**
   ```
   - Go to donor login page
   - Login with donor2@test.com
   - Note: Header should say "Welcome, Donor B" and "Role: donor"
   - Verify: Donations table is EMPTY (no donations from Donor A)
   - Create 1-2 donations with different food names
   - Verify: You see ONLY YOUR donations (not Donor A's)
   ```

4. **Login as Donor A again:**
   ```
   - Logout from Donor B
   - Login as Donor A again
   - Verify: You see ONLY Donor A's original donations
   - Verify: Donor B's donations are NOT visible
   ```

✅ **Expected Result:** Each donor sees ONLY their own donations, never another donor's data

---

### Test 2: Volunteer Dashboard Role Display

**Goal:** Verify volunteer role shows as "Volunteer" (not "Donor")

**Steps:**
1. Create a volunteer account:
   - Go to volunteer signup
   - Email: `volunteer1@test.com`
   - Password: `password123`
   - Role: Volunteer

2. **Login as Volunteer:**
   ```
   - Go to volunteer login page
   - Login with volunteer1@test.com
   - Check the header
   ```

✅ **Expected Result:**
- Header shows: "Welcome, [Volunteer Name] 👋"
- Below header shows: "Role: Volunteer" (NOT "Role: Donor")
- Logout button is visible

---

### Test 3: Donor Names in Volunteer Dashboard

**Goal:** Verify that volunteer can see donor names for each task

**Setup:**
1. Login as Donor A and create a donation
2. Login as Donor B and create a donation
3. Logout

**Test:**
1. Login as volunteer1@test.com
2. Look at the "Available Tasks" table

✅ **Expected Result:**
- Each task row shows the donor's name in the "Donor" column
- Example: "John Doe" or "Jane Smith" (not "Unknown Donor")
- Phone numbers are visible

**Test Task Claiming:**
1. Click "Accept" on one of the tasks
2. Look at "Your Upcoming Tasks" table

✅ **Expected Result:**
- Claimed task shows donor name
- Shows food name, quantity, pickup date
- Status shows "claimed"

---

### Test 4: Logout Functionality

**Goal:** Verify logout clears all data and requires re-login

**Steps:**

**For Donor:**
1. Login as any donor
2. Click the red "Logout" button in top-right
3. Try to navigate back to `/auth/welcome` (dashboard)

✅ **Expected Result:**
- Redirected to login page
- Cannot access dashboard without logging in
- Browser's localStorage is empty (check DevTools → Application → Local Storage)

**For Volunteer:**
1. Login as volunteer
2. Click the "Logout" button
3. Try to navigate to `/volunteer/dashboard`

✅ **Expected Result:**
- Redirected to volunteer login page
- Cannot access dashboard without logging in

---

### Test 5: JWT Token Expiration

**Goal:** Verify automatic logout on invalid/expired token

**Steps:**
1. Login as any user (donor or volunteer)
2. Open Browser DevTools → Application → Local Storage
3. Delete the "token" item OR modify it to random text
4. Try to create a donation or accept a task

✅ **Expected Result:**
- Gets unauthorized error (401)
- Automatically logged out and redirected to login page
- localStorage is cleared

---

## Browser DevTools Checks

### Check localStorage (should be clean)

1. Open DevTools (F12)
2. Go to Application tab → Local Storage → http://localhost:5173
3. After login, you should see:
   ```
   token: <JWT_TOKEN>
   donorId: <USER_ID>
   donorName: <USER_NAME>
   donorEmail: <USER_EMAIL>
   userRole: donor (or volunteer)
   ```
4. After logout, localStorage should be COMPLETELY EMPTY

### Check Network Requests

**For Donor Dashboard:**
1. Login as donor
2. Go to Network tab in DevTools
3. Look for requests to:
   - `GET /api/auth/me` - Should return user profile
   - `GET /api/donations/my-donations` - Should return only user's donations
4. Check the Authorization header: Should have `Bearer <token>`

**For Volunteer Dashboard:**
1. Login as volunteer
2. Check requests to:
   - `GET /api/auth/me` - Should return volunteer profile with role: "volunteer"
   - `GET /api/donations/available` - Available tasks with donor names
   - `GET /api/donations/volunteer` - Claimed tasks with donor names

---

## Common Issues & Solutions

### Issue: "Cannot access dashboard"
**Solution:** Make sure both backend and frontend are running:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Issue: "Donations not showing"
**Cause:** Token might be expired or invalid
**Solution:** 
1. Logout completely
2. Clear browser cache and localStorage
3. Login again

### Issue: "Donor name shows as 'Unknown Donor'"
**Cause:** Donation was created before donor information was properly populated
**Solution:**
1. Create a NEW donation after logging in
2. The new donation should have donor name populated

### Issue: "Still seeing previous user's data"
**Cause:** Old code or cache
**Solution:**
1. Hard refresh browser (Ctrl + Shift + R)
2. Clear localStorage manually
3. Restart frontend development server

---

## Success Criteria

All tests pass if:

✅ Each donor sees ONLY their own donations (complete isolation)
✅ Volunteer dashboard shows "Role: Volunteer" 
✅ All donor names are visible in volunteer's task lists
✅ Logout completely clears localStorage and prevents access
✅ No authentication errors in browser console
✅ All API calls include proper Authorization headers

---

## Quick Debugging Commands

### Check if backend is running:
```bash
curl http://localhost:5000
# Should return: "🍱 Khana Community Backend Running"
```

### Check JWT token validity:
1. Copy token from localStorage
2. Go to https://jwt.io
3. Paste token in debugger
4. Verify it contains: `id`, `name`, `email`, `role`

### MongoDB Check (if using MongoDB Compass):
1. Connect to your MongoDB instance
2. Look at `users` collection - verify roles are set correctly
3. Look at `donations` collection - verify `donorId` is populated

---

## Expected Console Output (No Errors)

**Good Console (During Login):**
```
Logged in: {token: "...", role: "donor", ...}
```

**Good Console (Loading Dashboard):**
```
Available tasks response: [{...}, {...}]
Accepted tasks response: [{...}]
```

**Bad Console (Fix Required):**
```
❌ Error fetching donations: 401 Unauthorized
❌ Token decode error
❌ No token received
```

---

## Final Verification Checklist

Before marking as complete, verify:

- [ ] Two different donors cannot see each other's donations
- [ ] Donor dashboard shows correct name and role "donor"
- [ ] Volunteer dashboard shows correct name and role "Volunteer"
- [ ] Volunteer can see donor names in available tasks
- [ ] Volunteer can see donor names in accepted tasks
- [ ] Logout button exists and works on both dashboards
- [ ] Logout clears ALL localStorage
- [ ] Cannot access dashboards after logout without re-login
- [ ] No console errors during normal operation
- [ ] JWT tokens are properly sent with all API requests

If all items are checked, the fixes are working correctly! ✅
