import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.API_SECRET_KEY || 'fallback_secret_key', {expiresIn: '24h'});
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.API_SECRET_KEY);
};

