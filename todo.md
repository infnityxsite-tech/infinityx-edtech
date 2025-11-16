# InfinityX Ed-Tech Platform - Project TODO

## Part 1: Admin Panel (CMS) - Highest Priority

### Security & Access
- [x] Remove "Admin" link from public navigation bar
- [x] Create protected route at /admin with authentication check
- [x] Implement Convex authentication for /admin route
- [x] Create login page for non-logged-in users accessing /admin
- [x] Implement admin role verification for all admin functions

### Admin Dashboard Features (CRUD)
- [x] Page Content Manager - Edit home page headline and sub-headline
- [x] Page Content Manager - Edit home page stats (Students Trained, Expert Instructors, Job Placement Rate)
- [x] Page Content Manager - Edit About page "Our Mission" text
- [x] Page Content Manager - Edit About page "Our Vision" text
- [x] Courses Manager - Display list of all courses in table
- [x] Courses Manager - Create new course functionality
- [x] Courses Manager - Update existing course functionality
- [x] Courses Manager - Delete course functionality
- [x] Programs Manager - Display list of all programs in table
- [x] Programs Manager - Create new program functionality
- [x] Programs Manager - Update existing program functionality
- [x] Programs Manager - Delete program functionality
- [x] Blog Manager - Display list of all blog posts in table
- [x] Blog Manager - Create new blog post with rich-text editor
- [x] Blog Manager - Update existing blog post functionality
- [x] Blog Manager - Delete blog post functionality
- [x] Careers Manager - Display list of all job listings in table
- [x] Careers Manager - Create new job listing functionality
- [x] Careers Manager - Update existing job listing functionality
- [x] Careers Manager - Delete job listing functionality

## Part 2: Public Website (Frontend)

### Navigation & Layout
- [x] Update navigation bar - remove "Admin" link
- [x] Set up navigation with: Home, About, Courses, Programs, Blog, Careers

### Dynamic Page Content
- [x] Home Page - Fetch and display headline from database
- [x] Home Page - Fetch and display sub-headline from database
- [x] Home Page - Fetch and display stats from database
- [x] About Page - Fetch and display "Our Mission" text
- [x] About Page - Fetch and display "Our Vision" text
- [x] Courses Page - Build dynamic courses page
- [x] Courses Page - Fetch and display all courses in card layout
- [x] Programs Page - Rebuild as dynamic page
- [x] Programs Page - Fetch and display all programs from database
- [x] Blog Page - Build blog listing page
- [x] Blog Page - Fetch and display all blog posts
- [x] Blog Page - Create dynamic blog post detail route (/blog/[postId])
- [x] Careers Page - Rebuild as dynamic page
- [x] Careers Page - Fetch and display all job listings

## Part 3: Backend & Database

### Database Schema
- [x] Define users table with admin role support
- [x] Define admins table linked to users
- [x] Define pageContent table with indexes
- [x] Define courses table
- [x] Define programs table
- [x] Define blogPosts table
- [x] Define jobListings table
- [x] Create all necessary database indexes

### API Functions (Queries & Mutations)
- [x] Create admin mutation: createCourse with admin check
- [x] Create admin mutation: updateCourse with admin check
- [x] Create admin mutation: deleteCourse with admin check
- [x] Create admin mutation: createProgram with admin check
- [x] Create admin mutation: updateProgram with admin check
- [x] Create admin mutation: deleteProgram with admin check
- [x] Create admin mutation: createBlogPost with admin check
- [x] Create admin mutation: updateBlogPost with admin check
- [x] Create admin mutation: deleteBlogPost with admin check
- [x] Create admin mutation: createJobListing with admin check
- [x] Create admin mutation: updateJobListing with admin check
- [x] Create admin mutation: deleteJobListing with admin check
- [x] Create admin mutation: updatePageContent with admin check
- [x] Create public query: listCourses
- [x] Create public query: listPrograms
- [x] Create public query: listBlogPosts
- [x] Create public query: getBlogPost by ID
- [x] Create public query: listJobListings
- [x] Create public query: getPageContent

## Testing & Deployment
- [x] Test admin authentication and authorization
- [x] Test all CRUD operations in admin panel
- [x] Test dynamic content loading on public pages
- [x] Verify responsive design across devices
- [x] Security review of admin panel
- [x] Performance optimization
- [x] Create user guide documentation
