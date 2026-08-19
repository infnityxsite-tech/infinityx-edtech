import type { NextFunction, Request, Response } from "express";
import { parse as parseCookie } from "cookie";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { queryOne } from "../database";
import { getAdminById, verifyToken, type AdminUser } from "./auth";

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export type AuthenticatedStudent = {
  id: string;
  openId: string;
  email: string | null;
};

function bearerToken(req: Request): string | null {
  const authorization = req.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : null;
}

export async function getAdminFromRequest(req: Request): Promise<AdminUser | null> {
  let token = bearerToken(req);
  if (!token) {
    const cookieHeader = req.get("cookie");
    if (cookieHeader) token = parseCookie(cookieHeader).adminToken || null;
  }
  if (!token) return null;

  const payload = verifyToken(token);
  return payload?.userId ? getAdminById(payload.userId) : null;
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) return res.status(401).json({ error: "Admin authentication required" });
    res.locals.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ error: "Admin authentication required" });
  }
}

export async function getStudentFromRequest(req: Request): Promise<AuthenticatedStudent | null> {
  const token = bearerToken(req);
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!token || !projectId) return null;

  const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
    algorithms: ["RS256"],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  });

  const openId = payload.sub;
  const email = typeof payload.email === "string" ? payload.email : null;
  if (!openId) return null;

  const student = await queryOne<AuthenticatedStudent>(
    `SELECT id::text, open_id as "openId", email
       FROM users
      WHERE open_id = $1 OR ($2::text IS NOT NULL AND email = $2)
      ORDER BY CASE WHEN open_id = $1 THEN 0 ELSE 1 END
      LIMIT 1`,
    [openId, email]
  );

  return student || null;
}

export async function requireStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await getStudentFromRequest(req);
    if (!student) return res.status(401).json({ error: "Student authentication required" });
    res.locals.student = student;
    return next();
  } catch {
    return res.status(401).json({ error: "Student authentication required" });
  }
}

