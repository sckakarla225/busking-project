## Spots API

# Docker Instructions
Build latest image: docker buildx build --platform linux/amd64 -t sckakarla225/spotlite-prediction-api . --load
Test latest image locally: docker run -p 8080:4000 sckakarla225/spotlite-prediction-api
Login into Docker Hub: docker login
Push latest image to Docker Hub: docker push sckakarla225/spotlite-prediction-api
Go into Digital Ocean droplet: ssh -i deploy/do-ssh-key root@104.236.12.32
Bring latest image onto droplet: docker pull sckakarla225/spotlite-prediction-api:latest
Kill any existing processes on 8000: docker ps; docker stop {CONTAINER_ID_RUNNING_ON_8000}
Deploy latest image to droplet: docker run -p 8000:4000 sckakarla225/spotlite-prediction-api 


