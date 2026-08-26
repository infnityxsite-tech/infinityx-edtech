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
    if (cookieHeader && typeof cookieHeader === 'string') {
      try {
        const cookies = parseCookie(cookieHeader);
        token = cookies.adminToken || null;
      } catch (cookieError) {
        console.error("Error parsing cookie:", cookieError);
      }
    }

    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = opts.req.headers?.authorization || opts.req.headers?.["Authorization"];
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // Verify token and get user
    if (token) {
      try {
        const payload = verifyToken(token);
        if (payload && payload.userId) {
          const dbUser = await getAdminById(payload.userId);

          if (dbUser) {
            // Invalidate if username does not match (e.g. username changed from admin)
            const usernameMatches = !payload.username || payload.username === dbUser.username;

            // Invalidate if token was issued before the admin record was last updated
            let isTokenFresh = true;
            if (payload.iat && dbUser.updatedAt) {
              const updatedAtSeconds = Math.floor(new Date(dbUser.updatedAt).getTime() / 1000);
              // Give 2 seconds tolerance for minor clock skew
              if (updatedAtSeconds > (payload.iat + 2)) {
                isTokenFresh = false;
              }
            }

            if (usernameMatches && isTokenFresh) {
              user = dbUser;
            } else {
              console.log(`Stale/invalidated token rejected for admin user: ${payload.username}`);
              user = null;
            }
          }
        }
      } catch (tokenError) {
        // Token is invalid or expired - this is normal, just set user to null
        console.log("Token verification failed (user not authenticated)");
        user = null;
      }
    }
  } catch (error) {
    // Log error but don't throw - return null user instead
    console.error("Error creating context:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
