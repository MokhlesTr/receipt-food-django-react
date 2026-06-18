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
