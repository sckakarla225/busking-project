import csv
import ast
import pandas as pd
from datetime import datetime

from utils.spots_data import get_spots
from data.static import (
    get_nearby_spots,
    is_sipnstroll,
    get_nearby_sipnstroll_info,
    analyze_poi_data
)
from data.temporal import (
    get_popular_times,
    calculate_average_poi_activity,
    find_nearby_dra_events,
    find_nearby_visit_raleigh_events
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
    columns = ['spot_id', 'poi_count', 'avg_poi_distance', 'poi_weight']
    poi_df = pd.DataFrame(columns=columns)
    all_spots = get_spots('filtered-spots')
    rows_to_add = []
    
    for spot in all_spots:
        nearby_spots = get_nearby_spots(spot["latitude"], spot["longitude"])
        poi_count, avg_poi_distance, poi_weight = analyze_poi_data(nearby_spots)
        new_row = [spot["id"], poi_count, avg_poi_distance, poi_weight]
        print(new_row)
        rows_to_add.append(new_row)
        
    poi_df = pd.concat([poi_df, pd.DataFrame(rows_to_add, columns=poi_df.columns)], ignore_index=True)
    print(poi_df.head())
    merged_df = pd.merge(df, poi_df[['spot_id', 'poi_count', 'avg_poi_distance', 'poi_weight']], on='spot_id', how='left')
    print(merged_df.head())
    merged_df.to_csv('dataset.csv', index=False)

def add_walking_paths():
    df = pd.read_csv('dataset.csv')
    columns = ['spot_id', 'walking_paths']
    walking_df = pd.DataFrame(columns=columns)
    all_spots = get_spots('filtered-spots')
    rows_to_add = []
    
    for spot in all_spots:
        spot_id = spot["id"]
        walking_paths = spot["walking_paths"]
        new_row = [spot_id, walking_paths]
        print(new_row)
        rows_to_add.append(new_row)
        
    walking_df = pd.concat([walking_df, pd.DataFrame(rows_to_add, columns=walking_df.columns)], ignore_index=True)
    print(walking_df.head())
    merged_df = pd.merge(df, walking_df[['spot_id', 'walking_paths']], on='spot_id', how='left')
    print(merged_df.head())
    merged_df.to_csv('dataset.csv', index=False)
    
def format_time(time_str):
    return datetime.strptime(time_str, '%I:%M %p').time() 

def is_time_within(start_time_str, end_time_str, current_time_str):
    start_time = format_time(start_time_str)
    end_time = format_time(end_time_str)
    current_time = format_time(current_time_str)
    return start_time <= current_time <= end_time

def filter_events_for_row(row):
    dra_events_df = pd.read_csv('sources/dra_events.csv')
    dra_events_list = dra_events_df.to_dict(orient='records')
    visit_raleigh_events_df = pd.read_csv('sources/visit_raleigh_events_short.csv')
    visit_raleigh_events_list = visit_raleigh_events_df.to_dict(orient='records')
    nearby_visit_raleigh_events = find_nearby_visit_raleigh_events(
        visit_raleigh_events_list,
        row['latitude'], 
        row['longitude']
    )
    nearby_dra_events = find_nearby_dra_events(
        dra_events_list,
        row['latitude'], 
        row['longitude']
    )
    nearby_events = nearby_visit_raleigh_events + nearby_dra_events
    
    date_obj = datetime.strptime(row['date'], "%m/%d/%y")
    formatted_row_date = date_obj.strftime("%m/%d/%Y")
    
    filtered_events = [
        event['name'] for event in nearby_events
        if event['date'] == formatted_row_date and is_time_within(event['start_time'], event['end_time'], row['time'])
    ]
    return filtered_events
    
def add_events():
    df = pd.read_csv('dataset.csv')
    df['events'] = df.apply(lambda row: filter_events_for_row(row), axis=1)
    print(df.head())
    df.to_csv('dataset.csv', index=False)
    
def add_poi_directions():
    df = pd.read_csv('dataset.csv')
    columns = ['spot_id', 'poi_directions']
    poi_directions_df = pd.DataFrame(columns=columns)
    all_spots = get_spots('filtered-spots')
    rows_to_add = []
    
    for spot in all_spots:
        nearby_spots = get_nearby_spots(spot["latitude"], spot["longitude"])
        seen_paths = set()
        poi_directions = []
        
        for nearby_spot in nearby_spots:
            if nearby_spot["direction"] not in seen_paths:
                seen_paths.add(nearby_spot["direction"])
                poi_directions.append(nearby_spot["direction"])
        
        new_row = [spot["id"], poi_directions]
        rows_to_add.append(new_row)
        
    poi_directions_df = pd.concat(
        [poi_directions_df, pd.DataFrame(rows_to_add, columns=poi_directions_df.columns)], 
        ignore_index=True
    )
    print(poi_directions_df.head())
    merged_df = pd.merge(df, poi_directions_df[['spot_id', 'poi_directions']], on='spot_id', how='left')
    print(merged_df.head())
    merged_df.to_csv('dataset.csv', index=False)
    