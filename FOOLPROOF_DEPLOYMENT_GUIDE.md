# InfinityX EdTech - Foolproof Vercel Deployment Guide (SQLite)

**Author:** Manus AI  
**Date:** November 11, 2025

## Introduction

This guide provides a **100% free, no-credentials-needed** method to deploy your InfinityX EdTech project to **Vercel**. We will use **SQLite**, a file-based database that requires **zero setup**.

**You will NOT need:**
- A credit card
- Any database credentials
- Any external services like PlanetScale or Neon

## Prerequisites

1. **GitHub Account:** [https://github.com/signup](https://github.com/signup)
2. **Vercel Account:** [https://vercel.com/signup](https://vercel.com/signup) (Sign up with your GitHub account)

## Step 1: Create a GitHub Repository

1. **Go to GitHub** and create a new repository. You can name it `infinityx-edtech-sqlite`.
2. **Unzip** the `infinityx-edtech-sqlite-final.zip` file on your computer.
3. **Push the project** to your new GitHub repository:

   ```bash
   # In your project folder
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to Vercel** and sign in with your GitHub account.
2. **Import your project:**
   - Click **"Add New..."** -> **"Project"**.
   - Find your `infinityx-edtech-sqlite` GitHub repository and click **"Import"**.

3. **Configure the project:**
   - **Framework Preset:** Vercel should automatically detect it as a **Vite** project.
   - **Build and Output Settings:** Leave these as default.

4. **Add Environment Variables:**
   - Expand the **"Environment Variables"** section.
   - Add only **ONE** environment variable:

     - **`SESSION_SECRET`**:
       - **Value:** Generate a random string. You can use an online generator or run this command: `openssl rand -base64 32`

   **That's it! No database URL needed.**

5. **Deploy:**
   - Click the **"Deploy"** button.
   - Vercel will now build and deploy your project. This may take a few minutes.

## Step 3: Access Your Live Website

- Go back to your Vercel dashboard.
- Click on the **visit** button or the domain link for your project.
- Your InfinityX EdTech website is now live!

### Accessing the Admin Panel

- Go to `https://your-vercel-domain.vercel.app/admin/login`
- Click the **"Login as Local Admin"** button.

## How It Works (Zero Configuration)

- **SQLite Database:** The database is a single file (`database.db`) that is created automatically on Vercel.
- **Database Seeding:** The `seed.ts` script runs automatically after the build to populate your database with default content and images.
- **Local File Storage:** Image uploads are saved to the `public/uploads/` directory, which works seamlessly on Vercel.

## Conclusion

Your InfinityX EdTech platform is now deployed and fully functional with **zero cost and zero configuration**. You can manage your content from the admin panel and share your website with the world.

### Troubleshooting

- **Errors during deployment:** Check the Vercel logs. Most issues are related to incorrect environment variables (make sure you only have `SESSION_SECRET`).
- **Content not appearing:** The seed script should run automatically. If it doesn't, you can run it manually from the Vercel dashboard's "Deployments" tab by redeploying with the "Redeploy with existing build" option.
