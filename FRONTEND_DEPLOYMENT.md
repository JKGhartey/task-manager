# Frontend Deployment Guide for Vercel

## 🎯 Your Live Backend

Your backend is now live at: **https://task-manager-x8af.onrender.com**

## 🚀 Deploy Frontend on Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy Frontend

```bash
cd frontend
vercel
```

### Step 3: Configure Environment Variables

When prompted by Vercel, add these environment variables:

```bash
VITE_API_URL=https://task-manager-x8af.onrender.com/api
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=1.0.0
```

## 🔧 Alternative: Manual Environment Setup

### Option 1: Create .env.production file

```bash
cd frontend
cp env.production.example .env.production
```

### Option 2: Set in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://task-manager-x8af.onrender.com/api`
   - **Environment**: Production

## ✅ Verification

### Test Backend Connection

After deployment, your frontend should be able to:

- ✅ Connect to backend API
- ✅ Handle authentication
- ✅ Manage tasks
- ✅ Display user data

### Test Endpoints

```bash
# Backend health check
curl https://task-manager-x8af.onrender.com/health

# API documentation
curl https://task-manager-x8af.onrender.com/api-docs
```

## 🔗 Your Complete Application

### URLs:

- **Backend**: https://task-manager-x8af.onrender.com
- **Frontend**: https://your-frontend.vercel.app (after deployment)
- **API Docs**: https://task-manager-x8af.onrender.com/api-docs

### API Endpoints:

- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Tasks**: `GET/POST/PUT/DELETE /api/tasks/*`
- **Users**: `GET/POST/PUT/DELETE /api/users/*`
- **Reports**: `GET /api/reports/*`

## 🎯 Expected Flow

1. **User visits frontend** → Vercel serves React app
2. **Frontend makes API calls** → To Render backend
3. **Backend processes requests** → MongoDB Atlas database
4. **Response returned** → Frontend displays data

## 🔒 Security Notes

- ✅ **HTTPS enabled** on both Vercel and Render
- ✅ **CORS configured** in backend for frontend domain
- ✅ **JWT authentication** for secure API access
- ✅ **Environment variables** for sensitive data

## 🚨 Troubleshooting

### If API calls fail:

1. **Check CORS settings** in backend
2. **Verify environment variables** in Vercel
3. **Test backend directly** with curl
4. **Check browser console** for errors

### If authentication fails:

1. **Verify JWT_SECRET** in backend environment
2. **Check token storage** in localStorage
3. **Test login endpoint** directly

Your task manager will be fully functional once the frontend is deployed! 🚀
