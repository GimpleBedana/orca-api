import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({windowMs: 15 * 60 * 1000, max: 50,
  message: {error: 'Too many requests, please try again later.'}, standardHeaders: true, legacyHeaders: false
});

export const sensitiveLimiter = rateLimit({windowMs: 5 * 60 * 1000, max: 20,
  message: {error: 'Too many attempts. Please slow down.'}, standardHeaders: true, legacyHeaders: false
});