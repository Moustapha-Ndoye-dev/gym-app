import rateLimit from 'express-rate-limit';

// General rate limiter for most API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Effectively disabled for testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Stricter rate limiter for login
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Effectively disabled for testing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      'Too many login attempts from this IP, please try again after an hour',
  },
});
