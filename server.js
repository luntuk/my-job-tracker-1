import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import dns from 'dns';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// routers
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
// public
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route', uptime: process.uptime(), timestamp: new Date() });
});

// Demo login test route
app.post('/api/v1/auth/demo-test', (req, res) => {
  console.log('Demo test route hit with body:', req.body);
  res.json({ msg: 'demo test works', received: req.body });
});

app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Try to connect to MongoDB, but don't crash if it fails
let mongoConnected = false;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    mongoConnected = true;
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Running in DEMO MODE without database. Demo account only.');
    mongoConnected = false;
  });

app.listen(port, () => {
  console.log(`\n🚀 Server running on PORT ${port}`);
  console.log(`📊 Test route: http://localhost:${port}/api/v1/test`);
  if (!mongoConnected) {
    console.log('💡 To enable full functionality, configure MongoDB in .env');
  }
});
