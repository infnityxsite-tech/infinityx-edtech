# InfinityX Ed-Tech Platform - User Guide

## Website Information

**Website URL:** Available after deployment via the Publish button in the Management UI

**Purpose:** InfinityX is a comprehensive ed-tech platform that enables administrators to manage and deliver educational content including courses, programs, blog posts, and career opportunities. Students and visitors can browse all content and learn about the platform.

**Access:** Public website is accessible to all visitors. Admin panel requires authentication with admin credentials.

---

## Powered by Manus

**Technology Stack:**
- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui components
- **Backend:** Express 4 + tRPC 11 for type-safe API communication
- **Database:** MySQL/TiDB with Drizzle ORM for schema management
- **Authentication:** Manus OAuth for secure admin access
- **Deployment:** Auto-scaling infrastructure with global CDN

This platform is built on cutting-edge technologies that ensure fast performance, type safety, and seamless scalability across all features.

---

## Using Your Website

### For Visitors

**Browsing Content:**
1. Click "Home" to see the main landing page with platform statistics
2. Click "About" to learn about the platform's mission and vision
3. Click "Courses" to explore all available courses with descriptions and instructor information
4. Click "Programs" to view specialized learning programs and required skills
5. Click "Blog" to read articles and insights from experts
6. Click on any blog post title to read the full article with markdown formatting
7. Click "Careers" to view open job positions and apply

**Key Features:**
- All content is dynamically loaded from the database
- Responsive design works on desktop, tablet, and mobile devices
- Search and filter functionality for courses and programs
- Markdown support for blog posts with proper formatting

### For Administrators

**Accessing the Admin Panel:**
1. Navigate to `/admin` in your browser
2. If not logged in, you'll be redirected to the login page
3. Click "Sign In to Admin Panel" and authenticate with your Manus account
4. You must have admin role to access the dashboard

**Managing Page Content:**
1. In the Admin Panel, click the "Page Content" tab
2. Select "Home Page" to edit the main headline, sub-headline, and statistics
3. Select "About Page" to edit the mission and vision statements
4. Click "Save" to publish changes immediately to the live website

**Managing Courses:**
1. Click the "Courses" tab in the Admin Panel
2. Click "Add Course" to create a new course
3. Fill in course details: title, description, duration, level, instructor, price, and image URL
4. Click "Create Course" to save
5. To edit a course, click the edit icon next to the course name
6. To delete a course, click the delete icon (this action cannot be undone)

**Managing Programs:**
1. Click the "Programs" tab
2. Click "Add Program" to create a new specialized program
3. Enter program details including title, description, duration, and skills (comma-separated)
4. Upload a program image URL for visual representation
5. Changes appear on the Programs page immediately

**Managing Blog Posts:**
1. Click the "Blog" tab
2. Click "Add Post" to create a new blog article
3. Enter title, author name, and content (supports Markdown formatting)
4. Add a summary and featured image URL
5. Click "Create Post" to publish
6. Posts appear on the Blog page sorted by publication date (newest first)
7. Edit or delete posts using the action buttons

**Managing Job Listings:**
1. Click the "Careers" tab
2. Click "Add Job" to post a new job opening
3. Enter job title, location, job type (Full-time, Part-time, etc.), and salary range
4. Describe the job responsibilities and list required skills
5. Click "Create Listing" to publish the job
6. Job listings appear on the Careers page immediately
7. Mark jobs as inactive or delete them when positions are filled

**Admin Security:**
- Only users with admin role can access the admin panel
- All mutations (create, update, delete) are protected and verified on the server
- Session cookies are secure and expire automatically
- Click "Logout" to end your admin session

---

## Managing Your Website

### Dashboard Features

**Settings Panel** (in Management UI):
- Update website title and logo
- Configure domain settings
- Manage notification preferences

**Database Panel** (in Management UI):
- View and manage all database records
- Run custom queries if needed
- Export data for backups

**Secrets Panel** (in Management UI):
- Manage API keys and credentials
- Update environment variables securely
- No secrets are exposed in code

### Monitoring and Analytics

- View website traffic and user statistics in the Dashboard
- Monitor admin panel usage and content changes
- Track which content gets the most engagement

---

## Next Steps

Talk to Manus AI anytime to request changes or add features. Whether you want to customize the design, add new content types, integrate with external services, or optimize performance, we're here to help.

**Quick Actions:**
- Add more courses and programs to expand your offerings
- Create blog content to establish thought leadership
- Post job listings to attract talent
- Customize the home page statistics to reflect your platform's growth

Start by logging into the admin panel and creating your first course or program. Your students are waiting to learn!
