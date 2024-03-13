# Spot Prediction Model 1.0

## Environment Setup
pipenv install
pipenv run
(optional: python3 -m pip install -r requirements.txt)

## API Instructions
- Run the API: uvicorn main:app --reload

## Docker Instructions
- Build the image: docker build -t spot-prediction-api .
- Test the image locally: docker run -p 4000:80 spot-prediction-api
- Access Digital Ocean droplet: ssh root@104.131.77.20
- Transfer image to droplet: docker save spot-prediction-api > spot-prediction-api.tar
- Transfer to SCP: scp spot-prediction-api.tar root@104.131.77.20:~/
- Deploy to droplet: docker load < spot-prediction-api.tar
- Run image via droplet: docker run -d -p 80:80 spot-prediction-api

