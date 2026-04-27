import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { authEndpoints, studentAuthEndpoints } from "./routers/auth";
import { coursesEndpoints } from "./routers/admin/courses";
import { contentEndpoints } from "./routers/admin/content";
import { crmEndpoints } from "./routers/admin/crm";
import { settingsEndpoints } from "./routers/admin/settings";
import { solutionsEndpoints } from "./routers/admin/solutions";

export const appRouter = router({
  system: systemRouter,

  // Combine all auth actions
  auth: router({
    ...authEndpoints,
  }),

  // Merge admin and public procedure spaces since they use standard logic.
  admin: router({
    ...coursesEndpoints,
    ...contentEndpoints,
    ...crmEndpoints,
    ...settingsEndpoints,
    ...studentAuthEndpoints,
    ...solutionsEndpoints,
  }),
});

export type AppRouter = typeof appRouter;