# InfinityX EdTech Platform

**A modern, full-stack educational technology platform built with React, TypeScript, and Express.**

## Overview

InfinityX is a comprehensive EdTech platform designed to provide online courses, programs, and career opportunities in cutting-edge technologies like Artificial Intelligence, Web Development, and Cybersecurity.

## Features

### Public Features
- **Modern Homepage:** Professional hero section with statistics, vision statement, and technology showcases
- **About Page:** Company information, founder bio, mission & vision statements with supporting images
- **Courses & Programs:** Browse and apply for educational offerings
- **Blog:** Read articles and updates
- **Careers:** View job listings and apply
- **Contact Form:** Send messages directly to the admin team

### Admin Features
- **Page Content Manager:** Control all text and images for Home and About pages
- **Courses Manager:** Create, edit, and delete course listings
- **Programs Manager:** Manage specialized training programs
- **Blog Manager:** Publish and manage blog posts
- **Careers Manager:** Post and manage job listings
- **Messages Manager:** View and respond to contact form submissions
- **Applications Manager:** Review student applications
- **Site Settings:** Update global contact information and footer text

## Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, tRPC
- **Database:** MySQL with Drizzle ORM
- **Storage:** Forge Storage (production-ready file uploads)
- **Authentication:** Session-based auth with role-based access control

## What Was Fixed

This version includes comprehensive fixes and enhancements:

1. **Upload System:** Migrated from local disk storage to Forge storage with proper validation
2. **Database Schema:** Added missing fields (heroImageUrl, contactMessages table) and clarified field organization
3. **Admin Panel:** Fixed PageContentManager to properly separate Home and About page fields
4. **Messages Feature:** Fully implemented contact form with admin viewing and deletion
5. **Professional Design:** Complete redesign of public pages with new images and content
6. **TypeScript Errors:** Fixed all compilation errors including price field types and deprecated hooks
7. **Navigation:** Added Contact button to main navigation
8. **All Buttons Working:** Verified all CTAs and links function correctly

## Quick Start

See **SETUP_GUIDE.md** for detailed setup instructions.

```bash
# Install dependencies
pnpm install

# Configure database
# Create .env file with DATABASE_URL

# Run migrations
pnpm db:push

# Start development server
pnpm dev
```

## Project Structure

```
infinityx-edtech/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities and configs
├── server/               # Express backend
│   ├── routes/           # API routes
│   ├── routers.ts        # tRPC routers
│   └── db.ts             # Database functions
├── drizzle/              # Database schema and migrations
├── public/               # Static assets
│   └── assets/           # Generated professional images
└── SETUP_GUIDE.md        # Detailed setup instructions
```

## Admin Access

For local development, navigate to `/admin/login` and use the "Login as Local Admin" button.

For production, ensure you have an admin user in the database with `role = 'admin'`.

## License

© 2025 InfinityX EdTech Platform. All rights reserved.

## Support

For questions or issues, please contact: infnityx.site@gmail.com
