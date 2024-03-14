from fastapi import APIRouter, status, HTTPException
from typing import List

from models import PrepareInputModel, PredictionOutputModel
from utils import prepare_input_for_spot_prediction, predict_crowd_level

app_router = APIRouter()

@app_router.get('/', status_code=status.HTTP_200_OK)
async def app_index():
    return { 'App': 'Index' }

@app_router.post("/predict-spot", status_code=status.HTTP_200_OK)
async def predict_spot(input: PrepareInputModel) -> PredictionOutputModel:
    input_data = prepare_input_for_spot_prediction(
        spot_id=input.spot_id,
        latitude=input.latitude,
        longitude=input.longitude,
        date=input.date,
        time=input.time,
        day=input.day
    )
    crowd_level_prediction = predict_crowd_level(input_data)
    if len(crowd_level_prediction) != 0:
        prediction_output: PredictionOutputModel = {
            'spot_id': input.spot_id,
            'date': input.date,
            'time': input.time,
            'prediction_value': crowd_level_prediction[0]
        }
        return prediction_output 
    else:
        return { "Error": "Unable to generate prediction" }

@app_router.post('/predict-spots', status_code=status.HTTP_200_OK)
async def predict_spots(inputs: List[PrepareInputModel]) -> List[PredictionOutputModel]:
    prediction_outputs: List[PredictionOutputModel] = []
    isError = False
    
    for input in inputs:
        input_data = prepare_input_for_spot_prediction(
            spot_id=input.spot_id,
            latitude=input.latitude,
            longitude=input.longitude,
            date=input.date,
            time=input.time,
            day=input.day
        )
        crowd_level_prediction = predict_crowd_level(input_data)
        if len(crowd_level_prediction) != 0:
            prediction_output: PredictionOutputModel = {
                'spot_id': input.spot_id,
                'date': input.date,
                'time': input.time,
                'prediction_value': crowd_level_prediction[0]
            }
            prediction_outputs.append(prediction_output)
        else:
            isError = True
            
    if isError:
        return { "Error": "Unable to generate predictions" }
        
    return prediction_outputs
