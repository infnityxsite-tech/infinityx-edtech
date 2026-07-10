import { publicProcedure, protectedProcedure } from "../../_core/trpc";
import { z } from "zod";
import * as db from "../../db";

export const settingsEndpoints = {
    getSiteDefaults: publicProcedure.query(async () => {
        const settings = await db.getSiteSettings();
        return {
            defaultLanguage: settings.default_language || 'en',
            defaultTheme: settings.default_theme || 'light',
        };
    }),

    getSiteSettings: protectedProcedure.query(async ({ ctx }) => {
        return await db.getSiteSettings();
    }),

    updateSiteSettings: protectedProcedure
        .input(z.object({
            settings: z.record(z.string(), z.string())
        }))
        .mutation(async ({ input }) => {
            return await db.updateSiteSettings(input.settings as Record<string, string>);
        }),
};
