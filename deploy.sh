#!/bin/bash
# source build.sh
echo "Saving frontend image..."
docker save warehouse/frontend:latest > ./warehouse.tar.gz
echo "warehouse.tar.gz file created!"
echo "--------------------------------------------------------"
echo "Transfer ui file to server"
scp ./warehouse.tar.gz timeweb:./warehouse/ui
echo "Transfer successful!"
echo "--------------------------------------------------------"
