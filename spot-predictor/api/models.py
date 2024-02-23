from pydantic import BaseModel
from typing import Optional

class PrepareInputModel(BaseModel):
    spot_id: str
    latitude: float
    longitude: float
    date: str
    time: str 
    day: str
    
class PredictionOutputModel(BaseModel):
    spot_id: str
    date: str
    time: str
    prediction_value: str # Add validator to this: 'High', 'Medium, 'Low'