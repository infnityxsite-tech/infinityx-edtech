# InfinityX EdTech — Netlify Deployment Guide

A step-by-step guide for deploying the InfinityX EdTech platform on **Netlify Free** without any technical background.

---

## Prerequisites — Accounts you need before starting

| Service | Why you need it | Free tier |
|---------|-----------------|-----------|
| **GitHub** | Hosts the code | Free |
| **Netlify** | Runs the website | Free (300 credits/month) |
| **Neon** | PostgreSQL database (already exists) | Already configured |
| **Cloudinary** | Stores uploaded images and student submissions | Free (25 GB storage, 25 GB bandwidth/month) |
| **Firebase** | Student authentication | Already configured |

---

## Step 1 — Create a Cloudinary account (skip if you already have one)

> Skip if you already have CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.

1. Go to https://cloudinary.com/users/register_free
2. Fill in your name, email, and a password. No credit card required.
3. After signing in you land on the Dashboard.
4. At the top you see your Cloud name — note it down.
5. Click Settings > Access Keys (left sidebar).
6. Copy the API Key and API Secret.

---

## Step 2 — Create a Netlify account using GitHub

1. Go to https://app.netlify.com/signup
2. Click Continue with GitHub.
3. Authorize Netlify.
4. You are now inside the Netlify dashboard.

---

## Step 3 — Import the repository

1. In the Netlify dashboard click Add new site > Import an existing project.
2. Choose Deploy with GitHub.
3. Search for infinityx-edtech and click it.
4. Under Branch to deploy select deployment/netlify-migration.
5. Netlify auto-detects from netlify.toml. Confirm:
   - Build command: pnpm install --frozen-lockfile && pnpm build
   - Publish directory: dist/public
   - Functions directory: netlify/functions
6. Do NOT click Deploy yet — add environment variables first (Step 5).

---

## Step 4 — Obtain your Neon DATABASE_URL

1. Log in to https://console.neon.tech
2. Select your project.
3. Go to Connection Details.
4. Copy the Connection string:
   postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

---

## Step 5 — Add environment variables in Netlify

Click Add a variable for each row below.

### Required Server Secrets (never visible to users)

NODE_ENV=production
DATABASE_URL=<your neon connection string>
JWT_SECRET=<at least 32 random characters>
ALLOWED_ORIGINS=<leave blank now, fill after deploy>
CLOUDINARY_CLOUD_NAME=<your cloud name>
CLOUDINARY_API_KEY=<your api key>
CLOUDINARY_API_SECRET=<your api secret>

### Required Firebase client config (from Firebase console > Project settings)

VITE_FIREBASE_API_KEY=<from firebase>
VITE_FIREBASE_AUTH_DOMAIN=<from firebase>
VITE_FIREBASE_PROJECT_ID=<from firebase>
VITE_FIREBASE_MESSAGING_SENDER_ID=<from firebase>
VITE_FIREBASE_APP_ID=<from firebase>

### Application identity

VITE_APP_ID=infinityx_production
VITE_APP_TITLE=InfinityX

### Optional AI grading (add at least one)

GEMINI_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=

---

## Step 6 — Deploy

1. Click Deploy site.
2. Wait 3-8 minutes for the build to finish.
3. You will see a green Published status.

---

## Step 7 — Update ALLOWED_ORIGINS

1. After deployment, copy your URL like https://random-name-12345.netlify.app
2. Go to Site settings > Environment variables.
3. Edit ALLOWED_ORIGINS and set it to your Netlify URL.
4. If you have a custom domain add both: https://your-netlify.netlify.app,https://yourdomain.com
5. Trigger a new deploy to pick up the change.

---

## Step 8 — Testing checklist

- Homepage loads with images and fonts
- Navigation between pages works
- /api/health returns {"status":"ok"}
- /sitemap.xml returns XML
- Admin login works
- Admin image upload goes to Cloudinary (URL returned)
- Student Firebase login works
- Student submission stored in Cloudinary, AI grading result shown
- Certificate download renders PNG with student name and course
- No broken images or routes

---

## Step 9 — Custom domain (only after all tests pass)

1. In Netlify: Domain settings > Add custom domain.
2. Follow DNS instructions.
3. Netlify provisions SSL automatically.
4. Add the domain to ALLOWED_ORIGINS and redeploy.

---

## Step 10 — Rollback to Render

Your Render deployment is NOT deleted. If Netlify has any issue:
1. Point your DNS back to the Render URL.
2. Render will serve traffic once its bandwidth resets.

---

## Environment variables — Full reference

### Required server secrets
NODE_ENV, DATABASE_URL, JWT_SECRET, ALLOWED_ORIGINS,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### Required public (Firebase)
VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

### Application
VITE_APP_ID, VITE_APP_TITLE

### Optional AI grading
GEMINI_API_KEY, GROQ_API_KEY, DEEPSEEK_API_KEY

### Optional legacy integrations
OWNER_OPEN_ID, BUILT_IN_FORGE_API_URL, BUILT_IN_FORGE_API_KEY, VITE_FRONTEND_FORGE_API_URL

### Local/Render only (NOT needed on Netlify)
PORT, AUTO_INITIALIZE_DATABASE

---

## Security confirmation

- No .env files committed to Git.
- No Firebase service-account files committed.
- No credentials in VITE_ variables.
- Only .env.example with placeholder values is tracked.
- All uploads go through Cloudinary server-side (never base64 in API responses).
- Student submissions use Cloudinary authenticated delivery (not publicly accessible).
- Admin endpoints are protected with JWT verification.
- CORS allows only ALLOWED_ORIGINS (no wildcard in production).
