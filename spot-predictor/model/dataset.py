import csv
import pandas as pd

from utils.spots_data import get_spots
from data.static import (
    get_nearby_spots,
    is_sipnstroll,
    get_nearby_sipnstroll_info
)
from data.temporal import (
    get_popular_times,
    calculate_average_poi_activity
)
from constants import CALENDAR

def get_matching_dates(day_of_week):
    dates = []
    for date, day in CALENDAR.items():
        if day == day_of_week:
            dates.append(date)
    return dates

def setup_dataset():
    dataset = pd.DataFrame()
    all_spots = get_spots('filtered-spots')
    
    for spot in all_spots:
        nearby_spots = get_nearby_spots(spot["latitude"], spot["longitude"])
        popular_times_for_places = get_popular_times(nearby_spots)
        averages_for_popular_times = calculate_average_poi_activity(popular_times_for_places)
        for entry in averages_for_popular_times:
            day = entry['day']
            time = entry['time']
            avg_poi_activity = entry['average_poi_activity']
            all_dates = get_matching_dates(day)
            new_rows = []
            for date in all_dates:
                new_row_data = {
                    'spot_id': spot["id"],
                    'latitude': spot["latitude"],
                    'longitude': spot["longitude"],
                    'date': date,
                    'day': day,
                    'time': time,
                    'avg_poi_activity': avg_poi_activity,
                    'size': spot["size"]
                }
                new_rows.append(new_row_data)
            new_rows_df = pd.DataFrame(new_rows)
            dataset = pd.concat([dataset, new_rows_df], ignore_index=True)
            dataset.reset_index()
                
    dataset.to_csv('dataset.csv', index=False)
    return dataset

def add_is_sip_n_stroll():
    df = pd.read_csv('dataset.csv')
    df['is_sipnstroll'] = df.apply(lambda row: is_sipnstroll(row['latitude'], row['longitude']), axis=1)
    print(df.head())
    df.to_csv('dataset.csv', index=False)
    
def add_sip_n_stroll_info():
    df = pd.read_csv('dataset.csv')
    temp_df = df.apply(lambda row: get_nearby_sipnstroll_info(row['latitude'], row['longitude']), axis=1, result_type='expand')
    df['nearby_sns_count'], df['avg_sns_proximity'] = temp_df[0], temp_df[1]
    print(df.head())
    df.to_csv('dataset.csv', index=False)
    
def add_poi_data():
    df = pd.read_csv('dataset.csv')
    poi_df = pd.DataFrame()
    all_spots = get_spots('filtered-spots')
    for spot in all_spots:
        nearby_spots = get_nearby_spots(spot["latitude"], spot["longitude"])
    
    return