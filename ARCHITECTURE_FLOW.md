# Architecture & Data Flow - Food Donation Platform

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────────┤
│  DonorLogin.jsx          VolunteerLogin.jsx                     │
│       ↓                         ↓                               │
│  DonorDashboard.jsx      VolunteerDashboard.jsx                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP Requests with JWT Token
                     │ Authorization: Bearer <token>
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                  │
├─────────────────────────────────────────────────────────────────┤
│  authMiddleware.js → Verify JWT Token                          │
│       ↓                                                          │
│  authController.js → Login, GetMe                               │
│  donationController.js → CRUD operations (user-filtered)        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ MongoDB Queries
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                         │
├─────────────────────────────────────────────────────────────────┤
│  users collection:                                              │
│    - name, email, password, role                                │
│                                                                  │
│  donations collection:                                          │
│    - donorId (ref: User)                                        │
│    - foodName, quantity, status                                 │
│    - claimedBy (ref: User)                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow (Login Process)

### Before Fix (BROKEN):
```
User A Login
    ↓
localStorage.setItem("donorId", "user_a_id")
localStorage.setItem("token", "token_a")
    ↓
User A Logout (but localStorage NOT cleared!)
    ↓
User B Login
    ↓
localStorage.setItem("donorId", "user_b_id")  ← OLD DATA STILL EXISTS!
localStorage.setItem("token", "token_b")
    ↓
Dashboard loads with mixed data
    ↓
❌ User B sees User A's donations
```

### After Fix (WORKING):
```
User A Login
    ↓
localStorage.clear()  ← REMOVES ALL OLD DATA
    ↓
localStorage.setItem("donorId", "user_a_id")
localStorage.setItem("token", "token_a")
    ↓
User A Logout
    ↓
localStorage.clear()  ← REMOVES ALL DATA
    ↓
User B Login
    ↓
localStorage.clear()  ← REMOVES ANY REMAINING DATA
    ↓
localStorage.setItem("donorId", "user_b_id")
localStorage.setItem("token", "token_b")
    ↓
Dashboard loads with ONLY User B's data
    ↓
✅ User B sees ONLY their own donations
```

---

## 📊 Data Fetching Flow

### Donor Dashboard Flow:

```
1. Component Mount
   └→ useEffect() triggered

2. Fetch User Profile
   ├→ GET /api/auth/me
   ├→ Headers: { Authorization: "Bearer <token>" }
   └→ Backend verifies JWT → Returns user data
       └→ setUser({ name: "John", role: "donor" })

3. Fetch Donations
   ├→ GET /api/donations/my-donations
   ├→ Headers: { Authorization: "Bearer <token>" }
   └→ Backend extracts user.id from JWT
       ├→ Donation.find({ donorId: req.user.id })
       └→ Returns ONLY donations created by this user
           └→ setDonations([...])

4. Display
   ├→ Header: "Welcome, John" | "Role: donor" | [Logout]
   └→ Table: Shows ONLY John's donations
```

### Volunteer Dashboard Flow:

```
1. Component Mount
   └→ useEffect() triggered

2. Fetch User Profile
   ├→ GET /api/auth/me
   ├→ Headers: { Authorization: "Bearer <token>" }
   └→ Backend verifies JWT → Returns user data
       └→ setVolunteer({ name: "Jane", role: "volunteer" })

3. Fetch Available Tasks
   ├→ GET /api/donations/available
   ├→ Backend: Donation.find({ status: "available" })
   │             .populate("donorId", "name email phone")
   └→ Returns tasks WITH donor information
       └→ setAvailableTasks([
            { foodName: "Rice", donorId: { name: "John" } },
            { foodName: "Bread", donorId: { name: "Mary" } }
          ])

4. Fetch Accepted Tasks
   ├→ GET /api/donations/volunteer
   ├→ Backend: Donation.find({ claimedBy: req.user.id })
   │             .populate("donorId", "name email phone")
   └→ Returns ONLY tasks claimed by this volunteer
       └→ setTasks([...])

5. Display
   ├→ Header: "Welcome, Jane 👋" | "Role: Volunteer" | [Logout]
   ├→ Available Tasks: Shows donor names (task.donorId.name)
   └→ Your Tasks: Shows donor names for claimed tasks
```

---

## 🔄 Create Donation Flow (Donor)

### Before Fix:
```
Frontend:
  donorId = localStorage.getItem("donorId")  ← Could be stale/wrong
  POST /api/donations
  Body: { donorId, foodName, quantity, ... }
      ↓
Backend:
  Creates donation with provided donorId  ← Trusts client data
      ↓
❌ SECURITY ISSUE: Client could fake donorId
```

### After Fix:
```
Frontend:
  POST /api/donations
  Body: { foodName, quantity, ... }  ← NO donorId sent
  Headers: { Authorization: "Bearer <token>" }
      ↓
Backend:
  authMiddleware verifies JWT token
  Extracts user.id from token
  Creates donation: { donorId: req.user.id, ... }
      ↓
✅ SECURE: Backend determines user ID from verified JWT
```

---

## 🎭 JWT Token Structure

```javascript
// When user logs in:
const token = jwt.sign(
  {
    id: user._id,        // User's MongoDB _id
    email: user.email,
    name: user.name,
    role: user.role      // "donor" or "volunteer"
  },
  process.env.JWT_SECRET_KEY,
  { expiresIn: "24h" }
);

// Token looks like (encoded):
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M...

// When decoded (by backend):
{
  id: "673abc123def456",
  email: "john@test.com",
  name: "John Doe",
  role: "donor",
  iat: 1234567890,
  exp: 1234654290
}
```

