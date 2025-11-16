# InfinityX EdTech - Authentication System Update

## 🎯 What Changed?

The **Manus authentication system has been completely removed** and replaced with a **stable, self-contained admin authentication system** that:

- ✅ **Works 100% offline** - No external dependencies
- ✅ **Never fails** - No reliance on third-party services
- ✅ **Industry-standard security** - JWT + bcrypt password hashing
- ✅ **Simple and reliable** - Username/password login
- ✅ **Free forever** - No API costs or limits

---

## 🔐 New Authentication System

### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Password Hashing** | bcrypt (10 rounds) |
| **Session Management** | JWT (JSON Web Tokens) |
| **Token Storage** | HTTP-only cookies |
| **Database** | PostgreSQL (`admin_users` table) |

### Default Admin Credentials

After running `pnpm init-db`, you can log in with:

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change this password immediately after your first login!

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file:

```bash
DATABASE_URL=postgresql://localhost/infinityx
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Initialize Database

```bash
pnpm init-db
```

This will:
- Create all database tables
- Generate a secure bcrypt hash for the default admin password
- Insert the default admin user

### 4. Start Development Server

```bash
pnpm dev
```

### 5. Log In to Admin Panel

1. Navigate to `http://localhost:3000/admin-login`
2. Enter username: `admin` and password: `admin123`
3. You'll be redirected to the admin dashboard

---

## 📋 Admin Features

Once logged in, you can:

- ✅ Manage page content (Home, About)
- ✅ Create/edit/delete courses
- ✅ Create/edit/delete programs
- ✅ Manage blog posts
- ✅ View applications and messages
- ✅ Manage career postings

---

## 🔧 How It Works

### Login Flow

1. User enters username and password on `/admin-login`
2. Frontend sends credentials to `auth.login` TRPC endpoint
3. Server verifies password using bcrypt
4. If valid, server generates a JWT token
5. Token is stored in HTTP-only cookie
6. User is redirected to `/admin`

### Protected Routes

All admin routes check for a valid JWT token:

1. TRPC context reads token from cookie or Authorization header
2. Token is verified using JWT secret
3. If valid, user data is attached to context
4. Protected procedures check for `ctx.user`

### Security Features

- ✅ Passwords are **never stored in plain text**
- ✅ Bcrypt hashing with **10 salt rounds**
- ✅ JWT tokens expire after **7 days**
- ✅ HTTP-only cookies prevent XSS attacks
- ✅ Secure flag enabled in production

---

## 🛠️ API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `auth.login` | Mutation | Login with username/password |
| `auth.me` | Query | Get current logged-in user |
| `auth.logout` | Mutation | Clear session and log out |

### Example Usage

```typescript
// Login
const { token, user } = await trpc.auth.login.mutate({
  username: 'admin',
  password: 'admin123',
});

// Get current user
const currentUser = await trpc.auth.me.query();

// Logout
await trpc.auth.logout.mutate();
```

---

## 📦 Deployment on Render.com

See **RENDER_DEPLOYMENT_GUIDE.md** for complete instructions.

**Quick Steps:**

1. Push code to GitHub
2. Create Blueprint on Render from your repo
3. Run `pnpm init-db` in Render shell
4. Access your live site!

**Cost**: 100% FREE (no credit card required)

---

## 🔄 Changing Admin Password

Currently, password changes must be done directly in the database. A password change feature will be added in a future update.

**Manual password change:**

```sql
-- Generate new hash using bcrypt (10 rounds)
-- Then update the database:
UPDATE admin_users 
SET password_hash = '$2b$10$NEW_HASH_HERE'
WHERE username = 'admin';
```

---

## 🆘 Troubleshooting

### "Invalid username or password"

- Check that you're using `admin` / `admin123`
- Make sure `pnpm init-db` ran successfully
- Check database connection

### "Token verification failed"

- Make sure `JWT_SECRET` is set in environment variables
- Clear cookies and log in again
- Check that the token hasn't expired (7 days)

### Admin panel shows "Not authenticated"

- Make sure you're logged in at `/admin-login`
- Check that the JWT token cookie is being sent
- Verify `JWT_SECRET` matches between sessions

---

## 📝 Files Changed

### New Files

- `server/_core/auth.ts` - Authentication service
- `test-auth.js` - Authentication testing script
- `generate-admin-hash.js` - Password hash generator

### Modified Files

- `client/src/pages/AdminLogin.tsx` - New login UI
- `server/routers.ts` - New auth endpoints
- `server/_core/context.ts` - JWT verification
- `server/_core/env.ts` - Removed Manus variables
- `schema.sql` - Added `admin_users` table
- `init-db.js` - Bcrypt hash generation
- `package.json` - Added bcrypt and jsonwebtoken

### Removed Files

- `server/_core/sdk.ts` - Manus SDK
- `server/_core/oauth.ts` - Manus OAuth
- `server/_core/cookies.ts` - Old cookie handling
- `server/firebase.ts` - Firebase integration

---

## ✅ Summary

Your InfinityX EdTech platform now has a **rock-solid, self-contained authentication system** that:

- Works reliably without external dependencies
- Uses industry-standard security practices
- Is simple to understand and maintain
- Costs nothing to run
- Will never fail due to third-party service issues

**You're ready to deploy and manage your platform with confidence!** 🚀
