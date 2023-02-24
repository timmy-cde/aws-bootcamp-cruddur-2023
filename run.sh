#!/bin/bash

echo "Building project in docker..."
docker compose -f "docker-compose.yml" up -d --build
echo "Done building, check your ports!"