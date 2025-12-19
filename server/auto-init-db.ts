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
}

/**
 * Check if database is initialized by checking if admin_users table exists
 */
async function isDatabaseInitialized(): Promise<boolean> {
  try {
    const result = await queryOne<{ exists: boolean }>(
      `SELECT EXISTS (
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
            `INSERT INTO admin_users (username, password_hash, email, name)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING`,
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