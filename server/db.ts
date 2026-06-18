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
  // Get all quizzes for this lesson, then flatten their questions
  // into the format the frontend QuizViewer expects: { question, options[], correctIndex }
  const quizzesRaw = await queryMany<any>(
    `SELECT id FROM quizzes WHERE lesson_id = $1`,
    [lessonId]
  );

  const allQuestions: any[] = [];
  for (const quiz of quizzesRaw) {
    const questions = await queryMany<any>(
      `SELECT question, option_a, option_b, option_c, option_d, correct_answer
       FROM quiz_questions WHERE quiz_id = $1`,
      [quiz.id]
    );
    for (const q of questions) {
      const options = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean);
      const answerMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, a: 0, b: 1, c: 2, d: 3 };
      const correctIndex = answerMap[q.correct_answer] ?? 0;
      allQuestions.push({ question: q.question, options, correctIndex });
    }
  }
  return allQuestions;
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
  await query(
    `INSERT INTO student_lesson_progress (user_id, lesson_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, lesson_id) DO NOTHING`,
    [userId, lessonId]
  );
}

export async function getCompletedLessons(userId: string, courseId: string) {
  // Join through lessons -> modules -> course to find completed lessons for this course
  return await queryMany<any>(
    `SELECT slp.lesson_id as "lessonId"
     FROM student_lesson_progress slp
     JOIN lessons l ON slp.lesson_id = l.id
     JOIN modules m ON l.module_id = m.id
     WHERE slp.user_id = $1 AND m.course_id = $2`,
    [userId, courseId]
  );
}

// ==============================
// 📝 STUDENT NOTES
// ==============================

export async function getStudentNote(userId: string, lessonId: string) {
  return await queryOne<any>(
    `SELECT id, content, updated_at as "updatedAt"
     FROM student_notes WHERE user_id = $1 AND lesson_id = $2`,
    [userId, lessonId]
  );
}

export async function saveStudentNote(userId: string, lessonId: string, content: string) {
  await query(
    `INSERT INTO student_notes (user_id, lesson_id, content, updated_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, lesson_id)
     DO UPDATE SET content = $3, updated_at = CURRENT_TIMESTAMP`,
    [userId, lessonId, content]
  );
  return { success: true };
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

export async function deleteStudent(userId: string) {
  await query(`DELETE FROM users WHERE id = $1`, [userId]);
}

export async function updateStudentCourses(userId: string, courseIds: string[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM enrollments WHERE student_id = $1`, [userId]);
    for (const courseId of courseIds) {
      await client.query(
        `INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)`,
        [userId, courseId]
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function getAllStudents() {
  return await queryMany<any>(
    `SELECT u.id, u.name, u.email, u.created_at as "createdAt",
            COALESCE(ec.cnt, 0)::int as "enrollmentCount"
         FROM users u
         LEFT JOIN (SELECT student_id, COUNT(*) as cnt FROM enrollments GROUP BY student_id) ec ON ec.student_id = u.id
         WHERE u.role = 'student' ORDER BY u.created_at DESC`
  )
}

export async function getStudentEnrolledCourseIds(studentId: string): Promise<string[]> {
  const rows = await queryMany<{ course_id: string }>(
    `SELECT course_id::text as course_id FROM enrollments WHERE student_id = $1`,
    [studentId]
  );
  return rows.map(r => r.course_id);
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
  priceEgp?: number;
  priceUsd?: number;
  deliveryMode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertProgram = Omit<Program, "id" | "createdAt" | "updatedAt">;

export async function getPrograms(): Promise<Program[]> {
  return await queryMany<any>(
    `SELECT id, title, title_ar as "titleAr", description, description_ar as "descriptionAr", 
            image_url as "imageUrl", duration, skills, category,
            price_egp as "priceEgp", price_usd as "priceUsd", delivery_mode as "deliveryMode",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM programs ORDER BY created_at DESC`
  );
}

export async function createProgram(program: InsertProgram) {
  const result = await queryOne<{ id: string }>(
    `INSERT INTO programs (title, title_ar, description, description_ar, image_url, duration, skills, category, price_egp, price_usd, delivery_mode)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
    [program.title, program.titleAr, program.description, program.descriptionAr,
    program.imageUrl, program.duration, program.skills, program.category || 'other',
    program.priceEgp || 0, program.priceUsd || 0, program.deliveryMode || 'Recorded']
  );
  return result;
}

export async function updateProgram(id: string, updates: Partial<InsertProgram>) {
  const allowedKeys: (keyof InsertProgram)[] = [
    'title', 'titleAr', 'description', 'descriptionAr',
    'imageUrl', 'duration', 'skills', 'category',
    'priceEgp', 'priceUsd', 'deliveryMode'
  ];

  const queryData = buildUpdateQuery('programs', allowedKeys, updates, 'id', id);
  if (!queryData) return;

  await query(queryData.text, queryData.values);
}

