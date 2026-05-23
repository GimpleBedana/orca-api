import express from 'express';
import { TopicController } from '../controllers/topicController.js';
import { sensitiveLimiter } from '../middleware/rateLimiter.js';
import { authentication }  from '../middleware/authentication.js';
import { authorization } from '../middleware/authorization.js';

const topicRouter = express.Router();
const topicController = new TopicController();
topicRouter.use(authorization);
topicRouter.use(authentication);


topicRouter.get('/', topicController.getTopics.bind(topicController));
topicRouter.post('/', topicController.createTopic.bind(topicController));
topicRouter.post('/arrange', topicController.reArrangeTopics.bind(topicController));
topicRouter.get('/generate-code', topicController.generateCode.bind(topicController)); // sensitiveLimiter,

export default topicRouter;
