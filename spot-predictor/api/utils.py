from datetime import datetime
from typing import Any, Callable, Dict, List
from joblib import load
import pandas as pd
import numpy as np

encoder = load('encoder.joblib')
scaler = load('scaler.joblib')
target_encoder = load('target_encoder.joblib')

def prepare_input(
    spot_id,
    latitude, 
    longitude, 
    month, 
    day_of_month, 
    hour, 
    day, 
):
    input_data = {
        'latitude': latitude, 
        'longitude': longitude, 
        'month': month, 
        'day_of_month': day_of_month, 
        'hour': hour, 
        'day': day
    }
    input_df = pd.DataFrame([input_data])
    training_feature_names = [
        'latitude', 'longitude', 'avg_poi_activity', 'size',
        'nearby_sns_count', 'avg_sns_proximity', 'poi_count',
        'avg_poi_distance', 'poi_weight', 'events_count',
        'matching_paths_count', 'month', 'day_of_month', 'hour',
        'is_sipnstroll'
    ]
    
    day_encoded = encoder.transform(input_df[['day']])
    day_encoded_df = pd.DataFrame(day_encoded, columns=encoder.get_feature_names_out())
    input_df = pd.concat([input_df.drop(columns=['day']), day_encoded_df], axis=1)
    
    spots_data_df = pd.read_csv('./sources/preprocessed.csv')
    average_times_df = pd.read_csv('./sources/average_times.csv')
    spot_data = spots_data_df[
        (spots_data_df['spot_id'] == spot_id) & 
        (spots_data_df['day'] == day) & 
        (spots_data_df['hour'] == hour) &
        (spots_data_df['month'] == month) &
        (spots_data_df['day_of_month'] == day_of_month)
    ].head(1)
    
    print(spot_data)
    if spot_data.empty:
        spot_data_ref = spots_data_df[(spots_data_df['spot_id'] == spot_id)].head(1)
        for feature in training_feature_names:
            if feature not in input_df.columns:
                if feature == "avg_poi_activity":
                    average_time = average_times_df[
                        (average_times_df['day'] == day) &
                        (average_times_df['hour'] == hour)
                    ].head(1)
                    if not average_time.empty:
                        input_df['avg_poi_activity'] = average_time['avg_poi_activity'].values[0]
                    else:
                        input_df['avg_poi_activity'] = 0.0
                elif feature == "events_count":
                    input_df['events_count'] = 0
                else:
                    if not spot_data_ref.empty:
                        input_df[feature] = spot_data_ref[feature].values[0]
    else:
        for feature in training_feature_names:
            if feature not in input_df.columns:
                input_df[feature] = spot_data[feature].values[0]
    
    numerical_features = [
        'latitude', 'longitude', 'avg_poi_activity', 'size',
        'nearby_sns_count', 'avg_sns_proximity', 'poi_count',
        'avg_poi_distance', 'poi_weight', 'events_count',
        'matching_paths_count', 'month', 'day_of_month', 'hour'
    ]
    input_df[numerical_features] = scaler.transform(input_df[numerical_features])
    
    return input_df

def process_output(probs):
    predicted_index = np.argmax(probs, axis=1)
    labels = target_encoder.categories_[0]
    predicted_labels = labels[predicted_index]
    return predicted_labels

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
        day=day
    )
    
    return input_df

def process_prediction_output(probs: List[Dict]):
    prediction_labels = process_output(probs=probs)
    
    return prediction_labels[0]