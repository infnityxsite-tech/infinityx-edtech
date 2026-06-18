import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "../db";
import { authenticateAdmin, generateToken } from "../_core/auth";

const COOKIE_NAME = "adminToken";

export const authEndpoints = {
    login: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const user = await authenticateAdmin(input.username, input.password);

            if (!user) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid username or password",
                });
            }

            const token = generateToken(user);

            if (ctx.res?.setHeader) {
                ctx.res.setHeader(
                    "Set-Cookie",
                    `${COOKIE_NAME}=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; SameSite=Lax${ctx.req.secure ? '; Secure' : ''}`
                );
            }

            return { success: true, token, user };
        }),

    me: publicProcedure.query(({ ctx }) => {
        return ctx.user || null;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
        if (ctx.res?.setHeader) {
            ctx.res.setHeader(
                "Set-Cookie",
                `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
            );
        }
        return { success: true };
    }),
};

export const studentAuthEndpoints = {
    studentRegister: publicProcedure
        .input(z.object({ name: z.string(), email: z.string().email(), password: z.string() }))
        .mutation(async ({ input }) => {
            // Very basic mock hashing for prototype
            const passwordHash = Buffer.from(input.password).toString('base64');
            const openId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            try {
                const result = await db.query(
                    "INSERT INTO users (open_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, 'student') RETURNING id, name, email",
                    [openId, input.name, input.email, passwordHash]
                );
                return { success: true, user: result.rows[0] };
            } catch (e: any) {
                if (e.code === '23505' || e.message?.includes('duplicate key')) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: "A student with this email already exists."
                    });
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Failed to create student account: " + e.message,
                });
            }
        }),

    studentLogin: publicProcedure
        .input(z.object({ email: z.string().email(), password: z.string() }))
        .mutation(async ({ input }) => {
            const passwordHash = Buffer.from(input.password).toString('base64');
            const result = await db.query(
                "SELECT id, name, email FROM users WHERE email = $1 AND password_hash = $2",
                [input.email, passwordHash]
            );

            if (result.rows.length === 0) {
                throw new Error("Invalid email or password");
            }
            return { success: true, token: result.rows[0].id.toString(), user: result.rows[0] };
        }),

    syncGoogleStudent: publicProcedure
        .input(z.object({ openId: z.string(), name: z.string(), email: z.string() }))
        .mutation(async ({ input }) => {
            const result = await db.query(
                `INSERT INTO users (open_id, name, email, login_method, role) 
                 VALUES ($1, $2, $3, 'google', 'student')
                 ON CONFLICT (email) DO UPDATE SET open_id = $1, name = $2, login_method = 'google'
                 RETURNING id, name, email`,
                [input.openId, input.name, input.email]
            );
            return { success: true, user: result.rows[0] };
        }),
};
