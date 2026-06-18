#!/bin/bash
echo "Running tests..."
docker compose run backend pytest
echo "Checking API health..."
curl -f http://localhost:8000/api/receipts/ || echo "API is not healthy"
echo "Tests finished."
