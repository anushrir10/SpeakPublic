# Deployment Guide — SpeakPublic

This file contains exact steps and values to deploy the backend to Render, the landing to Vercel, and package the Chrome extension.

## Backend — Render

- Service root: `backend`
- Start command: `npm start`
- Health check path: `/health`
- Environment: Node
- Add these environment variables in Render (Secrets):
  - `OPENAI_API_KEY` = <your OpenAI key>
  - `BHASHINI_API_KEY` = <your Bhashini key>
  - `NODE_ENV` = `production`

Recommended Render settings (use Render UI or `render.yaml` in `backend/`):

1. Create a new Web Service, connect the GitHub repo `anushrir10/SpeakPublic`.
2. Select branch `main` and set the root directory to `backend`.
3. Build command: (leave empty)
4. Start command: `npm start`
5. Set health check path to `/health` and enable auto-deploy from `main`.

After deploy, note the service URL (e.g. `https://speakpublic-backend.onrender.com`) and use it for the frontend environment variable below.

Your Vercel deployments (examples you provided):

- https://speakpublic-jzna37inf-syntix.vercel.app (project preview)
- https://speakpublic.vercel.app (production)

Set `VITE_API_URL` in the Vercel project to `https://speakpublic.onrender.com` (the Render backend URL) before triggering a production deploy. If you already deployed, trigger a redeploy after setting the env var.

## Frontend — Vercel

- Project root: `landing`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable (Production):
  - `VITE_API_URL` = `https://<your-render-service>.onrender.com`

Steps:
1. Create a new Vercel project, import from GitHub and select the `landing` folder as the root.
2. Set the build command and output directory above.
3. Add the `VITE_API_URL` environment variable in Vercel to the Render service URL.
4. Deploy.

## Chrome extension — package & test

Local unpacked test (Chrome/Edge):
1. Open Chrome → `chrome://extensions/` → enable Developer mode.
2. Click `Load unpacked` and select the `extension/` folder from the repo.
3. Test the popup and any content scripts against the deployed URLs.

Create distribution ZIP (PowerShell):
```powershell
Compress-Archive -Path extension\* -DestinationPath speakpublic-extension-v1.zip -Force
```

Before publishing to the Chrome Web Store:
- Update `extension/manifest.json` host permissions to the final backend domain (e.g., `https://speakpublic-backend.onrender.com/*`).
- Verify icons and popup work in unpacked mode.

## Quick local commands
```bash
# start backend
cd backend
npm start

# build landing
cd landing
npm run build

# package extension (PowerShell)
Compress-Archive -Path extension\\* -DestinationPath speakpublic-extension-v1.zip -Force
```
