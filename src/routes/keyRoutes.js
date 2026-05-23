import express from 'express';
import { KeyController } from '../controllers/keyController.js';
import { sensitiveLimiter } from '../middleware/rateLimiter.js';
import { authentication } from '../middleware/authentication.js';
import { authorization } from '../middleware/authorization.js';

const keyRouter = express.Router();
const keyController = new KeyController();
keyRouter.use(authorization);
keyRouter.use(authentication);

keyRouter.get('/', keyController.getArrangementByKey.bind(keyController)); //sensitiveLimiter,
keyRouter.post('/', keyController.saveArrangement.bind(keyController));

export default keyRouter;
