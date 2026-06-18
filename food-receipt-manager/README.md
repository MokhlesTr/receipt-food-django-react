# Food Receipt Manager

A full-stack web application to manage food purchase receipts and track spending.

## Tech Stack
- **Backend**: Django, Django REST Framework, SQLite
- **Frontend**: React (Vite), Tailwind CSS v4, Redux Toolkit, Recharts
- **Deployment**: Docker, Docker Compose

## Features
- JWT Authentication (Register, Login, Logout)
- CRUD operations for Receipts
- Dashboard with spending statistics and visualizations
- Filter and search functionality
- Responsive and modern UI with Tailwind

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Running the application
To build and start the application using Docker:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

The frontend will be accessible at `http://localhost:5173`
The backend API will be accessible at `http://localhost:8000/api/`

### Running Tests
To run the automated tests:

```bash
chmod +x scripts/test.sh
./scripts/test.sh
```

## Structure
- `/backend`: Django project files and API endpoints
- `/frontend`: React application
- `/scripts`: Automation scripts
