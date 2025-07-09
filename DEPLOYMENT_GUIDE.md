# Backend Deployment Guide

## 🚀 Quick Start: Railway (Recommended)

### Step 1: Prepare Your Repository

1. Make sure your backend code is in a GitHub repository
2. Ensure you have a MongoDB Atlas database set up

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables

In Railway dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Step 4: Deploy

1. Railway will automatically build and deploy your app
2. Your API will be available at: `https://your-app-name.railway.app`

---

## 🌐 Alternative: Render

### Step 1: Deploy on Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `task-manager-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 2: Add Environment Variables

Add the same environment variables as above in Render dashboard.

---

## 🐳 Alternative: Heroku

### Step 1: Install Heroku CLI

```bash
npm install -g heroku
```

### Step 2: Deploy

```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set NODE_ENV="production"
git push heroku main
```

---

## 🔧 Environment Variables Setup

### Required Variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Optional Variables:

```bash
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)

### Step 2: Configure Database

1. Create a database user
2. Get your connection string
3. Replace `<username>`, `<password>`, `<cluster>`, and `<database>` in the URI

### Step 3: Network Access

1. Go to Network Access
2. Add IP address: `0.0.0.0/0` (allows all IPs - secure for production)

---

## 🔗 Connect Frontend to Backend

### Update Frontend API Configuration

In your frontend, update the API base URL:

```typescript
// src/utils/axiosInstance.ts
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-url.railway.app/api"
    : "http://localhost:5000/api";
```

---

## ✅ Health Check

Your backend includes a health check endpoint:

- **URL**: `https://your-backend-url.railway.app/health`
- **Expected Response**: `{"status":"OK","timestamp":"2024-01-01T00:00:00.000Z"}`

---

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**: Check if all dependencies are in `package.json`
2. **MongoDB Connection**: Verify your connection string and network access
3. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly
4. **Port Issues**: Most platforms use `process.env.PORT` automatically

### Logs:

- **Railway**: View logs in the dashboard
- **Render**: View logs in the dashboard
- **Heroku**: `heroku logs --tail`

---

## 🔒 Security Checklist

- [ ] Use strong JWT secret
- [ ] Set up proper CORS origins
- [ ] Use HTTPS in production
- [ ] Secure MongoDB connection
- [ ] Set `NODE_ENV=production`
