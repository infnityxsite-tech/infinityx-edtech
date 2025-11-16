# InfinityX EdTech - Vercel Deployment Guide

**Author:** Manus AI  
**Date:** November 10, 2025

## Introduction

This guide provides a complete, step-by-step walkthrough to deploy your InfinityX EdTech project to **Vercel** with a **free cloud database** from **PlanetScale**. Follow these instructions carefully to get your website live.

## Prerequisites

Before you start, you will need accounts for the following free services:

1. **GitHub:** [https://github.com/signup](https://github.com/signup)
2. **PlanetScale:** [https://planetscale.com/](https://planetscale.com/)
3. **Vercel:** [https://vercel.com/signup](https://vercel.com/signup) (Sign up with your GitHub account)

## Step 1: Create a GitHub Repository

1. **Go to GitHub** and create a new repository. You can name it `infinityx-edtech`.
2. **Unzip** the `infinityx-edtech-vercel-final.zip` file on your computer.
3. **Push the project** to your new GitHub repository. You can use the GitHub Desktop app or the command line.

   ```bash
   # In your project folder
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Set Up Your Free Cloud Database (PlanetScale)

1. **Go to PlanetScale** and sign in.
2. **Create a new database:**
   - Click **"New database"**.
   - Give it a name (e.g., `infinityx-db`).
   - Choose a region near you.
   - Click **"Create database"**.

3. **Get your database credentials:**
   - In your database dashboard, click the **"Connect"** button.
   - In the "Connect with" dropdown, select **"Drizzle ORM"**.
   - You will see your database credentials. **Keep this page open!** You will need the `DATABASE_URL`.

## Step 3: Deploy to Vercel

1. **Go to Vercel** and sign in with your GitHub account.
2. **Import your project:**
   - Click **"Add New..."** -> **"Project"**.
   - Find your `infinityx-edtech` GitHub repository and click **"Import"**.

3. **Configure the project:**
   - **Framework Preset:** Vercel should automatically detect it as a Vite project. If not, select **"Vite"**.
   - **Build and Output Settings:** Leave these as default. Vercel will use the settings from your `vercel.json` file.

4. **Add Environment Variables:**
   - Expand the **"Environment Variables"** section.
   - Add the following variables:

     - **`DATABASE_URL`**:
       - **Value:** Copy the full `DATABASE_URL` from your PlanetScale dashboard.

     - **`SESSION_SECRET`**:
       - **Value:** Generate a random string. You can use an online generator or run this command in your terminal: `openssl rand -base64 32`

     - **`NODE_ENV`**:
       - **Value:** `production`

5. **Deploy:**
   - Click the **"Deploy"** button.
   - Vercel will now build and deploy your project. This may take a few minutes.

## Step 4: Run Database Migrations

After the first deployment, you need to sync your database schema.

1. **Install the Vercel CLI:**
   ```bash
   pnpm install -g vercel
   ```

2. **Link your local project to Vercel:**
   ```bash
   # In your project folder
   vercel link
   ```
   Follow the prompts to link to your Vercel project.

3. **Pull your production environment variables:**
   ```bash
   vercel env pull .env.production.local
   ```
   This creates a local file with your production database URL.

4. **Run the database migration:**
   ```bash
   pnpm db:push
   ```
   This command connects to your PlanetScale database and creates all the necessary tables.

## Step 5: Seed the Database with Default Content

To add the default images and text to your live website, run the seed script against your production database.

```bash
pnpm seed
```

This will populate the `pageContent` table with the default content for your Home and About pages.

## Step 6: Access Your Live Website

- Go back to your Vercel dashboard.
- Click on the **visit** button or the domain link for your project.
- Your InfinityX EdTech website is now live!

### Accessing the Admin Panel

- Go to `https://your-vercel-domain.vercel.app/admin/login`
- Click the **"Login as Local Admin"** button. This will work because the authentication is simplified for this project.

## Conclusion

Your InfinityX EdTech platform is now successfully deployed on Vercel with a free, scalable cloud database. You can now manage your content from the admin panel and share your website with the world.

### Troubleshooting

- **500 Internal Server Error:** Check your Vercel logs for errors. This is often due to incorrect environment variables.
- **Database Connection Error:** Ensure the `DATABASE_URL` is copied correctly from PlanetScale and includes `?sslaccept=strict`.
- **Images Not Loading:** Verify that the `heroImageUrl` and other image fields in your database point to the correct paths (e.g., `/assets/hero-banner.jpg`).
