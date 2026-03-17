# Job Application Tracker

A full-stack MERN app to track internship/job applications with a Kanban board.

**Tech Stack:** React + Vite · Node.js + Express · MongoDB Atlas · JWT Auth  
**Deploy:** Frontend on Vercel · Backend on Render · DB on MongoDB Atlas (all free)

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── models/         # User.js, Job.js (Mongoose schemas)
│   ├── routes/         # auth.js, jobs.js (REST API)
│   ├── middleware/     # auth.js (JWT verification)
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/ # Navbar, JobCard, JobModal
    │   ├── pages/      # Login, Register, Dashboard
    │   ├── context/    # AuthContext (JWT + user state)
    │   └── App.jsx
    ├── .env.example
    └── package.json
```

---

## Local Development Setup

### Step 1 — Clone or create the repo

```bash
# If starting fresh
mkdir job-tracker && cd job-tracker
git init
```

### Step 2 — Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
# Backend runs on http://localhost:5000
```

### Step 3 — Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env already has VITE_API_URL=http://localhost:5000/api
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Deployment Guide

### STEP 1 — Set up MongoDB Atlas (Free Database)

1. Go to https://cloud.mongodb.com and create a free account
2. Click **"Build a Database"** → choose **M0 Free** tier → select any region
3. Create a username and password (save these!)
4. Under **Network Access** → click **"Add IP Address"** → select **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Go to **Database** → click **"Connect"** → **"Drivers"** → copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add `jobtracker` at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jobtracker`
6. **Save this URI** — you'll need it in the next step

---

### STEP 2 — Deploy Backend on Render (Free)

1. Push your `backend/` folder to a GitHub repo
   ```bash
   cd backend
   git init
   git add .
   git commit -m "initial backend"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/job-tracker-backend.git
   git push -u origin main
   ```

2. Go to https://render.com → Sign up with GitHub

3. Click **"New"** → **"Web Service"**

4. Connect your GitHub repo (`job-tracker-backend`)

5. Fill in the settings:
   - **Name:** `job-tracker-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

6. Scroll to **"Environment Variables"** and add:
   ```
   MONGO_URI     = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jobtracker
   JWT_SECRET    = any_long_random_string_like_xyz123abc456
   FRONTEND_URL  = https://your-app.vercel.app   (fill this after Step 3)
   PORT          = 5000
   ```

7. Click **"Create Web Service"**

8. Wait ~2 minutes. You'll get a URL like: `https://job-tracker-api.onrender.com`
   - **Save this URL** — you need it for the frontend

> **Note:** Free Render instances sleep after 15 min of inactivity. First request after sleep takes ~30 seconds. This is fine for a portfolio project.

---

### STEP 3 — Deploy Frontend on Vercel (Free)

1. Push your `frontend/` folder to a GitHub repo
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "initial frontend"
   git remote add origin https://github.com/YOUR_USERNAME/job-tracker-frontend.git
   git push -u origin main
   ```

2. Go to https://vercel.com → Sign up with GitHub

3. Click **"Add New Project"** → Import your `job-tracker-frontend` repo

4. Vercel auto-detects Vite. Just add the environment variable:
   ```
   VITE_API_URL = https://job-tracker-api.onrender.com/api
   ```
   (Use your actual Render URL from Step 2)

5. Click **"Deploy"**

6. You'll get a URL like: `https://job-tracker.vercel.app`

7. Go back to Render → update `FRONTEND_URL` env var to this Vercel URL

---

### STEP 4 — Test your live app

1. Open your Vercel URL
2. Click Register → create an account
3. Add a few job applications
4. Verify data persists after refresh (it's in MongoDB now!)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/jobs | Yes | Get all jobs for user |
| POST | /api/jobs | Yes | Add new job |
| PUT | /api/jobs/:id | Yes | Update job |
| DELETE | /api/jobs/:id | Yes | Delete job |

Auth routes return a JWT token. Pass it as: `Authorization: Bearer <token>`

---

## Features

- JWT Authentication (register/login/logout)
- Kanban board (Applied → Interview → Offer → Rejected)
- Add, edit, delete applications
- Search by role or company
- Filter by work type (Remote / On-site / Hybrid)
- Stats dashboard (total, interviews, offers, response rate)
- Job posting link per application
- Fully responsive

---

## What to tell recruiters

- "Built a full-stack MERN app with JWT authentication and RESTful API"
- "Deployed frontend on Vercel and backend on Render with MongoDB Atlas"
- "Implemented protected routes, token-based auth, and a real-time Kanban board"