export async function deleteProgram(id: string) {
  await query(`DELETE FROM programs WHERE id = $1`, [id]);
}

// --- Program Complete (with Modules + Courses) ---

export async function getProgramComplete(id: string) {
  const program = await queryOne<any>(
    `SELECT id, title, title_ar as "titleAr", description, description_ar as "descriptionAr",
            image_url as "imageUrl", duration, skills, category,
            price_egp as "priceEgp", price_usd as "priceUsd", delivery_mode as "deliveryMode",
            created_at as "createdAt"
     FROM programs WHERE id = $1`, [id]
  );
  if (!program) return null;

  const modulesRaw = await queryMany<any>(
    `SELECT id, title, description, duration, image_url as "imageUrl", links, order_index as "orderIndex", delivery_mode as "deliveryMode"
     FROM program_modules WHERE program_id = $1 ORDER BY order_index ASC`, [id]
  );

  const modules = await Promise.all(modulesRaw.map(async (mod: any) => {
    const coursesRaw = await queryMany<any>(
      `SELECT pmc.id as "junctionId", pmc.course_id as "courseId", pmc.override_price_egp as "overridePriceEgp",
              pmc.override_price_usd as "overridePriceUsd", pmc.order_index as "orderIndex",
              c.title, c.description, c.cover_image as "imageUrl", c.duration, c.level, c.type as "courseType",
              c.external_link as "courseLink"
       FROM program_module_courses pmc
       JOIN courses c ON pmc.course_id = c.id
       WHERE pmc.program_module_id = $1
       ORDER BY pmc.order_index ASC`, [mod.id]
    );
    return { ...mod, courses: coursesRaw };
  }));

  return { info: program, modules };
}

