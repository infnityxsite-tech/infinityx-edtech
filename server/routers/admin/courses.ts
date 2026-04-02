import { publicProcedure, protectedProcedure } from "../../_core/trpc";
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
        .input(z.object({ id: z.string() }))
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
            const allowed = await db.verifyAndRegisterDeviceSession(input.userId, input.deviceId, input.deviceName);
            if (!allowed) {
                throw new Error("Device limit reached. Maximum 2 active devices allowed.");
            }
            return { success: true };
        }),

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
};
