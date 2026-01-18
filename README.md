# Trackd - Sustainability Actions API

A Django REST API for managing sustainability actions. Track actions with names, dates, and points.

## 🚀 Quick Start

### 1. Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Server
```bash
cd backend
python manage.py runserver
```

The API will be available at: **http://localhost:8000**

---

## 📡 API Endpoints

Base URL: `http://localhost:8000/api/actions/`

### List All Actions
**GET** `/api/actions/`

Returns all sustainability actions.

**Example Response:**
```json
[
  {
    "id": 1,
    "action": "Recycling",
    "date": "2025-01-08",
    "points": 25
  }
]
```

### Create New Action
**POST** `/api/actions/`

Creates a new action. ID is auto-generated.

**Request Body:**
```json
{
  "action": "Recycling",
  "date": "2025-01-08",
  "points": 25
}
```

**Response:** Returns the created action with auto-generated ID (201 Created)

### Get Single Action
**GET** `/api/actions/<id>/`

Get a specific action by ID.

**Example:** `GET /api/actions/1/`

**Response:** Returns the action, or 404 if not found

### Update Action (Full)
**PUT** `/api/actions/<id>/`

Full update - you must send ALL fields. Replaces entire action.

**Request Body:** Send all fields
```json
{
  "action": "Updated Recycling",
  "date": "2025-01-09",
  "points": 30
}
```

### Update Action (Partial)
**PATCH** `/api/actions/<id>/`

Partial update - only send fields you want to change.

**Request Body:** Only send fields to update
```json
{
  "points": 30
}
```

All other fields remain unchanged.

### Delete Action
**DELETE** `/api/actions/<id>/`

Deletes an action permanently.

**Response:** 204 No Content (success) or 404 if not found

---

## 🧪 Testing with Postman

### 1. GET All Actions
- Method: `GET`
- URL: `http://localhost:8000/api/actions/`
- No body needed

### 2. POST Create Action
- Method: `POST`
- URL: `http://localhost:8000/api/actions/`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "action": "Recycling",
  "date": "2025-01-08",
  "points": 25
}
```

### 3. GET Single Action
- Method: `GET`
- URL: `http://localhost:8000/api/actions/1/`

### 4. PATCH Update Action
- Method: `PATCH`
- URL: `http://localhost:8000/api/actions/1/`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "points": 30
}
```

### 5. DELETE Action
- Method: `DELETE`
- URL: `http://localhost:8000/api/actions/1/`

---

## 📁 Project Structure

```
trackd/
├── backend/
│   ├── actions/              # Django app
│   │   ├── views.py         # API endpoints
│   │   └── urls.py          # URL routes
│   ├── data/
│   │   └── fleet_actions.json  # Data storage
│   ├── trackd_project/      # Django settings
│   └── manage.py            # Django management
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

---

## 💾 Data Storage

All data is stored in `backend/data/fleet_actions.json`. The file is automatically created when you first create an action.

**Data Format:**
- `id` - Auto-generated primary key
- `action` - Action name (string, max 255 chars)
- `date` - Date in YYYY-MM-DD format
- `points` - Points (integer)

---

## 🛠️ Technologies

- Django 6.0.1
- Django REST Framework 3.16.1
- django-cors-headers 4.9.0

---

## ✅ Features

- ✅ RESTful API design
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ JSON file storage (no database needed)
- ✅ Auto-generated IDs
- ✅ Error handling (404 for not found)
- ✅ Browsable API interface (visit URLs in browser)

---

## 📝 Notes

- No database migrations needed (using JSON file storage)
- No superuser/admin setup needed
- Data persists in JSON file (survives server restarts)
- CORS enabled for frontend integration (localhost:3000)