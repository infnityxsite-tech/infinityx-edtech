# InfinityX EdTech - Complete Fix and Deployment Guide

## What Was Fixed

### 1. API Endpoints Converted to Vercel Serverless Functions

**Problem**: The original code used Express.js which doesn't work properly in Vercel's serverless environment.

**Solution**: Converted all API routes to use Vercel's serverless function format with proper types.

#### Files Changed:
- `api/index.ts` - Now uses `VercelRequest` and `VercelResponse` types
- `api/upload.ts` - Rewritten to use `formidable` instead of `multer` (better for serverless)
- `api/trpc/[trpc].ts` - New file for tRPC integration with Vercel

### 2. TypeScript Type Errors Fixed

**Problem**: Express types (`Request`, `Response`) were incompatible with Vercel's serverless functions.

**Solution**: 
- Added `@vercel/node` package for proper types
- Changed all API handlers to use `VercelRequest` and `VercelResponse`
- Added `formidable` for file uploads (replaces multer in serverless)

### 3. Routing Configuration Updated

**Problem**: `vercel.json` wasn't properly configured for tRPC and API routes.

**Solution**: Updated routing rules to properly handle:
- tRPC endpoints (`/api/trpc/*`)
- Upload endpoint (`/api/upload`)
- Static files
- SPA fallback to index.html

### 4. Dependencies Added

Added to `package.json`:
```json
{
  "dependencies": {
    "@vercel/node": "^3.0.0",
    "formidable": "^3.5.1"
  },
  "devDependencies": {
    "@types/formidable": "^3.4.5"
  }
}
```

## Deployment Steps

### Step 1: Update Your Repository

1. **Replace the files in your repository** with the fixed versions:
   ```bash
   # Copy these files from the fixed version:
   - api/index.ts
   - api/upload.ts
   - api/trpc/[trpc].ts
   - package.json
   - vercel.json
   ```

2. **Delete the old file**:
   ```bash
   # Remove this file as it's no longer needed:
   - api/trpc.ts
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Fix: Convert to Vercel serverless functions"
   git push origin main
   ```

### Step 2: Vercel Environment Variables

Make sure these environment variables are set in Vercel:

1. Go to: https://vercel.com/your-project/settings/environment-variables

2. Add all Firebase credentials:
   ```
   FIREBASE_PROJECT_ID=infinityx-edtech
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY=your-private-key
   SESSION_SECRET=your-session-secret
   VITE_APP_TITLE=InfinityX EdTech
   VITE_APP_LOGO=your-logo-url
   VITE_OAUTH_PORTAL_URL=your-portal-url
   ```

3. **Important**: Make sure to add them to all environments (Production, Preview, Development)

### Step 3: Redeploy

1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "Redeploy" on the latest deployment
5. Or push a new commit to trigger automatic deployment

### Step 4: Verify the Fix

After deployment, check these URLs:

1. **Health Check**: `https://your-domain.vercel.app/api/index`
   - Should return: `{"status":"ok","timestamp":"...","message":"InfinityX EdTech API is running"}`

2. **Admin Page**: `https://your-domain.vercel.app/admin`
   - Should load without JSON parse errors
   - Console should not show 404 errors for tRPC endpoints

3. **Image Upload**: Try uploading an image in the admin panel
   - Should work (note: files will be stored as base64 temporarily)

## Important Notes

### File Upload Limitation

**Current Implementation**: The upload endpoint now returns files as base64 data URLs. This is a temporary solution for Vercel's serverless environment.

**For Production**: You MUST configure cloud storage:

#### Option 1: Use Vercel Blob Storage (Recommended)
```bash
npm install @vercel/blob
```

Then update `api/upload.ts`:
```typescript
import { put } from '@vercel/blob';

// Inside the handler:
const blob = await put(fileName, fileBuffer, {
  access: 'public',
});

return res.status(200).json({
  success: true,
  url: blob.url,
  filename: fileName,
  size: file.size,
  mimetype: file.mimetype
});
```

#### Option 2: Use AWS S3
You already have `@aws-sdk/client-s3` in dependencies. Update the upload handler to use S3.

#### Option 3: Use Cloudinary
```bash
npm install cloudinary
```

### Firebase Configuration

Make sure your Firebase rules allow read/write access for authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Troubleshooting

#### If you still see 404 errors:

1. **Check Vercel logs**:
   - Go to Vercel dashboard → Your project → Logs
   - Look for any error messages

2. **Verify file structure**:
   ```
   /api
     /trpc
       [trpc].ts
     index.ts
     upload.ts
   ```

3. **Clear Vercel cache**:
   - Go to Settings → General
   - Scroll to "Clear Cache"
   - Click "Clear Cache" and redeploy

#### If TypeScript errors persist:

1. **Install dependencies locally**:
   ```bash
   pnpm install
   ```

2. **Run type check**:
   ```bash
   pnpm check
   ```

3. **Fix any remaining type errors** before deploying

#### If images don't upload:

1. **Check browser console** for error messages
2. **Verify the upload endpoint** is responding: `POST https://your-domain.vercel.app/api/upload`
3. **Implement proper cloud storage** (see "File Upload Limitation" above)

## Next Steps

1. ✅ Deploy the fixed code
2. ✅ Verify all endpoints work
3. ⚠️ **IMPORTANT**: Set up proper cloud storage for file uploads
4. ✅ Test image upload functionality
5. ✅ Test admin panel functionality
6. ✅ Monitor Vercel logs for any issues

## Support

If you encounter any issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Make sure Firebase credentials are correct

## Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| `api/index.ts` | Converted to Vercel serverless function | Express doesn't work in Vercel |
| `api/upload.ts` | Rewritten with formidable | Multer has issues in serverless |
| `api/trpc/[trpc].ts` | New tRPC handler | Proper tRPC integration for Vercel |
| `api/trpc.ts` | Deleted | Replaced by `[trpc].ts` |
| `package.json` | Added dependencies | Need Vercel types and formidable |
| `vercel.json` | Updated routing | Proper API and tRPC routing |

All changes maintain backward compatibility with your Firebase setup and existing frontend code.
