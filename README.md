# 🏡 Trishul StayEase – Eco-Homestay Direct Booking Engine

> A full-stack, AI-powered sustainable homestay discovery and direct booking engine connecting mindful travellers with authentic eco-friendly stays across India.

---

## 🌐 Live Demo

- **Frontend Application (Vercel):** [https://trishul-stay-ease.vercel.app](https://trishul-stay-ease.vercel.app)
- **Backend API & Swagger Docs (Render):** [https://trishul-stayease.onrender.com/docs](https://trishul-stayease.onrender.com/docs)

---

## 🎥 Demo Video

- **Video Walkthrough (YouTube Unlisted):** `[Link will be updated after recording]`

---

## 📸 Screenshots

| 1. Explore & Sustainable Stays | 2. AI Eco Travel Planner |
| :---: | :---: |
| ![Explore Stays](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60) <br> *Browse, filter, and search eco-certified homestays* | ![AI Planner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60) <br> *Generate personalized sustainable itineraries with Gemini AI* |

| 3. Host Analytics Dashboard | 4. Interactive Booking Modal |
| :---: | :---: |
| ![Host Dashboard](https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60) <br> *Real-time metrics: revenue, bookings, and occupancy* | ![Booking Flow](https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=60) <br> *Instant dynamic price calculation and date validation* |

---

## ✨ Features

- **🌿 Eco-Stay Discovery & Advanced Filters**: Search listings by location/title with debounced API queries; filter by category (Mountain, Forest, Riverside, Coastal), price ceiling, and availability.
- **🤖 AI-Powered Eco Travel Planner**: Integrated with **Google Gemini 1.5 Flash** to generate custom eco-travel itineraries, sustainability tips, packing essentials, and budget allocations with server-side TTL caching.
- **🔐 Secure Authentication & Dual Roles**:
  - JWT token-based authentication with 24-hour expiration and refresh token support.
  - One-click **Google OAuth 2.0** Single Sign-On (SSO).
  - Role-Based Access Control (**Guest** vs. **Host/Admin**).
  - Password hashing with Bcrypt and interactive frontend strength validation.
- **📅 Real-Time Booking Management**:
  - Dynamic check-in/check-out date selection with automated multi-night price calculation.
  - Status lifecycle tracking (`upcoming`, `completed`, `cancelled`, `rejected`).
  - Unauthenticated users clicking "Book Now" are redirected to login/signup with preserved navigation state.
- **📊 Host Property & Analytics Dashboard**:
  - Full CRUD operations for homestay listings (image URLs, amenities, pricing, availability toggle).
  - Host metrics: Total properties, active bookings, gross revenue, and occupancy rate calculations.
- **❤️ Guest Wishlist & In-App Messaging**:
  - Save favourite properties to personal wishlist with one-click toggles.
  - Direct communication channel between guests and hosts per booking.
- **🛡️ Production-Ready Reliability & UX**:
  - Global React `ErrorBoundary` fallback UI.
  - Dark / Light mode toggle with local storage persistence.
  - Rate limiting with `SlowAPI` on critical endpoints.
  - Responsive layout optimized for mobile (375px), tablet (768px), and desktop (1440px).

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router 7, Vanilla CSS + Tailwind CSS, Axios, Context API |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, Uvicorn, Motor (Async MongoDB Driver) |
| **Database** | MongoDB Atlas (Cloud M0 Cluster) |
| **AI Integration** | Google Gemini 1.5 Flash via `@google/genai` SDK |
| **Security & Auth** | JWT (`python-jose`), Google OAuth 2.0, Bcrypt (`passlib`), SlowAPI (Rate Limiting) |
| **Deployment** | Vercel (Frontend SPA), Render (Backend Web Service) |

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** (v18.0 or higher) and **npm**
- **Python** (v3.10 or higher)
- **MongoDB Atlas** database URI
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))
- **Google OAuth Client ID** ([Google Cloud Console](https://console.cloud.google.com/))

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Riddhi1204/Trishul_StayEase.git
cd Trishul_StayEase
```

---

### 2️⃣ Backend Setup (FastAPI + MongoDB)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   # Windows
   copy .env.example .env

   # macOS / Linux
   cp .env.example .env
   ```

5. Fill in your `.env` values:
   ```env
   PORT=8000
   HOST=0.0.0.0
   ALLOWED_ORIGINS=http://localhost:5173,https://trishul-stay-ease.vercel.app
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=trishul_stayease
   JWT_SECRET=your-super-secret-key-minimum-32-characters
   JWT_ALGORITHM=HS256
   JWT_EXPIRE_MINUTES=10080
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. Start the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   - API Running: **http://localhost:8000**
   - Interactive Docs: **http://localhost:8000/docs**

---

### 3️⃣ Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Create local environment file `.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   - Frontend Running: **http://localhost:5173**

---

## 📖 API Documentation

All endpoints return JSON responses. Protected endpoints require the header `Authorization: Bearer <access_token>`.

### Authentication

#### `POST /auth/register`
- **Request**:
  ```json
  {
    "full_name": "Riddhi Kumari",
    "email": "user@example.com",
    "phone": "+919876543210",
    "password": "Password@123",
    "role": "guest"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "user": { "id": "664fa...", "full_name": "Riddhi Kumari", "email": "user@example.com", "role": "guest" }
  }
  ```

#### `POST /auth/login`
- **Request**: `{ "email": "user@example.com", "password": "Password@123" }`
- **Response (200 OK)**: `{ "access_token": "...", "user": { ... } }`

#### `POST /auth/google`
- **Request**: `{ "idToken": "google_credential_string", "role": "guest" }`
- **Response (200 OK)**: `{ "access_token": "...", "user": { ... } }`

---

### Properties

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/properties` | Public | List all properties |
| `GET` | `/api/properties/{id}` | Public | Get single property details |
| `GET` | `/api/properties/search?q={query}` | Public | Search properties by title/location |
| `GET` | `/api/properties/filter?max_price={}&type={}` | Public | Filter properties by price/category |
| `GET` | `/api/properties/me/all` | Host Only | Get all properties owned by logged-in host |
| `POST` | `/api/properties` | Host Only | Create a new property |
| `PUT` | `/api/properties/{id}` | Host Only | Update property details |
| `DELETE` | `/api/properties/{id}` | Host Only | Delete a property |

---

### Bookings & Wishlist

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Guest Only | Create a booking (`property_id`, `start_date`, `end_date`, `guests`) |
| `GET` | `/api/bookings/me` | Guest Only | View logged-in guest's bookings |
| `GET` | `/api/bookings/host` | Host Only | View all reservation requests for host's properties |
| `PUT` | `/api/bookings/{id}/status` | Host/Guest | Update booking status (`completed`, `cancelled`, `rejected`) |
| `GET` | `/api/wishlist` | Guest Only | Fetch guest's saved wishlist |
| `POST` | `/api/wishlist/{property_id}` | Guest Only | Add property to wishlist |
| `DELETE` | `/api/wishlist/{property_id}` | Guest Only | Remove property from wishlist |

---

### AI Travel Planner

#### `POST /api/ai/travel-plan`
- **Access**: Authenticated Users
- **Request**:
  ```json
  {
    "destination": "Rishikesh",
    "days": 3,
    "budget": "₹15,000",
    "travel_style": "Adventure",
    "guests": 2
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "trip_overview": "A 3-day adventure itinerary in Rishikesh focusing on eco-tourism...",
    "itinerary": [
      {
        "day": 1,
        "title": "Riverside Arrival & Ganga Aarti",
        "activities": ["Check-in at Eco Homestay", "Sunset meditation at Parmarth Niketan"],
        "eco_tips": "Carry a reusable bottle and support local vendors."
      }
    ],
    "budget_breakdown": {
      "accommodation": "₹6,000",
      "activities": "₹5,000",
      "food_and_transport": "₹4,000"
    }
  }
  ```

---

## 🏗️ Architecture & Folder Structure

Trishul StayEase follows a decoupled client-server architecture with an asynchronous, modular design pattern:

```
Trishul_StayEase/
│
├── frontend/                        # React 19 + Vite Frontend SPA
│   ├── public/                      # Static branding, manifest, icons, favicons
│   ├── src/
│   │   ├── components/              # Navbar, Hero, Card, Footer, Modals, ErrorBoundary
│   │   ├── components/ui/           # Reusable UI library (Toast, Button, Input)
│   │   ├── contexts/                # AuthContext (JWT/OAuth), ThemeContext (Dark mode)
│   │   ├── pages/                   # Home, Explore, Dashboard, AI Planner, Bookings, Wishlist
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios client & response interceptors
│   │   ├── App.jsx                  # Protected routes & client-side router
│   │   ├── main.jsx                 # ErrorBoundary & React DOM root
│   │   └── index.css                # Global CSS variables & responsive design tokens
│   ├── package.json
│   └── vite.config.js
│
├── backend/                         # FastAPI Asynchronous REST API
│   ├── ai/                          # Gemini AI travel planner service, prompts, schemas
│   ├── auth/                        # JWT authentication, Bcrypt hashing, Google OAuth service
│   ├── database/                    # Motor async client connection, indexes, CRUD operations
│   ├── middleware/                  # Custom security headers & CORS middleware
│   ├── routers/                     # Bookings, Wishlists, Host Dashboard, Messaging, Contact
│   ├── security/                    # SlowAPI rate limiting configuration
│   ├── models.py                    # Pydantic v2 schemas and validation models
│   ├── main.py                      # FastAPI app instance, lifespans, route aggregation
│   └── requirements.txt             # Backend dependencies
│
├── W4_APICollection_26100462.json   # Postman Collection
├── render.yaml                      # Render Blueprint deployment config
└── README.md                        # Master documentation
```

---

## ⚠️ Known Limitations

1. **Render Free-Tier Cold Starts**: The backend is hosted on Render's free tier, which spins down web services after 15 minutes of inactivity. The initial request after an idle period may take 30–60 seconds to respond while the server container boots up.
2. **MongoDB Atlas M0 Cluster Constraints**: Hosted on a shared M0 cluster with a 512MB storage quota and a 500 connection limit.
3. **Simulated Payment Gateway**: The current booking flow records reservations directly with calculated nightly totals. Real payment gateway integration (Razorpay / Stripe) is planned for the next release.
4. **Google Gemini Free Tier Rate Limits**: The AI Travel Planner is subject to standard free-tier RPM (requests per minute) quotas.

---

## 🤝 Credits & Acknowledgements

- **Google DeepMind / Google Gemini API** for powering the AI Eco Travel Planner.
- **FastAPI & Motor (Async Python)** for asynchronous backend performance.
- **React & Vite Teams** for the frontend developer experience.
- **Unsplash** for high-resolution eco-tourism and nature imagery.
- **Antigravity AI** for pair-programming and technical orchestration.

---

## 👩‍💻 Author

**Riddhi Kumari**
- 🔗 **LinkedIn**: [linkedin.com/in/riddhi-kumari-039974383](https://www.linkedin.com/in/riddhi-kumari-039974383/)
- 🐙 **GitHub**: [github.com/Riddhi1204](https://github.com/Riddhi1204)
