# TrackD

A Django REST API for managing sustainability actions. Track sustainability activities with action names, dates, and points.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
cd backend
python manage.py migrate
```

4. Create a superuser:
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

6. Access the admin panel at: http://127.0.0.1:8000/admin/

## API Endpoints

The API will be available at `http://127.0.0.1:8000/api/actions/`

- `GET /api/actions/` - List all sustainability actions
- `POST /api/actions/` - Create a new sustainability action
- `GET /api/actions/<id>/` - Get a specific action
- `PUT /api/actions/<id>/` - Update an action
- `DELETE /api/actions/<id>/` - Delete an action

## Project Structure

```
trackd/
├── backend/              # Django project
│   ├── actions/         # Django app (sustainability actions)
│   ├── trackd_project/  # Django project settings
│   └── manage.py        # Django management script
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Technologies

- Django 6.0.1
- Django REST Framework 3.16.1
- django-cors-headers 4.9.0

## Features

- RESTful API for sustainability actions
- CRUD operations (Create, Read, Update, Delete)
- JSON-based responses
- Django admin interface for data management

