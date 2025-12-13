-- InfinityX EdTech Platform - PostgreSQL Schema
-- Updated with Bilingual Support & School Categories

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_admin_users_username ON admin_users(username);

-- ============================================
-- PAGE CONTENT TABLE (Bilingual)
-- ============================================
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(50) UNIQUE NOT NULL,
  
  -- English Content
  headline TEXT,
  sub_headline TEXT,
  mission_text TEXT,
  vision_text TEXT,
  founder_bio TEXT,
  founder_message TEXT,
  about_company TEXT,

  -- Arabic Content
  headline_ar TEXT,
  sub_headline_ar TEXT,
  mission_text_ar TEXT,
  vision_text_ar TEXT,
  founder_bio_ar TEXT,
  founder_message_ar TEXT,
  about_company_ar TEXT,

  -- Statistics
  students_trained INTEGER DEFAULT 0,
  expert_instructors INTEGER DEFAULT 0,
  job_placement_rate INTEGER DEFAULT 0,

  -- Images
  hero_image_url TEXT,
  banner_image_url TEXT,
  founder_image_url TEXT,
  company_image_url TEXT,
  mission_image_url TEXT,
  vision_image_url TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_content_key ON page_content(page_key);

-- ============================================
-- COURSES TABLE (Bilingual Support)
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),        -- Added for Arabic
  description TEXT,
  description_ar TEXT,          -- Added for Arabic
  image_url TEXT,
  duration VARCHAR(100),
  level VARCHAR(50),
  instructor VARCHAR(255),
  price_egp DECIMAL(10, 2) DEFAULT 0,
  price_usd DECIMAL(10, 2) DEFAULT 0,
  course_link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_title ON courses(title);

-- ============================================
-- PROGRAMS TABLE (Bilingual + Categories)
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),       -- Arabic Title
  description TEXT,
  description_ar TEXT,         -- Arabic Description
  image_url TEXT,
  duration VARCHAR(100),
  skills TEXT,                 -- Comma-separated skills (e.g. "React, Node")
  category VARCHAR(50) DEFAULT 'other', -- e.g. "space", "ai", "software"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- AUTOMATIC MIGRATION BLOCK
-- This safely adds columns if they are missing (for Render deployment)
-- ============================================
DO $$
BEGIN
    -- 1. Add Arabic columns to page_content
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'page_content' AND column_name = 'headline_ar') THEN
        ALTER TABLE page_content 
        ADD COLUMN headline_ar TEXT,
        ADD COLUMN sub_headline_ar TEXT,
        ADD COLUMN mission_text_ar TEXT,
        ADD COLUMN vision_text_ar TEXT,
        ADD COLUMN founder_bio_ar TEXT,
        ADD COLUMN founder_message_ar TEXT,
        ADD COLUMN about_company_ar TEXT;
    END IF;

    -- 2. Add Arabic columns to courses
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'title_ar') THEN
        ALTER TABLE courses ADD COLUMN title_ar VARCHAR(255), ADD COLUMN description_ar TEXT;
    END IF;

    -- 3. Add Arabic, Skills, and Category columns to programs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'title_ar') THEN
        ALTER TABLE programs ADD COLUMN title_ar VARCHAR(255), ADD COLUMN description_ar TEXT;
    END IF;

    -- Add 'skills' if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'skills') THEN
        ALTER TABLE programs ADD COLUMN skills TEXT;
    END IF;

    -- Add 'category' if missing (Critical for School Pages)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'category') THEN
        ALTER TABLE programs ADD COLUMN category VARCHAR(50) DEFAULT 'other';
    END IF;
END $$;

-- ============================================
-- REST OF TABLES (Unchanged)
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  author VARCHAR(255),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_published ON blog_posts(published_at DESC);

CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  course_interest VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_settings_key ON site_settings(key);

-- ============================================
-- SEED DATA - Updated with Professional/Bilingual Content
-- ============================================
INSERT INTO page_content (
    page_key, 
    headline, headline_ar, 
    sub_headline, sub_headline_ar,
    students_trained, expert_instructors, job_placement_rate
)
VALUES 
  (
    'home', 
    'Empowering the Next Generation of Tech Leaders', 
    'تمكين الجيل القادم من قادة التكنولوجيا في الشرق الأوسط',
    'Master cutting-edge technologies through hands-on learning, expert mentorship, and real-world projects that prepare you for the future.', 
    'أتقن أحدث التقنيات من خلال التعلم العملي والتوجيه من الخبراء والمشاريع الواقعية التي تعدك للمستقبل',
    5000, 50, 95
  ),
  (
    'about', 
    'About InfinityX', 
    'عن إنفينيتي إكس',
    'Transforming education through technology, innovation, and a commitment to empowering the next generation of tech leaders.', 
    'تحويل التعليم من خلال التكنولوجيا والابتكار والالتزام بتمكين الجيل القادم من قادة التكنولوجيا',
    0, 0, 0
  )
ON CONFLICT (page_key) 
DO UPDATE SET 
    headline_ar = EXCLUDED.headline_ar,
    sub_headline_ar = EXCLUDED.sub_headline_ar;

-- ============================================
-- DEFAULT ADMIN (Change Password on Login)
-- ============================================
INSERT INTO admin_users (username, password_hash, email, name)
VALUES 
  ('admin', '$2b$10$rKqF5xZ8YxZ8YxZ8YxZ8YeJ5xZ8YxZ8YxZ8YxZ8YxZ8YxZ8YxZ8Yx', 'admin@infinityx.com', 'Administrator')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();