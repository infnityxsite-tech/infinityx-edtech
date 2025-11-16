// server/_core/context.ts
import { verifyToken, getAdminById, type AdminUser } from "./auth";
import { parse as parseCookie } from "cookie";

export type TrpcContext = {
  req: any;
  res: any;
  user: AdminUser | null;
};

export async function createContext(opts: { req: any; res: any }): Promise<TrpcContext> {
  let user: AdminUser | null = null;

  try {
    // Get token from cookie or Authorization header
    let token: string | null = null;

    // Try to get token from cookie
    const cookieHeader = opts.req.headers?.cookie || opts.req.headers?.["cookie"];
    if (cookieHeader) {
      const cookies = parseCookie(cookieHeader);
      token = cookies.adminToken || null;
    }

    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = opts.req.headers?.authorization || opts.req.headers?.["Authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // Verify token and get user
    if (token) {
      const payload = verifyToken(token);
      if (payload && payload.userId) {
        user = await getAdminById(payload.userId);
      }
    }
  } catch (error) {
    console.error("Error creating context:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
