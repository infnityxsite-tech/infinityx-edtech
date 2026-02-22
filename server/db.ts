import { query, queryOne, queryMany } from "./database";
import pool from "./database";
export { query };
import { ENV } from "./_core/env";

// ==============================
// 🛡️ SECURITY UTILS
// ==============================
function buildUpdateQuery(tableName: string, allowedKeys: string[], updates: any, idField: string, idValue: any) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  for (const key of allowedKeys) {
    if (updates[key] !== undefined) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      fields.push(`${snakeKey} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    }
  }

  if (fields.length === 0) return null;

  values.push(idValue);
  return {
    text: `UPDATE ${tableName} SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE ${idField} = $${paramIndex}`,
    values
  };
}

// ==============================
// 👤 USER OPERATIONS
// ==============================

export interface User {
  id: string;
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

export interface InsertUser {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: "student" | "admin";
  lastSignedIn?: Date;
}

export async function upsertUser(user: InsertUser) {
  const role = user.role || (user.openId === ENV.ownerOpenId ? "admin" : "student");
  const now = new Date();

  await query(
    `INSERT INTO users (open_id, name, email, login_method, role, last_signed_in, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (open_id) 
     DO UPDATE SET 
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       login_method = EXCLUDED.login_method,
       role = EXCLUDED.role,
       last_signed_in = EXCLUDED.last_signed_in,
       updated_at = EXCLUDED.updated_at`,
    [user.openId, user.name, user.email, user.loginMethod, role, user.lastSignedIn || now, now, now]
  );
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const result = await queryOne<any>(
    `SELECT id, open_id as "openId", name, email, login_method as "loginMethod", 
            role, created_at as "createdAt", updated_at as "updatedAt", 
            last_signed_in as "lastSignedIn"
     FROM users WHERE open_id = $1`,
    [openId]
  );
  return result || undefined;
}

// ==============================
// 📄 PAGE CONTENT OPERATIONS
// ==============================

export interface PageContent {
  id: string;
  pageKey: string;
  headline?: string | null;
  headlineAr?: string | null;
  subHeadline?: string | null;
  subHeadlineAr?: string | null;
  missionText?: string | null;
  missionTextAr?: string | null;
  visionText?: string | null;
  visionTextAr?: string | null;
  founderName?: string | null;
  studentsTrained?: number;
  expertInstructors?: number;
  jobPlacementRate?: number;
  heroImageUrl?: string | null;
  visionImageUrl?: string | null;
  bannerImageUrl?: string | null;
  founderImageUrl?: string | null;
  companyImageUrl?: string | null;
  missionImageUrl?: string | null;
  founderBio?: string | null;
  founderBioAr?: string | null;
  founderMessage?: string | null;
  founderMessageAr?: string | null;
  aboutCompany?: string | null;
  aboutCompanyAr?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertPageContent = Omit<PageContent, "id" | "createdAt" | "updatedAt">;

export async function getPageContent(pageKey: string): Promise<PageContent | undefined> {
  const result = await queryOne<any>(
    `SELECT id, page_key as "pageKey", headline, headline_ar as "headlineAr", sub_headline as "subHeadline", sub_headline_ar as "subHeadlineAr",
            mission_text as "missionText", mission_text_ar as "missionTextAr", vision_text as "visionText", vision_text_ar as "visionTextAr",
            students_trained as "studentsTrained", expert_instructors as "expertInstructors",
            job_placement_rate as "jobPlacementRate", hero_image_url as "heroImageUrl",
            banner_image_url as "bannerImageUrl", founder_image_url as "founderImageUrl",
            company_image_url as "companyImageUrl", mission_image_url as "missionImageUrl",
            vision_image_url as "visionImageUrl", founder_bio as "founderBio", founder_bio_ar as "founderBioAr",
            founder_message as "founderMessage", founder_message_ar as "founderMessageAr", about_company as "aboutCompany", about_company_ar as "aboutCompanyAr",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM page_content WHERE page_key = $1`,
    [pageKey]
  );
  return result || undefined;
}

export async function updatePageContent(pageKey: string, updates: Partial<InsertPageContent>) {
  const allowedKeys: string[] = [
    'headline', 'headlineAr', 'subHeadline', 'subHeadlineAr',
    'missionText', 'missionTextAr', 'visionText', 'visionTextAr', 'studentsTrained', 'expertInstructors',
    'jobPlacementRate', 'heroImageUrl', 'bannerImageUrl', 'founderImageUrl',
    'companyImageUrl', 'missionImageUrl', 'visionImageUrl', 'founderBio', 'founderBioAr',
    'founderMessage', 'founderMessageAr', 'aboutCompany', 'aboutCompanyAr', 'founderName'
  ];

  const queryData = buildUpdateQuery('page_content', allowedKeys, updates, 'page_key', pageKey);
  if (!queryData) return;

  await query(queryData.text, queryData.values);
}

// ==============================
// 📚 COURSES OPERATIONS
// ==============================

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  duration?: string | null;
  level?: string | null;
  instructor?: string | null;
  priceEgp: number;
  priceUsd: number;
  courseLink?: string | null;
  category?: string | null;
  courseType?: string | null;
  syllabus?: string | null;
  scheduleDetails?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCourse = Omit<Course, "id" | "createdAt" | "updatedAt">;

export async function getCourses(): Promise<Course[]> {
  return await queryMany<any>(
    `SELECT id, title, description, cover_image as "imageUrl", duration, level, 
            instructor, price_egp as "priceEgp", price_usd as "priceUsd",
            external_link as "courseLink", category, type as "courseType",
            syllabus, schedule_details as "scheduleDetails",
            created_at as "createdAt"
     FROM courses ORDER BY created_at DESC`
  );
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const result = await queryOne<any>(
    `SELECT id, title, description, cover_image as "imageUrl", duration, level,
            instructor, price_egp as "priceEgp", price_usd as "priceUsd",
            external_link as "courseLink", category, type as "courseType",
            syllabus, schedule_details as "scheduleDetails",
            created_at as "createdAt"
     FROM courses WHERE id = $1`,
    [id]
  );
  return result || undefined;
}

export async function createCourse(course: InsertCourse): Promise<{ id: string }> {
  const result = await queryOne<{ id: string }>(
    `INSERT INTO courses (title, description, image_url, duration, level, instructor,
                          price_egp, price_usd, course_link, category, course_type,
                          syllabus, schedule_details)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
    [course.title, course.description, course.imageUrl, course.duration, course.level,
    course.instructor, course.priceEgp, course.priceUsd, course.courseLink,
    course.category, course.courseType,
    (course as any).syllabus ?? null, (course as any).scheduleDetails ?? null]
  );
  if (!result) throw new Error('Failed to create course');
  return result;
}

export async function createCourseComplete(courseData: any, modulesData: any[]): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Create Course
    const courseRes = await client.query(
      `INSERT INTO courses (title, description, cover_image, duration, level, instructor,
                            price_egp, price_usd, external_link, category, type,
                            syllabus, schedule_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [courseData.title, courseData.description, courseData.imageUrl, courseData.duration, courseData.level,
      courseData.instructor, courseData.priceEgp, courseData.priceUsd, courseData.courseLink,
      courseData.category, courseData.courseType, courseData.syllabus, courseData.scheduleDetails]
    );
    const courseId = courseRes.rows[0].id;

    // 2. Create Modules
    for (const mod of modulesData) {
      const moduleRes = await client.query(
        `INSERT INTO modules (course_id, title, order_index)
         VALUES ($1, $2, $3) RETURNING id`,
        [courseId, mod.title, mod.orderIndex]
      );
      const moduleId = moduleRes.rows[0].id;

      // 3. Create Lessons
      for (const lesson of mod.lessons || []) {
        const lessonRes = await client.query(
          `INSERT INTO lessons (module_id, title, video_url, is_preview, order_index)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [moduleId, lesson.title, lesson.videoUrl, lesson.isPreview || false, lesson.orderIndex]
        );
        const lessonId = lessonRes.rows[0].id;

        // 3.5 Create Materials
        for (const mat of lesson.materials || []) {
          await client.query(
            `INSERT INTO materials (lesson_id, material_title, material_url) VALUES ($1, $2, $3)`,
            [lessonId, mat.title, mat.url]
          );
        }

        // 4. Create Quizzes
        for (const quiz of lesson.quizzes || []) {
          const quizRes = await client.query(
            `INSERT INTO quizzes (lesson_id, title)
             VALUES ($1, $2) RETURNING id`,
            [lessonId, quiz.title]
          );
          const quizId = quizRes.rows[0].id;

          // 5. Create Quiz Questions
          for (const q of quiz.questions || []) {
            await client.query(
              `INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer)
                  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [quizId, q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer]
            );
          }
        }
      }
    }

    await client.query('COMMIT');
    return { id: courseId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getCourseComplete(id: string) {
  const course = await getCourseById(id);
  if (!course) return null;

  const modulesRaw = await queryMany<any>(`SELECT id, title, order_index as "orderIndex" FROM modules WHERE course_id = $1 ORDER BY order_index ASC`, [id]);
  const modules = await Promise.all(modulesRaw.map(async (mod) => {
    const lessonsRaw = await queryMany<any>(`SELECT id, title, video_url as "videoUrl", is_preview as "isPreview", order_index as "orderIndex" FROM lessons WHERE module_id = $1 ORDER BY order_index ASC`, [mod.id]);
    const lessons = await Promise.all(lessonsRaw.map(async (les) => {
      const materialsRaw = await queryMany<any>(`SELECT material_title as "title", material_url as "url" FROM materials WHERE lesson_id = $1`, [les.id]);
      const quizzesRaw = await queryMany<any>(`SELECT id, title FROM quizzes WHERE lesson_id = $1`, [les.id]);
      const quizzes = await Promise.all(quizzesRaw.map(async (quiz) => {
        const questionsRaw = await queryMany<any>(`SELECT question, option_a as "optionA", option_b as "optionB", option_c as "optionC", option_d as "optionD", correct_answer as "correctAnswer" FROM quiz_questions WHERE quiz_id = $1`, [quiz.id]);
        return { ...quiz, questions: questionsRaw };
      }));
      return { ...les, materials: materialsRaw, quizzes };
    }));
    return { ...mod, lessons };
  }));

  return { info: course, modules };
}

export async function updateCourseComplete(courseId: string, courseData: any, modulesData: any[]): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE courses SET title=$1, description=$2, cover_image=$3, duration=$4, level=$5, instructor=$6,
                          price_egp=$7, price_usd=$8, external_link=$9, category=$10, type=$11,
                          syllabus=$12, schedule_details=$13, updated_at=CURRENT_TIMESTAMP
       WHERE id = $14`,
      [courseData.title, courseData.description, courseData.imageUrl, courseData.duration, courseData.level,
      courseData.instructor, courseData.priceEgp, courseData.priceUsd, courseData.courseLink,
      courseData.category, courseData.courseType, courseData.syllabus, courseData.scheduleDetails, courseId]
    );

    await client.query(`DELETE FROM modules WHERE course_id = $1`, [courseId]);

    for (const mod of modulesData) {
      const moduleRes = await client.query(
        `INSERT INTO modules (course_id, title, order_index) VALUES ($1, $2, $3) RETURNING id`,
        [courseId, mod.title, mod.orderIndex]
      );
      const moduleId = moduleRes.rows[0].id;

      for (const lesson of mod.lessons || []) {
        const lessonRes = await client.query(
          `INSERT INTO lessons (module_id, title, video_url, is_preview, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [moduleId, lesson.title, lesson.videoUrl, lesson.isPreview || false, lesson.orderIndex]
        );
        const lessonId = lessonRes.rows[0].id;

        for (const mat of lesson.materials || []) {
          await client.query(`INSERT INTO materials (lesson_id, material_title, material_url) VALUES ($1, $2, $3)`, [lessonId, mat.title, mat.url]);
        }

        for (const quiz of lesson.quizzes || []) {
          const quizRes = await client.query(`INSERT INTO quizzes (lesson_id, title) VALUES ($1, $2) RETURNING id`, [lessonId, quiz.title]);
          const quizId = quizRes.rows[0].id;

          for (const q of quiz.questions || []) {
            await client.query(
              `INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [quizId, q.question, q.optionA, q.optionB, q.optionC, q.optionD, q.correctAnswer]
            );
          }
        }
      }
    }

    await client.query('COMMIT');
    return { id: courseId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteCourse(id: string) {
  await query(`DELETE FROM courses WHERE id = $1`, [id]);
}

// ==============================
// 📖 COURSE MODULES OPERATIONS
// ==============================

export async function getCourseModules(courseId: string) {
  return await queryMany<any>(
    `SELECT id, course_id as "courseId", title, order_index as "orderIndex"
     FROM modules WHERE course_id = $1 ORDER BY order_index ASC`,
    [courseId]
  );
}

// ==============================
// 📽️ COURSE LESSONS OPERATIONS
// ==============================

export async function getCourseLessons(moduleId: string) {
  return await queryMany<any>(
    `SELECT id, module_id as "moduleId", title, video_url as "videoUrl", 
            is_preview as "isPreview", order_index as "orderIndex"
     FROM lessons WHERE module_id = $1 ORDER BY order_index ASC`,
    [moduleId]
  );
}

export async function getLessonMaterials(lessonId: string) {
  return await queryMany<any>(
    `SELECT id, lesson_id as "lessonId", material_title as "title", material_url as "url"
     FROM materials WHERE lesson_id = $1`,
    [lessonId]
  );
}

// ==============================
// 🔒 ENROLLMENTS & SESSIONS 
// ==============================

export async function getEnrollment(userId: string, courseId: string) {
  return await queryOne<any>(
    `SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
}

export async function enrollUser(userId: string, courseId: string) {
  await query(
    `INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)
     ON CONFLICT (student_id, course_id) DO NOTHING`,
    [userId, courseId]
  );
}

export async function verifyAndRegisterDeviceSession(userId: string, deviceId: string, deviceName: string): Promise<boolean> {
  const sessions = await queryMany<any>(
    `SELECT id, device_fingerprint as "deviceId" FROM device_sessions WHERE student_id = $1 ORDER BY last_active DESC`,
    [userId]
  );

  const existingSession = sessions.find(s => s.deviceId === deviceId);

  if (existingSession) {
    await query(
      `UPDATE device_sessions SET last_active = CURRENT_TIMESTAMP WHERE id = $1`,
      [existingSession.id]
    );
    return true;
  }

  if (sessions.length >= 2) {
    return false; // Denied: Already 2 devices registered
  }

  await query(
    `INSERT INTO device_sessions (student_id, device_fingerprint) VALUES ($1, $2)`,
    [userId, deviceId]
  );
  return true;
}

// ==============================
// 🧠 QUIZZES
// ==============================

export async function getCourseQuizzes(lessonId: string) {
  return await queryMany<any>(
    `SELECT id, lesson_id as "lessonId", title
     FROM quizzes WHERE lesson_id = $1`,
    [lessonId]
  );
}

export async function getQuizQuestions(quizId: string) {
  return await queryMany<any>(
    `SELECT id, quiz_id as "quizId", question, option_a as "optionA", option_b as "optionB",
            option_c as "optionC", option_d as "optionD", correct_answer as "correctAnswer"
     FROM quiz_questions WHERE quiz_id = $1`,
    [quizId]
  );
}

// Progress
export async function markLessonComplete(userId: string, lessonId: string) {
  // lesson_progress was dropped, we aren't tracking simple lesson clicks anymore unless we recreate it,
  // but let's silently accept to prevent frontend crash while we rewrite it.
  return;
}

export async function getCompletedLessons(userId: string, courseId: string) {
  return []; // Mocked out during structural refactor
}

// Admin Utilities
export async function getEnrolledStudents(courseId: string) {
  return await queryMany<any>(
    `SELECT u.id, u.name, u.email, e.created_at as "enrolledAt" 
         FROM enrollments e 
         JOIN users u ON e.student_id = u.id 
         WHERE e.course_id = $1`,
    [courseId]
  )
}

export async function clearUserDevices(userId: string) {
  await query(`DELETE FROM device_sessions WHERE student_id = $1`, [userId]);
}

export async function getAllStudents() {
  return await queryMany<any>(
    `SELECT id, name, email, created_at as "createdAt"
         FROM users WHERE role = 'student' ORDER BY created_at DESC`
  )
}

// ==============================
// 🎓 PROGRAMS OPERATIONS
// ==============================

export interface Program {
  id: string;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  imageUrl?: string | null;
  duration?: string | null;
  skills?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertProgram = Omit<Program, "id" | "createdAt" | "updatedAt">;

export async function getPrograms(): Promise<Program[]> {
  return await queryMany<any>(
    `SELECT id, title, title_ar as "titleAr", description, description_ar as "descriptionAr", 
            image_url as "imageUrl", duration, skills, category,
            created_at as "createdAt", updated_at as "updatedAt"
     FROM programs ORDER BY created_at DESC`
  );
}

export async function createProgram(program: InsertProgram) {
  await query(
    `INSERT INTO programs (title, title_ar, description, description_ar, image_url, duration, skills, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [program.title, program.titleAr, program.description, program.descriptionAr,
    program.imageUrl, program.duration, program.skills, program.category || 'other']
  );
}

export async function updateProgram(id: string, updates: Partial<InsertProgram>) {
  const allowedKeys: (keyof InsertProgram)[] = [
    'title', 'titleAr', 'description', 'descriptionAr',
    'imageUrl', 'duration', 'skills', 'category'
  ];

  const queryData = buildUpdateQuery('programs', allowedKeys, updates, 'id', id);
  if (!queryData) return;

  await query(queryData.text, queryData.values);
}

export async function deleteProgram(id: string) {
  await query(`DELETE FROM programs WHERE id = $1`, [id]);
}

// ==============================
// 📝 BLOG OPERATIONS
// ==============================

export interface BlogPost {
  id: string;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  imageUrl?: string | null;
  author?: string | null;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertBlogPost = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

export async function getBlogPosts(): Promise<BlogPost[]> {
  return await queryMany<any>(
    `SELECT id, title, content, excerpt, image_url as "imageUrl", author,
            published_at as "publishedAt", created_at as "createdAt", updated_at as "updatedAt"
     FROM blog_posts ORDER BY published_at DESC`
  );
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  const result = await queryOne<any>(
    `SELECT id, title, content, excerpt, image_url as "imageUrl", author,
            published_at as "publishedAt", created_at as "createdAt", updated_at as "updatedAt"
     FROM blog_posts WHERE id = $1`,
    [id]
  );
  return result || undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  await query(
    `INSERT INTO blog_posts (title, content, excerpt, image_url, author, published_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [post.title, post.content, post.excerpt, post.imageUrl, post.author, post.publishedAt]
  );
}

export async function updateBlogPost(id: string, updates: Partial<InsertBlogPost>) {
  const allowedKeys: (keyof InsertBlogPost)[] = [
    'title', 'content', 'excerpt', 'imageUrl', 'author', 'publishedAt'
  ];

  const queryData = buildUpdateQuery('blog_posts', allowedKeys, updates, 'id', id);
  if (!queryData) return;

  await query(queryData.text, queryData.values);
}

export async function deleteBlogPost(id: string) {
  await query(`DELETE FROM blog_posts WHERE id = $1`, [id]);
}

// ==============================
// 💼 CAREERS OPERATIONS
// ==============================

export interface Career {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  type?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCareer = Omit<Career, "id" | "createdAt" | "updatedAt">;

export async function getCareers(): Promise<Career[]> {
  return await queryMany<any>(
    `SELECT id, title, description, location, type,
            created_at as "createdAt", updated_at as "updatedAt"
     FROM careers ORDER BY created_at DESC`
  );
}

export async function createCareer(career: InsertCareer) {
  await query(
    `INSERT INTO careers (title, description, location, type)
     VALUES ($1, $2, $3, $4)`,
    [career.title, career.description, career.location, career.type]
  );
}

export async function updateCareer(id: string, updates: Partial<InsertCareer>) {
  const allowedKeys: (keyof InsertCareer)[] = [
    'title', 'description', 'location', 'type'
  ];

  const queryData = buildUpdateQuery('careers', allowedKeys, updates, 'id', id);
  if (!queryData) return;

  await query(queryData.text, queryData.values);
}

export async function deleteCareer(id: string) {
  await query(`DELETE FROM careers WHERE id = $1`, [id]);
}

// ==============================
// 📋 APPLICATIONS OPERATIONS
// ==============================

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  courseInterest?: string | null;
  message?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertApplication = Omit<Application, "id" | "createdAt" | "updatedAt">;

export async function getApplications(): Promise<Application[]> {
  return await queryMany<any>(
    `SELECT id, full_name as "fullName", email, phone, course_interest as "courseInterest",
            message, status, created_at as "createdAt", updated_at as "updatedAt"
     FROM applications ORDER BY created_at DESC`
  );
}

export async function createApplication(application: InsertApplication) {
  await query(
    `INSERT INTO applications (full_name, email, phone, course_interest, message, status)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [application.fullName, application.email, application.phone,
    application.courseInterest, application.message, application.status || 'pending']
  );
}

export async function updateApplicationStatus(id: string, status: string) {
  await query(
    `UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [status, id]
  );
}

export async function deleteApplication(id: string) {
  await query(`DELETE FROM applications WHERE id = $1`, [id]);
}

// ==============================
// 💬 MESSAGES OPERATIONS
// ==============================

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertMessage = Omit<Message, "id" | "createdAt" | "updatedAt">;

export async function getMessages(): Promise<Message[]> {
  return await queryMany<any>(
    `SELECT id, name, email, subject, message, status,
            created_at as "createdAt", updated_at as "updatedAt"
     FROM messages ORDER BY created_at DESC`
  );
}

export async function createMessage(msg: InsertMessage) {
  await query(
    `INSERT INTO messages (name, email, subject, message, status)
     VALUES ($1, $2, $3, $4, $5)`,
    [msg.name, msg.email, msg.subject, msg.message, msg.status || 'unread']
  );
}

export async function updateMessageStatus(id: string, status: string) {
  await query(
    `UPDATE messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [status, id]
  );
}

export async function deleteMessage(id: string) {
  await query(`DELETE FROM messages WHERE id = $1`, [id]);
}


// ==============================
// 💼 JOB LISTINGS OPERATIONS (Aliases for Careers)
// ==============================

// These are aliases for career functions to maintain compatibility
export const getJobListings = getCareers;
export const getAllJobListings = getCareers;
export const createJobListing = createCareer;
export const updateJobListing = updateCareer;
export const deleteJobListing = deleteCareer;

// ==============================
// 📝 STUDENT APPLICATIONS (Aliases)
// ==============================

export const getStudentApplications = getApplications;
export const createStudentApplication = createApplication;
export const deleteStudentApplication = deleteApplication;

// ==============================
// 💬 CONTACT MESSAGES (Aliases)
// ==============================

export const getContactMessages = getMessages;
export const createContactMessage = createMessage;
export const deleteContactMessage = deleteMessage;

// ==============================
// ⚙️ SITE SETTINGS
// ==============================

export async function setSiteSetting(key: string, value: string) {
  await query(
    `INSERT INTO site_settings (key, value) 
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
    [key, value]
  );
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const result = await queryOne<{ value: string }>(
    `SELECT value FROM site_settings WHERE key = $1`,
    [key]
  );
  return result?.value || null;
}
// ==============================
// ⚙️ BULK SITE SETTINGS (Add this to fix the error)
// ==============================

export async function getSiteSettings(): Promise<Record<string, string>> {
  // Get all settings
  const rows = await queryMany<{ key: string; value: string }>(
    `SELECT key, value FROM site_settings`
  );

  // Convert from array [{key: 'x', value: 'y'}] to object {x: 'y'}
  const settings: Record<string, string> = {};
  rows.forEach(row => {
    settings[row.key] = row.value;
  });

  return settings;
}

export async function updateSiteSettings(settings: Record<string, string>) {
  // Loop through the object and save each setting
  for (const [key, value] of Object.entries(settings)) {
    await setSiteSetting(key, value);
  }
  return { success: true };
}

// ==============================
// 🎓 CERTIFICATES OPERATIONS
// ==============================

export interface Certificate {
  id: string;
  certId: string;
  studentName: string;
  courseName: string;
  duration?: string | null;
  issueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCertificate = Omit<Certificate, "id" | "certId" | "createdAt" | "updatedAt">;

export async function getCertificates(): Promise<Certificate[]> {
  return await queryMany<any>(
    `SELECT id, cert_id as "certId", student_name as "studentName", 
            course_name as "courseName", duration, issue_date as "issueDate",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM certificates ORDER BY issue_date DESC`
  );
}

export async function getCertificateByCertId(certId: string): Promise<Certificate | undefined> {
  const result = await queryOne<any>(
    `SELECT id, cert_id as "certId", student_name as "studentName", 
            course_name as "courseName", duration, issue_date as "issueDate",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM certificates WHERE cert_id = $1`,
    [certId]
  );
  return result || undefined;
}

export async function createCertificate(certificate: InsertCertificate): Promise<Certificate> {
  const year = new Date().getFullYear();
  let certId = '';

  // Retry loop for race conditions
  for (let attempt = 0; attempt < 5; attempt++) {
    const result = await queryOne<any>(
      `SELECT count(*) as count FROM certificates WHERE EXTRACT(YEAR FROM created_at) = $1`,
      [year]
    );
    const count = parseInt(result?.count || '0');
    const nextNum = (count + 1).toString().padStart(4, '0');
    certId = `INF-${year}-${nextNum}`;

    try {
      const inserted = await queryOne<any>(
        `INSERT INTO certificates (cert_id, student_name, course_name, duration, issue_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, cert_id as "certId", student_name as "studentName", 
                   course_name as "courseName", duration, issue_date as "issueDate",
                   created_at as "createdAt", updated_at as "updatedAt"`,
        [certId, certificate.studentName, certificate.courseName, certificate.duration, certificate.issueDate || new Date()]
      );
      return inserted!;
    } catch (error: any) {
      if (error.code === '23505') { // Unique violation
        continue; // Try again
      }
      throw error;
    }
  }
  throw new Error("Failed to generate unique certificate ID after 5 attempts");
}

export async function deleteCertificate(id: string) {
  await query(`DELETE FROM certificates WHERE id = $1`, [id]);
}

// ==============================
// 🌟 SPONSORS OPERATIONS
// ==============================

export interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  url?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertSponsor = Omit<Sponsor, "id" | "createdAt" | "updatedAt" | "isActive"> & { isActive?: boolean };

export async function getSponsors(): Promise<Sponsor[]> {
  return await queryMany<any>(
    `SELECT id, name, logo_url as "logoUrl", url, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
     FROM sponsors ORDER BY created_at DESC`
  );
}

export async function getActiveSponsors(): Promise<Sponsor[]> {
  return await queryMany<any>(
    `SELECT id, name, logo_url as "logoUrl", url, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
     FROM sponsors WHERE is_active = true ORDER BY created_at DESC`
  );
}

export async function createSponsor(sponsor: InsertSponsor): Promise<Sponsor> {
  const result = await queryOne<any>(
    `INSERT INTO sponsors (name, logo_url, url, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, logo_url as "logoUrl", url, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`,
    [sponsor.name, sponsor.logoUrl, sponsor.url, sponsor.isActive !== undefined ? sponsor.isActive : true]
  );
  return result!;
}

export async function updateSponsor(id: number | string, data: Partial<InsertSponsor>): Promise<Sponsor> {
  const current = await queryOne<any>(`SELECT * FROM sponsors WHERE id = $1`, [id]);
  if (!current) throw new Error("Sponsor not found");

  const queryParams = [
    data.name !== undefined ? data.name : current.name,
    data.logoUrl !== undefined ? data.logoUrl : current.logo_url,
    data.url !== undefined ? data.url : current.url,
    data.isActive !== undefined ? data.isActive : current.is_active,
    id
  ];

  const result = await queryOne<any>(
    `UPDATE sponsors
     SET name = $1, logo_url = $2, url = $3, is_active = $4
     WHERE id = $5
     RETURNING id, name, logo_url as "logoUrl", url, is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"`,
    queryParams
  );

  return result!;
}

export async function deleteSponsor(id: number | string): Promise<void> {
  await query(`DELETE FROM sponsors WHERE id = $1`, [id]);
}