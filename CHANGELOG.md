# Changelog

## Version 2.0.0 - November 10, 2025

### Major Enhancements

#### Backend Fixes
- **Upload System Overhaul**
  - Migrated from local disk storage to Forge storage
  - Added proper file validation (type, size limits)
  - Implemented error handling for upload failures
  - Files now stored with production-ready URLs

- **Database Schema Updates**
  - Added `heroImageUrl` field to pageContent table for Home page hero images
  - Created `contactMessages` table for storing contact form submissions
  - Fixed field organization and added clear comments for Home vs About page fields
  - Added proper indexes for performance

- **TRPC Router Improvements**
  - Added all missing image fields to updatePageContent input schema
  - Fixed typo: "FORBIDDED" → "FORBIDDEN" in error codes
  - Added message management procedures (getMessages, createMessage, deleteMessage)
  - Fixed price field type handling (number to string conversion for decimal fields)

#### Frontend Fixes
- **PageContentManager Component**
  - Completely rewritten to properly separate Home and About page fields
  - Added image upload with preview functionality
  - Implemented proper state management for each page
  - Added visual feedback for uploaded images
  - Fixed issue where images were mixing between pages

- **MessagesManager Component**
  - Enhanced UI with better styling
  - Added automatic refresh after message deletion
  - Improved empty state messaging

- **Home Page Redesign**
  - Professional hero section with gradient overlay
  - Enhanced statistics section with better visual hierarchy
  - Added vision section with supporting imagery
  - Redesigned technology cards with hover effects
  - Improved call-to-action sections
  - Added comprehensive footer

- **About Page Redesign**
  - Professional banner with company information
  - Enhanced founder section with bio and message
  - Mission & vision cards with dedicated imagery
  - Core values section with icons
  - Improved layout and spacing

- **Navigation Enhancement**
  - Added prominent "Contact Us" button
  - Improved responsive design
  - Better visual hierarchy

- **Contact Page**
  - Fixed TRPC mutation to use correct procedure
  - Added messageType field for categorization
  - Improved form validation and error handling

#### TypeScript & Code Quality
- Fixed all TypeScript compilation errors
- Resolved deprecated React Query `onSuccess` callback usage
- Fixed Apply.tsx URL parameter parsing
- Corrected price field type conversions throughout the codebase
- Added proper type safety for all database operations

#### Assets & Design
- Generated 5 professional images for the website:
  - Hero banner (diverse students collaborating)
  - About banner (modern office environment)
  - Founder portrait (professional headshot)
  - Vision learning (futuristic classroom)
  - Mission education (graduation success)
- Implemented consistent blue and white color scheme
- Added professional typography and spacing

### Documentation
- Created comprehensive SETUP_GUIDE.md with step-by-step instructions
- Updated README.md with project overview and features
- Added this CHANGELOG.md to track all changes

### Testing
- Verified all TypeScript compilation passes without errors
- Confirmed database schema migrations are ready
- Tested admin panel functionality
- Verified all navigation links and buttons work correctly

## Version 1.0.0 - Initial Release

- Basic project structure
- Initial admin panel
- Course and program management
- Blog and careers features
- Basic page content management
