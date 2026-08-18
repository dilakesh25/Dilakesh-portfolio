# Dilakesh Shanmugadivel — Full Stack Portfolio & Admin Dashboard

A full-stack enterprise developer portfolio with a secure **Admin Dashboard** for managing showcase projects, technical skills, career experience, and visitor contact messages.

---

## 🛠️ Tech Stack
* **Frontend:** React 18, Vite 5, Lucide React, Vanilla CSS
* **Backend:** Node.js, Express.js
* **Database & ODM:** MongoDB Atlas / Mongoose
* **Authentication:** JWT (JSON Web Tokens), `bcryptjs`
* **Configuration:** `dotenv`

---

## 📁 Project Structure
```
dilakesh-portfolio/
├── src/
│   ├── main.jsx             # Portfolio entry, dynamic API integration & contact form
│   ├── AdminDashboard.jsx    # Complete Admin Dashboard (Auth, Stats, CRUD, Messages)
│   └── styles.css           # Design tokens, aesthetics, responsive layouts
│
├── server/
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Admin login & JWT generation
│   │   ├── projectController.js    # Projects CRUD
│   │   ├── skillController.js      # Skills CRUD
│   │   ├── experienceController.js # Experience CRUD
│   │   ├── messageController.js    # Messages handling & read/delete
│   │   └── statsController.js      # Dashboard counts & resume download stats
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── User.js          # Admin credentials with bcrypt hashing
│   │   ├── Project.js       # Projects schema
│   │   ├── Skill.js         # Skills schema
│   │   ├── Experience.js    # Experience schema
│   │   ├── Message.js       # Contact inquiries schema
│   │   └── Analytics.js     # Resume download & metric counters
│   ├── routes/
│   │   ├── auth.js          # /api/auth/login
│   │   ├── projects.js      # /api/projects
│   │   ├── skills.js        # /api/skills
│   │   ├── experience.js    # /api/experience
│   │   ├── messages.js      # /api/messages
│   │   └── stats.js         # /api/dashboard/stats & /api/stats/resume-download
│   ├── seed.js              # Initial database seed script
│   ├── server.js            # Express server entry point
│   ├── .env.example
│   └── .env
│
├── index.html
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Inside `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dilakesh-portfolio?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_2026
ADMIN_EMAIL=dilakesh756@gmail.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:5173
```

### 2. Seed Initial Database
```bash
npm run seed
```

### 3. Run Backend Server
```bash
npm run server
```
Server runs on `http://localhost:5000`.

### 4. Run Frontend (Vite)
In another terminal:
```bash
npm run dev
```
Portfolio runs on `http://localhost:5173`.

---

## 🔐 Admin Dashboard Access
* Click **Admin** in the navigation header or **Admin Portal** in the footer.
* **Default Credentials:**
  * **Email:** `dilakesh756@gmail.com`
  * **Password:** `Admin@123`
