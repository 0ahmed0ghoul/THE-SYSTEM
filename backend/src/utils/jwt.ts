// backend/src/utils/jwt.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string =
  process.env.JWT_SECRET || "your-super-secret-key-change-this-in-production";

const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d";

export interface TokenPayload {
  sub: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}


export const signUserToken = (
  user: { id: number; email: string; role?: string }
): string => {
  const payload: TokenPayload = {
    sub: user.id.toString(),
    email: user.email,
    role: user.role || "user",
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};


export const generateUserToken = (
  user: { id: number; email: string; role?: string }
): string => {
  const payload: TokenPayload = {
    sub: user.id.toString(),
    email: user.email,
    role: user.role || "user",
  };

  console.log("Generating token for user:", user.email);
  console.log(
    "Using JWT_SECRET:",
    JWT_SECRET ? `Secret exists (length: ${JWT_SECRET.length})` : "No secret!"
  );

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyUserToken = (token: string): TokenPayload => {
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('Token verified for user:', decoded.email);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
};

export function authMiddleware(req: Request, res: Response, next: NextFunction): void | Response {
  try {
    const authHeader = req.header("authorization") ?? req.header("Authorization") ?? "";
    
    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Auth header exists:', !!authHeader);
    console.log('Auth header starts with Bearer:', authHeader.startsWith("Bearer "));

    // Check if authorization header exists and has Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      console.log('Invalid auth format');
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid authorization format",
        code: "INVALID_AUTH_FORMAT"
      });
    }

    // Extract token
    const token = authHeader.slice(7).trim();
    console.log('Token extracted:', token ? `${token.substring(0, 30)}...` : 'empty');

    if (!token) {
      console.log('No token after Bearer prefix');
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        code: "NO_TOKEN"
      });
    }

    // Verify token
    const payload = verifyUserToken(token);

    if (!payload || !payload.sub) {
      console.log('Invalid token payload');
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token payload",
        code: "INVALID_TOKEN_PAYLOAD"
      });
    }

    // Attach user information to request
    (req as any).userId = payload.sub;
    (req as any).userEmail = payload.email;
    (req as any).user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || "user"
    };
    (req as any).token = token;

    console.log('Authentication successful for user:', payload.email);
    console.log('========================');
    
    return next();
  } catch (error: any) {
    console.error('Authentication error:', error.name, error.message);
    
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token has expired",
        code: "TOKEN_EXPIRED",
        expiredAt: error.expiredAt
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token signature",
        code: "INVALID_TOKEN_SIGNATURE"
      });
    }

    // Generic authentication error
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Authentication failed",
      code: "AUTH_FAILED"
    });
  }
}