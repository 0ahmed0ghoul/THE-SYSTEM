// backend/src/routes/debug.routes.ts
import { Router } from 'express';
import { generateUserToken, verifyUserToken } from '../utils/jwt.js';

const router = Router();

router.get('/test-jwt', (req, res) => {
  try {
    const testUser = {
      id: 1,
      email: 'test@example.com',
      role: 'user'
    };
    
    // Generate token
    const token = generateUserToken(testUser);
    
    // Verify token
    const verified = verifyUserToken(token);
    
    res.json({
      success: true,
      token,
      verified,
      jwtSecretExists: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token required'
      });
    }
    
    const verified = verifyUserToken(token);
    
    res.json({
      success: true,
      verified
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message,
      name: error.name
    });
  }
});

export default router;