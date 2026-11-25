# InternTrack — Full-Stack Internship Application Tracker

**InternTrack** is a modern, responsive, full-stack SaaS web application designed for students and graduates to streamline, track, and master their internship recruitment process.

Built with **FastAPI**, **SQLAlchemy ORM**, **MySQL**, **React.js (Vite)**, and **Tailwind CSS**, InternTrack replaces chaotic spreadsheets with a high-performance career operations hub featuring Kanban tracking, interview scheduling, calendar integrations, and actionable analytics.

---

## 🌟 Key Features

### 1. Modern SaaS UI & Experience
- **Dark navy and electric blue palette** designed for engineering workflows.
- Responsive layout for desktop, tablet, and mobile.
- Desktop sidebar navigation with mobile drawer.
- Subtle card glows, shimmer skeleton loading states, and toast notifications.
- Accessible dialogs and confirmation modals for destructive operations.

### 2. Comprehensive Application Management
- **8 Workflow Stages:** `Wishlist`, `Applied`, `Under Review`, `Online Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`.
- **Dual View Modes:**
  - **Table View:** Searchable, sortable by date, company, or deadline with quick status dropdown.
  - **Kanban Board:** Multi-column board with drag-and-drop or quick stage advance arrows that persist directly to the database.
- **16 Detailed Fields:** Company name, job title, description, company website, application URL, location, work mode (Remote/Hybrid/On-site), employment type, salary/stipend, application date, deadline, status, recruiter name, recruiter email, interview date, personal notes, and resume version.

### 3. Executive Dashboard & Metrics
- **7 Summary Metric Cards:** Real-time counters for Total Applications, Applied, Under Review, OA, Interviews, Offers, and Rejections.
- **Conversion Rates:** Calculates actual Interview Conversion Rate and Offer Conversion Rate from persistent database records.
- **Interactive Visualizations:**
  - Applications velocity over time (Area chart).
  - Status distribution breakdown (Donut chart).
  - Monthly pipeline progression (Bar chart).
- **Widgets:** Recently logged applications, upcoming scheduled interviews with 1-click meeting join links, and upcoming deadlines.

### 4. Interview Session Management
- Link interviews directly to specific applications.
- Set interview round type (`Technical`, `HR`, `Behavioral`, `System Design`, `Other`).
- Store video conference links (Google Meet, Zoom, Teams) with instant join buttons.
- Document preparation notes and track interview outcomes (`Scheduled`, `Completed`, `Cancelled`).

### 5. Interactive Monthly Calendar
- Unified schedule displaying application deadlines, interview sessions, and task reminders.
- Month-to-month navigation with "Today" quick jump.
- Color-coded event badges with interactive detail modals on click.

### 6. Analytics & Intelligence Coach
- Detailed charts: Applications by status, monthly trend, applications by location, and work mode breakdown.
- Contextual, data-driven recommendations that adapt dynamically to the candidate's real funnel metrics.

### 7. Reminders & Prep Notes
- Deadline and follow-up reminders with priority flags (`High`, `Medium`, `Low`).
- One-click checkbox completion state with database persistence.
- Application-linked or general interview reflection notes.

### 8. User Profile & Settings
- Academic credentials: University, degree, graduation year.
- Career preferences: Target role, preferred work mode, preferred locations.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance SPA with client-side routing |
| **Styling** | Tailwind CSS | Dark navy theme (`#0B1120`, `#0F172A`, `#1E293B`, `#2563EB`) |
| **Icons** | Lucide React | Modern, clean iconography |
| **Charts** | Recharts | Responsive SVG charts (Pie, Bar, Area) |
| **HTTP Client** | Axios | Configured with JWT interceptors & error handling |
| **Backend** | Python 3.11+, FastAPI | Asynchronous RESTful API framework |
| **ORM** | SQLAlchemy 2.0 | Normalized relational mapping with cascade rules |
| **Validation** | Pydantic v2 | Strict request/response schema validation |
| **Authentication** | JWT (Jose) & Passlib (Bcrypt) | Secure salted password hashing and stateless tokens |
| **Database** | MySQL 8.0 (Production / Docker) | Persistent relational storage with Alembic migrations |
| **Containerization**| Docker & Docker Compose | Multi-container setup for MySQL, Backend, and Frontend |

---

## 📁 Project Architecture & Folder Structure

