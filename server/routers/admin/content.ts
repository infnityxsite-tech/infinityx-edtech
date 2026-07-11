import { publicProcedure, protectedProcedure } from "../../_core/trpc";
import { z } from "zod";
import * as db from "../../db";

export const contentEndpoints = {
    getPageContent: publicProcedure
        .input(z.object({ pageKey: z.string() }))
        .query(({ input }) => db.getPageContent(input.pageKey)),

    updatePageContent: protectedProcedure
        .input(
            z.object({
                id: z.union([z.string(), z.number()]).optional(),
                pageKey: z.string(),
                headline: z.string().optional(),
                subHeadline: z.string().optional(),
                missionText: z.string().optional(),
                visionText: z.string().optional(),
                studentsTrained: z.number().optional(),
                expertInstructors: z.number().optional(),
                jobPlacementRate: z.number().optional(),
                heroImageUrl: z.string().optional(),
                bannerImageUrl: z.string().optional(),
                founderImageUrl: z.string().optional(),
                companyImageUrl: z.string().optional(),
                missionImageUrl: z.string().optional(),
                visionImageUrl: z.string().optional(),
                founderBio: z.string().optional(),
                founderMessage: z.string().optional(),
                aboutCompany: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, pageKey, ...data } = input;
            await db.updatePageContent(pageKey, data);
            return { success: true };
        }),

    // PROGRAMS
    getPrograms: publicProcedure.query(() => db.getPrograms()),

    getProgramComplete: publicProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .query(({ input }) => db.getProgramComplete(input.id)),

    createProgram: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                title_ar: z.string().optional(),
                description: z.string().optional(),
                description_ar: z.string().optional(),
                imageUrl: z.string().optional(),
                duration: z.string().optional(),
                skills: z.string().optional(),
                category: z.string().default("space"),
                priceEgp: z.number().default(0),
                priceUsd: z.number().default(0),
                deliveryMode: z.string().default("Recorded"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // @ts-ignore
            return await db.createProgram(input);
        }),

    createProgramComplete: protectedProcedure
        .input(z.object({ info: z.any(), modules: z.array(z.any()) }))
        .mutation(async ({ input }) => {
            return await db.createProgramComplete(input.info, input.modules);
        }),

    updateProgram: protectedProcedure
        .input(
            z.object({
                id: z.union([z.string(), z.number()]).transform(String),
                title: z.string().optional(),
                title_ar: z.string().optional(),
                description: z.string().optional(),
                description_ar: z.string().optional(),
                imageUrl: z.string().optional(),
                duration: z.string().optional(),
                skills: z.string().optional(),
                category: z.string().optional(),
                priceEgp: z.number().optional(),
                priceUsd: z.number().optional(),
                deliveryMode: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            await db.updateProgram(id, data);
            return { success: true };
        }),

    updateProgramComplete: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String), info: z.any(), modules: z.array(z.any()) }))
        .mutation(async ({ input }) => {
            return await db.updateProgramComplete(input.id, input.info, input.modules);
        }),

    deleteProgram: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ ctx, input }) => {
            await db.deleteProgram(input.id);
            return { success: true };
        }),

    // JOB LISTINGS
    getJobListings: publicProcedure.query(() => db.getJobListings()),
    getAllJobListings: protectedProcedure.query(async ({ ctx }) => {
        return await db.getAllJobListings();
    }),

    createJobListing: protectedProcedure
        .input(
            z.object({
                title: z.string(),
                location: z.string(),
                description: z.string(),
                requirements: z.string().optional(),
                jobType: z.string().optional(),
                salary: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await db.createJobListing(input);
        }),

    updateJobListing: protectedProcedure
        .input(
            z.object({
                id: z.union([z.string(), z.number()]).transform(String),
                title: z.string().optional(),
                location: z.string().optional(),
                description: z.string().optional(),
                requirements: z.string().optional(),
                jobType: z.string().optional(),
                salary: z.string().optional(),
                isActive: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            await db.updateJobListing(id, data);
            return { success: true };
        }),

    deleteJobListing: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ ctx, input }) => {
            await db.deleteJobListing(input.id);
            return { success: true };
        }),

    // BLOGS
    getBlogPosts: publicProcedure.query(() => db.getBlogPosts()),
    getBlogPostById: publicProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .query(async ({ input }) => {
            const post = await db.getBlogPostById(input.id);
            return post ?? null;
        }),
    createBlogPost: protectedProcedure
        .input(z.object({
            title: z.string(), author: z.string(), content: z.string(),
            excerpt: z.string().nullable().optional().transform(e => e === null ? "" : e), imageUrl: z.string().optional(),
            publishedAt: z.date().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return await db.createBlogPost({ ...input, publishedAt: input.publishedAt || new Date() });
        }),
    updateBlogPost: protectedProcedure.input(z.object({
        id: z.union([z.string(), z.number()]).transform(String),
        title: z.string().optional(), author: z.string().optional(),
        content: z.string().optional(), excerpt: z.string().nullable().optional().transform(e => e === null ? "" : e),
        imageUrl: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const { id, ...data } = input; await db.updateBlogPost(id, data); return { success: true };
    }),
    deleteBlogPost: protectedProcedure.input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ ctx, input }) => { await db.deleteBlogPost(input.id); return { success: true }; }),

    // SPONSORS
    getSponsors: protectedProcedure.query(() => db.getSponsors()),

    getActiveSponsors: publicProcedure.query(() => db.getActiveSponsors()),

    createSponsor: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                logoUrl: z.string(),
                url: z.string().optional(),
                isActive: z.boolean().optional(),
            })
        )
        .mutation(async ({ input }) => {
            return await db.createSponsor(input);
        }),

    updateSponsor: protectedProcedure
        .input(
            z.object({
                id: z.union([z.string(), z.number()]).transform(String),
                name: z.string().optional(),
                logoUrl: z.string().optional(),
                url: z.string().optional(),
                isActive: z.boolean().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const { id, ...data } = input;
            return await db.updateSponsor(id, data);
        }),

    deleteSponsor: protectedProcedure
        .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
        .mutation(async ({ input }) => {
            await db.deleteSponsor(input.id);
            return { success: true };
        }),
};
