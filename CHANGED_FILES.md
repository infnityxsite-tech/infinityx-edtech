# Changed Files - Quick Reference

## Files You Need to Replace in Your Repository

### 1. API Files (CRITICAL - These fix the 404 and TypeScript errors)

#### `api/index.ts`
- **Status**: MODIFIED
- **Action**: Replace completely
- **Why**: Converted from Express to Vercel serverless function

#### `api/upload.ts`
- **Status**: MODIFIED
- **Action**: Replace completely
- **Why**: Rewritten to use formidable instead of multer for serverless compatibility

#### `api/trpc/[trpc].ts`
- **Status**: NEW FILE
- **Action**: Create this new file
- **Why**: Proper tRPC handler for Vercel (uses dynamic routing)

#### `api/trpc.ts`
- **Status**: DELETE
- **Action**: Remove this file
- **Why**: Replaced by `api/trpc/[trpc].ts`

### 2. Configuration Files

#### `package.json`
- **Status**: MODIFIED
- **Action**: Replace or merge dependencies
- **Changes**: Added `@vercel/node`, `formidable`, and `@types/formidable`

#### `vercel.json`
- **Status**: MODIFIED
- **Action**: Replace completely
- **Why**: Fixed routing configuration for tRPC and API endpoints

### 3. Documentation (Optional but Recommended)

#### `DEPLOYMENT_FIX_GUIDE.md`
- **Status**: NEW FILE
- **Action**: Add to repository
- **Why**: Complete guide for deployment and troubleshooting

## Quick Copy Commands

If you're working locally, use these commands:

```bash
# Navigate to your project directory
cd /path/to/your/infinityx-edtech

# Create the trpc directory if it doesn't exist
mkdir -p api/trpc

# Copy the fixed files (adjust paths as needed)
cp /path/to/fixed/api/index.ts api/index.ts
cp /path/to/fixed/api/upload.ts api/upload.ts
cp /path/to/fixed/api/trpc/[trpc].ts api/trpc/[trpc].ts
cp /path/to/fixed/package.json package.json
cp /path/to/fixed/vercel.json vercel.json

# Delete the old trpc.ts
rm api/trpc.ts

# Install new dependencies
pnpm install

# Commit and push
git add .
git commit -m "Fix: Convert to Vercel serverless functions and fix TypeScript errors"
git push origin main
```

## Verification Checklist

After deploying, verify:

- [ ] No TypeScript compilation errors in Vercel build logs
- [ ] No 404 errors in browser console
- [ ] No JSON parse errors in browser console
- [ ] Admin page loads successfully
- [ ] tRPC endpoints respond correctly
- [ ] Image upload works (returns base64 temporarily)

## Files NOT Changed

These files remain the same:
- All files in `/client` directory
- All files in `/server` directory (except if you want to improve them later)
- All files in `/public` directory
- `.env` and `.env.local` files
- Firebase configuration files
- All React components and pages

## Priority Order

If you can only update some files, do them in this order:

1. **HIGHEST PRIORITY**: `api/index.ts`, `api/upload.ts`, `api/trpc/[trpc].ts`
   - These fix the 404 and TypeScript errors

2. **HIGH PRIORITY**: `package.json`
   - Adds required dependencies

3. **MEDIUM PRIORITY**: `vercel.json`
   - Improves routing

4. **LOW PRIORITY**: Documentation files
   - Helpful but not required for functionality
