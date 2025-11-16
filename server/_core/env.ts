export const ENV = {
  appId: process.env.VITE_APP_ID ?? "infinityx",
  jwtSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT ?? "3000",
};
