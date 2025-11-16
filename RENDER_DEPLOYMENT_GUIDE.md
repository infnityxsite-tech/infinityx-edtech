# InfinityX EdTech: Complete Render.com Deployment Guide (100% FREE)

**Author**: Manus AI
**Date**: November 16, 2025

## 1. Introduction

This guide provides a complete, step-by-step process for deploying your updated InfinityX EdTech website on **Render.com** [1] for **100% FREE**. The project has been reconfigured with a **stable, self-contained admin authentication system** and works seamlessly with Render's free tier, including a free PostgreSQL database.

### Key Features of This Setup

| Feature | Description |
| :--- | :--- |
| **Authentication** | **Self-contained username/password system**. No external dependencies. |
| **Cost** | **Completely FREE**. No credit card required. |
| **Hosting** | Web service and PostgreSQL database hosted on Render. |
| **Database** | Free PostgreSQL database (expires after 90 days, but can be easily recreated). |
| **Deployment** | Fully automated deployments from your GitHub repository. |
| **Performance** | The web service will "spin down" after 15 minutes of inactivity. The first visitor after that will experience a 30-60 second delay while it wakes up. Subsequent visits will be fast. |

---

## 2. Prerequisites

Before you begin, please ensure you have the following:

1.  **GitHub Account**: Your project code must be in a GitHub repository. Sign up at [github.com](https://github.com).
2.  **Render Account**: Sign up for a Render account at [render.com](https://render.com). You can sign up using your GitHub account.

---

## 3. Step-by-Step Deployment on Render

Follow these steps to get your website live for free.

### Step 3.1: Create a Blueprint on Render

Render uses a "Blueprint" to create and manage your services from a single configuration file (`render.yaml`), which I have already created for you.

1.  Log in to your Render account.
2.  Go to the **Blueprints** page from the dashboard.
3.  Click **New Blueprint**.
4.  Connect your GitHub account and select the GitHub repository for your InfinityX EdTech project.
5.  Render will automatically detect the `render.yaml` file. It will show you the two services to be created:
    *   `infinityx-edtech` (Web Service)
    *   `infinityx-db` (PostgreSQL Database)
6.  Click **Apply** to create the services.

Render will now start building and deploying your website and database. This may take a few minutes.

### Step 3.2: Configure Environment Variables

The `render.yaml` file automatically sets the `DATABASE_URL` and generates a `JWT_SECRET`. You do not need to add any environment variables manually for the site to work.

> **Note**: The default admin credentials are `admin` / `admin123`. You should change the password after your first login.

### Step 3.3: Initialize the Database

Once your web service is deployed and running, you need to create the database tables and the default admin user.

1.  In your `infinityx-edtech` web service on Render, go to the **Shell** tab.
2.  A terminal connected to your running application will open.
3.  Type the following command and press Enter:

    ```bash
    pnpm init-db
    ```

4.  This command executes the `schema.sql` file, securely hashes the default password, creates all necessary tables, and inserts the default admin user. You should see a "Database initialized successfully!" message.

This is a **one-time command**. Do not run it again unless you want to reset your database.

### Step 3.4: Access Your Live Website

Your website is now live!

1.  Go back to the main page for your `infinityx-edtech` web service on Render.
2.  At the top, you will see a URL ending in `.onrender.com`. This is the public URL for your website.
3.  Click the URL to visit your live site. Remember, the first visit might be slow as the service wakes up.
4.  Navigate to `/admin-login` to access the admin login page.

---

## 4. Important Note on Free Database Expiration

Render's free PostgreSQL databases **expire after 90 days**. When this happens, your website will show errors because it cannot connect to the database.

**How to Fix It:**

1.  Go to your Render dashboard.
2.  Delete the expired PostgreSQL database (`infinityx-db`).
3.  Create a new, free PostgreSQL database with the **exact same name** (`infinityx-db`).
4.  Render will automatically link the new database to your web service.
5.  Go to the **Shell** tab of your web service and run `pnpm init-db` again to recreate the tables and the admin user.

This process takes about 5 minutes and will get your site back online for another 90 days, for free.

---

## 5. Local Development

To work on the project locally:

1.  **Install PostgreSQL**: Use [Postgres.app](https://postgresapp.com/) for Mac or the official installers for Windows/Linux.
2.  **Create Database**: Create a local database named `infinityx`.
3.  **`.env` file**: Ensure the `DATABASE_URL` in your `.env` file points to your local database.
4.  **Install & Initialize**: Run `pnpm install` and then `pnpm init-db`.
5.  **Start Server**: Run `pnpm dev` to start the local server at `http://localhost:3000`.

---

## 6. References

[1] Render. "Render: The fastest way to build and run all your apps and websites." [https://render.com](https://render.com)
