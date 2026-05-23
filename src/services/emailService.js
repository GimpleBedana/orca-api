import nodemailer from 'nodemailer';

// Gmail SMTP configuration (no API key required)
export async function sendOTPEmail(email, otpCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Verify Your Email - NUMi\'s orca website',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to NUMi\'s orca website!</h2>
        <p>Thank you for signing up. To complete your registration, please verify your email address using the code below:</p>
        
        <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
        </div>
        
        <p><strong>This code will expire in 10 minutes.</strong></p>
        
        <p>If you didn't create an account with us, please ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          NUMI ORCA TEAM<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(msg);
    return true;
  } catch (error) {
    return false;
  }
}
