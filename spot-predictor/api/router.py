from fastapi import APIRouter, status, HTTPException
from typing import List
from joblib import load
from keras.models import load_model

from models import PrepareInputModel, PredictionOutputModel
from utils import prepare_input_for_prediction, process_prediction_output

app_router = APIRouter()
model = load_model('./predictor')

@app_router.get('/', status_code=status.HTTP_200_OK)
async def app_index():
    return { 'App': 'Index' }

@app_router.post("/predict-spot", status_code=status.HTTP_200_OK)
async def predict_spot(input: PrepareInputModel) -> PredictionOutputModel:
    prepared_input = prepare_input_for_prediction(
        spot_id=input.spot_id,
        latitude=input.latitude,
        longitude=input.longitude,
        date=input.date,
        time=input.time,
        day=input.day  
    )
    prediction = model.predict(prepared_input)
    prediction_label = process_prediction_output(prediction)
    prediction_output: PredictionOutputModel = {
        'spot_id': input.spot_id,
        'date': input.date,
        'time': input.time,
        'prediction_value': prediction_label
    }
    
    return prediction_output

@app_router.post('/predict-spots', status_code=status.HTTP_200_OK)
async def predict_spots(inputs: List[PrepareInputModel]) -> List[PredictionOutputModel]:
    prediction_outputs: List[PredictionOutputModel] = []
    for input in inputs:
        prepared_input = prepare_input_for_prediction(
            spot_id=input.spot_id,
            latitude=input.latitude,
            longitude=input.longitude,
            date=input.date,
            time=input.time,
            day=input.day 
        )
        prediction = model.predict(prepared_input)
        prediction_label = process_prediction_output(prediction)
        prediction_output: PredictionOutputModel = {
            'spot_id': input.spot_id,
            'date': input.date,
            'time': input.time,
            'prediction_value': prediction_label
        }
        prediction_outputs.append(prediction_output)
        
    return prediction_outputs
