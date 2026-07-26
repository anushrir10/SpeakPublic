SpeakPublic — Deployment Guide

This repository contains three deliverables:

- `backend/` — Express API (port 3001)
- `landing/` — React + Vite frontend (production built to `landing/dist/`)
- `extension/` — Chrome Extension (MV3)

# Quick local checks

1. Start backend (local test):

```bash
cd backend
npm install
npm start
# Backend reachable at http://localhost:3001 (or production: https://speakpublic.onrender.com)
curl http://localhost:3001/health
```

2. Build the frontend:

```bash
cd landing
npm install
npm run build
# Production files in landing/dist/
```

3. Extension package:

- Zip `extension/` into `speakpublic-extension.zip` (already created)

Deployment (manual steps you must perform)

A. Push repository to GitHub (you said this is done). If not:

```bash
git remote add origin https://github.com/YOUR_USERNAME/speakpublic.git
git branch -M main
git push -u origin main
```

B. Deploy backend to Render (recommended - free tier)

1. Go to https://render.com and sign in with GitHub
2. New -> Web Service
3. Select your `speakpublic` repo
4. Configure:
   - Name: `speakpublic-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Instance: Free
5. Add the environment variables (on Render dashboard):
   - `OPENAI_API_KEY` = <your key>
   - `BHASHINI_API_KEY` = <your key>
   - `BHASHINI_USER_ID` = <your id>
6. Create and wait for deploy to finish
7. Copy the produced service URL (example: `https://speakpublic-api.onrender.com`)
8. Verify: `https://<your-render-url>/health` → `{ "status": "ok" }`

C. Deploy landing to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. New Project -> Import `speakpublic` repo
3. Set configuration:
   - Root Directory: `landing`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable in Vercel project:
   - `VITE_API_URL` = `https://<your-render-url>` (exact URL from Render)
5. Deploy and copy the public URL (e.g., `https://speakpublic.vercel.app`)

D. Chrome extension

1. Update extension `manifest.json` and JS to use production API URL
   - `https://<your-render-url>`
2. Zip the `extension/` folder to `speakpublic-extension.zip`
3. Publish via Chrome Web Store Developer Dashboard or load unpacked for testing

Notes & tips

- Render free services sleep after inactivity. For demos, hit the backend 3-5 minutes before presenting to warm it up.
- If you want, we can add a `render.yaml` and `vercel.json` to automate deployments, or set up GitHub Actions to trigger deploys automatically.

If you'd like, I can now:
- Add `QRSection.jsx` to the `landing` app and wire it to the deployed URL.
- Create `render.yaml` and a `vercel.json` to assist with automated deploys.
- Prepare the exact text for Render and Vercel environment variable values to paste in the dashboard.

Which of these would you like next?
