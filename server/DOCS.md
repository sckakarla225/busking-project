## Spots API

# Docker Instructions
docker buildx build --platform linux/amd64 -t sckakarla225/spotlite-prediction-api . --load
docker run -p 8080:4000 sckakarla225/spotlite-prediction-api
docker login
docker push sckakarla225/spotlite-prediction-api
ssh -i deploy/do-ssh-key root@104.236.12.32
docker run -p 8081:4000 sckakarla225/spotlite-prediction-api 


