# Environment Variables Setup Guide

## 🔧 VERCEL (Frontend) Environment Variables

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project: `khana-community-kfoc`
3. Go to **Settings** tab
4. Click **Environment Variables** in the sidebar

### Step 2: Add Environment Variables
Add these variables one by one:

**Variable 1:**
- Name: `VITE_API_BASE_URL`
- Value: `https://khana-community.onrender.com`
- Environment: `Production`, `Preview`, `Development` (check all)

**Variable 2:**
- Name: `NODE_ENV`
- Value: `production`
- Environment: `Production` (check only production)

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Select **Use existing Build Cache** = NO
4. Click **Redeploy**

---

## 🔧 RENDER (Backend) Environment Variables

### Step 1: Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Click on your service: `khana-community`
3. Go to **Environment** tab in the left sidebar

### Step 2: Add Environment Variables
Add these variables:

**Variable 1:**
- Key: `PORT`
- Value: `5000`

**Variable 2:**
- Key: `MONGO_URI`
- Value: `mongodb+srv://singhvikki870:Vikki00000@cluster0.lrf2tr3.mongodb.net/`

**Variable 3:**
- Key: `JWT_SECRET_KEY`
- Value: `vikki`

**Variable 4:**
- Key: `FRONTEND_URL`
- Value: `https://khana-community-kfoc.vercel.app`

**Variable 5:**
- Key: `NODE_ENV`
- Value: `production`

### Step 3: Deploy
1. Click **Save Changes**
2. Service will automatically redeploy
3. Wait for deployment to complete (green status)

---

## 🚀 Quick Fix Commands

If still getting 404, run these in your frontend folder:

```bash
cd frontend
npm run build
```

Then push to GitHub - Vercel will auto-deploy.

---

## ✅ Test After Setup
1. Visit: https://khana-community-kfoc.vercel.app/
2. Should show the AccessAccount page (not 404)
3. Test login/signup functionality
4. Check browser console for any errors