---

## 🛡️ Authentication Middleware Flow

```
Client Request
    ↓
GET /api/donations/my-donations
Headers: { Authorization: "Bearer <token>" }
    ↓
┌──────────────────────────────┐
│   authMiddleware.js          │
├──────────────────────────────┤
│ 1. Extract token from header │
│ 2. Verify token with secret  │
│ 3. Decode user info          │
│ 4. Attach to req.user        │
│    req.user = {              │
│      id: "673abc...",         │
│      name: "John",            │
│      role: "donor"            │
│    }                          │
└────────────┬─────────────────┘
             ↓
┌──────────────────────────────┐
│   donationController.js      │
├──────────────────────────────┤
│ getDonationsByDonor()        │
│   ↓                          │
│ Donation.find({              │
│   donorId: req.user.id  ←──  Uses verified user ID
│ })                           │
└──────────────────────────────┘
```

---

## 🗄️ Database Query Examples

### Get Donor's Own Donations:
```javascript
// Backend: donationController.js
export const getDonationsByDonor = async (req, res) => {
  const donations = await Donation.find({ 
    donorId: req.user.id  // ← User ID from JWT token
  })
  .populate("claimedBy", "name email")  // Add volunteer info
  .populate("donorId", "name email");   // Add donor info
  
  // Returns: Only donations where donorId matches logged-in user
};
```

### Get Volunteer's Claimed Tasks:
```javascript
// Backend: donationController.js
export const getVolunteerDonations = async (req, res) => {
  const donations = await Donation.find({ 
    claimedBy: req.user.id  // ← User ID from JWT token
  })
  .populate("donorId", "name email phone")  // Add donor info
  .populate("claimedBy", "name email");      // Add volunteer info
  
  // Returns: Only donations claimed by logged-in volunteer
  // Each donation includes donor's name via .populate()
};
```

### Get Available Tasks (Any Volunteer):
```javascript
// Backend: donationController.js
export const getAvailableDonations = async (req, res) => {
  const donations = await Donation.find({ 
    status: "available"  // Not yet claimed
  })
  .populate("donorId", "name email phone");  // Add donor info
  
  // Returns: All unclaimed donations with donor details
};
```

---

## 🔀 Role-Based Data Access

```
┌─────────────────────────────────────────────────────────┐
│                     User Types                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  DONOR                          VOLUNTEER                │
│  role: "donor"                  role: "volunteer"        │
│                                                          │
│  Can:                           Can:                     │
│  ✅ Create donations            ✅ View all available    │
│  ✅ View own donations              donations           │
│  ✅ See assigned volunteer      ✅ Claim donations       │
│  ❌ View others' donations      ✅ View claimed tasks    │
│  ❌ Claim donations             ✅ See donor names       │
│                                 ❌ View other           │
│                                     volunteers' tasks   │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Component State Management

### DonorDashboard State:
```javascript
const [user, setUser] = useState(null);          // Current user profile
const [donations, setDonations] = useState([]);  // User's donations only
const [formData, setFormData] = useState({...}); // New donation form

// On mount:
fetchUserProfile()    → setUser()
fetchMyDonations()    → setDonations()
```

### VolunteerDashboard State:
```javascript
const [volunteer, setVolunteer] = useState(null);      // Current user
const [availableTasks, setAvailableTasks] = useState([]); // Unclaimed
const [tasks, setTasks] = useState([]);                // Claimed by user

// On mount:
fetchVolunteer()       → setVolunteer()
fetchAvailableTasks()  → setAvailableTasks()
fetchAcceptedTasks()   → setTasks()
```

---

## 🔄 Complete User Journey

### Donor Journey:
```
1. Signup/Login
   ↓
2. localStorage.clear() + Store new token
   ↓
3. Redirect to /auth/welcome (DonorDashboard)
   ↓
4. Fetch user profile + donations
   ↓
5. Display: "Welcome, [Name]" + own donations
   ↓
6. Create new donation
   ↓
7. Donation saved with JWT user ID
   ↓
8. Refresh donations list
   ↓
9. Logout → localStorage.clear()
```

### Volunteer Journey:
```
1. Signup/Login
   ↓
2. localStorage.clear() + Store new token
   ↓
3. Redirect to /volunteer/dashboard
   ↓
4. Fetch user profile + available tasks + accepted tasks
   ↓
5. Display: "Welcome, [Name]" + "Role: Volunteer"
   ↓
6. See all available donations with donor names
   ↓
7. Accept a task
   ↓
8. Task moves to "Your Upcoming Tasks"
   ↓
9. Logout → localStorage.clear()
```

---

## 🎯 Summary

**Key Improvements:**

1. **Data Isolation:** `localStorage.clear()` on login prevents data leakage
2. **JWT Authentication:** All data fetching uses verified JWT tokens
3. **Backend Authority:** User ID always extracted from JWT (never client-provided)
4. **Proper Logout:** Clears all local data and requires re-authentication
5. **Role Display:** Fetches user profile to show correct role
6. **Populated Donor Data:** MongoDB `.populate()` includes donor names in tasks

**Result:** Secure, isolated, role-based access control system! ✅
