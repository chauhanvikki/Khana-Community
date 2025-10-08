# Khana Community - Production Deployment Guide

## 🚀 Production URLs
- **Backend**: https://khana-community.onrender.com/
- **Frontend**: https://khana-community-kfoc.vercel.app/

## 📋 Changes Made for Production

### Backend Updates (Render)
1. **CORS Configuration**: Updated to allow both localhost and production frontend URLs
2. **Environment Variables**: Added `FRONTEND_URL` for dynamic CORS configuration
3. **Socket.io**: Configured to accept connections from production frontend
4. **Package.json**: Added proper start scripts and engine requirements

### Frontend Updates (Vercel)
1. **API URLs**: Updated all hardcoded localhost URLs to production backend URL
2. **Environment Variables**: Created `.env` and `.env.production` files
3. **Configuration**: Added `config.js` for centralized API URL management
4. **Vercel Config**: Created `vercel.json` for proper SPA routing and environment variables

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://singhvikki870:Vikki00000@cluster0.lrf2tr3.mongodb.net/
JWT_SECRET_KEY=vikki
FRONTEND_URL=https://khana-community-kfoc.vercel.app
```

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://khana-community.onrender.com
```

## 📁 Files Updated

### Backend Files:
- `index.js` - CORS and Socket.io configuration
- `.env` - Added frontend URL
- `package.json` - Deployment scripts

### Frontend Files:
- `pages/DonorLogin.jsx` - Already using production URL ✅
- `pages/DonorSignUp.jsx` - Updated to production URL
- `pages/DonorDashboard.jsx` - Already using production URL ✅
- `pages/VolunteerLogin.jsx` - Updated to production URL
- `pages/VolunteerSignUp.jsx` - Updated to production URL
- `pages/VolunteerDashboard.jsx` - Already using production URL ✅
- `components/Chat.jsx` - Updated to production URL
- `components/ProfileImageUpload.jsx` - Updated to production URL
- `src/App.jsx` - Updated to production URL
- `src/config.js` - New configuration file
- `vite.config.js` - Environment variable handling
- `.env` and `.env.production` - Environment configurations
- `vercel.json` - Vercel deployment configuration

## 🚀 Deployment Steps

### Backend (Render)
1. Push changes to your GitHub repository
2. Render will automatically redeploy from the connected repository
3. Ensure environment variables are set in Render dashboard

### Frontend (Vercel)
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy from the connected repository
3. Environment variables are configured in `vercel.json`

## ✅ Testing
1. Visit https://khana-community-kfoc.vercel.app/
2. Test user registration and login for both donors and volunteers
3. Test donation creation and claiming functionality
4. Test real-time chat functionality
5. Verify all API calls are working with the production backend

## 🔍 Troubleshooting
- Check browser console for any CORS errors
- Verify all environment variables are properly set
- Ensure MongoDB connection is working
- Check Render and Vercel deployment logs for any errors

Your application is now fully configured for production! 🎉