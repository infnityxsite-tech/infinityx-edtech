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
    // Migration 3b: Ensure updated_at column exists on courses table
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ Migration: Ensured updated_at column on courses table');
  } catch (error: any) {
    if (error.code === '42701' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: courses.updated_at already exists');
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

  try {
    // Migration 7: B2B CMS & Sales Funnel Tables
    await query(`
      CREATE TABLE IF NOT EXISTS service_packages (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255),
        description TEXT,
        description_ar TEXT,
        features_json TEXT,
        price_tier VARCHAR(100),
        icon_url TEXT,
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS client_case_studies (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_name_ar VARCHAR(255),
        industry VARCHAR(255),
        industry_ar VARCHAR(255),
        challenge TEXT,
        challenge_ar TEXT,
        solution TEXT,
        solution_ar TEXT,
        results_json TEXT,
        image_url TEXT,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS solution_tiers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255),
        description TEXT,
        description_ar TEXT,
        target_audience VARCHAR(255),
        target_audience_ar VARCHAR(255),
        tech_stack_json TEXT,
        price_range VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consultation_leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        industry_pain_point TEXT,
        service_interest VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add triggers for the new tables
    const b2bTables = ['service_packages', 'client_case_studies', 'solution_tiers', 'consultation_leads'];
    for (const table of b2bTables) {
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

    // Add indexes for consultation_leads
    try {
      await query(`CREATE INDEX IF NOT EXISTS idx_consultation_leads_status ON consultation_leads(status)`);
      await query(`CREATE INDEX IF NOT EXISTS idx_consultation_leads_email ON consultation_leads(email)`);
    } catch (e) { }

      // Seed services table
      try {
        const servicesCount = await queryOne<{ count: string }>(`SELECT COUNT(*) FROM services`);
        if (servicesCount && parseInt(servicesCount.count) === 0) {
          console.log('🌱 Seeding services table with B2B enterprise entries...');
          const seedServices = [
            {
              title: "Computer Vision Systems",
              titleAr: "أنظمة الرؤية الحاسوبية",
              description: "Real-time object detection, quality inspection, and spatial tracking inference at the edge.",
              descriptionAr: "كشف الأجسام في الوقت الفعلي، فحص الجودة، والتتبع المكاني على الحافة.",
              icon: "Eye",
              priceTier: "Enterprise Level",
              status: "active",
              featuresJson: JSON.stringify(["YOLOv11 Object Detection", "Real-time Inference <12ms", "Edge Deployment (Jetson)"])
            },
            {
              title: "Enterprise MLOps & Data",
              titleAr: "عمليات تعلم الآلة وبيانات المؤسسة",
              description: "End-to-end model lifecycle management, scalable data lakes, and continuous training pipelines.",
              descriptionAr: "إدارة دورة حياة النموذج، بحيرات بيانات قابلة للتوسع، ومسارات تدريب مستمرة.",
              icon: "Database",
              priceTier: "Enterprise Level",
              status: "active",
              featuresJson: JSON.stringify(["Model Lifecycle Management", "Automated Retraining", "AWS SageMaker Integration"])
            },
            {
              title: "Cloud-Native Architecture",
              titleAr: "هندسة الأنظمة السحابية",
              description: "Microservices architecture, real-time WebSockets, and high-availability API layers.",
              descriptionAr: "بنية الخدمات المصغرة، WebSockets في الوقت الفعلي، وطبقات API عالية التوفر.",
              icon: "Cloud",
              priceTier: "Enterprise Level",
              status: "active",
              featuresJson: JSON.stringify(["Microservices Architecture", "Real-time WebSockets", "Kubernetes Orchestration"])
            },
            {
              title: "Predictive Analytics",
              titleAr: "التحليلات التنبؤية",
              description: "Advanced forecasting models leveraging historical data to predict trends, demand, and anomalies.",
              descriptionAr: "نماذج تنبؤية متقدمة تستفيد من البيانات التاريخية للتنبؤ بالاتجاهات والطلب والتشوهات.",
              icon: "BarChart3",
              priceTier: "Enterprise Level",
              status: "active",
              featuresJson: JSON.stringify(["Time-Series Forecasting", "Anomaly Detection", "BI Dashboard Integration"])
            }
          ];

          for (const s of seedServices) {
            await query(`
              INSERT INTO services (title, title_ar, description, description_ar, icon, price_tier, status, features_json)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [s.title, s.titleAr, s.description, s.descriptionAr, s.icon, s.priceTier, s.status, s.featuresJson]);
          }
        }
      } catch (e) {
        console.error('Error seeding services:', e);
      }

    console.log('✅ Migration: Added B2B CMS & sales funnel tables');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: B2B tables already exist');
    } else {
      console.error('❌ Migration error for B2B tables:', error);
    }
  }

  try {
    // Migration 8: Headless CMS Normalized B2B Tables
    await query(`
      CREATE TABLE IF NOT EXISTS service_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Check if services table exists from previous pivot, if not create it
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        description_ar TEXT,
        icon VARCHAR(255),
        featured BOOLEAN DEFAULT false,
        show_on_homepage BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'draft',
        sort_order INTEGER DEFAULT 0,
        price_tier VARCHAR(100),
        features_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Add missing columns to services if it already existed
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'slug') THEN
              ALTER TABLE services ADD COLUMN slug VARCHAR(255) UNIQUE;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'featured') THEN
              ALTER TABLE services ADD COLUMN featured BOOLEAN DEFAULT false;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'show_on_homepage') THEN
              ALTER TABLE services ADD COLUMN show_on_homepage BOOLEAN DEFAULT false;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'status') THEN
              ALTER TABLE services ADD COLUMN status VARCHAR(50) DEFAULT 'draft';
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'sort_order') THEN
              ALTER TABLE services ADD COLUMN sort_order INTEGER DEFAULT 0;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'category_id') THEN
              ALTER TABLE services ADD COLUMN category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL;
          END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS service_pricing_models (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        model_type VARCHAR(50) NOT NULL, -- 'Fixed', 'Retainer', 'Custom'
        starting_price VARCHAR(100),
        features_json TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS service_blocks (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        block_type VARCHAR(50) NOT NULL, -- 'overview', 'architecture_diagram', 'pricing_matrix', etc
        content_jsonb JSONB NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS service_use_cases (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        metrics_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS service_deliverables (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Extend existing client_case_studies with service relation
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_case_studies' AND column_name = 'service_id') THEN
              ALTER TABLE client_case_studies ADD COLUMN service_id INTEGER REFERENCES services(id) ON DELETE SET NULL;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_case_studies' AND column_name = 'slug') THEN
              ALTER TABLE client_case_studies ADD COLUMN slug VARCHAR(255) UNIQUE;
          END IF;
      END $$;
    `);

    const headlessTables = ['service_categories', 'services', 'service_pricing_models', 'service_blocks', 'service_use_cases', 'service_deliverables'];
    for (const table of headlessTables) {
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

    // Assign generic slugs to existing services if missing
    await query(`UPDATE services SET slug = LOWER(REPLACE(title, ' ', '-')) WHERE slug IS NULL`);
    await query(`UPDATE services SET status = 'active' WHERE status = 'draft'`);

    console.log('✅ Migration: Added Headless CMS normalized tables for B2B pivot');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration: Headless CMS tables already exist');
    } else {
      console.error('❌ Migration error for Headless CMS tables:', error);
    }
  }

  try {
    // Migration 9: Enterprise V2 — Normalized relational tables + rich content columns
    await query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS hero_image_url TEXT`);
    await query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS problem_statement TEXT`);
    await query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS problem_statement_ar TEXT`);
    await query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS overview_long TEXT`);
    await query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS overview_long_ar TEXT`);
    await query(`ALTER TABLE client_case_studies ADD COLUMN IF NOT EXISTS outcome TEXT`);
    await query(`ALTER TABLE client_case_studies ADD COLUMN IF NOT EXISTS outcome_ar TEXT`);
    await query(`ALTER TABLE client_case_studies ADD COLUMN IF NOT EXISTS logo_url TEXT`);

    await query(`
      CREATE TABLE IF NOT EXISTS service_gallery (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        caption VARCHAR(255),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS service_faq (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        question_ar TEXT,
        answer_ar TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS service_tech_stack (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Migration 9: Enterprise V2 relational tables and columns');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration 9: Tables already exist');
    } else {
      console.error('❌ Migration 9 error:', error);
    }
  }

  try {
    // Migration 10: V3 Solutions Architecture — Impact metrics, Industries, Extended leads
    await query(`ALTER TABLE services ADD COLUMN IF NOT EXISTS process_methodology_json TEXT`);

    // Extend pricing models
    const pkgCols = ['typical_range VARCHAR(255)', 'scope_summary TEXT', 'scope_summary_ar TEXT', 'deliverables_json TEXT', 'optional_add_ons_json TEXT', 'support_terms TEXT', 'support_terms_ar TEXT', 'ip_ownership_notes TEXT', 'ip_ownership_notes_ar TEXT', 'description_ar TEXT', 'model_type_ar VARCHAR(100)'];
    for (const col of pkgCols) { await query(`ALTER TABLE service_pricing_models ADD COLUMN IF NOT EXISTS ${col}`).catch(() => {}); }

    // Extend deliverables
    const delCols = ['title_ar VARCHAR(255)', 'description_ar TEXT', 'acceptance_criteria TEXT', 'acceptance_criteria_ar TEXT', 'expected_timeline VARCHAR(100)'];
    for (const col of delCols) { await query(`ALTER TABLE service_deliverables ADD COLUMN IF NOT EXISTS ${col}`).catch(() => {}); }

    // Extend use cases
    const ucCols = ['title_ar VARCHAR(255)', 'description_ar TEXT', 'industry VARCHAR(100)', 'business_impact TEXT', 'business_impact_ar TEXT', 'example_scenario TEXT', 'example_scenario_ar TEXT'];
    for (const col of ucCols) { await query(`ALTER TABLE service_use_cases ADD COLUMN IF NOT EXISTS ${col}`).catch(() => {}); }

    // Impact metrics
    await query(`CREATE TABLE IF NOT EXISTS service_impact_metrics (id SERIAL PRIMARY KEY, service_id INTEGER REFERENCES services(id) ON DELETE CASCADE, metric_title VARCHAR(255) NOT NULL, metric_title_ar VARCHAR(255), metric_value VARCHAR(100) NOT NULL, metric_description TEXT, metric_description_ar TEXT, impact_category VARCHAR(100), order_index INTEGER DEFAULT 0)`);

    // Industries
    await query(`CREATE TABLE IF NOT EXISTS industries (id SERIAL PRIMARY KEY, slug VARCHAR(100) UNIQUE NOT NULL, title VARCHAR(255) NOT NULL, title_ar VARCHAR(255) NOT NULL, hero_image_url TEXT, overview TEXT, overview_ar TEXT, pain_points_json TEXT, pain_points_ar_json TEXT, order_index INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await query(`CREATE TABLE IF NOT EXISTS industry_services (id SERIAL PRIMARY KEY, industry_id INTEGER REFERENCES industries(id) ON DELETE CASCADE, service_id INTEGER REFERENCES services(id) ON DELETE CASCADE, UNIQUE(industry_id, service_id))`);

    // Extended consultation leads
    const leadCols = ['selected_service_id INTEGER', 'selected_package_type VARCHAR(100)', 'budget_range VARCHAR(100)', 'timeline_expectation VARCHAR(100)', 'requires_full_ip BOOLEAN DEFAULT false', 'proposal_summary_snapshot JSONB'];
    for (const col of leadCols) { await query(`ALTER TABLE consultation_leads ADD COLUMN IF NOT EXISTS ${col}`).catch(() => {}); }

    console.log('✅ Migration 10: V3 Solutions Architecture tables and columns');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration 10: V3 tables already exist');
    } else {
      console.error('❌ Migration 10 error:', error);
    }
  }

  try {
    // Migration 11: Add missing columns to careers table (requirements, job_type, salary)
    await query(`ALTER TABLE careers ADD COLUMN IF NOT EXISTS requirements TEXT`);
    await query(`ALTER TABLE careers ADD COLUMN IF NOT EXISTS job_type VARCHAR(100)`);
    await query(`ALTER TABLE careers ADD COLUMN IF NOT EXISTS salary VARCHAR(255)`);
    console.log('✅ Migration 11: Added requirements, job_type, salary columns to careers');
  } catch (error: any) {
    if (error.code === '42701' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration 11: Careers columns already exist');
    } else {
      console.error('❌ Migration 11 error:', error);
    }
  }

  try {
    // Migration 12: Student progress tracking & notes (uses `lessons` table, not `course_lessons`)
    await query(`
      CREATE TABLE IF NOT EXISTS student_lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS student_notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );
    `);
    console.log('✅ Migration 12: Added student_lesson_progress and student_notes tables');
  } catch (error: any) {
    if (error.code === '42P07' || error.message?.includes('already exists')) {
      console.log('ℹ️  Migration 12: student_lesson_progress / student_notes already exist');
    } else {
      console.error('❌ Migration 12 error:', error);
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