from fastapi import APIRouter, status, HTTPException
from typing import List
from joblib import load
from keras.models import load_model

from api.models import PrepareInputModel, PredictionOutputModel
from api.utils import prepare_input_for_prediction

app_router = APIRouter()
model = load_model('spot-predictor/saved_model')

@app_router.get('/', status_code=status.HTTP_200_OK)
async def user_index():
    return { 'App': 'Index' }

@app_router.post("/predict-spot", status_code=status.HTTP_200_OK)
async def predict_spot(input: PrepareInputModel) -> PredictionOutputModel:
    input_data = input.to_dict()
    prepared_input = prepare_input_for_prediction(input_data)
    prediction = model.predict(prepared_input)
    prediction_output: PredictionOutputModel = {
        'spot_id': input_data['spot_id'],
        'date': input_data['date'],
        'time': input_data['time'],
        'prediction_value': prediction
    }
    
    return prediction_output

@app_router.post('/predict-spots', status_code=status.HTTP_200_OK)
async def predict_spots(inputs: List[PrepareInputModel]) -> List[PredictionOutputModel]:
    prediction_outputs = List[PredictionOutputModel]
    for input in inputs:
        input_data = input.to_dict()
        prepared_input = prepare_input_for_prediction(input_data)
        prediction = model.predict(prepared_input)
        prediction_output: PredictionOutputModel = {
            'spot_id': input_data['spot_id'],
            'date': input_data['date'],
            'time': input_data['time'],
            'prediction_value': prediction
        }
        prediction_outputs.append(prediction_output)
        
    return prediction_outputs
