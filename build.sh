#!/bin/bash
# Run the app development server
echo '--------------------------------------------------------------------'
echo 'Stoppping & Removing Frontend container...'
echo '--------------------------------------------------------------------'
docker container stop warehouse-frontend
docker container rm warehouse-frontend
echo '--------------------------------------------------------------------'
echo 'Removing Frontend image...'
echo '--------------------------------------------------------------------'
docker rmi -f warehouse/frontend:latest
echo '===================================================================='
echo 'Building Frontend image...'
echo '--------------------------------------------------------------------'
docker build -t warehouse/frontend .
echo '--------------------------------------------------------------------'
