# ⚡ EduNavigator — AI-Powered Student Career Portal

> A full-stack MERN application that combines community features, AI-driven career tools, role-based administration, and a real-time AI interview simulator into a single cohesive platform.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Features](#features)
5. [Role-Based Access Control](#role-based-access-control)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Database Models](#database-models)
9. [API Reference](#api-reference)
10. [Frontend Pages](#frontend-pages)
11. [AI Resume Analyzer](#ai-resume-analyzer)
12. [AI Interview Simulator](#ai-interview-simulator)
13. [Email Notification System](#email-notification-system)
14. [Seeding the Superadmin](#seeding-the-superadmin)
15. [Design System](#design-system)
16. [Deployment Notes](#deployment-notes)

---

## Project Overview

**EduNavigator** is a next-generation academic career platform designed for students, administrators, and institutions. It provides:

- A **community hub** (forums, clubs, events)
- A **career center** (job board, AI job matching, AI resume scanner)
- An **AI interview simulator** with real-time feedback and scoring
- A **role-based admin system** with superadmin oversight
- **Email notifications** to students when jobs are posted

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Vanilla CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Real-time | Socket.IO |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| File Upload | Multer |
| PDF Parsing | pdfjs-dist |
| Email | Nodemailer (SMTP) |
| Fonts | Google Fonts — Orbitron, Inter, Share Tech Mono |

---

## Folder Structure

```
Portal/
└── Student-Portal/
    ├── Student-portal-BE-main/          # Backend (Node.js + Express)
    │   ├── models/                       # Mongoose schemas
    │   │   ├── Student.js               # User model (student/admin/superadmin)
    │   │   ├── JobBoard.js              # Job postings
    │   │   ├── JobApplication.js        # Job applications
    │   │   ├── InterviewSession.js      # AI interview sessions
    │   │   ├── Forum.js                 # Forum posts
    │   │   ├── Club.js                  # Student clubs
    │   │   ├── Event.js                 # Campus events
    │   │   └── Notification.js          # In-app notifications
    │   ├── routes/                       # Express route handlers
    │   │   ├── authRoutes.js            # Register, login, admin management
    │   │   ├── JobBoardRoutes.js        # Jobs CRUD + applications
    │   │   ├── interviewRoutes.js       # Interview session API
    │   │   ├── resumeRoutes.js          # Resume upload & analysis
    │   │   ├── recommendationRoutes.js  # AI job matching
    │   │   ├── ForumRoutes.js           # Forum posts
    │   │   ├── ClubRoutes.js            # Clubs
    │   │   ├── EventRoutes.js           # Events
    │   │   └── notificationRoutes.js    # Notifications
    │   ├── middleware/
    │   │   └── auth.js                  # JWT verification + role guard
    │   ├── services/
    │   │   ├── resumeAnalyzer.js        # PDF text extraction + NLP analysis
    │   │   ├── interviewEngine.js       # Question bank + answer evaluator
    │   │   └── emailService.js          # Nodemailer email templates
    │   ├── scripts/
    │   │   └── seedSuperAdmin.js        # One-time superadmin account seeder
    │   ├── socket.js                    # Socket.IO initialisation
    │   ├── server.js                    # Express app entry point
    │   └── .env                         # Environment variables
    │
    └── Student-portal-FE-main/          # Frontend (React + Vite)
        ├── src/
        │   ├── api/
        │   │   └── axiosInstance.js     # Axios with base URL + auth header
        │   ├── context/
        │   │   ├── AuthContext.jsx      # Global auth state
        │   │   └── SocketContext.jsx    # Socket.IO context
        │   ├── components/
        │   │   ├── ProtectedRoute.jsx   # Auth-gated route wrapper
        │   │   └── NotificationBell.jsx # Real-time notification bell
        │   ├── pages/
        │   │   ├── Home.jsx             # Landing page
        │   │   ├── Login.jsx            # Login form
        │   │   ├── Register.jsx         # Register (student / admin)
        │   │   ├── Forum.jsx            # Forum listing
        │   │   ├── NewPost.jsx          # Create forum post (admin only)
        │   │   ├── Clubs.jsx            # Clubs listing
        │   │   ├── NewClub.jsx          # Create club (admin only)
        │   │   ├── Events.jsx           # Events listing
        │   │   ├── NewEvent.jsx         # Create event (admin only)
        │   │   ├── JobBoard.jsx         # Job board (apply / manage)
        │   │   ├── NewJobBoard.jsx      # Post a job (admin only)
        │   │   ├── AdminApplications.jsx# View job applicants (admin)
        │   │   ├── MyApplications.jsx   # Student's own applications
        │   │   ├── Recommendations.jsx  # AI job match with resume
        │   │   ├── ResumeChecker.jsx    # Resume upload + AI analysis
        │   │   ├── InterviewSimulator.jsx # AI interview chat UI
        │   │   ├── InterviewDashboard.jsx # Interview history + scores
        │   │   ├── SuperAdminPanel.jsx  # Approve/reject admin accounts
        │   │   └── studentDashboard.jsx # Personal student dashboard
        │   ├── App.jsx                  # Routes + burger sidebar navigation
        │   ├── App.css                  # Global reset + animations
        │   └── index.css                # Design system (CSS variables + utilities)
        └── index.html
```

---

## Features

### 🌐 Community
| Feature | Description |
|---|---|
| **Forum** | Post and browse community discussions. Admins create posts; students view. |
| **Clubs** | Discover student organisations. Admins manage; students browse. |
| **Events** | View campus workshops and events. Admins create; students can register. |

### 💼 Career Center
| Feature | Description |
|---|---|
| **Job Board** | Browse job listings with search and type filter. Students apply; admins manage. |
| **AI Job Match** | Upload resume → AI matches your skills to available jobs with a % score |
| **AI Resume Scanner** | NLP-based resume analysis: ATS score, skill extraction, gap detection, improvement tips |

### 🎤 AI Interview Simulator *(new)*
| Feature | Description |
|---|---|
| **Setup** | Start by entering skills or uploading resume PDF — AI personalises questions |
| **Chat UI** | Real-time chat with AI interviewer; one question at a time |
| **Answer Evaluation** | Keyword-matching + depth scoring (0–10 per answer) |
| **Per-answer Feedback** | Strengths, weaknesses, and a targeted improvement tip |
| **Final Score** | Overall (0–100), Technical, Communication, Confidence breakdown |
| **History** | Browse all past sessions, expand to see Q&A detail |

### 🔔 Notifications
- In-app real-time notifications via Socket.IO when a job is posted
- Email notifications to all registered students when an admin posts a job *(requires SMTP config)*
- Email interview result summary sent to student on session completion *(requires SMTP config)*

---

## Role-Based Access Control

EduNavigator has **three roles** with strictly separated permissions:

| Action | Student | Admin | Superadmin |
|---|:---:|:---:|:---:|
| View forum / clubs / events | ✅ | ✅ | ✅ |
| Apply for jobs | ✅ | ❌ | ❌ |
| Create forum posts | ❌ | ✅ | ✅ |
| Create clubs / events | ❌ | ✅ | ✅ |
| Post jobs | ❌ | ✅ | ✅ |
| Delete jobs / posts | ❌ | ✅ | ✅ |
| View job applicants | ❌ | ✅ | ✅ |
| Use AI Resume Scanner | ✅ | ✅ | ✅ |
| Use AI Interviewer | ✅ | ✅ | ✅ |
| Approve / reject admins | ❌ | ❌ | ✅ |

### Admin Approval Workflow

```
Student registers as "Admin"
        ↓
Account created with status = "pending"
        ↓
Admin is BLOCKED from logging in
        ↓
Superadmin logs in → sees pending admin in panel
        ↓
Superadmin clicks "Approve"
        ↓
Admin status = "active" → can now log in
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone / extract the project

```bash
# The project lives at:
C:\Portal\Student-Portal\
```

### 2. Backend setup

```bash
cd Student-portal-BE-main
npm install
```

Create `.env` (see [Environment Variables](#environment-variables)).

Seed the superadmin account (run **once**):

```bash
node scripts/seedSuperAdmin.js
```

Start the backend:

```bash
npm run dev        # Development (nodemon)
# Server runs at http://localhost:5500
```

### 3. Frontend setup

```bash
cd Student-portal-FE-main
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## Environment Variables

**File:** `Student-portal-BE-main/.env`

```env
# ── Core ─────────────────────────────────────────────────────────────────────
PORT=5500
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.imbwgrv.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:5173

# ── Email Notifications (optional) ───────────────────────────────────────────
# Leave commented out to disable email — portal works without it.
# For Gmail: enable App Passwords at https://myaccount.google.com/apppasswords
#
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your.email@gmail.com
# EMAIL_PASS=your-16-char-app-password
# EMAIL_FROM=EduNavigator <your.email@gmail.com>
```

> **Note:** If email variables are absent, job-posting and interview-result emails are silently skipped. The rest of the platform is unaffected.

---

## Database Models

### `Student`
```js
{
  name:       String,
  email:      String (unique),
  password:   String (bcrypt hashed),
  department: String,
  role:       "student" | "admin" | "superadmin",
  status:     "active" | "pending" | "rejected",
  createdAt:  Date
}
```

### `JobBoard`
```js
{
  role:        String,   // job title
  company:     String,
  location:    String,
  contact:     String,
  description: String,
  skills:      [String],
  type:        "Full-time" | "Internship" | "Part-time" | "Contract",
  createdAt:   Date
}
```

### `JobApplication`
```js
{
  jobId:      ObjectId → JobBoard,
  studentId:  ObjectId → Student,
  coverNote:  String,
  status:     "pending" | "accepted" | "rejected",
  appliedAt:  Date
}
```

### `InterviewSession`
```js
{
  studentId:      ObjectId → Student,
  detectedSkills: [String],
  questions: [{
    id, text, category, difficulty, skill, expectedKeywords
  }],
  answers: [{
    questionId, questionText, answerText,
    score (0–10),
    feedback: { strengths, weaknesses, tip },
    category, difficulty, answeredAt
  }],
  currentIndex:  Number,
  status:        "active" | "completed" | "abandoned",
  finalScore: {
    overall, technical, communication, confidence   // all 0–100
  },
  tipsSummary:   [String],
  completedAt:   Date
}
```

### `Notification`
```js
{
  userId:    ObjectId | null,   // null = broadcast to all
  type:      String,
  message:   String,
  link:      String,
  read:      Boolean,
  createdAt: Date
}
```

---

## API Reference

### Auth  `/api/auth`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register student or admin |
| POST | `/login` | Public | Login (pending admins blocked) |
| GET | `/pending-admins` | Superadmin | List admins awaiting approval |
| PATCH | `/approve/:id` | Superadmin | Approve an admin |
| PATCH | `/reject/:id` | Superadmin | Reject an admin |

### Jobs  `/api/jobs`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all jobs |
| POST | `/` | Admin | Create job (triggers email to students) |
| DELETE | `/:id` | Admin | Delete job |
| POST | `/:id/apply` | Student | Apply for job |
| GET | `/applications/mine` | Student | My applications |
| GET | `/applications/all` | Admin | All applications |

### Interview  `/api/interview`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/start` | Auth | Start session from skills array |
| POST | `/start-from-resume` | Auth | Start session from PDF upload |
| GET | `/:sessionId/question` | Auth | Get current question |
| POST | `/:sessionId/evaluate` | Auth | Submit answer → get score + feedback |
| GET | `/sessions` | Auth | Get all past sessions |
| GET | `/sessions/:id` | Auth | Get full session detail |
| DELETE | `/sessions/:id` | Auth | Abandon active session |

### Resume  `/api/resume`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/upload` | Auth | Upload PDF → get full analysis |

### Recommendations  `/api/recommendations`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Auth | AI job matches based on resume |

### Notifications  `/api/notifications`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Auth | Get notifications for user |
| PATCH | `/:id/read` | Auth | Mark as read |

---

## Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/` | Home — EduNavigator landing | Public |
| `/login` | Login form | Public |
| `/register` | Register (student / admin toggle) | Public |
| `/forum` | Forum posts | Auth |
| `/clubs` | Student clubs | Auth |
| `/events` | Campus events | Auth |
| `/jobs` | Job board | Auth |
| `/recommendations` | AI Job Match Matrix | Auth |
| `/resume-checker` | AI Resume Scanner | Auth |
| `/interview` | AI Interview Simulator | Auth |
| `/interview/dashboard` | Interview history & scores | Auth |
| `/my-applications` | My job applications | Student |
| `/dashboard` | Personal dashboard | Auth |
| `/new` | Create forum post | Admin |
| `/new-event` | Create event | Admin |
| `/new-club` | Create club | Admin |
| `/jobs/new` | Post a job | Admin |
| `/admin/applications` | View all job applicants | Admin |
| `/superadmin` | Approve / reject admin accounts | Superadmin |

---

## AI Resume Analyzer

**File:** `services/resumeAnalyzer.js`

### How it works

1. **Extract text** from uploaded PDF using `pdfjs-dist`
2. **Skill detection** — regex boundary-matching against a dictionary of 60+ technologies
3. **Section detection** — 18 binary checks: email, phone, LinkedIn, GitHub, portfolio, education, experience, projects, skills section, summary, certifications, awards, quantified achievements, action verbs, GPA, volunteer work, bullet points, word count
4. **ATS scoring** (0–100) — weighted sum of matched keywords and detected sections
5. **Improvement tips** — up to 8 contextual tips generated based on what's *missing*
6. **Skill gaps** — comparison against a general-purpose tech stack
7. **Role matching** — maps detected skills against 11 job role profiles, returns top matches with % score

### ATS Score Weights

| Signal | Points |
|---|---|
| Each detected skill | 4 pts (cap 40) |
| Education section | 8 |
| Experience section | 8 |
| Quantified achievements | 6 |
| Projects section | 6 |
| Skills section | 5 |
| Summary / Objective | 5 |
| GitHub or Portfolio | 5 |
| Contact / Email | 4 |
| Certifications | 4 |
| Action verbs | 4 |
| LinkedIn | 2 |
| ≥5 bullet points | 2 |

---

## AI Interview Simulator

**Files:** `services/interviewEngine.js`, `routes/interviewRoutes.js`, `pages/InterviewSimulator.jsx`

### Interview Flow

```
Student enters skills (or uploads resume)
          ↓
Backend builds personalised question set (7–10 questions)
  • Technical questions (from skill question bank)
  • Project-based questions
  • Behavioural questions
          ↓
Chat UI: AI shows one question at a time
          ↓
Student types answer → backend evaluates
  • Keyword matching score (0–7)
  • Depth bonus based on word count (0–3)
  • Feedback: strengths, weaknesses, improvement tip
          ↓
After all questions:
  • Overall score (0–100)
  • Technical / Communication / Confidence breakdown
  • Improvement tips summary
  • Results emailed to student (if SMTP configured)
          ↓
Session stored in MongoDB for history dashboard
```

### Question Bank Coverage

| Skill | Easy | Medium | Hard |
|---|---|---|---|
| React | 2 | 2 | 2 |
| JavaScript | 2 | 2 | 2 |
| TypeScript | 1 | 2 | 1 |
| Node.js | 1 | 2 | 1 |
| Python | 2 | 2 | 1 |
| MongoDB | 1 | 2 | 1 |
| Machine Learning | 1 | 2 | 1 |
| Docker | 1 | 1 | 1 |
| AWS | 0 | 2 | 1 |
| SQL | 1 | 2 | 0 |
| Git | 1 | 1 | 0 |
| REST API | 1 | 2 | 0 |

Plus **5 behavioural questions** (2 randomly chosen per session) and **project-based questions** auto-generated from the student's top skills.

### Scoring Formula

```
Raw Score per Answer (0–10):
  keyword_score = (matched_keywords / total_expected) × 7 × difficulty_multiplier
  depth_bonus   = 0 (< 30 words) | 1 (30–79) | 2 (80–149) | 3 (≥ 150)
  answer_score  = min(keyword_score + depth_bonus, 10)

Final Scores (0–100):
  technical     = avg(tech + project answer scores) × 10
  communication = min((avg_word_count / 150) × 100, 100)
  confidence    = max(100 − avg_score_variance × 12, 0)
  overall       = technical × 0.5 + communication × 0.3 + confidence × 0.2
```

---

## Email Notification System

**File:** `services/emailService.js`

### Triggers

| Event | Recipients | Email Content |
|---|---|---|
| Admin posts a job | All active students | Job details, skills required, Apply button |
| Student completes interview | That student | Score breakdown, sub-scores, View Report button |

### Setup (Gmail)

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Generate a password for "Mail"
3. Add to `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=EduNavigator <your.email@gmail.com>
```

> If variables are missing, emails are silently skipped — the portal works fully without them.

---

## Seeding the Superadmin

Run **once** before first use:

```bash
cd Student-portal-BE-main
node scripts/seedSuperAdmin.js
```

**Default credentials** (change after first login):

| Field | Value |
|---|---|
| Email | `superadmin@portal.edu` |
| Password | `SuperAdmin@123` |
| Role | `superadmin` |

---

## Design System

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--blue` | `#3b82f6` | Primary actions, borders |
| `--blue-bright` | `#2563eb` | Button fills |
| `--purple` | `#8b5cf6` | Accents, admin elements |
| `--green` | `#10b981` | Success states |
| `--orange` | `#f59e0b` | Warnings, medium scores |
| `--red` | `#ef4444` | Errors, hard difficulty |

### Typography

| Font | Usage |
|---|---|
| **Orbitron** | Headings, brand, numbers |
| **Inter** | Body text, paragraphs |
| **Share Tech Mono** | Labels, badges, code |

### CSS Utility Classes

| Class | Description |
|---|---|
| `.fx-btn-primary` | Gradient blue→purple button with clip path |
| `.fx-btn-outline` | Transparent bordered button |
| `.fx-heading` | Orbitron uppercase heading style |
| `.fx-grid-bg` | Fixed subtle grid background |
| `.fx-chip-blue/purple/green/red` | Coloured skill/status chips |
| `.fx-progress` | Progress bar track |
| `.fx-progress-fill` | Progress bar animated fill |
| `.neon-text-blue/purple` | Text with blue or purple glow |
| `.sector-label` | Small monospace uppercase label |

### Card Pattern

All cards follow a consistent structure:
```
┌── coloured top stripe (3px) ──────────────────┐
│                                                │
│  corner accent ┐         ┌ corner accent       │
│                │  body   │                     │
│  corner accent ┘         └ corner accent       │
│                                                │
├── light footer bar ───────────────────────────┤
│  [ action buttons ]                            │
└────────────────────────────────────────────────┘
```

---

## Deployment Notes

### Backend (e.g. Render / Railway)

1. Set all `.env` variables in the dashboard
2. Build command: `npm install`
3. Start command: `node server.js`
4. Set `FRONTEND_URL` to your Netlify/Vercel URL

### Frontend (e.g. Netlify / Vercel)

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
4. Add a `_redirects` file in `public/`:
   ```
   /*  /index.html  200
   ```

### CORS

Add your frontend domain to `allowedOrigins` in `server.js`:

```js
const allowedOrigins = [
  "https://your-app.netlify.app",
  "http://localhost:5173",
];
```

---

## Quick Reference

```
┌─────────────────────────────────────────────────────┐
│              EDUNAVIGATOR QUICK REFERENCE            │
├─────────────────┬───────────────────────────────────┤
│ Backend URL     │ http://localhost:5500              │
│ Frontend URL    │ http://localhost:5173              │
│ Superadmin      │ superadmin@portal.edu              │
│ SA Password     │ SuperAdmin@123                     │
├─────────────────┴───────────────────────────────────┤
│ Start backend:  npm run dev  (in BE folder)         │
│ Start frontend: npm run dev  (in FE folder)         │
│ Seed superadmin:node scripts/seedSuperAdmin.js      │
└─────────────────────────────────────────────────────┘
```

---

*EduNavigator — Built with the MERN Stack · Powered by AI · Designed for Students*