```text
interntrack/
├── docker-compose.yml              # Multi-container orchestration (MySQL, Backend, Frontend)
├── render.yaml                     # Render Cloud blueprint configuration
├── .env.example                    # Global environment variables template
├── README.md                       # Documentation & setup guide
│
├── backend/
│   ├── Dockerfile                  # Python 3.11 production container
│   ├── requirements.txt            # Python dependencies (FastAPI, SQLAlchemy, PyMySQL, etc.)
│   ├── alembic.ini                 # Database migrations configuration
│   ├── test_api.py                 # Automated backend test suite
│   ├── .env.example                # Backend environment variables
│   ├── alembic/
│   │   ├── env.py                  # Alembic environment runner
│   │   └── versions/
│   │       └── 001_initial_tables.py  # Initial table migration
│   └── app/
│       ├── main.py                 # FastAPI application, CORS, and routers registration
│       ├── config.py               # Pydantic BaseSettings configuration
│       ├── database.py             # SQLAlchemy engine & session maker
│       ├── seed.py                 # Database initialization & sample data generator
│       ├── models/                 # SQLAlchemy ORM models
│       │   ├── user.py             # User model
│       │   ├── application.py      # Application model (16 fields)
│       │   ├── interview.py        # Interview model
│       │   ├── reminder.py         # Reminder model
│       │   └── note.py             # Note model
│       ├── schemas/                # Pydantic validation schemas
│       │   ├── user.py
│       │   ├── application.py
│       │   ├── interview.py
│       │   ├── reminder.py
│       │   ├── note.py
│       │   └── dashboard.py
│       ├── routers/                # REST API routers
│       │   ├── auth.py             # /api/auth/register, /login, /me
│       │   ├── applications.py     # /api/applications CRUD & filtering
│       │   ├── dashboard.py        # /api/dashboard/summary, /analytics, /recent
│       │   ├── interviews.py       # /api/interviews CRUD
│       │   ├── reminders.py        # /api/reminders CRUD
│       │   ├── notes.py            # /api/notes CRUD
│       │   └── profile.py          # /api/profile GET & PUT
│       └── utils/
│           └── security.py         # Bcrypt hashing & JWT verification
│
└── frontend/
    ├── Dockerfile                  # Multi-stage Vite + Nginx container
    ├── nginx.conf                  # Nginx SPA rewrite & API proxy configuration
    ├── package.json                # Dependencies (React, Tailwind, Recharts, Lucide)
    ├── vite.config.js              # Vite configuration & dev proxy
    ├── tailwind.config.js          # Tailwind dark navy theme & custom utilities
    ├── vercel.json                 # Vercel deployment rewrites
    ├── index.html                  # HTML template with Google Fonts (Inter)
    └── src/
        ├── main.jsx                # Entry point
        ├── App.jsx                 # Routes & global modal providers
        ├── index.css               # Base CSS & custom scrollbar
        ├── context/
        │   ├── AuthContext.jsx     # Authentication provider & user session
        │   └── ToastContext.jsx    # Floating notification system
        ├── services/
        │   └── api.js              # Axios client with interceptors
        ├── utils/
        │   ├── constants.js        # Statuses, colors, work modes
        │   └── formatters.js       # Date and time formatting helpers
        ├── components/
        │   ├── common/             # Navbar, Sidebar, Modal, StatCard, Skeletons
        │   ├── applications/       # Form modal, Details modal, Table view, Kanban board
        │   ├── interviews/         # Interview modal
        │   └── reminders/          # Reminder modal
        └── pages/                  # Dashboard, Applications, Interviews, Calendar, Analytics, Reminders, Profile, Login, Register
```

---

## 🚀 Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

To run the complete system (MySQL 8.0, FastAPI Backend, and React Frontend) with a single command:

1. Clone or navigate to the repository directory:
   ```bash
   cd interntrack
   ```
