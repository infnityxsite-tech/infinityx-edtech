import { protectedProcedure } from "../../_core/trpc";
import { z } from "zod";
import * as db from "../../db";

export const settingsEndpoints = {
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
