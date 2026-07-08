import { publicProcedure, protectedProcedure } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "../../db";

export const coursesEndpoints = {
    getCourses: publicProcedure.query(() => db.getCourses()),

    getCourseById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(({ input }) => db.getCourseById(input.id)),

    createCourse: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                description: z.string().optional(),
                imageUrl: z.string().optional(),
                duration: z.string().optional(),
                level: z.string().optional(),
                instructor: z.string().optional(),
                priceEgp: z.number().default(0),
                priceUsd: z.number().default(0),
                courseLink: z.string().optional(),
                category: z.string().optional(),
                courseType: z.string().optional().default('Recorded'),
                syllabus: z.string().optional(),
                scheduleDetails: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await db.createCourse({
                ...input,
                priceEgp: String(input.priceEgp),
                priceUsd: String(input.priceUsd),
            } as any);
        }),

    createCourseComplete: protectedProcedure
        .input(
            z.object({
                info: z.any(),
                modules: z.array(z.any()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await db.createCourseComplete(
                {
                    ...input.info,
                    priceEgp: String(input.info.priceEgp || 0),
                    priceUsd: String(input.info.priceUsd || 0),
                },
                input.modules
            );
        }),

    getCourseComplete: publicProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .query(({ input }) => db.getCourseComplete(input.id)),

    updateCourseComplete: protectedProcedure
        .input(
            z.object({
                id: z.union([z.string(), z.number()]).transform(String),
                info: z.any(),
                modules: z.array(z.any()),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await db.updateCourseComplete(
                input.id,
                {
                    ...input.info,
                    priceEgp: String(input.info.priceEgp || 0),
                    priceUsd: String(input.info.priceUsd || 0),
                },
                input.modules
            );
        }),

    deleteCourse: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ ctx, input }) => {
            await db.deleteCourse(input.id);
            return { success: true };
        }),

    // ─── CONTENT LIBRARY — Reusability Endpoints ───────────────────────
    getAllModulesWithCourse: protectedProcedure
        .query(() => db.getAllModulesWithCourse()),

    getAllLessonsWithModule: protectedProcedure
        .query(() => db.getAllLessonsWithModule()),

    importModule: protectedProcedure
        .input(z.object({
            sourceModuleId: z.union([z.string(), z.number()]).transform(String),
            targetCourseId: z.union([z.string(), z.number()]).transform(String),
            orderIndex: z.number().default(0),
        }))
        .mutation(async ({ input }) => {
            return await db.deepCopyModule(input.sourceModuleId, input.targetCourseId, input.orderIndex);
        }),

    importLesson: protectedProcedure
        .input(z.object({
            sourceLessonId: z.union([z.string(), z.number()]).transform(String),
            targetModuleId: z.union([z.string(), z.number()]).transform(String),
            orderIndex: z.number().default(0),
        }))
        .mutation(async ({ input }) => {
            return await db.deepCopyLesson(input.sourceLessonId, input.targetModuleId, input.orderIndex);
        }),

    // COURSE MODULES
    getCourseModules: publicProcedure
        .input(z.object({ courseId: z.union([z.string(), z.number()]).transform(String) }))
        .query(({ input }) => db.getCourseModules(input.courseId)),

    createCourseModule: protectedProcedure
        .input(
            z.object({
                courseId: z.union([z.string(), z.number()]).transform(String),
                title: z.string(),
                orderIndex: z.number().default(0),
            })
        )
        .mutation(async ({ input }) => {
            throw new Error("Direct module creation is obsolete. Use createCourseComplete.");
        }),

    // COURSE LESSONS
    getCourseLessons: publicProcedure
        .input(z.object({ moduleId: z.union([z.string(), z.number()]).transform(String) }))
        .query(({ input }) => db.getCourseLessons(input.moduleId)),

    getLessonMaterials: publicProcedure
        .input(z.object({ lessonId: z.union([z.string(), z.number()]).transform(String) }))
        .query(({ input }) => db.getLessonMaterials(input.lessonId)),

    // QUIZZES
    getCourseQuizzes: publicProcedure
        .input(z.object({ lessonId: z.union([z.string(), z.number()]).transform(String) }))
        .query(({ input }) => db.getCourseQuizzes(input.lessonId)),

    getQuizQuestions: publicProcedure
        .input(z.object({ quizId: z.union([z.string(), z.number()]).transform(String) }))
        .query(({ input }) => db.getQuizQuestions(input.quizId)),

    // PROGRESS & TRACKING
    markLessonComplete: publicProcedure
        .input(z.object({ userId: z.string(), lessonId: z.string() }))
        .mutation(async ({ input }) => {
            await db.markLessonComplete(input.userId, input.lessonId);
            return { success: true };
        }),

    getCompletedLessons: publicProcedure
        .input(z.object({ userId: z.string(), courseId: z.string() }))
        .query(({ input }) => db.getCompletedLessons(input.userId, input.courseId)),

    // ENROLLMENTS & SESSIONS
    enrollUser: publicProcedure
        .input(z.object({ userId: z.string(), courseId: z.string() }))
        .mutation(async ({ input }) => {
            await db.enrollUser(input.userId, input.courseId);
            return { success: true };
        }),

    getEnrollment: publicProcedure
        .input(z.object({ userId: z.string(), courseId: z.string() }))
        .query(async ({ input }) => {
            return await db.getEnrollment(input.userId, input.courseId);
        }),

    getEnrolledCourses: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            const result = await db.query(
                `SELECT c.id, c.title, c.description, c.cover_image as "imageUrl", c.level, c.duration, 
                c.instructor, c.type as "courseType", e.created_at as "enrolledAt"
         FROM enrollments e 
         JOIN courses c ON e.course_id = c.id 
         WHERE e.student_id = $1 
         ORDER BY e.created_at DESC`,
                [input.userId]
            );
            return result.rows;
        }),

    verifyDeviceSession: publicProcedure
        .input(z.object({ userId: z.string(), deviceId: z.string(), deviceName: z.string() }))
        .mutation(async ({ input }) => {
            try {
                const allowed = await db.verifyAndRegisterDeviceSession(input.userId, input.deviceId, input.deviceName);
                if (!allowed) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "DEVICE_LIMIT_REACHED",
                    });
                }
                return { success: true };
            } catch (err: any) {
                // Re-throw if it's already a TRPC FORBIDDEN error (device limit)
                if (err?.code === "FORBIDDEN" || err?.message === "DEVICE_LIMIT_REACHED") {
                    throw err;
                }
                // Any other error is a server/DB issue — log it and return success
                // to avoid falsely blocking students due to DB errors
                console.error("Device verification DB error (allowing access):", err?.message || err);
                return { success: true };
            }
        }),

    // STUDENT NOTES
    getStudentNote: publicProcedure
        .input(z.object({ userId: z.string(), lessonId: z.string() }))
        .query(({ input }) => db.getStudentNote(input.userId, input.lessonId)),

    saveStudentNote: publicProcedure
        .input(z.object({ userId: z.string(), lessonId: z.string(), content: z.string() }))
        .mutation(({ input }) => db.saveStudentNote(input.userId, input.lessonId, input.content)),

    // CERTIFICATES
    getCertificates: protectedProcedure.query(() => db.getCertificates()),

    getStudentCertificates: publicProcedure
        .input(z.object({ email: z.string() }))
        .query(async ({ input }) => {
            const allCerts = await db.getCertificates();
            return allCerts.filter(c => c.studentEmail === input.email);
        }),

    getCertificateByCertId: publicProcedure
        .input(z.object({ certId: z.string() }))
        .query(({ input }) => db.getCertificateByCertId(input.certId)),

    createCertificate: protectedProcedure
        .input(
            z.object({
                studentName: z.string(),
                studentEmail: z.string().optional(),
                courseName: z.string(),
                duration: z.string().optional(),
                issueDate: z.union([z.string(), z.date()]).optional(),
            })
        )
        .mutation(async ({ input }) => {
            const issueDate = input.issueDate
                ? (typeof input.issueDate === 'string' ? new Date(input.issueDate) : input.issueDate)
                : new Date();
            return await db.createCertificate({
                studentName: input.studentName,
                studentEmail: input.studentEmail,
                courseName: input.courseName,
                duration: input.duration,
                issueDate: issueDate
            });
        }),

    deleteCertificate: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ input }) => {
            await db.deleteCertificate(input.id);
            return { success: true };
        }),

    // ─── AI AUTO-GRADING ─────────────────────────────────────────────────
    upsertAssignment: protectedProcedure
        .input(z.object({
            lessonId: z.union([z.string(), z.number()]).transform(String),
            instructions: z.string().optional(),
            rubric: z.string().optional(),
            maxScore: z.number().optional(),
            allowedFileTypes: z.string().optional(),
            maxFileSizeMb: z.number().optional(),
            maxAttempts: z.number().optional(),
            isActive: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
            const { lessonId, ...data } = input;
            return await db.upsertAssignment(lessonId, data);
        }),

    getAssignment: publicProcedure
        .input(z.object({ lessonId: z.union([z.string(), z.number()]).transform(String) }))
        .query(async ({ input }) => {
            let assignment = await db.getAssignmentByLessonId(input.lessonId);
            
            // If no explicit assignment exists, auto-create a default one 
            // so students can always upload lesson materials for AI grading
            if (!assignment) {
                assignment = await db.upsertAssignment(input.lessonId, {
                    instructions: "Please upload your assignment or relevant materials for this lesson. The AI Assistant will review and evaluate your work based on the core concepts covered in the lesson.",
                    rubric: "1. Completeness: Does the submission address all aspects of the lesson?\n2. Correctness: Are the concepts applied correctly?\n3. Clarity: Is the work clear and well-presented?",
                    maxScore: 100,
                    allowedFileTypes: ".txt,.pdf,.py,.ipynb,.csv,.docx,.doc,.jpg,.jpeg,.png",
                    maxFileSizeMb: 15,
                    maxAttempts: 10,
                    isActive: true
                });
            }
            
            return assignment;
        }),

    deleteAssignment: protectedProcedure
        .input(z.object({ lessonId: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ input }) => {
            await db.deleteAssignment(input.lessonId);
            return { success: true };
        }),

    getSubmissions: publicProcedure
        .input(z.object({
            userId: z.string(),
            assignmentId: z.number(),
        }))
        .query(async ({ input }) => {
            return await db.getSubmissionsByAssignment(input.userId, input.assignmentId);
        }),

    getSubmissionCount: publicProcedure
        .input(z.object({
            userId: z.string(),
            assignmentId: z.number(),
        }))
        .query(async ({ input }) => {
            return await db.getSubmissionCount(input.userId, input.assignmentId);
        }),
};
