// server/auto-init-db.ts - Auto-initialize database on server startup
import { query, queryOne } from './database';
import { hashPassword } from './_core/auth';
import fs from 'fs';
import path from 'path';

/**
 * Run database migrations
 */
async function runMigrations(): Promise<void> {
  try {
    // Migration 1: Add course_link column to courses table
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS course_link TEXT
    `);
    console.log('✅ Migration: Added course_link column to courses table');
  } catch (error: any) {
    // Ignore duplicate column errors
    if (error.code === '42701' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: course_link column already exists');
    } else {
      console.error('❌ Migration error:', error);
    }
  }

  try {
    // Migration 2: Add category column to courses table
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS category VARCHAR(100)
    `);
    console.log('✅ Migration: Added category column to courses table');
  } catch (error: any) {
    if (error.code === '42701' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: category column already exists');
    } else {
      console.error('❌ Migration error:', error);
    }
  }

  try {
    // Migration 3: Add course_type column to courses table
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS course_type VARCHAR(50)
    `);
    console.log('✅ Migration: Added course_type column to courses table');
  } catch (error: any) {
    if (error.code === '42701' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: course_type column already exists');
    } else {
      console.error('❌ Migration error:', error);
    }
  }

  try {
    // Migration 4: Add certificates table
    await query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        cert_id VARCHAR(50) UNIQUE NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        duration VARCHAR(100),
        issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Using a separate query for index just to be safe
    let indexExists = false;
    try {
      const result = await queryOne(`SELECT 1 FROM pg_indexes WHERE indexname = 'idx_certificates_cert_id'`);
      if (result) indexExists = true;
    } catch (e) { }

    if (!indexExists) {
      await query(`CREATE INDEX idx_certificates_cert_id ON certificates(cert_id)`);
    }

    // Add trigger
    let triggerExists = false;
    try {
      const result = await queryOne(`SELECT 1 FROM pg_trigger WHERE tgname = 'update_certificates_updated_at'`);
      if (result) triggerExists = true;
    } catch (e) { }

    if (!triggerExists) {
      await query(`
          CREATE TRIGGER update_certificates_updated_at 
          BEFORE UPDATE ON certificates 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);
    }

    console.log('✅ Migration: Added certificates table');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: certificates table already exists');
    } else {
      console.error('❌ Migration error:', error);
    }
  }

  try {
    // Migration 5: Add sponsors table
    await query(`
      CREATE TABLE IF NOT EXISTS sponsors(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_url VARCHAR(1000) NOT NULL,
        url VARCHAR(1000),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
        `);

    // Add trigger
    let triggerExists = false;
    try {
      const result = await queryOne(`SELECT 1 FROM pg_trigger WHERE tgname = 'update_sponsors_updated_at'`);
      if (result) triggerExists = true;
    } catch (e) { }

    if (!triggerExists) {
      await query(`
          CREATE TRIGGER update_sponsors_updated_at 
          BEFORE UPDATE ON sponsors 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);
    }

    console.log('✅ Migration: Added sponsors table');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: sponsors table already exists');
    } else {
      console.error('❌ Migration error for sponsors:', error);
    }
  }

  try {
    // Migration 6: Course Platform Tables
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        open_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        login_method VARCHAR(50) DEFAULT 'email',
        role VARCHAR(50) DEFAULT 'user',
        last_signed_in TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS course_modules (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS course_lessons (
        id SERIAL PRIMARY KEY,
        module_id INTEGER REFERENCES course_modules(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255),
        video_url TEXT,
        duration VARCHAR(100),
        material_link TEXT,           
        order_index INTEGER DEFAULT 0,
        is_free BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS course_quizzes (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES course_lessons(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_index INTEGER NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS quiz_submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        quiz_id INTEGER REFERENCES course_quizzes(id) ON DELETE CASCADE,
        is_correct BOOLEAN NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, quiz_id)
      );

      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        lesson_id INTEGER REFERENCES course_lessons(id) ON DELETE CASCADE,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active',
        UNIQUE(user_id, course_id)
      );

      CREATE TABLE IF NOT EXISTS device_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        device_id VARCHAR(255) NOT NULL,
        device_name VARCHAR(255),
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, device_id)
      );
    `);

    // Add triggers
    const tables = ['users', 'course_modules', 'course_lessons', 'course_quizzes'];
    for (const table of tables) {
      let triggerExists = false;
      try {
        const result = await queryOne(`SELECT 1 FROM pg_trigger WHERE tgname = 'update_${table}_updated_at'`);
        if (result) triggerExists = true;
      } catch (e) { }

      if (!triggerExists) {
        await query(`
            CREATE TRIGGER update_${table}_updated_at 
            BEFORE UPDATE ON ${table}
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
          `);
      }
    }

    console.log('✅ Migration: Added course platform tables');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: course platform tables already exist');
    } else {
      console.error('❌ Migration error for course platform:', error);
    }
  }
}

/**
 * Check if database is initialized by checking if admin_users table exists
 */
async function isDatabaseInitialized(): Promise<boolean> {
  try {
    const result = await queryOne<{ exists: boolean }>(
      `SELECT EXISTS(
          SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
        )`
    );
    return result?.exists || false;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
}

/**
 * Initialize database with schema and seed data
 */
export async function autoInitializeDatabase(): Promise<void> {
  try {
    console.log('🔍 Checking if database needs initialization...');

    // We check if the admin table exists to determine if we need to run the full schema
    const isInitialized = await isDatabaseInitialized();

    // Always run migrations to ensure DB is up to date with new columns
    if (isInitialized) {
      console.log('✅ Database already initialized, checking for migrations...');
      await runMigrations();

      // Even if initialized, we might want to try running the schema for missing triggers
      // But we must be very careful to ignore "already exists" errors
    }

    // If NOT initialized, or if we want to ensure triggers exist, we run schema.sql
    // Ideally, we only run this if !isInitialized, but your previous logs showed missing triggers.
    // The safest way is to run it but SWALLOW specific errors.

    if (!isInitialized) {
      console.log('🚀 Initializing database schema...');

      const schemaPath = path.join(process.cwd(), 'schema.sql');

      if (!fs.existsSync(schemaPath)) {
        console.error('❌ schema.sql not found at:', schemaPath);
        throw new Error('schema.sql file not found');
      }

      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

      // Split by semicolons
      const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        try {
          await query(statement);
        } catch (error: any) {
          // ✅ FIX: Explicitly ignore "Relation already exists" (42P07) and "Duplicate Object" (42710)
          // 42710 is the code for "Trigger already exists"
          if (
            error.code === '42P07' ||
            error.code === '42710' ||
            error.message?.includes('already exists')
          ) {
            // Silent ignore - this is fine
          } else {
            console.error('⚠️ Error executing schema statement:', error.message);
          }
        }
      }

      // Create default admin user
      console.log('👤 Creating default admin user...');
      const defaultPassword = 'admin123';
      const passwordHash = await hashPassword(defaultPassword);

      await query(
        `INSERT INTO admin_users(username, password_hash, email, name)
            VALUES($1, $2, $3, $4)
            ON CONFLICT(username) DO NOTHING`,
        ['admin', passwordHash, 'admin@infinityx.com', 'Administrator']
      );

      console.log('✅ Database initialized successfully!');
      console.log('📝 Default admin credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!');
    } else {
      // If already initialized, we skip the full schema run to avoid overhead,
      // as migrations handled the column updates.
      console.log('⏩ Skipping schema execution (DB already exists).');
    }

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    // Don't throw error here to keep server running even if DB init has minor hiccups
    // throw error; 
  }
}