2. Launch Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
   - **Backend REST API:** [http://localhost:8000](http://localhost:8000)
   - **Swagger Interactive API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **API Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### Option 2: Local Development Setup (Manual)

#### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env`:
   ```env
   # For MySQL:
   DATABASE_URL=mysql+pymysql://root:rootpassword@localhost:3306/interntrack?charset=utf8mb4
   # Or for zero-config offline SQLite testing:
   # DATABASE_URL=sqlite:///./interntrack.db

   SECRET_KEY=super_secure_jwt_secret_key_min_32_characters
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   PORT=8000
   ```
5. Apply database migrations & seed initial sample data:
   ```bash
   alembic upgrade head
   python -m app.seed
   ```
6. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

#### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web application at [http://localhost:5173](http://localhost:5173).

---

## 🔑 Demo Account Credentials

For evaluation and instant walkthrough, the database seeder creates a populated demo student profile:

- **Email:** `alex.chen@university.edu`
- **Password:** `DemoPass123!`

*(You can also click the **"Click here to fill Demo Account credentials"** button directly on the login page for 1-click test access).*

Alternatively, you can register a new account on the `/register` page to test fresh user onboarding and isolated data isolation.

---

## 📡 REST API Documentation

FastAPI provides an automatic, interactive **Swagger UI** available at:
`http://localhost:8000/docs`

### Primary Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new account and receive JWT token |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile |
| `GET` | `/api/applications` | List applications with search, status, location, and sorting |
| `POST` | `/api/applications` | Create a new internship application (16 fields) |
| `GET` | `/api/applications/{id}` | Retrieve application details |
| `PUT` | `/api/applications/{id}` | Update application record |
| `PATCH` | `/api/applications/{id}/status`| Quick stage update (persists Kanban moves) |
| `DELETE` | `/api/applications/{id}` | Permanently delete application |
| `GET` | `/api/dashboard/summary` | Real-time counters and conversion rates |
| `GET` | `/api/dashboard/analytics` | Timeline, status distribution, and monthly data |
| `GET` | `/api/dashboard/recent-applications` | Recent submissions, upcoming interviews, deadlines |
| `GET` | `/api/interviews` | List scheduled interviews |
| `POST` | `/api/interviews` | Schedule interview round linked to application |
| `PUT` | `/api/interviews/{id}` | Update interview details or status |
| `DELETE` | `/api/interviews/{id}` | Delete interview record |
| `GET` | `/api/reminders` | List checklist reminders |
| `POST` | `/api/reminders` | Create reminder |
| `PUT` | `/api/reminders/{id}` | Update reminder (including completion toggle) |
| `DELETE` | `/api/reminders/{id}` | Delete reminder |
| `GET` | `/api/notes` | List preparation notes |
| `POST` | `/api/notes` | Create preparation note |
| `PUT` | `/api/notes/{id}` | Update note |
| `DELETE` | `/api/notes/{id}` | Delete note |
| `GET` | `/api/profile` | Retrieve candidate academic and career profile |
| `PUT` | `/api/profile` | Update candidate academic and career profile |
| `GET` | `/api/health` | Healthcheck endpoint reporting DB connectivity |

---

## 🔒 Security & Data Isolation

- **Password Hashing:** Passwords are never stored in plaintext; hashed using `passlib` with `bcrypt`.
- **Stateless JWT Tokens:** Tokens carry standard `sub` claims and expire based on configurable environment variables.
- **Strict Data Isolation:** Every query (`/applications`, `/interviews`, `/reminders`, `/notes`, `/dashboard`) enforces `user_id == current_user.id`. Users can never access or modify records belonging to other candidates.
- **SQL Injection Prevention:** All queries utilize SQLAlchemy ORM parameterized queries.
- **CORS Configured:** Fully customizable cross-origin access protection.

---

## ☁️ Production Deployment Guide

### Deploy Frontend to Vercel

1. Push your repository to GitHub / GitLab.
2. Log in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your repository and select `frontend` as the **Root Directory**.
4. Configure Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.onrender.com/api`
6. Click **Deploy**. Vercel will build and distribute the app with edge CDN caching and automatic HTTPS.

---

### Deploy Backend to Render (or Railway / AWS)

1. Log in to [Render](https://render.com) and click **"New +"** -> **"Blueprint"** (or **"Web Service"**).
2. Point Render to your repository:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/api/health`
3. Environment Variables:
   - `DATABASE_URL`: `mysql+pymysql://<user>:<password>@<host>:<port>/<dbname>?charset=utf8mb4`
   - `SECRET_KEY`: A secure random 32+ character string
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `10080`
   - `PYTHON_VERSION`: `3.11.9`

---

### Managed MySQL Database Options

InternTrack is fully compatible with any standard MySQL 8.0+ managed provider:
- **Aiven MySQL** / **PlanetScale** / **Railway MySQL** / **AWS RDS MySQL** / **DigitalOcean Managed MySQL**.
- Simply supply the connection URI in `DATABASE_URL` using the `mysql+pymysql://` protocol format.
- Run `alembic upgrade head` to apply all migrations automatically upon first boot.

---

## 🧪 Testing and Verification

Run the automated test suite verifying all 14 REST endpoints and multi-user data isolation:

```bash
cd backend
python test_api.py
```

Expected output:
```text
✓ /api/health passed
✓ /api/auth/login passed
✓ /api/auth/me passed
✓ /api/dashboard/summary passed
✓ /api/dashboard/analytics passed
✓ /api/dashboard/recent-applications passed
✓ /api/applications passed
✓ /api/applications POST passed
✓ /api/applications/{id}/status PATCH passed
✓ /api/applications/{id} DELETE passed
✓ /api/interviews passed
✓ /api/reminders passed
✓ /api/notes passed
✓ /api/profile GET & PUT passed
🎉 ALL 14 BACKEND API ENDPOINTS VERIFIED & WORKING PERFECTLY!
✓ USER DATA ISOLATION VERIFIED: User B cannot view or modify User A's records!
```

---

## 📄 License

This project is licensed under the MIT License.
