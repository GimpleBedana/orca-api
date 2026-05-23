import { AccountModel } from '../models/account.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/tokenUtils.js';
import { generateOTP, getOTPExpiryTime, hashOTP } from  '../utils/otpUtils.js';
import { sendOTPEmail } from '../services/emailService.js';
import blacklistedTokens from '../utils/tokenBlacklist.js';

export class AccountController {

  constructor() {
    this.accountModel = new AccountModel();
  }

  async createAccount(req, res) {
    const { email, password } = req.body;
    try{
      if (!email || !password ) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }
        const existingAccount = await this.accountModel.findByEmail(email);

      if (existingAccount.success && existingAccount.data) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
      const hashedPassword = await hashPassword(password);
      const otp = generateOTP();
      const otpExpireAt = getOTPExpiryTime();
      const hashedOTP = await hashOTP(otp);

      await this.accountModel.createAccount({ email, password: hashedPassword, auth_provider: 'LOCAL', provider_id: null, spawn_code: null, email_verified: false, otp_code: hashedOTP, otp_expires_at: otpExpireAt });
      await sendOTPEmail(email, otp);

      res.status(201).json({ success: true, message: 'Account created successfully. Please verify your email with the OTP sent.' });
    }catch(error){
          return res.status(500).json({ success: false, error: 'Failed to create account' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try{
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }
      const accountResult = await this.accountModel.findByEmail(email);

      if (!accountResult.success || !accountResult.data) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
      }

      const account = accountResult.data;
      const passwordMatch = await verifyPassword(password, account.password);

      if (!passwordMatch) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
      }

      if (!account.email_verified) {
        return res.status(403).json({ success: false, error: 'Email not verified. Please verify your email before logging in.' });
      }
      const token = generateToken({ id: account.id, username: account.username || account.email, email: account.email });
      res.status(200).json({ success: true, token });
    }catch(error){
      console.error('Login error:', error);
      return res.status(500).json({ success: false, error: error.message || 'Failed to login' });
    }
  }

  async getAccountUsernameById(req, res) {
    const { id } = req.params;
    try {
        if (!id) {
          return res.status(400).json({success: false, error: 'User id is required'});
        }

        const result = await this.accountModel.findUserById(id);

        if (!result.success) {
          return res.status(404).json({success: false, error: result.error || 'User not found' });
        }

        return res.status(200).json({success: true, username: result.data.username});

    } catch (error) {
      return res.status(500).json({success: false, error: 'Failed to fetch username'});
    }
  }

  async logout(req, res) {
    const authHeader = req.headers.authorization;
      try {
        if (!authHeader) {
          return res.status(400).json({success: false, error: 'No token provided'});
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
          return res.status(400).json({success: false, error: 'Invalid token format'});
        }

        await blacklistedTokens.add(token);

        return res.status(200).json({success: true, message: 'Logged out successfully'});

    } catch (error) {
        return res.status(500).json({success: false, error: 'Logout failed'});
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;
    try {
      const result = await this.accountModel.findUserById(userId);
      if (!result.success || !result.data) {
        return res.status(404).json({ success: false, error: result.error || 'User not found' });
      }
      return res.status(200).json({ success: true, profile: result.data });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
  }
}