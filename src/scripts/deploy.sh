#!/bin/bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting automated deployment for Makhzen (Zero Manual Intervention) ===${NC}"

echo -e "${BLUE}[1/4] Stopping existing containers...${NC}"
docker compose down

echo -e "${BLUE}[2/4] Building Docker images...${NC}"
docker compose build

echo -e "${BLUE}[3/4] Starting containers in detached mode...${NC}"
docker compose up -d

echo -e "${BLUE}[4/4] Waiting for backend to be ready and applying migrations...${NC}"
sleep 5
docker compose exec -T backend python manage.py migrate
docker compose exec -T backend python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='test').exists() or User.objects.create_superuser('test', 'test@test.com', 'test456')"

echo -e "${GREEN}=== Deployment Successful! ===${NC}"
echo -e "Frontend is available at: http://localhost:5173"
echo -e "Backend API is available at: http://localhost:8000"
