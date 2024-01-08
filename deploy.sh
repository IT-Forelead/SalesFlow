#!/bin/bash
source build.sh
echo "Saving frontend image..."
docker save workout/frontend:latest > ./alphaui.tar.gz
echo "alphaui.tar.gz file created!"
echo "--------------------------------------------------------"
echo "Transfer ui file to server"
scp ./alphaui.tar.gz timeweb2:./
echo "Transfer successful!"
echo "--------------------------------------------------------"
