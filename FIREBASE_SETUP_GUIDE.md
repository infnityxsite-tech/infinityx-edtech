# InfinityX EdTech - Firebase & Vercel Deployment Guide

**Author:** Manus AI  
**Date:** November 11, 2025

## Introduction

This guide provides a **100% free** method to deploy your InfinityX EdTech project to **Vercel** using **Firebase Firestore** as the database.

**You will need:**
- A Google Account (for Firebase)
- A GitHub Account
- A Vercel Account

## Step 1: Create a Firebase Project

1. **Go to the Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Create a new project:**
   - Click **"Add project"**.
   - Give it a name (e.g., `infinityx-edtech`).
   - Disable Google Analytics (not needed).
   - Click **"Create project"**.

3. **Create a Firestore Database:**
   - In the left menu, go to **Build -> Firestore Database**.
   - Click **"Create database"**.
   - Select **"Start in production mode"**.
   - Choose a location (e.g., `us-central`).
   - Click **"Enable"**.

4. **Get Service Account Credentials:**
   - Click the gear icon next to **Project Overview** and go to **Project settings**.
   - Go to the **"Service accounts"** tab.
   - Click **"Generate new private key"**.
   - A JSON file will be downloaded. **Keep this file safe!**

## Step 2: Deploy to Vercel

1. **Push your code to GitHub** if you haven't already.
2. **Go to Vercel** and import your project.

3. **Add Environment Variables:**
   - Open the downloaded JSON file from Firebase.
   - In your Vercel project settings, go to **Environment Variables**.
   - Add the following variables:

     - **`FIREBASE_PROJECT_ID`**: Copy the `project_id` from the JSON file.
     - **`FIREBASE_CLIENT_EMAIL`**: Copy the `client_email` from the JSON file.
     - **`FIREARBE_PRIVATE_KEY`**: Copy the `private_key` from the JSON file. **Important:** Make sure to copy the entire key, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.
     - **`SESSION_SECRET`**: Generate a random string (e.g., with `openssl rand -base64 32`).

4. **Deploy:**
   - Click the **"Deploy"** button.
   - Vercel will build and deploy your project.

## Step 3: Seed the Database

1. **Go to your Vercel project dashboard**.
2. **Go to the "Deployments" tab** and find the latest deployment.
3. **Click the "..." menu** and select **"Redeploy"**.
4. **Enable "Use existing Build Cache"** and click **"Redeploy"**.
5. **Go to the "Functions" tab** and find the `seed` function.
6. **Click the "Invoke" button** to run the seed script.

## Step 4: Access Your Live Website

- Go back to your Vercel dashboard.
- Click on the **visit** button or the domain link for your project.
- Your InfinityX EdTech website is now live!

### Accessing the Admin Panel

- Go to `https://your-vercel-domain.vercel.app/admin/login`
- Click the **"Login as Local Admin"** button.

## How It Works

- **Firebase Firestore:** A NoSQL cloud database that scales automatically.
- **Vercel Serverless Functions:** The backend API runs as serverless functions on Vercel.
- **Firebase Admin SDK:** Securely connects to your Firebase project from the backend.

## Conclusion

Your InfinityX EdTech platform is now deployed and fully functional with a powerful, scalable, and free database. You can manage your content from the admin panel and share your website with the world.
