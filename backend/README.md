# Trishul StayEase — FastAPI Backend

REST API for the Trishul StayEase eco-homestay booking platform.  
Built with **FastAPI + Pydantic v2 + Uvicorn** using in-memory storage (Week 4).

---

## 📁 Folder Structure

```
backend/
├── main.py            # FastAPI app — all routes
├── models.py          # Pydantic schemas
├── requirements.txt   # Python dependencies
├── .env               # Local secrets (git-ignored)
├── .env.example       # Template — copy to .env
└── README.md          # This file
```

---

## 🚀 How to Run Locally

### 1. Create & activate a virtual environment

```bash
# Windows
cd backend
python -m venv venv
venv\Scripts\activate

# macOS / Linux
cd backend
python -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up environment variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values (allowed origins, port, etc.)
```

### 4. Start the development server

```bash
uvicorn main:app --reload --port 8000
```

The API will be live at **http://localhost:8000**

---

## 📖 API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/api/properties` | List all properties | 200 |
| GET | `/api/properties/{id}` | Get a single property | 200 / 404 |
| POST | `/api/properties` | Create a new property | 201 |
| PUT | `/api/properties/{id}` | Update a property | 200 / 404 |
| DELETE | `/api/properties/{id}` | Delete a property | 204 / 404 |
| GET | `/api/properties/search?q=` | Search by title or location | 200 |
| GET | `/api/properties/filter?max_price=&type=&status=` | Filter properties | 200 |

### Interactive Docs

- **Swagger UI** → http://localhost:8000/docs
- **ReDoc** → http://localhost:8000/redoc

---

## 📦 Data Model

```json
{
  "id":       1,
  "title":    "Mountain Retreat",
  "location": "Munsiyari, Uttarakhand",
  "price":    3200,
  "type":     "mountain",
  "status":   "available"
}
```

**Valid types:** `mountain` | `forest` | `riverside` | `coastal`  
**Valid statuses:** `available` | `booked`

---

## 🔧 Example Requests

### Create a property
```bash
curl -X POST http://localhost:8000/api/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"Beach Hut","location":"Goa","price":2500,"type":"coastal","status":"available"}'
```

### Search properties
```bash
curl "http://localhost:8000/api/properties/search?q=mountain"
```

### Filter by price
```bash
curl "http://localhost:8000/api/properties/filter?max_price=3000&type=forest"
```

---

## 🌐 CORS Configuration

Set the `ALLOWED_ORIGINS` variable in `.env` to allow your frontend:

```
ALLOWED_ORIGINS=http://localhost:5173,https://your-app.vercel.app
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |
