#!/bin/bash
docker compose down
source publish rm -f workout-front -t latest
docker compose up -d