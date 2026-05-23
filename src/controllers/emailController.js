import { AccountModel } from '../models/account.js';
import { generateOTP, getOTPExpiryTime, isOTPExpired, hashOTP, compareOTP } from '../utils/otpUtils.js';
import { sendOTPEmail } from '../services/emailService.js';
import { generateToken } from '../utils/tokenUtils.js';

export class EmailController {

  constructor() {
    this.accountModel = new AccountModel();
  }

  async verifyOTP(req, res) {
    const { email, otp } = req.body;

    try {
      const accountResult = await this.accountModel.findByEmail(email);

      if (!accountResult.success || !accountResult.data) {
        return res.status(400).json({ error: 'Account not found' });
      }

      const account = accountResult.data;

      if (account.email_verified) {
        return res.status(400).json({ error: 'Email already verified' });
      }

      if (!account.otp_code || !account.otp_expires_at) {
        return res.status(400).json({ error: 'No OTP code found. Please request a new one.' });
      }

      if (isOTPExpired(account.otp_expires_at)) {
        return res.status(400).json({ error: 'OTP code has expired. Please request a new one.' });
      }
      const isValidOTP = await compareOTP(otp, account.otp_code);

      if (!isValidOTP) {
        return res.status(400).json({ error: 'Invalid OTP code' });
      }
      const verificationResult = await this.accountModel.verifyEmail(account.id);

      if (!verificationResult.success) {
        return res.status(500).json({ error: 'Account email is not verified' });
      }
      const token = generateToken({ id: account.id, username: account.username || account.email, email: account.email });

      res.json({token, message: 'Email verified successfully' });
    } catch (err) {
      console.error('OTP verification error:', err);
      res.status(500).json({ error: 'OTP verification failed' });
    }
  }

  async resendOTP(req, res) {
    const { email } = req.body;

    try {
      const accountResult = await this.accountModel.findByEmail(email);

      if (!accountResult.success || !accountResult.data) {
        return res.status(400).json({ error: 'Account not found' });
      }

      const account = accountResult.data;

      if (account.email_verified) {
        return res.status(400).json({ error: 'Email already verified' });
      }

      const newOTPCode = generateOTP();
      const newOTPExpiresAt = getOTPExpiryTime();
      const hashedOTP = await hashOTP(newOTPCode);

      const updateResult = await this.accountModel.updateOTP(account.id, hashedOTP, newOTPExpiresAt);

      if (!updateResult.success) {
        return res.status(500).json({ error: 'Failed to update OTP' });
      }
      const emailSent = await sendOTPEmail(email, newOTPCode);
      
      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }

      res.json({ message: 'New OTP code sent to your email' });
    } catch (err) {
      console.error('Resend OTP error:', err);
      res.status(500).json({ error: 'Failed to resend OTP' });
    }
  }
}