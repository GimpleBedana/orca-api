import { Router } from 'express';
import { AccountController } from '../controllers/accountController.js';
import { GoogleController } from '../controllers/googleController.js';
import { EmailController } from '../controllers/emailController.js';
import { validateAccount } from '../middleware/validateAccount.js';
import { authentication } from '../middleware/authentication.js';
import { authorization } from '../middleware/authorization.js';
import { sensitiveLimiter } from '../middleware/rateLimiter.js';


const accountRouter = Router();
const accountController = new AccountController();
const googleController = new GoogleController();
const emailController = new EmailController();
accountRouter.use(authorization);

accountRouter.post('/sign-up', validateAccount, sensitiveLimiter, accountController.createAccount.bind(accountController));
accountRouter.post('/login', sensitiveLimiter, accountController.login.bind(accountController));
accountRouter.post('/google-auth', googleController.googleAuth.bind(googleController));
accountRouter.post('/verify-otp', sensitiveLimiter, emailController.verifyOTP.bind(emailController));
accountRouter.post('/resend-otp', sensitiveLimiter, emailController.resendOTP.bind(emailController));

accountRouter.get('/profile', authentication, accountController.getProfile.bind(accountController));
accountRouter.get('/:id', authentication, accountController.getAccountUsernameById.bind(accountController));
accountRouter.post('/logout', authentication, accountController.logout.bind(accountController));

export default accountRouter;
