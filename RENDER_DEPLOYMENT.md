# 🚀 Render Deployment Guide

## ✅ **Quick Deploy (Automatic with render.yaml)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add backend proxy and Render config"
   git push origin main
   ```

2. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repo
   - Render will automatically detect `render.yaml` and create BOTH services!

3. **Configure After Deploy:**
   - Wait for **backend** to deploy first (get the URL)
   - Go to **frontend** service → Environment
   - Add: `REACT_APP_API_URL` = `https://aman-project-backend.onrender.com`
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

4. **Update Backend CORS:**
   - After frontend deploys, copy its URL (e.g., `https://aman-project-frontend.onrender.com`)
   - Go to `server/index.js` line 11
   - Replace `'https://your-render-frontend-url.onrender.com'` with your actual URL
   - Push changes:
     ```bash
     git add server/index.js
     git commit -m "Update CORS for production"
     git push origin main
     ```

---

## 🔧 **Manual Deploy (Without render.yaml)**

If you prefer manual setup:

### Backend Service
1. **New Web Service**
2. Settings:
   - **Name**: `aman-project-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
3. Add Environment Variable:
   - `NODE_ENV` = `production`

### Frontend Service
1. **New Static Site**
2. Settings:
   - **Name**: `aman-project-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
3. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://aman-project-backend.onrender.com`

---

## 📝 **Important Notes**

### Free Tier Limitations
- **Spins down after 15 minutes** of inactivity
- First request after spin-down takes **~30 seconds**
- **VIX/Buffett data may be slow** on first load

### URLs You'll Get
- Backend: `https://aman-project-backend.onrender.com`
- Frontend: `https://aman-project-frontend.onrender.com`

### Testing After Deploy
```bash
# Test backend health
curl https://aman-project-backend.onrender.com/api/health

# Test VIX
curl https://aman-project-backend.onrender.com/api/vix

# Test Buffett Indicator
curl https://aman-project-backend.onrender.com/api/buffett-indicator
```

---

## 🐛 **Troubleshooting**

### "CORS header missing" in production
- ✅ Update `server/index.js` line 11 with your **actual** frontend URL
- ✅ Redeploy backend

### "Failed to fetch" errors
- ✅ Check backend is deployed and running
- ✅ Verify `REACT_APP_API_URL` is set correctly in frontend
- ✅ Test backend endpoints directly with curl

### Build fails
- ✅ Make sure you pushed all files including `server/` directory
- ✅ Check Render build logs for specific errors

---

## 💰 **Cost**

- **Free** for both services (Render Free Tier)
- No credit card required
- Automatic SSL certificates
- Auto-deploys on git push

---

## 🎯 **Final Checklist**

- [ ] Pushed code to GitHub
- [ ] Deployed backend service
- [ ] Got backend URL
- [ ] Set `REACT_APP_API_URL` in frontend
- [ ] Deployed frontend service
- [ ] Got frontend URL
- [ ] Updated CORS in `server/index.js`
- [ ] Pushed CORS update
- [ ] Tested live site
- [ ] VIX and Buffett Indicator work! 🎉

