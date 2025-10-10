# Backend Setup Instructions

## 🚀 Quick Start

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Start Backend Server (in one terminal)
```bash
cd server
npm start
```

This will start the backend on `http://localhost:5001` 
*(Note: Port 5000 is often used by macOS AirPlay)*

### 3. Start Frontend (in another terminal)
```bash
# From the root directory
npm start
```

This will start the frontend on `http://localhost:3000`

---

## 📡 API Endpoints

Once the backend is running, you'll have:

- **VIX Index**: `http://localhost:5000/api/vix`
- **Buffett Indicator**: `http://localhost:5000/api/buffett-indicator`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🌐 Production Deployment on Render

### Step 1: Create Two Services on Render

#### Backend Service (Web Service)
1. Go to Render Dashboard → **New Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Name**: `aman-project-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add Environment Variable:
   - `NODE_ENV` = `production`
5. Deploy!

#### Frontend Service (Static Site)
1. Go to Render Dashboard → **New Static Site**
2. Connect your GitHub repo
3. Settings:
   - **Name**: `aman-project-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://aman-project-backend.onrender.com` (use your actual backend URL)
5. Deploy!

### Step 2: Update Backend CORS

After deploying, update `server/index.js` line 10 with your actual frontend URL:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-actual-frontend-url.onrender.com'] 
  : ['http://localhost:3000']
```

---

## 🔧 Troubleshooting

### "CORS header missing" error
- ✅ Make sure backend server is running (`npm start` in `server/` directory)
- ✅ Check backend logs for errors
- ✅ Verify `http://localhost:5000/api/health` returns `{"status":"ok"}`

### "NetworkError when attempting to fetch"
- ✅ Backend server is not running - start it with `npm start` in `server/` directory

### "Port 5000 already in use"
- ✅ Kill the process: `lsof -ti:5000 | xargs kill -9`
- ✅ Or change port in `server/index.js`

---

## 📝 Notes

- Backend fetches data from Yahoo Finance and CurrentMarketValuation.com
- Data is cached and refreshed every hour
- CORS is configured to allow requests from your frontend
- In production, both services run independently on Render

