import bcrypt from 'bcrypt';

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const getOTPExpiryTime = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}

export const isOTPExpired = (otpExpiresAt) => {
  return new Date() > new Date(otpExpiresAt);
}

export const hashOTP = async (otpCode) => {
  const saltRounds = 10;
  return await bcrypt.hash(otpCode, saltRounds);
}

export const compareOTP = async (plainOTP, hashedOTP) => {
  return await bcrypt.compare(plainOTP, hashedOTP);
}

import crypto from 'crypto';

const pepper = process.env.SPAWN_SECRET;

export const generateSpawnCode = () => {
  return crypto.randomBytes(8).toString('hex');
}

export const hashSpawnCode = (spawnCode) => {
  return crypto
    .createHash('sha256')
    .update(spawnCode + pepper)
    .digest('hex');
}
