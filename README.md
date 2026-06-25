# 🏡 Trishul StayEase – Direct Booking Engine

A modern full-stack eco-homestay booking platform built with **React + Vite** (frontend) and **FastAPI** (backend). Helps eco-homestay owners accept direct reservations without relying on third-party OTAs.

🌐 **Live Demo:** [trishul-stay-ease.vercel.app](https://trishul-stay-ease.vercel.app)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS v4, Axios |
| **Backend** | Python, FastAPI, Pydantic v2, Uvicorn |
| **Styling** | Vanilla CSS + Tailwind CSS (dark mode supported) |
| **Deployment** | Vercel (Frontend) |
| **Tools** | Git & GitHub, Postman, VS Code |

---

## 📂 Project Structure

```
Trishul_StayEase/
│
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/         # Navbar, Hero, Card, Footer
│   │   ├── components/ui/      # Button, Input, Modal, Toast, Loader
│   │   ├── contexts/           # ThemeContext (dark mode)
│   │   ├── pages/              # Home, About, Dashboard, Login, ComponentShowcase
│   │   ├── services/
│   │   │   └── api.js          # Axios API service layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.local              # VITE_API_URL (git-ignored)
│   ├── vercel.json             # SPA routing config
│   └── package.json
│
├── backend/                    # FastAPI REST API
│   ├── main.py                 # All endpoints + CORS + error handling
│   ├── models.py               # Pydantic schemas
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Local secrets (git-ignored)
│   ├── .env.example            # Environment variable template
│   └── README.md               # Backend-specific docs
│
├── W4_APICollection_TrishulStayEase.json  # Postman collection
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v18+ and npm
- **Python** 3.10+

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Riddhi1204/Trishul_StayEase.git
cd Trishul_StayEase
```

---

### 2️⃣ Run the Backend (FastAPI)

```bash
# Navigate to the backend folder
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Start the server (with auto-reload)
uvicorn main:app --reload --port 8000
```

✅ Backend running at: **http://localhost:8000**
📖 Swagger API docs: **http://localhost:8000/docs**

---

### 3️⃣ Run the Frontend (React + Vite)

Open a **new terminal**, then:

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Create local environment file
echo VITE_API_URL=http://localhost:8000 > .env.local

# Start the dev server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## 🔌 API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/api/properties` | List all properties | 200 |
| GET | `/api/properties/{id}` | Get a single property | 200 / 404 |
| POST | `/api/properties` | Create a new property | 201 |
| PUT | `/api/properties/{id}` | Update a property | 200 / 404 |
| DELETE | `/api/properties/{id}` | Delete a property | 204 / 404 |
| GET | `/api/properties/search?q=` | Search by title or location | 200 |
| GET | `/api/properties/filter?max_price=` | Filter by price / type / status | 200 |

---

## 🌿 Features

- **Eco-stay listings** fetched live from FastAPI backend
- **Search** properties by name or location (debounced API calls)
- **Filter** by price, type, and availability
- **Dark mode** with system preference detection and localStorage persistence
- **Reusable UI library** — Button, Input, Modal, Toast, Loader components
- **Skeleton loading** states while fetching data
- **Error handling** with retry support
- **CORS configured** for local dev and Vercel production

---

## 📬 Postman Collection

Import `W4_APICollection_TrishulStayEase.json` into Postman to test all endpoints with pre-filled example requests and responses.

---

## 🎓 Internship Project

**Track:** Full Stack Development Internship
**Sector:** Homestay & Eco-Tourism
**Project:** WD-05 – Direct Booking Engine (Zero Commission MVP)

---

## 👩‍💻 Author

**Riddhi Kumari**

- 🔗 LinkedIn: [linkedin.com/in/riddhi-kumari-039974383](https://www.linkedin.com/in/riddhi-kumari-039974383/)
- 🐙 GitHub: [github.com/Riddhi1204](https://github.com/Riddhi1204)

---

## 📄 License

This project is developed for educational and internship purposes.
