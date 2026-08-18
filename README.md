# Dilakesh Shanmugadivel — Full Stack Portfolio & Admin Dashboard

A full-stack enterprise developer portfolio with a secure **Admin Dashboard** for managing showcase projects, technical skills, career experience, and visitor contact messages.

---

## 📁 Project Structure
```
portfolio/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── main.jsx             # Portfolio entry, dynamic API integration & contact form
│   │   ├── AdminDashboard.jsx    # Complete Admin Dashboard (Auth, Stats, CRUD, Messages)
│   │   └── styles.css           # Design tokens, aesthetics, responsive layouts
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js       # Admin login & JWT generation
│   │   ├── projectController.js    # Projects CRUD
│   │   ├── skillController.js      # Skills CRUD
│   │   ├── experienceController.js # Experience CRUD
│   │   ├── messageController.js    # Messages handling & read/delete
│   │   └── statsController.js      # Dashboard counts & resume download stats
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # Admin credentials with bcrypt hashing
│   │   ├── Project.js           # Projects schema
│   │   ├── Skill.js             # Skills schema
│   │   ├── Experience.js        # Experience schema
│   │   ├── Message.js           # Contact inquiries schema
│   │   └── Analytics.js         # Resume download & metric counters
│   ├── routes/
│   │   ├── auth.js              # /api/auth/login
│   │   ├── projects.js          # /api/projects
│   │   ├── skills.js            # /api/skills
│   │   ├── experience.js        # /api/experience
│   │   ├── messages.js          # /api/messages
│   │   └── stats.js             # /api/dashboard/stats & /api/stats/resume-download
│   ├── seed.js                  # Initial database seed script
│   ├── server.js                # Express server entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── package.json                 # Root workspace orchestrator scripts
└── README.md
```

---

## 🚀 Running the Project

### 1. Seed Database (Creates Admin + Initial Data)
```bash
npm run seed
```

### 2. Start Backend Server
```bash
npm run server
```
* Backend starts at `http://localhost:5050`

### 3. Start Frontend (Vite)
```bash
npm run dev
```
* Frontend starts at `http://localhost:5173`

---

## 🔐 Admin Dashboard Credentials
* **URL:** [http://localhost:5173](http://localhost:5173) ➔ Click **Admin** (top bar or footer)
* **Email:** `dilakesh756@gmail.com`
* **Password:** `Adhidila007`
