import { AccountModel } from '../models/account.js';
import { generateToken } from '../utils/tokenUtils.js';

export class GoogleController {

  constructor() {
    this.accountModel = new AccountModel();
  }

  async googleAuth(req, res) {
    const { email, google_id} = req.body;

    try {
      //Basic Validation
      if (!email || !google_id) {
        return res.status(400).json({ error: 'Email and Google ID are required' });
      }

      let account;
      // Main Validation
      const existingUser = await this.accountModel.findByEmail(email);

      if (existingUser.success && existingUser.data) {
        const userData = existingUser.data;

        const updateProvider = await this.accountModel.updateGoogleInfo(userData.id, google_id, 'GOOGLE');

        if (!updateProvider.success) return res.status(400).json({ error: updateProvider.error });
        account = userData;
      } else if (existingUser.success === false && existingUser.error === 'Account not found') {
        const createGoogleUser = await this.accountModel.createAccountGoogle({ email, google_id, auth_provider: 'GOOGLE' });

        if (!createGoogleUser.success) return res.status(400).json({ error: createGoogleUser.error });
        account = createGoogleUser.data;
      } else {
        return res.status(500).json({ error: existingUser.error || 'Failed to check account status' });
      }
      //Safety Validation
      if (!account) return res.status(400).json({ error: 'Google authentication failed' });

      const token = generateToken({ id: account.id, username: account.username || account.email, email: account.email });

      const { password: _, ...accountWithoutPassword } = account;

      res.json({success: true, token});
    } catch (err) {
      console.error('Google authentication error:', err);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  }
}
