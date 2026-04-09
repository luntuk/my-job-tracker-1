# Job Tracker

A simple job management app built with MERN stack by a student developer.

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas (free at https://www.mongodb.com/atlas)

### Setup Steps

```bash
# 1. Install dependencies
npm run setup-project

# 2. Create .env file (copy from .env.example)
cp .env.example .env

# 3. Edit .env with your MongoDB URL
# Replace: MONGO_URL=YOUR_MONGODB_URL
# Example: mongodb+srv://user:pass@cluster.mongodb.net/my-job-tracker?retryWrites=true&w=majority

# 4. Create demo user and sample jobs (optional but recommended)
node populate.js

# 5. Start development
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

---

## Demo Account

**Email:** demo@example.com  
**Password:** demo123456

Just click "Try Demo Account" on the login page!

---

## Features

User Registration & Login (JWT)  
Create, Edit, Delete Jobs  
Filter by Status, Type, Search  
Pagination  
User Profile  
Job Statistics  

---

## Project Structure

```
my-job-tracker/
├── client/              # React + Vite frontend
├── controllers/         # Express route handlers
├── models/              # MongoDB schemas
├── routes/              # API routes
├── middleware/          # Auth, validation
├── utils/               # Helpers
└── server.js            # Express entry
```

---

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/logout` - Logout

### Jobs (Protected)
- `GET /api/v1/jobs` - List jobs
- `POST /api/v1/jobs` - Create job
- `PATCH /api/v1/jobs/:id` - Update job
- `DELETE /api/v1/jobs/:id` - Delete job

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose  
**Frontend:** React, Vite, Axios, React Router  
**Auth:** JWT, bcryptjs  

---

## Environment Variables

```env
PORT=5100
NODE_ENV=development
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/my-job-tracker?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_32_chars
JWT_EXPIRES_IN=1d
```

---

## Troubleshooting

**MongoDB Connection Error?**
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Add IP address: 0.0.0.0/0 (allow anywhere)
4. Restart the app

**Port Already in Use?**
- Change `PORT` in `.env` (e.g., 5101)

**Token Invalid?**
- Clear localStorage
- Login again

---

**Made by a Daniil Dzis**
