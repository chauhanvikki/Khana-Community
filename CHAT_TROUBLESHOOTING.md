# Chat Feature Troubleshooting Guide

## ✅ Changes Made to Fix Issues

### 1. **Backend Setup** ✅
- ✅ Updated `Message.js` model to use ES6 imports
- ✅ Updated `messages.js` routes to use ES6 imports
- ✅ Added message routes to `backend/index.js`
- ✅ Route registered: `/api/messages`

### 2. **Frontend Improvements** ✅
- ✅ Better error handling in Chat component
- ✅ Improved ID extraction for donors and volunteers
- ✅ Added console logging for debugging
- ✅ Better validation before opening chat

---

## 🔍 How to Debug Issues

### Step 1: Check Backend is Running
```bash
# Make sure backend is running and shows:
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Step 2: Check Browser Console
Open browser DevTools (F12) and check Console tab:

**When clicking "Chat with Donor/Volunteer":**
```javascript
// You should see:
Opening chat with donor: { donorId: "xxx", donorName: "John" }
Extracted: { donorId: "xxx", donorName: "John" }

// Or for volunteer:
Opening chat with volunteer: { volunteerId: "xxx", volunteerName: "Jane" }
Extracted: { volunteerId: "xxx", volunteerName: "Jane" }
```

**When sending a message:**
```javascript
// You should see:
Message sent successfully: { message: "...", data: {...} }
```

### Step 3: Check Network Tab
In DevTools, go to Network tab:

**POST /api/messages**
- Status: Should be `201 Created`
- Response: `{ message: "Message sent successfully", data: {...} }`

**GET /api/messages/:userId**
- Status: Should be `200 OK`
- Response: `[...array of messages...]`

---

## 🐛 Common Errors & Solutions

### Error: "Failed to send message: 404"
**Cause:** Message routes not registered in backend

**Solution:**
1. Check `backend/index.js` has:
   ```javascript
   import messageRoutes from "./routes/messages.js";
   app.use("/api/messages", messageRoutes);
   ```
2. Restart backend server

---

### Error: "Cannot open chat: Volunteer ID is missing"
**Cause:** Volunteer ID not properly populated in donation

**Solution:**
1. Check browser console for: `Donation claimedBy data: ...`
2. If `claimedBy` is `null` or `undefined`, the donation hasn't been claimed yet
3. Make sure volunteer has accepted/claimed the donation first

---

### Error: "Failed to send message: 401 Unauthorized"
**Cause:** Authentication token missing or invalid

**Solution:**
1. Logout and login again
2. Check localStorage has `token`
3. In browser console: `localStorage.getItem('token')`

---

### Error: "Recipient ID is missing"
**Cause:** ID not extracted properly from donation/task

**Solution:**
1. Check console logs:
   ```javascript
   Donation claimedBy data: { _id: "xxx", name: "John" }
   Extracted: { volunteerId: "xxx", volunteerName: "John" }
   ```
2. If `volunteerId` or `donorId` is `undefined`, check the data structure

---

## 🔧 Manual Testing Steps

### Test 1: Volunteer → Donor Chat
1. **As Volunteer:**
   - Login to volunteer account
   - Go to "Your Upcoming Tasks"
   - Click "Chat with Donor" on any accepted task
   - Type message and click Send
   - Check console for logs

2. **As Donor:**
   - Login to donor account (different browser/incognito)
   - Go to "My Donations"
   - Click "Chat with [Volunteer Name]" on claimed donation
   - See the volunteer's message
   - Reply

### Test 2: Donor → Volunteer Chat
1. **As Donor:**
   - Create a donation
   - Wait for volunteer to claim it
   - Click "Chat with [Volunteer]"
   - Send first message

2. **As Volunteer:**
   - See the donor's message
   - Reply

---

## 📊 Database Check

### Check if Messages are Saving
Using MongoDB Compass or mongo shell:

```javascript
// In MongoDB
use your_database_name;

// Check messages collection
db.messages.find().pretty();

// Should show:
{
  _id: ObjectId("..."),
  senderId: ObjectId("..."),
  recipientId: ObjectId("..."),
  message: "Hello!",
  read: false,
  createdAt: ISODate("...")
}
```

---

## 🎯 Quick Fixes

### Fix 1: Restart Backend
```bash
# Stop backend (Ctrl+C)
# Start backend again
npm run dev
# or
node index.js
```

### Fix 2: Clear Browser Cache
```javascript
// In browser console:
localStorage.clear();
location.reload();

// Then login again
```

### Fix 3: Check MongoDB Connection
```javascript
// In backend console, you should see:
✅ MongoDB Connected

// If not, check .env file has correct MONGO_URI
```

---

## 📝 Checklist

Before reporting issues, verify:

- [ ] Backend server is running
- [ ] MongoDB is connected
- [ ] Message routes are registered in `backend/index.js`
- [ ] Frontend shows volunteer/donor name in chat button
- [ ] Click chat button opens modal
- [ ] Console shows proper IDs when clicking chat button
- [ ] Network tab shows API calls
- [ ] Authentication token exists in localStorage
- [ ] Donation has been claimed (for donor to see chat button)

---

## 💡 Still Having Issues?

Check the browser console logs and note:

1. **Exact error message**
2. **Console logs** (all "Opening chat..." and "Extracted..." logs)
3. **Network tab status codes**
4. **User role** (donor or volunteer)
5. **Steps to reproduce**

---

## ✨ Success Indicators

You'll know it's working when:

✅ Chat button appears correctly
✅ Modal opens with recipient name
✅ Can type message
✅ "Send" button is enabled
✅ Message appears in chat after sending
✅ Messages persist after closing/reopening modal
✅ Other user can see the message
✅ Timestamps are correct
✅ Read receipts work (✓ vs ✓✓)
