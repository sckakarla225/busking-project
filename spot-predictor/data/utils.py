from datetime import datetime
from typing import Any, Callable, Dict, List
from joblib import load
from keras.models import load_model
import pandas as pd
import numpy as np
import ast
import math

def find_common_paths(row):
    return list(set(row['walking_paths']) & set(row['poi_directions']))

def prepare_input_for_spot_prediction(
    spot_id,
    latitude,
    longitude,
    date,
    time,
    day
):
    dataset = pd.read_csv('sources/labeled.csv')
    spot_data = dataset[
        (dataset['spot_id'] == spot_id) & 
        (dataset['day'] == day) & 
        (dataset['time'] == time) &
        (dataset['date'] == date)
    ].head(1)
    
    if spot_data.empty:
        spot_data = dataset[
            (dataset['spot_id'] == spot_id)
        ].head(1)
        print(spot_data)
        
        spot_data['walking_paths'] = spot_data['walking_paths'].apply(ast.literal_eval)
        spot_data['poi_directions'] = spot_data['poi_directions'].apply(ast.literal_eval)
        spot_data['events'] = spot_data['events'].apply(ast.literal_eval)
        
        average_times = pd.read_csv('sources/average_times.csv')
        average_times_data = average_times[
            (average_times['day'] == day) &
            (average_times['time'] == time)
        ]
        print(average_times_data)
        average_poi_activity = average_times_data['avg_poi_activity'].iloc[0]
        percentage = math.ceil(average_poi_activity * 100)
        formatted_average_poi_activity = f"{percentage}%"
        
        input_data = {
            'latitude': latitude,
            'longitude': longitude,
            'avg_poi_activity': formatted_average_poi_activity,
            'size': spot_data['size'].iloc[0],
            'nearby_sns_count': spot_data['nearby_sns_count'].iloc[0],
            'avg_sns_proximity': spot_data['avg_sns_proximity'].iloc[0],
            'poi_count': spot_data['poi_count'].iloc[0],
            'avg_poi_distance': spot_data['avg_poi_distance'].iloc[0],
            'poi_weight': spot_data['poi_weight'].iloc[0],
            'walking_paths': spot_data['walking_paths'].iloc[0],
            'poi_directions': spot_data['poi_directions'].iloc[0],
            'events': [],
            'date': date,
            'time': time,
            'spot_id': spot_id,
            'day': day,
            'is_sipnstroll': spot_data['is_sipnstroll'].iloc[0]
        }
        
        return input_data
    else:
        spot_data['walking_paths'] = spot_data['walking_paths'].apply(ast.literal_eval)
        spot_data['poi_directions'] = spot_data['poi_directions'].apply(ast.literal_eval)
        spot_data['events'] = spot_data['events'].apply(ast.literal_eval)

        input_data = {
            'latitude': latitude,
            'longitude': longitude,
            'avg_poi_activity': spot_data['avg_poi_activity'].iloc[0],
            'size': spot_data['size'].iloc[0],
            'nearby_sns_count': spot_data['nearby_sns_count'].iloc[0],
            'avg_sns_proximity': spot_data['avg_sns_proximity'].iloc[0],
            'poi_count': spot_data['poi_count'].iloc[0],
            'avg_poi_distance': spot_data['avg_poi_distance'].iloc[0],
            'poi_weight': spot_data['poi_weight'].iloc[0],
            'walking_paths': spot_data['walking_paths'].iloc[0],
            'poi_directions': spot_data['poi_directions'].iloc[0],
            'events': spot_data['events'].iloc[0],
            'date': date,
            'time': time,
            'spot_id': spot_id,
            'day': day,
            'is_sipnstroll': spot_data['is_sipnstroll'].iloc[0]
        }
    
        print(input_data)
        return input_data
    
def predict_crowd_level(input_data):
    encoder = load('encoder.joblib')
    scaler = load('scaler.joblib')
    target_encoder = load('target_encoder.joblib')
    model = load_model('./predictor', compile=False)

    input_df = pd.DataFrame([input_data])

    input_df['matching_paths'] = input_df.apply(find_common_paths, axis=1)
    input_df.drop(['walking_paths', 'poi_directions'], axis=1, inplace=True)
    input_df['avg_poi_activity'] = input_df['avg_poi_activity'].str.rstrip('%').astype('float') / 100.0
    input_df['events_count'] = input_df['events'].apply(lambda x: len(x))
    input_df['matching_paths_count'] = input_df['matching_paths'].apply(lambda x: len(x))
    input_df.drop(['events', 'matching_paths'], axis=1, inplace=True)
    input_df['is_sipnstroll'] = input_df['is_sipnstroll'].apply(lambda x: 1 if x else 0)
    
    input_df['date'] = pd.to_datetime(input_df['date'])
    input_df['month'] = input_df['date'].dt.month
    input_df['day_of_month'] = input_df['date'].dt.day
    input_df['hour'] = pd.to_datetime(input_df['time'], format='%I:%M %p').dt.hour

    day_encoded = encoder.transform(input_df[['day']])
    day_encoded_df = pd.DataFrame(day_encoded, columns=encoder.get_feature_names_out(['day']))
    input_df = pd.concat([input_df, day_encoded_df], axis=1)
    input_df.drop('day', axis=1, inplace=True)

    input_df.drop(['date', 'time', 'spot_id'], axis=1, inplace=True)

    numerical_features = [
        'latitude', 'longitude', 'avg_poi_activity', 'size',
        'nearby_sns_count', 'avg_sns_proximity', 'poi_count',
        'avg_poi_distance', 'poi_weight', 'events_count',
        'matching_paths_count', 'month', 'day_of_month', 'hour',
    ]

    input_df[numerical_features] = scaler.transform(input_df[numerical_features])
    
    predictions_prob = model.predict(input_df)
    predicted_labels = target_encoder.inverse_transform(predictions_prob)

    return predicted_labels[0]