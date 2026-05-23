import jwt from 'jsonwebtoken';
import blacklistedTokens from '../utils/tokenBlacklist.js';

/**
 * Authentication middleware to check if the user is logged in
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next 
 */
export const authentication = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthenticated user',
    });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(403).json({success: false, message: 'Logged Out'});
}

  jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (!decoded || !decoded.id || (!decoded.username && !decoded.email)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    req.user = decoded;
    res.locals.username = decoded.username || decoded.email;
    next();
  });
}
