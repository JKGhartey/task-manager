# Render Deployment Guide for Task Manager Backend

## 🚀 Quick Start: Deploy on Render

### Step 1: Prepare Your Repository

1. Make sure your backend code is in a GitHub repository
2. Ensure you have a MongoDB Atlas database set up (see MongoDB setup below)

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign up with GitHub
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

#### Basic Settings:

- **Name**: `task-manager-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (since your backend is in a subfolder)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

#### Advanced Settings:

- **Health Check Path**: `/health`
- **Auto-Deploy**: Yes (deploys on every push)

### Step 3: Configure Environment Variables

In the Render dashboard, go to **Environment** tab and add these variables:

#### Required Variables:

```bash
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/task-manager
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Optional Variables:

```bash
PORT=10000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your app
3. Your API will be available at: `https://your-app-name.onrender.com`

---

## 🗄️ MongoDB Atlas Setup (Required)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier - 512MB)

### Step 2: Configure Database

1. **Create Database User**:

   - Go to Database Access
   - Click "Add New Database User"
   - Username: `task-manager-user`
   - Password: Generate a strong password
   - Role: "Read and write to any database"

2. **Get Connection String**:

   - Go to Database
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Connection String**:
   Replace the placeholders in your connection string:
   ```
   mongodb+srv://task-manager-user:your-password@cluster0.xxxxx.mongodb.net/task-manager
   ```

### Step 3: Network Access

1. Go to Network Access
2. Click "Add IP Address"
3. Add: `0.0.0.0/0` (allows all IPs - secure for production)

---

## 🔗 Connect Frontend to Backend

### Update Frontend API Configuration

In your frontend, update the API base URL:

```typescript
// src/utils/axiosInstance.ts
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-app-name.onrender.com/api"
    : "http://localhost:5000/api";
```

### Update CORS Configuration

Make sure your backend CORS settings include your frontend domain:

```typescript
// In your backend server.ts
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
```

---

## ✅ Health Check & Monitoring

### Health Check Endpoint

Your backend includes a health check endpoint:

- **URL**: `https://your-app-name.onrender.com/health`
- **Expected Response**: `{"status":"OK","timestamp":"2024-01-01T00:00:00.000Z"}`

### Monitor Your App

- **Logs**: View in Render dashboard under "Logs" tab
- **Metrics**: Monitor CPU, memory usage in dashboard
- **Uptime**: Render provides uptime monitoring

---

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**:

   - Check if all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check build logs in Render dashboard

2. **MongoDB Connection Error**:

   - Verify connection string format
   - Check network access settings in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Errors**:

   - Verify `FRONTEND_URL` environment variable
   - Check CORS configuration in server.ts
   - Ensure frontend URL is correct

4. **App Crashes**:
   - Check application logs in Render dashboard
   - Verify all environment variables are set
   - Check if PORT is correctly configured

### Useful Commands:

```bash
# Check your app logs
# Go to Render dashboard → Logs tab

# Test your API locally
curl http://localhost:5000/health

# Test your deployed API
curl https://your-app-name.onrender.com/health
```

---

## 🔒 Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Set up proper CORS origins
- [ ] Use HTTPS (included with Render)
- [ ] Secure MongoDB connection
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for secrets
- [ ] Regularly update dependencies

---

## 📊 Render Free Tier Limits

- **750 hours/month** (enough for 24/7 uptime)
- **512MB RAM**
- **Shared CPU**
- **Custom domains** supported
- **SSL certificates** included
- **Auto-deployments** from GitHub

---

## 🎯 Next Steps

1. **Deploy your backend** following this guide
2. **Deploy your frontend** on Vercel
3. **Test the connection** between frontend and backend
4. **Set up custom domain** (optional)
5. **Monitor your application** performance

Your task manager will be live at:

- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-app-name.onrender.com`
