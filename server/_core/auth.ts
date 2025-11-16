// server/_core/auth.ts - Simple JWT Authentication System
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from './env';
import { query, queryOne } from '../database';

const JWT_SECRET = ENV.jwtSecret || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface AdminUser {
  id: number;
  username: string;
  email?: string;
  name?: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: AdminUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Authenticate admin user with username and password
 */
export async function authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
  try {
    // Get user from database
    const user = await queryOne<any>(
      `SELECT id, username, password_hash, email, name 
       FROM admin_users 
       WHERE username = $1`,
      [username]
    );

    if (!user) {
      console.log('User not found:', username);
      return null;
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      console.log('Invalid password for user:', username);
      return null;
    }

    // Update last login time
    await query(
      `UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );

    // Return user without password hash
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Get admin user by ID
 */
export async function getAdminById(userId: number): Promise<AdminUser | null> {
  try {
    const user = await queryOne<any>(
      `SELECT id, username, email, name 
       FROM admin_users 
       WHERE id = $1`,
      [userId]
    );

    return user || null;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
}

/**
 * Create a new admin user
 */
export async function createAdmin(username: string, password: string, email?: string, name?: string): Promise<AdminUser | null> {
  try {
    const passwordHash = await hashPassword(password);
    
    const result = await queryOne<any>(
      `INSERT INTO admin_users (username, password_hash, email, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, name`,
      [username, passwordHash, email, name]
    );

    return result || null;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  }
}

/**
 * Update admin password
 */
export async function updateAdminPassword(userId: number, newPassword: string): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(newPassword);
    
    await query(
      `UPDATE admin_users SET password_hash = $1 WHERE id = $2`,
      [passwordHash, userId]
    );

    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}
