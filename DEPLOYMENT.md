# Railway Deployment Guide

This guide will help you deploy the Trackd Django backend to Railway.

## Prerequisites

1. GitHub account (code should be pushed to GitHub)
2. Railway account (sign up at https://railway.app - free tier available)

## Step 1: Prepare Your Code

✅ Already done! The code is ready for deployment with:
- `Procfile` - Tells Railway how to run Django
- `railway.json` - Railway configuration
- Updated `settings.py` - Uses environment variables
- `requirements.txt` - Includes gunicorn

## Step 2: Deploy to Railway

### 2.1 Create New Project on Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `trackd` repository
5. Railway will auto-detect it's a Python project

### 2.2 Configure Environment Variables

In Railway dashboard, go to your project → Variables tab, and add:

```
SECRET_KEY=<generate-a-new-secret-key>
DEBUG=False
CORS_ALLOWED_ORIGINS=https://abrahamguan.com,https://www.abrahamguan.com
```

**To generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 2.3 Set Root Directory (Important!)

Railway needs to know where your Django project is:

1. Go to Settings → Root Directory
2. Set it to: `backend`
3. This tells Railway to look in the `backend/` folder

### 2.4 Deploy!

Railway will automatically:
- Install dependencies from `requirements.txt`
- Run `gunicorn` using the `Procfile`
- Give you a public URL (like `trackd-production.railway.app`)

## Step 3: Get Your Backend URL

After deployment, Railway will give you a URL like:
- `https://trackd-production.up.railway.app`

Copy this URL - you'll need it for the frontend!

## Step 4: Update Frontend

### 4.1 Create Frontend Environment File

Create `frontend/.env` file:

```bash
cd frontend
echo "REACT_APP_API_URL=https://your-railway-url.railway.app/api" > .env
```

Replace `your-railway-url` with your actual Railway URL.

### 4.2 Build Frontend

```bash
cd frontend
npm run build
```

This creates a `build/` folder with static files.

### 4.3 Deploy Frontend to Hostinger

1. Upload the contents of `frontend/build/` to your Hostinger hosting
2. You can put it in a subfolder like `/trackd/` or as a subdomain

## Step 5: Test Everything

1. Visit your deployed frontend
2. Try creating an action
3. Check if it connects to Railway backend
4. Verify CORS is working (no CORS errors in browser console)

## Troubleshooting

### Backend won't start
- Check Railway logs: Go to your project → Deployments → View logs
- Make sure `Root Directory` is set to `backend`
- Verify `SECRET_KEY` is set

### CORS errors
- Add your frontend URL to `CORS_ALLOWED_ORIGINS` in Railway variables
- Make sure it includes `https://` not `http://`

### Frontend can't connect
- Check `REACT_APP_API_URL` in frontend `.env` file
- Rebuild frontend after changing `.env`: `npm run build`
- Verify Railway URL is correct (check Railway dashboard)

## Railway Free Tier Limits

- 500 hours/month free compute time
- $5 credit per month
- Perfect for portfolio projects!

## Next Steps

After deployment:
1. Test all CRUD operations
2. Share your portfolio link!
3. Monitor Railway dashboard for any issues
