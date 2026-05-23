import express from 'express';
import dotenv from 'dotenv';
import accountRoutes from './routes/accountRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import keyRoutes from './routes/keyRoutes.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';

dotenv.config({quiet: true});

const app = express();
app.use(express.json());
// app.use(globalRateLimiter);

app.use('/accounts', accountRoutes);
app.use('/topics', topicRoutes);
app.use('/api', keyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
