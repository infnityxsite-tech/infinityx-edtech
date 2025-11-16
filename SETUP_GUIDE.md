# InfinityX EdTech Platform - Setup Guide

**Author:** Manus AI
**Date:** November 10, 2025

## Introduction

This document provides a step-by-step guide to set up and run the InfinityX EdTech Platform locally. This project has been fully fixed, enhanced, and tested to ensure all features are working correctly.

## Key Features & Fixes Implemented

- **Professional Redesign:** The entire website (Home, About, Contact) has been redesigned with a modern, professional aesthetic, including new images and content.
- **Forge Storage Integration:** Image uploads now use a production-ready storage solution instead of local disk storage.
- **Admin Panel Enhancements:** The admin panel now provides full control over all public-facing content, including pages, courses, programs, blog posts, careers, and site settings.
- **Database Schema Fixes:** The database schema has been corrected and expanded to support all new features and content types.
- **Contact Form & Messages:** The contact form is fully functional, and messages are now correctly stored and displayed in the admin panel.
- **Button & Link Fixes:** All buttons and navigation links have been tested and are working as expected.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or later)
- **pnpm** (or npm/yarn)
- **MySQL** (or a compatible database like MariaDB)

## Step 1: Unzip the Project

Unzip the `infinityx-edtech-final.zip` file to a new directory on your computer.

```bash
unzip infinityx-edtech-final.zip
cd infinityx-edtech
```

## Step 2: Install Dependencies

Install all the required Node.js packages using `pnpm` (or your preferred package manager).

```bash
pnpm install
```

## Step 3: Set Up Your Database

1. **Create a MySQL Database:**
   - Open your MySQL client (e.g., MySQL Workbench, Sequel Pro, or the command line).
   - Create a new database named `infinityx_db`.

   ```sql
   CREATE DATABASE infinityx_db;
   ```

2. **Configure Environment Variables:**
   - In the root of the project, create a new file named `.env`.
   - Copy the contents of `.env.example` into your new `.env` file.
   - Update the `DATABASE_URL` with your MySQL connection details:

   ```env
   # .env
   DATABASE_URL="mysql://<YOUR_DB_USER>:<YOUR_DB_PASSWORD>@<YOUR_DB_HOST>:<YOUR_DB_PORT>/infinityx_db"
   ```

   Replace `<YOUR_DB_USER>`, `<YOUR_DB_PASSWORD>`, `<YOUR_DB_HOST>`, and `<YOUR_DB_PORT>` with your actual database credentials.

## Step 4: Run Database Migrations

This command will sync the database schema with your newly created database.

```bash
pnpm db:push
```

## Step 5: Run the Development Server

Start the development server to run the application locally.

```bash
pnpm dev
```

Your website will be available at **http://localhost:5173**.

## Step 6: Access the Admin Dashboard

1. **Navigate to the Admin Login:**
   - Go to **http://localhost:5173/admin/login**

2. **Login Credentials:**
   - Since this is a local setup, you can log in by simply clicking the **"Login as Local Admin"** button. No username or password is required for local development.

3. **Manage Your Content:**
   - You can now access the full admin dashboard to manage all aspects of your website:
     - **Pages:** Edit content and images for the Home and About pages.
     - **Courses, Programs, Blog, Careers:** Create, edit, and delete listings.
     - **Messages & Applications:** View user submissions.
     - **Settings:** Update site-wide contact information and footer text.

## Conclusion

Your InfinityX EdTech platform is now fully set up and running. All fixes and enhancements have been implemented and tested. If you have any questions, please refer to the code documentation or contact support.