export async function createProgramComplete(programData: any, modulesData: any[]): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const progRes = await client.query(
      `INSERT INTO programs (title, title_ar, description, description_ar, image_url, duration, skills, category, price_egp, price_usd, delivery_mode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [programData.title, programData.titleAr, programData.description, programData.descriptionAr,
       programData.imageUrl, programData.duration, programData.skills, programData.category || 'other',
       programData.priceEgp || 0, programData.priceUsd || 0, programData.deliveryMode || 'Recorded']
    );
    const programId = progRes.rows[0].id;

    for (const mod of modulesData) {
      const modRes = await client.query(
        `INSERT INTO program_modules (program_id, title, description, duration, image_url, links, order_index, delivery_mode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [programId, mod.title, mod.description || null, mod.duration || null, mod.imageUrl || null,
         mod.links || null, mod.orderIndex || 0, mod.deliveryMode || 'Recorded']
      );
      const moduleId = modRes.rows[0].id;

      for (const course of mod.courses || []) {
        await client.query(
          `INSERT INTO program_module_courses (program_module_id, course_id, override_price_egp, override_price_usd, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [moduleId, course.courseId, course.overridePriceEgp || null, course.overridePriceUsd || null, course.orderIndex || 0]
        );
      }
    }

    await client.query('COMMIT');
    return { id: programId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateProgramComplete(programId: string, programData: any, modulesData: any[]): Promise<{ id: string }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE programs SET title=$1, title_ar=$2, description=$3, description_ar=$4, image_url=$5,
       duration=$6, skills=$7, category=$8, price_egp=$9, price_usd=$10, delivery_mode=$11, updated_at=CURRENT_TIMESTAMP
       WHERE id = $12`,
      [programData.title, programData.titleAr, programData.description, programData.descriptionAr,
       programData.imageUrl, programData.duration, programData.skills, programData.category,
       programData.priceEgp || 0, programData.priceUsd || 0, programData.deliveryMode || 'Recorded', programId]
    );

    // Delete old modules (cascade deletes junction entries)
    await client.query(`DELETE FROM program_modules WHERE program_id = $1`, [programId]);

    for (const mod of modulesData) {
      const modRes = await client.query(
        `INSERT INTO program_modules (program_id, title, description, duration, image_url, links, order_index, delivery_mode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [programId, mod.title, mod.description || null, mod.duration || null, mod.imageUrl || null,
         mod.links || null, mod.orderIndex || 0, mod.deliveryMode || 'Recorded']
      );
      const moduleId = modRes.rows[0].id;

      for (const course of mod.courses || []) {
        await client.query(
          `INSERT INTO program_module_courses (program_module_id, course_id, override_price_egp, override_price_usd, order_index)
           VALUES ($1, $2, $3, $4, $5)`,
          [moduleId, course.courseId, course.overridePriceEgp || null, course.overridePriceUsd || null, course.orderIndex || 0]
        );
      }
    }

    await client.query('COMMIT');
    return { id: programId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
  requirements?: string | null;
  location?: string | null;
  type?: string | null;
  jobType?: string | null;
  salary?: string | null;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCareer = Omit<Career, "id" | "createdAt" | "updatedAt">;

export async function getCareers(): Promise<Career[]> {
  return await queryMany<any>(
    `SELECT id, title, description, requirements, location, type, job_type as "jobType", salary,
            created_at as "createdAt", updated_at as "updatedAt"
     FROM careers ORDER BY created_at DESC`
  );
}

export async function createCareer(career: InsertCareer) {
  await query(
    `INSERT INTO careers (title, description, requirements, location, type, job_type, salary)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [career.title, career.description, career.requirements, career.location, career.type, career.jobType, career.salary]
  );
}

export async function updateCareer(id: string, updates: Partial<InsertCareer>) {
  const allowedKeys: (keyof InsertCareer)[] = [
    'title', 'description', 'requirements', 'location', 'type', 'jobType', 'salary'
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
  type: string;
  cvLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertApplication = Omit<Application, "id" | "createdAt" | "updatedAt">;

export async function getApplications(): Promise<Application[]> {
  return await queryMany<any>(
    `SELECT id, full_name as "fullName", email, phone, course_interest as "courseInterest",
            message, status, type, cv_link as "cvLink", created_at as "createdAt", updated_at as "updatedAt"
     FROM applications ORDER BY created_at DESC`
  );
}

export async function createApplication(application: InsertApplication) {
  await query(
    `INSERT INTO applications (full_name, email, phone, course_interest, message, status, type, cv_link)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [application.fullName, application.email, application.phone,
    application.courseInterest, application.message, application.status || 'pending',
    (application as any).type || 'course', (application as any).cvLink || null]
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
  studentEmail?: string | null;
  courseName: string;
  duration?: string | null;
  issueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCertificate = Omit<Certificate, "id" | "certId" | "createdAt" | "updatedAt">;

export async function getCertificates(): Promise<Certificate[]> {
  return await queryMany<any>(
    `SELECT id, cert_id as "certId", student_name as "studentName", student_email as "studentEmail",
            course_name as "courseName", duration, issue_date as "issueDate",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM certificates ORDER BY issue_date DESC`
  );
}

export async function getCertificateByCertId(certId: string): Promise<Certificate | undefined> {
  const result = await queryOne<any>(
    `SELECT id, cert_id as "certId", student_name as "studentName", student_email as "studentEmail",
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
        `INSERT INTO certificates (cert_id, student_name, student_email, course_name, duration, issue_date)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, cert_id as "certId", student_name as "studentName", student_email as "studentEmail",
                   course_name as "courseName", duration, issue_date as "issueDate",
                   created_at as "createdAt", updated_at as "updatedAt"`,
        [certId, certificate.studentName, certificate.studentEmail || null, certificate.courseName, certificate.duration, certificate.issueDate || new Date()]
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

// ==============================
// 🚀 SERVICE PACKAGES OPERATIONS
// ==============================

export interface ServicePackage {
  id: string;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  featuresJson?: string | null;
  priceTier?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertServicePackage = Omit<ServicePackage, "id" | "createdAt" | "updatedAt">;

export async function getServicePackages(): Promise<ServicePackage[]> {
  return await queryMany<any>(
    `SELECT id, title, title_ar as "titleAr", description, description_ar as "descriptionAr",
            slug, icon, featured, show_on_homepage as "showOnHomepage", status,
            price_tier as "priceTier", hero_image_url as "heroImageUrl",
            problem_statement as "problemStatement", overview_long as "overviewLong",
            sort_order as "orderIndex",
            (status = 'active') as "isActive",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM services ORDER BY sort_order ASC, created_at DESC`
  );
}

export async function getActiveServicePackages(): Promise<ServicePackage[]> {
  return await queryMany<any>(
    `SELECT id, title, title_ar as "titleAr", description, description_ar as "descriptionAr",
            slug, icon, price_tier as "priceTier",
            sort_order as "orderIndex", true as "isActive",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM services WHERE status = 'active' ORDER BY sort_order ASC`
  );
}

export async function createServicePackage(pkg: InsertServicePackage): Promise<ServicePackage> {
  const slug = (pkg.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const result = await queryOne<any>(
    `INSERT INTO services (title, title_ar, description, description_ar, slug, price_tier, icon, status, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, title, title_ar as "titleAr", description, description_ar as "descriptionAr",
               slug, price_tier as "priceTier", icon, status,
               sort_order as "orderIndex",
               created_at as "createdAt", updated_at as "updatedAt"`,
    [pkg.title, pkg.titleAr, pkg.description, pkg.descriptionAr,
     slug, pkg.priceTier, 'Cpu',
     'active', pkg.orderIndex || 0]
  );
  return result!;
}

export async function updateServicePackage(id: string, updates: Partial<InsertServicePackage>): Promise<void> {
  const allowedKeys: string[] = [
    'title', 'titleAr', 'description', 'descriptionAr',
    'priceTier', 'icon', 'isActive', 'orderIndex', 'slug',
    'heroImageUrl', 'problemStatement', 'overviewLong'
  ];
  const queryData = buildUpdateQuery('services', allowedKeys, updates, 'id', id);
  if (!queryData) return;
  await query(queryData.text, queryData.values);
}

export async function deleteServicePackage(id: string): Promise<void> {
  // Delete related sub-tables first
  await query(`DELETE FROM service_tech_stack WHERE service_id = $1`, [id]);
  await query(`DELETE FROM service_deliverables WHERE service_id = $1`, [id]);
  await query(`DELETE FROM service_use_cases WHERE service_id = $1`, [id]);
  await query(`DELETE FROM service_pricing_models WHERE service_id = $1`, [id]);
  await query(`DELETE FROM service_gallery WHERE service_id = $1`, [id]);
  await query(`DELETE FROM service_faq WHERE service_id = $1`, [id]);
  await query(`DELETE FROM services WHERE id = $1`, [id]);
}

// ==============================
// 📊 CLIENT CASE STUDIES OPERATIONS
// ==============================

export interface ClientCaseStudy {
  id: string;
  clientName: string;
  clientNameAr?: string | null;
  industry?: string | null;
  industryAr?: string | null;
  challenge?: string | null;
  challengeAr?: string | null;
  solution?: string | null;
  solutionAr?: string | null;
  resultsJson?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertClientCaseStudy = Omit<ClientCaseStudy, "id" | "createdAt" | "updatedAt">;

export async function getClientCaseStudies(): Promise<ClientCaseStudy[]> {
  return await queryMany<any>(
    `SELECT id, client_name as "clientName", client_name_ar as "clientNameAr",
            industry, industry_ar as "industryAr", challenge, challenge_ar as "challengeAr",
            solution, solution_ar as "solutionAr", results_json as "resultsJson",
            image_url as "imageUrl", is_published as "isPublished",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM client_case_studies ORDER BY created_at DESC`
  );
}

export async function getPublishedCaseStudies(): Promise<ClientCaseStudy[]> {
  return await queryMany<any>(
    `SELECT id, client_name as "clientName", client_name_ar as "clientNameAr",
            industry, industry_ar as "industryAr", challenge, challenge_ar as "challengeAr",
            solution, solution_ar as "solutionAr", results_json as "resultsJson",
            image_url as "imageUrl", is_published as "isPublished",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM client_case_studies WHERE is_published = true ORDER BY created_at DESC`
  );
}

export async function createClientCaseStudy(cs: InsertClientCaseStudy): Promise<ClientCaseStudy> {
  const result = await queryOne<any>(
    `INSERT INTO client_case_studies (client_name, client_name_ar, industry, industry_ar, challenge, challenge_ar, solution, solution_ar, results_json, image_url, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, client_name as "clientName", client_name_ar as "clientNameAr",
               industry, industry_ar as "industryAr", challenge, challenge_ar as "challengeAr",
               solution, solution_ar as "solutionAr", results_json as "resultsJson",
               image_url as "imageUrl", is_published as "isPublished",
               created_at as "createdAt", updated_at as "updatedAt"`,
    [cs.clientName, cs.clientNameAr, cs.industry, cs.industryAr,
     cs.challenge, cs.challengeAr, cs.solution, cs.solutionAr,
     cs.resultsJson, cs.imageUrl, cs.isPublished !== undefined ? cs.isPublished : false]
  );
  return result!;
}

export async function updateClientCaseStudy(id: string, updates: Partial<InsertClientCaseStudy>): Promise<void> {
  const allowedKeys: string[] = [
    'clientName', 'clientNameAr', 'industry', 'industryAr',
    'challenge', 'challengeAr', 'solution', 'solutionAr',
    'resultsJson', 'imageUrl', 'isPublished'
  ];
  const queryData = buildUpdateQuery('client_case_studies', allowedKeys, updates, 'id', id);
  if (!queryData) return;
  await query(queryData.text, queryData.values);
}

export async function deleteClientCaseStudy(id: string): Promise<void> {
  await query(`DELETE FROM client_case_studies WHERE id = $1`, [id]);
}

// ==============================
// 🏗️ SOLUTION TIERS OPERATIONS
// ==============================

export interface SolutionTier {
  id: string;
  name: string;
  nameAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  targetAudience?: string | null;
  targetAudienceAr?: string | null;
  techStackJson?: string | null;
  priceRange?: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertSolutionTier = Omit<SolutionTier, "id" | "createdAt" | "updatedAt">;

export async function getSolutionTiers(): Promise<SolutionTier[]> {
  return await queryMany<any>(
    `SELECT id, name, name_ar as "nameAr", description, description_ar as "descriptionAr",
            target_audience as "targetAudience", target_audience_ar as "targetAudienceAr",
            tech_stack_json as "techStackJson", price_range as "priceRange",
            is_active as "isActive", order_index as "orderIndex",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM solution_tiers ORDER BY order_index ASC`
  );
}

export async function getActiveSolutionTiers(): Promise<SolutionTier[]> {
  return await queryMany<any>(
    `SELECT id, name, name_ar as "nameAr", description, description_ar as "descriptionAr",
            target_audience as "targetAudience", target_audience_ar as "targetAudienceAr",
            tech_stack_json as "techStackJson", price_range as "priceRange",
            is_active as "isActive", order_index as "orderIndex",
            created_at as "createdAt", updated_at as "updatedAt"
     FROM solution_tiers WHERE is_active = true ORDER BY order_index ASC`
  );
}

export async function createSolutionTier(tier: InsertSolutionTier): Promise<SolutionTier> {
  const result = await queryOne<any>(
    `INSERT INTO solution_tiers (name, name_ar, description, description_ar, target_audience, target_audience_ar, tech_stack_json, price_range, is_active, order_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, name, name_ar as "nameAr", description, description_ar as "descriptionAr",
               target_audience as "targetAudience", target_audience_ar as "targetAudienceAr",
               tech_stack_json as "techStackJson", price_range as "priceRange",
               is_active as "isActive", order_index as "orderIndex",
               created_at as "createdAt", updated_at as "updatedAt"`,
    [tier.name, tier.nameAr, tier.description, tier.descriptionAr,
     tier.targetAudience, tier.targetAudienceAr, tier.techStackJson,
     tier.priceRange, tier.isActive !== undefined ? tier.isActive : true, tier.orderIndex || 0]
  );
  return result!;
}

export async function updateSolutionTier(id: string, updates: Partial<InsertSolutionTier>): Promise<void> {
  const allowedKeys: string[] = [
    'name', 'nameAr', 'description', 'descriptionAr',
    'targetAudience', 'targetAudienceAr', 'techStackJson',
    'priceRange', 'isActive', 'orderIndex'
  ];
  const queryData = buildUpdateQuery('solution_tiers', allowedKeys, updates, 'id', id);
  if (!queryData) return;
  await query(queryData.text, queryData.values);
}

export async function deleteSolutionTier(id: string): Promise<void> {
  await query(`DELETE FROM solution_tiers WHERE id = $1`, [id]);
}

// ==============================
// 📞 CONSULTATION LEADS (B2B SALES FUNNEL)
// ==============================

export interface ConsultationLead {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  industryPainPoint?: string | null;
  serviceInterest?: string | null;
  status: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertConsultationLead = Omit<ConsultationLead, "id" | "createdAt" | "updatedAt">;

export async function getConsultationLeads(): Promise<ConsultationLead[]> {
  return await queryMany<any>(
    `SELECT id, name, company, email, phone,
            industry_pain_point as "industryPainPoint", service_interest as "serviceInterest",
            status, notes, created_at as "createdAt", updated_at as "updatedAt"
     FROM consultation_leads ORDER BY created_at DESC`
  );
}

export async function createConsultationLead(lead: InsertConsultationLead): Promise<ConsultationLead> {
  const result = await queryOne<any>(
    `INSERT INTO consultation_leads (name, company, email, phone, industry_pain_point, service_interest, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, name, company, email, phone,
               industry_pain_point as "industryPainPoint", service_interest as "serviceInterest",
               status, notes, created_at as "createdAt", updated_at as "updatedAt"`,
    [lead.name, lead.company, lead.email, lead.phone,
     lead.industryPainPoint, lead.serviceInterest, lead.status || 'new', lead.notes]
  );
  return result!;
}

export async function updateConsultationLeadStatus(id: string, status: string, notes?: string): Promise<void> {
  if (notes !== undefined) {
    await query(
      `UPDATE consultation_leads SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [status, notes, id]
    );
  } else {
    await query(
      `UPDATE consultation_leads SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [status, id]
    );
  }
}

export async function deleteConsultationLead(id: string): Promise<void> {
  await query(`DELETE FROM consultation_leads WHERE id = $1`, [id]);
}

// ============================================
// 🚀 HEADLESS CMS SOLUTIONS HUB (COMPOSED)
// ============================================

export async function getSolutionsHub() {
  const categoriesRes = await query(`SELECT * FROM service_categories ORDER BY order_index ASC`);
  
  const allServicesRes = await query(`
    SELECT s.*, c.name as category_name
    FROM services s
    LEFT JOIN service_categories c ON s.category_id = c.id
    WHERE s.status = 'active'
    ORDER BY s.sort_order ASC
  `);

  // Compose each service with counts and tech stack for hub display
  const serviceIds = allServicesRes.rows.map((s: any) => s.id);
  let deliverableCounts: any = {};
  let useCaseCounts: any = {};
  let techStackByService: any = {};

  if (serviceIds.length > 0) {
    const delRes = await query(`SELECT service_id, COUNT(*) as c FROM service_deliverables WHERE service_id = ANY($1) GROUP BY service_id`, [serviceIds]);
    delRes.rows.forEach((r: any) => { deliverableCounts[r.service_id] = parseInt(r.c); });

    const ucRes = await query(`SELECT service_id, COUNT(*) as c FROM service_use_cases WHERE service_id = ANY($1) GROUP BY service_id`, [serviceIds]);
    ucRes.rows.forEach((r: any) => { useCaseCounts[r.service_id] = parseInt(r.c); });

    const tsRes = await query(`SELECT service_id, name FROM service_tech_stack WHERE service_id = ANY($1) ORDER BY order_index ASC`, [serviceIds]);
    tsRes.rows.forEach((r: any) => {
      if (!techStackByService[r.service_id]) techStackByService[r.service_id] = [];
      techStackByService[r.service_id].push(r.name);
    });
  }

  const composedServices = allServicesRes.rows.map((s: any) => ({
    ...s,
    deliverableCount: deliverableCounts[s.id] || 0,
    useCaseCount: useCaseCounts[s.id] || 0,
    techStack: techStackByService[s.id] || [],
  }));

  const featuredServices = composedServices.filter((s: any) => s.featured);

  const caseStudiesRes = await query(`
    SELECT cs.*, s.title as service_title, s.slug as service_slug
    FROM client_case_studies cs
    LEFT JOIN services s ON cs.service_id = s.id
    WHERE cs.is_published = true 
    ORDER BY cs.created_at DESC LIMIT 6
  `);

  return {
    categories: categoriesRes.rows,
    featuredServices,
    allServices: composedServices,
    caseStudies: caseStudiesRes.rows
  };
}

export async function getSolutionBySlug(slug: string) {
  const serviceRes = await queryOne(`
    SELECT s.*, c.name as category_name, c.slug as category_slug
    FROM services s
    LEFT JOIN service_categories c ON s.category_id = c.id
    WHERE s.slug = $1 AND s.status = 'active'
  `, [slug]);

  if (!serviceRes) return null;

  const serviceId = serviceRes.id;

  const [blocksRes, pricingRes, useCasesRes, deliverablesRes, caseStudiesRes, techStackRes, galleryRes, faqRes, impactRes] = await Promise.all([
    query(`SELECT * FROM service_blocks WHERE service_id = $1 ORDER BY order_index ASC`, [serviceId]),
    query(`SELECT * FROM service_pricing_models WHERE service_id = $1`, [serviceId]),
    query(`SELECT * FROM service_use_cases WHERE service_id = $1`, [serviceId]),
    query(`SELECT * FROM service_deliverables WHERE service_id = $1`, [serviceId]),
    query(`SELECT * FROM client_case_studies WHERE service_id = $1 AND is_published = true`, [serviceId]),
    query(`SELECT * FROM service_tech_stack WHERE service_id = $1 ORDER BY order_index ASC`, [serviceId]),
    query(`SELECT * FROM service_gallery WHERE service_id = $1 ORDER BY order_index ASC`, [serviceId]),
    query(`SELECT * FROM service_faq WHERE service_id = $1 ORDER BY order_index ASC`, [serviceId]),
    query(`SELECT * FROM service_impact_metrics WHERE service_id = $1 ORDER BY order_index ASC`, [serviceId]),
  ]);

  return {
    ...serviceRes,
    blocks: blocksRes.rows,
    pricingModels: pricingRes.rows,
    useCases: useCasesRes.rows,
    deliverables: deliverablesRes.rows,
    relatedCaseStudies: caseStudiesRes.rows,
    techStack: techStackRes.rows,
    gallery: galleryRes.rows,
    faq: faqRes.rows,
    impactMetrics: impactRes.rows,
  };
}

// ============================================
// 🔧 CRUD for relational sub-tables
// ============================================

export async function addServiceGalleryItem(serviceId: number, imageUrl: string, caption?: string) {
  return await queryOne(`INSERT INTO service_gallery (service_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *`, [serviceId, imageUrl, caption || '']);
}
export async function deleteServiceGalleryItem(id: string) {
  await query(`DELETE FROM service_gallery WHERE id = $1`, [id]);
}

export async function addServiceFaq(serviceId: number, question: string, answer: string, questionAr?: string, answerAr?: string) {
  return await queryOne(`INSERT INTO service_faq (service_id, question, answer, question_ar, answer_ar) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [serviceId, question, answer, questionAr || '', answerAr || '']);
}
export async function deleteServiceFaq(id: string) {
  await query(`DELETE FROM service_faq WHERE id = $1`, [id]);
}

export async function addServiceTechStack(serviceId: number, name: string, category?: string) {
  return await queryOne(`INSERT INTO service_tech_stack (service_id, name, category) VALUES ($1, $2, $3) RETURNING *`, [serviceId, name, category || '']);
}
export async function deleteServiceTechStack(id: string) {
  await query(`DELETE FROM service_tech_stack WHERE id = $1`, [id]);
}

export async function addServiceDeliverable(serviceId: number, title: string, description?: string) {
  return await queryOne(`INSERT INTO service_deliverables (service_id, title, description) VALUES ($1, $2, $3) RETURNING *`, [serviceId, title, description || '']);
}
export async function deleteServiceDeliverable(id: string) {
  await query(`DELETE FROM service_deliverables WHERE id = $1`, [id]);
}

export async function addServiceUseCase(serviceId: number, title: string, description?: string) {
  return await queryOne(`INSERT INTO service_use_cases (service_id, title, description) VALUES ($1, $2, $3) RETURNING *`, [serviceId, title, description || '']);
}
export async function deleteServiceUseCase(id: string) {
  await query(`DELETE FROM service_use_cases WHERE id = $1`, [id]);
}

export async function addServicePricingModel(serviceId: number, modelType: string, startingPrice: string, description?: string, featuresJson?: string) {
  return await queryOne(`INSERT INTO service_pricing_models (service_id, model_type, starting_price, description, features_json) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [serviceId, modelType, startingPrice, description || '', featuresJson || '[]']);
}
export async function deleteServicePricingModel(id: string) {
  await query(`DELETE FROM service_pricing_models WHERE id = $1`, [id]);
}

export async function updateService(id: string, updates: any) {
  const allowedKeys = ['title','titleAr','description','descriptionAr','icon','featured','showOnHomepage','status','sortOrder','priceTier','featuresJson','heroImageUrl','problemStatement','problemStatementAr','overviewLong','overviewLongAr','slug'];
  const queryData = buildUpdateQuery('services', allowedKeys, updates, 'id', id);
  if (!queryData) return;
  await query(queryData.text, queryData.values);
}

export async function updateServicePricingModel(id: string, updates: { modelType?: string; startingPrice?: string; priceEgp?: string; description?: string; featuresJson?: string }) {
  const sets: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  if (updates.modelType !== undefined) { sets.push(`model_type = $${idx++}`); vals.push(updates.modelType); }
  if (updates.startingPrice !== undefined) { sets.push(`starting_price = $${idx++}`); vals.push(updates.startingPrice); }
  if (updates.priceEgp !== undefined) { sets.push(`price_egp = $${idx++}`); vals.push(updates.priceEgp); }
  if (updates.description !== undefined) { sets.push(`description = $${idx++}`); vals.push(updates.description); }
  if (updates.featuresJson !== undefined) { sets.push(`features_json = $${idx++}`); vals.push(updates.featuresJson); }
  if (sets.length === 0) return;
  vals.push(id);
  await query(`UPDATE service_pricing_models SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
}

export async function updateClientCaseStudyFull(id: string, updates: any) {
  const sets: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  const fields: [string, string][] = [
    ['clientName', 'client_name'], ['clientNameAr', 'client_name_ar'],
    ['industry', 'industry'], ['industryAr', 'industry_ar'],
    ['challenge', 'challenge'], ['challengeAr', 'challenge_ar'],
    ['solution', 'solution'], ['solutionAr', 'solution_ar'],
    ['outcome', 'outcome'], ['outcomeAr', 'outcome_ar'],
    ['imageUrl', 'image_url'], ['isPublished', 'is_published'],
  ];
  for (const [jsKey, dbKey] of fields) {
    if (updates[jsKey] !== undefined) { sets.push(`${dbKey} = $${idx++}`); vals.push(updates[jsKey]); }
  }
  if (sets.length === 0) return;
  vals.push(id);
  await query(`UPDATE client_case_studies SET ${sets.join(', ')} WHERE id = $${idx}`, vals);
}

// ============================================
// 📊 SERVICE IMPACT METRICS
// ============================================

export async function getServiceImpactMetrics(serviceId: number) {
  return await queryMany<any>(
    `SELECT id, service_id as "serviceId", metric_title as "metricTitle", metric_title_ar as "metricTitleAr",
            metric_value as "metricValue", metric_description as "metricDescription",
            metric_description_ar as "metricDescriptionAr", impact_category as "impactCategory", order_index as "orderIndex"
     FROM service_impact_metrics WHERE service_id = $1 ORDER BY order_index ASC`, [serviceId]
  );
}

export async function addServiceImpactMetric(serviceId: number, data: any) {
  return await queryOne(
    `INSERT INTO service_impact_metrics (service_id, metric_title, metric_title_ar, metric_value, metric_description, metric_description_ar, impact_category, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [serviceId, data.metricTitle, data.metricTitleAr || '', data.metricValue, data.metricDescription || '', data.metricDescriptionAr || '', data.impactCategory || 'efficiency', data.orderIndex || 0]
  );
}

export async function deleteServiceImpactMetric(id: string) {
  await query(`DELETE FROM service_impact_metrics WHERE id = $1`, [id]);
}

// ============================================
// 🏭 INDUSTRIES
// ============================================

export async function getIndustries() {
  return await queryMany<any>(
    `SELECT id, slug, title, title_ar as "titleAr", hero_image_url as "heroImageUrl",
            overview, overview_ar as "overviewAr", pain_points_json as "painPointsJson",
            pain_points_ar_json as "painPointsArJson", order_index as "orderIndex",
            created_at as "createdAt"
     FROM industries ORDER BY order_index ASC`
  );
}

export async function getIndustryBySlug(slug: string) {
  const industry = await queryOne<any>(
    `SELECT id, slug, title, title_ar as "titleAr", hero_image_url as "heroImageUrl",
            overview, overview_ar as "overviewAr", pain_points_json as "painPointsJson",
            pain_points_ar_json as "painPointsArJson", order_index as "orderIndex"
     FROM industries WHERE slug = $1`, [slug]
  );
  if (!industry) return null;

  const services = await queryMany<any>(
    `SELECT s.id, s.title, s.title_ar, s.slug, s.description, s.description_ar, s.icon, s.hero_image_url, s.price_tier
     FROM industry_services isv
     JOIN services s ON isv.service_id = s.id
     WHERE isv.industry_id = $1 AND s.status = 'active'
     ORDER BY s.sort_order ASC`, [industry.id]
  );

  const caseStudies = await queryMany<any>(
    `SELECT cs.* FROM client_case_studies cs
     WHERE cs.is_published = true AND cs.industry ILIKE $1
     ORDER BY cs.created_at DESC LIMIT 4`, [`%${industry.title}%`]
  );

  return { ...industry, services, caseStudies };
}

export async function createIndustry(data: any) {
  return await queryOne(
    `INSERT INTO industries (slug, title, title_ar, hero_image_url, overview, overview_ar, pain_points_json, pain_points_ar_json, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [data.slug, data.title, data.titleAr, data.heroImageUrl || null, data.overview || '', data.overviewAr || '', data.painPointsJson || '[]', data.painPointsArJson || '[]', data.orderIndex || 0]
  );
}

export async function updateIndustry(id: string, data: any) {
  const allowedKeys = ['slug','title','titleAr','heroImageUrl','overview','overviewAr','painPointsJson','painPointsArJson','orderIndex'];
  const queryData = buildUpdateQuery('industries', allowedKeys, data, 'id', id);
  if (!queryData) return;
  await query(queryData.text, queryData.values);
}

export async function deleteIndustry(id: string) {
  await query(`DELETE FROM industries WHERE id = $1`, [id]);
}

export async function mapIndustryService(industryId: number, serviceId: number) {
  await query(`INSERT INTO industry_services (industry_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [industryId, serviceId]);
}

export async function unmapIndustryService(industryId: number, serviceId: number) {
  await query(`DELETE FROM industry_services WHERE industry_id = $1 AND service_id = $2`, [industryId, serviceId]);
}

// ============================================
// 📝 ENHANCED PROPOSAL LEAD
// ============================================

export async function createProposalLead(lead: any) {
  const result = await queryOne<any>(
    `INSERT INTO consultation_leads (name, company, email, phone, industry_pain_point, service_interest, status, notes,
     selected_service_id, selected_package_type, budget_range, timeline_expectation, requires_full_ip, proposal_summary_snapshot)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING id, name, company, email, phone,
               industry_pain_point as "industryPainPoint", service_interest as "serviceInterest",
               status, notes, selected_service_id as "selectedServiceId",
               selected_package_type as "selectedPackageType", budget_range as "budgetRange",
               timeline_expectation as "timelineExpectation", requires_full_ip as "requiresFullIp",
               proposal_summary_snapshot as "proposalSummarySnapshot",
               created_at as "createdAt"`,
    [lead.name, lead.company, lead.email, lead.phone, lead.industryPainPoint, lead.serviceInterest,
     'new', lead.notes || null, lead.selectedServiceId || null, lead.selectedPackageType || null,
     lead.budgetRange || null, lead.timelineExpectation || null, lead.requiresFullIp || false,
     lead.proposalSummarySnapshot ? JSON.stringify(lead.proposalSummarySnapshot) : null]
  );
  return result!;
}

export async function getEnhancedConsultationLeads() {
  return await queryMany<any>(
    `SELECT cl.id, cl.name, cl.company, cl.email, cl.phone,
            cl.industry_pain_point as "industryPainPoint", cl.service_interest as "serviceInterest",
            cl.status, cl.notes, cl.selected_service_id as "selectedServiceId",
            cl.selected_package_type as "selectedPackageType", cl.budget_range as "budgetRange",
            cl.timeline_expectation as "timelineExpectation", cl.requires_full_ip as "requiresFullIp",
            cl.proposal_summary_snapshot as "proposalSummarySnapshot",
            cl.created_at as "createdAt", cl.updated_at as "updatedAt",
            s.title as "serviceName"
     FROM consultation_leads cl
     LEFT JOIN services s ON cl.selected_service_id = s.id
     ORDER BY cl.created_at DESC`
  );
}
