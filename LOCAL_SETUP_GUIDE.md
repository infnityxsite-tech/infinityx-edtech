# InfinityX Ed-Tech Platform - Local Setup Guide

This guide will help you set up and run the InfinityX Ed-Tech platform on your local machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Development Server](#running-the-development-server)
6. [Accessing the Application](#accessing-the-application)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

4. **MySQL Server** (if using MySQL instead of SQLite)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use a local MySQL service like XAMPP or WAMP

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

---

## Installation Steps

### Step 1: Extract the Project Files

1. Extract the `infinityx-edtech.zip` file to your desired location
2. Open a terminal/command prompt and navigate to the project directory:

```bash
cd path/to/infinityx-edtech
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

Or if you prefer using pnpm (faster):

```bash
npm install -g pnpm
pnpm install
```

**Note for Windows users**: If you encounter any issues during installation, try running the command prompt as Administrator.

### Step 3: Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list
```

You should see a tree of installed packages without any errors.

---

## Environment Configuration

### Step 1: Create Environment File

1. In the project root directory, create a file named `.env.local`
2. Copy the contents from the `.env.example` file into `.env.local`

### Step 2: Configure Environment Variables

Edit `.env.local` and set the following variables:

#### For Local Development (SQLite - Recommended)

```env
DATABASE_URL=file:./dev.db
NODE_ENV=development
JWT_SECRET=your_local_dev_secret_key_12345
```

#### For MySQL Setup

If you prefer to use MySQL:

```env
DATABASE_URL=mysql://root:password@localhost:3306/infinityx
NODE_ENV=development
JWT_SECRET=your_local_dev_secret_key_12345
```

**Important**: Replace `root`, `password`, and `localhost` with your actual MySQL credentials.

#### OAuth Configuration (Optional for Local Testing)

For full authentication testing, you'll need OAuth credentials from the Manus platform:

```env
VITE_APP_ID=your_app_id_from_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your_jwt_secret_key
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name
```

**Note**: Without OAuth configuration, you can still run the app, but authentication features won't work. The public pages will display normally.

---

## Database Setup

### Option 1: SQLite (Recommended for Local Development)

SQLite is the easiest option for local development. No additional setup is required!

The database file will be created automatically at `./dev.db` when you run the migrations.

### Option 2: MySQL Setup

If you're using MySQL:

#### Step 1: Create Database

```bash
mysql -u root -p
```

Enter your MySQL password, then run:

```sql
CREATE DATABASE infinityx;
EXIT;
```

#### Step 2: Update DATABASE_URL

In `.env.local`, set:

```env
DATABASE_URL=mysql://root:your_password@localhost:3306/infinityx
```

### Step 3: Run Database Migrations

After setting up your database, run the migrations:

```bash
npm run db:push
```

Or with pnpm:

```bash
pnpm db:push
```

This command will:
- Generate migration files from your schema
- Apply all migrations to your database
- Create all necessary tables

**Expected output**: You should see messages indicating tables were created successfully.

---

## Running the Development Server

### Step 1: Start the Development Server

Run the following command in your project directory:

```bash
npm run dev
```

Or with pnpm:

```bash
pnpm dev
```

### Step 2: Wait for Server to Start

You should see output similar to:

```
[06:16:21] ✓ [vite] Dev server running at:
[06:16:21] ➜  Local:   http://localhost:3000/
[06:16:21] ➜  press h to show help
```

**Note**: The first startup may take 30-60 seconds as it compiles the project.

### Step 3: Keep the Server Running

Leave the terminal window open while you're developing. The server will automatically reload when you make changes to the code.

---

## Accessing the Application

### Public Website

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the InfinityX home page with:
- Navigation menu (Home, About, Courses, Programs, Blog, Careers)
- Hero section with headline and call-to-action buttons
- Statistics section (Students Trained, Expert Instructors, Job Placement Rate)
- Footer

### Admin Panel

To access the admin panel:

1. Navigate to: `http://localhost:3000/admin`
2. Click "Sign In to Admin Panel"
3. You'll be redirected to the Manus OAuth login (if configured)
4. After login, you'll see the admin dashboard with tabs for:
   - Page Content Manager
   - Courses Manager
   - Programs Manager
   - Blog Manager
   - Careers Manager

**Note**: Without OAuth configuration, you won't be able to log in. To test locally without OAuth, you can temporarily modify the authentication logic in `server/_core/context.ts`.

---

## Project Structure

Here's an overview of the key directories:

```
infinityx-edtech/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components (Home, About, Courses, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── App.tsx        # Main app router
│   │   └── main.tsx       # Entry point
│   ├── index.html         # HTML template
│   └── vite.config.ts     # Vite configuration
├── server/                # Backend tRPC API
│   ├── routers.ts         # API endpoints
│   ├── db.ts              # Database queries
│   └── _core/             # Core server utilities
├── drizzle/               # Database schema and migrations
│   └── schema.ts          # Database table definitions
├── shared/                # Shared types and constants
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
├── .env.local             # Your local environment variables (create this)
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── vite.config.ts         # Vite build configuration
```

---

## Common Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Open database studio (visual editor)
npm run db:studio
```

### Code Quality

```bash
# Run TypeScript type checking
npm run type-check

# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint
```

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Make sure all dependencies are installed:

```bash
npm install
```

If that doesn't work, try clearing the cache:

```bash
npm cache clean --force
npm install
```

### Issue: Database connection error

**For SQLite**:
- Make sure you have write permissions in the project directory
- Delete `dev.db` file and run `npm run db:push` again

**For MySQL**:
- Verify MySQL is running: `mysql -u root -p`
- Check DATABASE_URL in `.env.local` has correct credentials
- Make sure the database exists: `CREATE DATABASE infinityx;`

### Issue: Port 3000 already in use

**Solution**: The dev server will automatically try the next available port. Check the terminal output to see which port is being used, or kill the process using port 3000:

**Windows**:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux**:
```bash
lsof -i :3000
kill -9 <PID>
```

### Issue: OAuth/Login not working

**Solution**: Without OAuth credentials, the admin panel won't work. To test locally:

1. For public pages: No login needed, they work fine
2. For admin panel: You'll need to configure OAuth credentials from the Manus platform

### Issue: Slow performance on first load

**Solution**: This is normal. The first load compiles TypeScript and bundles assets. Subsequent loads will be faster. Make sure you have at least 4GB RAM available.

### Issue: Changes not reflecting in browser

**Solution**: 
1. Hard refresh the browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check the terminal for compilation errors

---

## Next Steps

After successfully running the project locally:

1. **Explore the Code**: Review the project structure to understand how it works
2. **Customize Content**: Edit the database to add your own courses, programs, and blog posts
3. **Modify Design**: Update colors and styling in `client/src/index.css` and Tailwind config
4. **Add Features**: Extend the functionality by adding new pages or API endpoints
5. **Deploy**: When ready, deploy to production using the Publish button in the Manus platform

---

## Support & Resources

- **Manus Documentation**: https://docs.manus.im
- **React Documentation**: https://react.dev
- **TypeScript Documentation**: https://www.typescriptlang.org/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **tRPC Documentation**: https://trpc.io/docs

---

## FAQ

**Q: Can I use this project with a different database?**
A: Yes, you can modify the `drizzle.config.ts` and `drizzle/schema.ts` to use PostgreSQL or other supported databases.

**Q: How do I deploy this to production?**
A: Use the Publish button in the Manus platform management UI after creating a checkpoint.

**Q: Can I customize the admin panel?**
A: Yes, all admin components are in `client/src/components/admin/` and can be modified.

**Q: How do I add new pages?**
A: Create a new file in `client/src/pages/`, add a route in `client/src/App.tsx`, and add navigation links in `client/src/components/Navigation.tsx`.

---

**Happy coding! 🚀**
