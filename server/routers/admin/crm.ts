import { publicProcedure, protectedProcedure } from "../../_core/trpc";
import { z } from "zod";
import * as db from "../../db";

export const crmEndpoints = {
    // ADMIN TOOLS (STUDENT MGMT)
    getEnrolledStudents: protectedProcedure
        .input(z.object({ courseId: z.string() }))
        .query(({ input }) => db.getEnrolledStudents(input.courseId)),

    clearUserDevices: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ input }) => {
            await db.clearUserDevices(input.userId);
            return { success: true };
        }),

    getUserDevices: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            return await db.getUserDevices(input.userId);
        }),

    deleteStudent: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ input }) => {
            await db.deleteStudent(input.userId);
            return { success: true };
        }),

    updateStudentCourses: protectedProcedure
        .input(z.object({ userId: z.string(), courseIds: z.array(z.string()) }))
        .mutation(async ({ input }) => {
            await db.updateStudentCourses(input.userId, input.courseIds);
            return { success: true };
        }),

    getAllStudents: protectedProcedure
        .query(() => db.getAllStudents()),

    getStudentEnrolledCourseIds: protectedProcedure
        .input(z.object({ userId: z.string() }))
        .query(({ input }) => db.getStudentEnrolledCourseIds(input.userId)),

    syncLegacyFirestoreStudent: protectedProcedure
        .input(z.object({ email: z.string(), name: z.string(), enrolledSubjectIds: z.array(z.string()) }))
        .mutation(async ({ input }) => {
            const tempOpenId = `legacy_${input.email}`;
            const result = await db.query(
                `INSERT INTO users (open_id, name, email, login_method, role) 
                 VALUES ($1, $2, $3, 'firebase_legacy', 'student')
                 ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
                 RETURNING id`,
                [tempOpenId, input.name, input.email]
            );
            
            const userId = result.rows[0].id.toString();
            
            // Only update enrollments if they had any in Firestore
            if (input.enrolledSubjectIds.length > 0) {
                await db.updateStudentCourses(userId, input.enrolledSubjectIds);
            }
            
            return { success: true, userId };
        }),

    // STUDENT APPLICATIONS
    getApplications: protectedProcedure.query(async () => {
        const result = await db.query(`
      SELECT 
        applications.*,
        courses.title as course_title,
        courses.price_egp
      FROM applications
      LEFT JOIN courses ON applications.course_id = courses.id
      ORDER BY applications.created_at DESC
    `);
        return result.rows;
    }),

    createApplication: publicProcedure
        .input(
            z.object({
                fullName: z.string(),
                email: z.string(),
                phone: z.string().optional(),
                message: z.string().optional(),
                courseId: z.string().optional(),
                type: z.string().optional().default("course"),
                cvLink: z.string().optional(),
                courseInterest: z.string().optional()
            })
        )
        .mutation(async ({ input }) => {
            let courseIdInt = null;
            if (input.courseId && input.courseId !== "" && !isNaN(parseInt(input.courseId))) {
               courseIdInt = parseInt(input.courseId);
            }

            // Using courseInterest field for position applied for or actual course name
            const interest = input.courseInterest || input.courseId;

            await db.query(
                "INSERT INTO applications (full_name, email, phone, message, course_interest, type, cv_link, created_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), 'pending')",
                [input.fullName, input.email, input.phone, input.message, interest, input.type, input.cvLink]
            );
            return { success: true };
        }),

    deleteApplication: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ ctx, input }) => {
            await db.deleteStudentApplication(input.id);
            return { success: true };
        }),

    // CONTACT MESSAGES
    getMessages: protectedProcedure.query(async ({ ctx }) => {
        return await db.getContactMessages();
    }),

    createMessage: publicProcedure
        .input(
            z.object({
                name: z.string(),
                email: z.string(),
                phone: z.string().optional(),
                subject: z.string().optional(),
                message: z.string(),
                messageType: z.string().default("contact"),
            })
        )
        .mutation(async ({ input }) => {
            return await db.createContactMessage({
                ...input,
                status: "unread"
            });
        }),

    deleteMessage: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ ctx, input }) => {
            await db.deleteContactMessage(input.id);
            return { success: true };
        }),
};
