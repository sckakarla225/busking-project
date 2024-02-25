from pydantic import BaseModel
from typing import Optional
from enum import Enum

class PrepareInputModel(BaseModel):
    spot_id: str
    latitude: float
    longitude: float
    date: str
    time: str 
    day: str
    
class PredictionEnum(str, Enum):
    high = 'High'
    medium = 'Medium'
    low = 'Low'
    
class PredictionOutputModel(BaseModel):
    spot_id: str
    date: str
    time: str
    prediction_value: PredictionEnum