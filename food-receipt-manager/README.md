# Al-Makhzen (المخزن) - Food Inventory Management 📦

![Makhzen Logo](https://al-makhzan.com/Logo%20Al-makhzen.png)

**Al-Makhzen** is an enterprise-grade web application built for the **DevNet End-of-Year Mini-Project**. It provides small businesses with a fast, reliable, and secure system to manage food inventory, track categories, and log transactions dynamically.

This project strictly follows modern DevOps practices, featuring complete containerization, zero-intervention automated deployments, and a robust CI/CD pipeline.

---

## 🏗️ Architecture & Technologies

### 1. Frontend (React)
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS (Custom green/beige "Al-Makhzen" UI Theme)
- **Data Visualization:** Recharts (Dynamic Dashboards)
- **State Management:** Redux Toolkit

### 2. Backend (Django)
- **Framework:** Python / Django REST Framework
- **Database:** SQLite (Relational Data Integrity)
- **Security:** JWT (JSON Web Tokens) Authentication

### 3. DevOps & Infrastructure
- **Containerization:** Docker & Docker Compose
- **Automation:** Bash (`deploy.sh` and `test.sh`)
- **CI/CD Pipeline:** GitHub Actions

---

## 🚀 Quick Start (Zero-Intervention Deployment)

This project features a fully automated deployment script. You do not need to install Python or Node.js manually. **Docker is the only requirement.**

1. Clone the repository and navigate to the project directory.
2. Run the deployment script:
   ```bash
   ./scripts/deploy.sh
   ```

**What this script does:**
- Tears down any conflicting containers.
- Builds the `frontend` and `backend` Docker images.
- Starts the containers in detached mode.
- Automatically runs database migrations inside the backend container.
- Creates a default `test` user account.

<details>
<summary>📄 <b>Click here to view the deploy.sh script</b></summary>

```bash
#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Starting automated deployment for Makhzen ===${NC}"

docker compose down
docker compose build
docker compose up -d

sleep 5
docker compose exec -T backend python manage.py migrate
docker compose exec -T backend python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='test').exists() or User.objects.create_superuser('test', 'test@test.com', 'test456')"

echo -e "${GREEN}=== Deployment Successful! ===${NC}"
```
</details>

Once the script finishes, access the application:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000/api/](http://localhost:8000/api/)

**Demo Login Credentials:**
- Username: `test`
- Password: `test456`

---

## 🐳 Docker Orchestration

Our project uses `docker-compose.yml` to seamlessly network the React frontend and Django backend together, ensuring that the database persists via Docker volumes.

<details>
<summary>📄 <b>Click here to view the docker-compose.yml</b></summary>

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - db-data:/app/db-data
    environment:
      - DEBUG=1
    command: >
      sh -c "python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000/api
    depends_on:
      - backend

volumes:
  db-data:
```
</details>

---

## 🧪 Automated Testing

To validate the application's logic and network connectivity, run the automated test script:

```bash
./scripts/test.sh
```

**What this script does:**
1. Triggers Django's internal `APITestCase` suite to validate database and API logic.
2. Performs an automated HTTP cURL test against the API to ensure the server is responding correctly.

<details>
<summary>📄 <b>Click here to view the test.sh script</b></summary>

```bash
#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Running Automated Tests ===${NC}"

if ! docker compose ps | grep -q "backend.*Up"; then
    echo -e "${RED}Backend container is not running. Starting it...${NC}"
    docker compose up -d backend
    sleep 5
fi

echo -e "${BLUE}[1/2] Running Django Application Logic Tests...${NC}"
docker compose exec -T backend python manage.py test api.tests

echo -e "${BLUE}[2/2] Validating API Connectivity...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/inventory/)

if [ "$HTTP_STATUS" -eq 401 ] || [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}API Connectivity validated successfully (Status $HTTP_STATUS).${NC}"
else
    echo -e "${RED}API Connectivity failed with status $HTTP_STATUS.${NC}"
    exit 1
fi

echo -e "${GREEN}=== All tests passed successfully! ===${NC}"
```
</details>

---

## ⚙️ CI/CD Pipeline

This repository includes a Continuous Integration pipeline (`.github/workflows/ci.yml`). 
On every `push` or `pull_request` to the `main` branch, GitHub Actions will automatically provision an Ubuntu server, build the Docker Compose environment, and run all backend tests to ensure code stability.

---

## 💡 Key Features
- **Executive Dashboard:** Live charts tracking stock distribution and transaction flow.
- **Inventory Protection:** Advanced backend/frontend logic prevents users from "Selling" more stock than is physically available.
- **Category Integrity:** Categories linked to active food items cannot be deleted, ensuring database consistency.
- **Responsive Design:** A beautiful, glassmorphic UI that works perfectly on desktop and mobile.

---
*Developed for the DevNet Certification Project.*
