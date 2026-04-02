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
            })
        )
        .mutation(async ({ input }) => {
            const courseIdInt = (input.courseId && input.courseId !== "")
                ? parseInt(input.courseId)
                : null;

            await db.query(
                "INSERT INTO applications (full_name, email, phone, message, course_id, created_at, status) VALUES ($1, $2, $3, $4, $5, NOW(), 'pending')",
                [input.fullName, input.email, input.phone, input.message, courseIdInt]
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
