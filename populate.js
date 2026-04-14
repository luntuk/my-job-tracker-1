import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Job from './models/JobModel.js';
import User from './models/UserModel.js';
import { hashPassword } from './utils/passwordUtils.js';

try {
  await mongoose.connect(process.env.MONGO_URL);
  
  // Create or get demo user
  let user = await User.findOne({ email: 'demo@example.com' });
  if (!user) {
    const hashedPassword = await hashPassword('demo123456');
    user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      lastName: 'Student',
      location: 'Demo City',
      role: 'user'
    });
    console.log('Demo user created!');
  }
  
  const jsonJobs = JSON.parse(
    await readFile(new URL('./utils/mockData.json', import.meta.url))
  );
  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
  });
  await Job.deleteMany({ createdBy: user._id });
  await Job.create(jobs);
  console.log('Success!!! Demo user jobs populated.');
  console.log('Login with: demo@example.com / demo123456');
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
