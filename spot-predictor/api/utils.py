from datetime import datetime
from typing import Any, Callable, Dict, List
from joblib import load
import pandas as pd

from model.classifier import (
    prepare_input_for_prediction as prepare_input
)

encoder = load('encoder.joblib')
scaler = load('scaler.joblib')

def format_date_and_time(date: str, time: str):
    date_obj = datetime.strptime(date, '%m/%d/%y')
    combined_datetime_str = f"{date} {time}"
    combined_datetime_obj = datetime.strptime(combined_datetime_str, '%m/%d/%y %I:%M %p')
    
    month = date_obj.month
    day_of_month = date_obj.day
    hour = combined_datetime_obj.hour
    
    return month, day_of_month, hour

def prepare_input_for_prediction(
    spot_id: str,
    latitude: float, 
    longitude: float, 
    date: str,
    time: str,
    day: str
):
    month, day_of_month, hour = format_date_and_time(date=date, time=time)
    input_df = prepare_input(
        spot_id=spot_id,
        latitude=latitude,
        longitude=longitude,
        month=month,
        day_of_month=day_of_month,
        hour=hour,
        day=day,
        encoder=encoder,
        scaler=scaler
    )
    
    return input_df