// backend/src/middleware/auth.ts
import type { NextFunction, Request, Response } from "express";
import { verifyUserToken } from "../utils/jwt.js";

// Extend Express Request type to include user properties
declare global {
  namespace Express {
    interface Request {
      userId?: string | number;
      userEmail?: string;
      user?: {
        id: string | number;
        email: string;
        role?: string;
        [key: string]: any;
      };
      token?: string;
    }
  }
}

interface TokenPayload {
  sub: string | number;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Main authentication middleware
 * Verifies JWT token from Authorization header
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void | Response {
  try {
    const authHeader = req.header("authorization") ?? req.header("Authorization") ?? "";

    // Check if authorization header exists and has Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid authorization format",
        code: "INVALID_AUTH_FORMAT"
      });
    }

    // Extract token
    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        code: "NO_TOKEN"
      });
    }

    // Verify token
    const payload = verifyUserToken(token) as TokenPayload;

    if (!payload || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token payload",
        code: "INVALID_TOKEN_PAYLOAD"
      });
    }

    // Attach user information to request
    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || "user"
    };
    req.token = token;

    return next();
  } catch (error: any) {
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

/**
 * Optional authentication middleware
 * Doesn't fail if no token, but attaches user if present
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.header("authorization") ?? req.header("Authorization") ?? "";

    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      
      if (token) {
        try {
          const payload = verifyUserToken(token) as TokenPayload;
          
          if (payload && payload.sub) {
            req.userId = payload.sub;
            req.userEmail = payload.email;
            req.user = {
              id: payload.sub,
              email: payload.email,
              role: payload.role || "user"
            };
            req.token = token;
          }
        } catch (error) {
          // Token invalid but we don't fail, just continue without user
          console.debug("Optional auth: Invalid token provided");
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
}

/**
 * Role-based authorization middleware
 * @param allowedRoles - Array of roles allowed to access the route
 */
export function authorize(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    if (!allowedRoles.includes(req.user.role || "user")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
}

/**
 * Resource ownership middleware
 * @param getResourceUserId - Function that returns the user ID of the resource owner
 */
export function ownsResource(
  getResourceUserId: (req: Request) => Promise<string | number | null>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    try {
      const resourceOwnerId = await getResourceUserId(req);
      
      if (!resourceOwnerId) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
          code: "RESOURCE_NOT_FOUND"
        });
      }

      // Admin users can access any resource
      if (req.user.role === "admin" || req.user.role === "super_admin") {
        return next();
      }

      // Check if user owns the resource
      if (String(req.user.id) !== String(resourceOwnerId)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not own this resource",
          code: "ACCESS_DENIED"
        });
      }

      next();
    } catch (error) {
      console.error("Resource ownership check error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to verify resource ownership",
        code: "OWNERSHIP_ERROR"
      });
    }
  };
}

/**
 * Rate limiting middleware for authentication attempts
 */
export function authRateLimiter() {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;
    
    const attempt = attempts.get(ip);
    
    if (attempt) {
      if (now > attempt.resetTime) {
        // Reset if window has passed
        attempts.set(ip, { count: 1, resetTime: now + windowMs });
        return next();
      }
      
      if (attempt.count >= maxAttempts) {
        const waitTime = Math.ceil((attempt.resetTime - now) / 1000 / 60);
        return res.status(429).json({
          success: false,
          message: `Too many login attempts. Please try again in ${waitTime} minutes.`,
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: attempt.resetTime - now
        });
      }
      
      attempt.count++;
      attempts.set(ip, attempt);
    } else {
      attempts.set(ip, { count: 1, resetTime: now + windowMs });
    }
    
    next();
  };
}

/**
 * API Key authentication middleware
 * For service-to-service communication
 */
export function apiKeyAuthMiddleware(req: Request, res: Response, next: NextFunction): void | Response {
  try {
    const apiKey = req.header("x-api-key") || req.header("X-API-Key");
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: API key required",
        code: "API_KEY_REQUIRED"
      });
    }
    
    // Verify API key (implement your API key validation logic)
    const isValidApiKey = verifyApiKey(apiKey);
    
    if (!isValidApiKey) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid API key",
        code: "INVALID_API_KEY"
      });
    }
    
    // Attach service info to request if needed
    req.user = {
      id: "api-service",
      email: "api@service.com",
      role: "service"
    };
    
    next();
  } catch (error) {
    console.error("API key auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      code: "AUTH_ERROR"
    });
  }
}

// Helper function to verify API key (implement based on your needs)
function verifyApiKey(apiKey: string): boolean {
  // Get valid API keys from environment or database
  const validApiKeys = process.env.API_KEYS?.split(",") || [];
  return validApiKeys.includes(apiKey);
}

// Export all middleware as a combined object for convenience
export default {
  authMiddleware,
  optionalAuthMiddleware,
  authorize,
  ownsResource,
  authRateLimiter,
  apiKeyAuthMiddleware
};