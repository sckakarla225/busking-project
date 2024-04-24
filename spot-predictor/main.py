import ast
import math
import streamlit as st 
from streamlit_folium import folium_static
import pandas as pd
import numpy as np
from joblib import load
from keras.models import load_model
from utils.spots_data import (
    get_spots, 
    get_spot,
    get_spot_media,
    get_spots_difference,
    load_walking_paths
)
from utils.map_visuals import create_map, add_markers, add_markers_initial
from data.static import (
    get_nearby_spots, 
    is_sipnstroll,
    get_nearby_sipnstroll_info,
    get_coords_of_sipnstroll_locations,
    analyze_poi_data,
    get_spot_size_counts
)
from data.visual import (
    get_streetview_snapshots,
    get_streetview_imagery,
    analyze_walking_paths
)
from data.temporal import (
    get_popular_times,
    calculate_average_poi_activity,
    get_visit_raleigh_events,
    find_and_remove_duplicates,
    find_nearby_dra_events, 
    find_nearby_visit_raleigh_events
)
from data.situations import (
    get_raleigh_event_info,
    reformat_events
)
from model.dataset import (
    setup_dataset,
    add_is_sip_n_stroll,
    add_sip_n_stroll_info,
    add_poi_data,
    add_walking_paths,
    add_events,
    filter_events_for_row,
    add_poi_directions,
    split_spot_data,
    split_spot_times,
    preprocess_spot_data,
    preprocess_spot_times,
    format_unique_spot_times,
    preprocess_dataset
)
from model.clustering import main as clustering_main, find_common_paths
from model.classifier import main as classifier_main, prepare_input_for_prediction

reformat_events()

# URLS = []
# manual_urls = [
#     'https://downtownraleigh.org/do/run-club-1',
#     'https://downtownraleigh.org/do/friday-night-cocktails-and-dj-moeskino',
#     'https://downtownraleigh.org/do/downtown-raleigh-guided-african-american-history-tour',
#     'https://downtownraleigh.org/do/historian-guided-downtown-walking-tour',
#     'https://downtownraleigh.org/do/poetry-night',
#     'https://downtownraleigh.org/do/board-game-night',
#     'https://downtownraleigh.org/do/yogasix-run-club-run-restore-rehydrate',
#     'https://downtownraleigh.org/do/studio-tours-and-shopping-at-designed-for-joy',
#     'https://downtownraleigh.org/do/podcast-studio-tour',
# ]

# count = 0
# for url in URLS:
#     event_info = get_raleigh_event_info(url)
#     count += 1
    
# if count == len(URLS):
#     print("All events processed.")
# else:
#     print("Some events missed.")

# st.title("Spot Prediction API")
# st.write("Key Regions: Capital District, Fayetteville Street, Moore Square, Glenwood South, Warehouse District, Historic Oakwood, East Raleigh/Prince Hall/South Park")
# st.write("Target Areas: Hotels, Restaurants/Food Trucks, Music Venues, Museums, Events/Festivals, Nightlife, Stores, Parking Garages")
# st.write("Data Collector: https://busking-project.vercel.app/")

# Given a spot and a time-frame, predict how many people will be around the spot OR walk through the spot
# Available spot data: name, coordinates, images + videos
# Useful data to retrieve: nearby POIs, connected walkways, nearby scheduled events & gatherings

# Nearby POIs data: distance from spot, estimated capacity of indoor space, hours and timings, popularity of space
# Connected walkways data: all paths that go through spot (with corresponding point A and point B + type of place)

# classifier_main()

# Testing prediction input processing function
# encoder = load('encoder.joblib')
# scaler = load('scaler.joblib')
# target_encoder = load('target_encoder.joblib')
# model = load_model('predictor')

# All Spots Data
# st.write("Spots Data")
# spots = get_spots('final-spots')
# df = pd.DataFrame(spots)
# df = df.drop('id', axis=1)
# st.write(df)

# Spots Difference (Filtered minus Final)
# st.write("Spots Difference Data")
# diff_spots = get_spots_difference()
# diff_df = pd.DataFrame(diff_spots)
# diff_df = diff_df.drop('id', axis=1)
# st.write(diff_df)

# Update Filtered Spots with Paths
# load_walking_paths(FINAL_SPOT_IDS)
# load_walking_paths(DIFF_SPOT_IDS)

# size_counts = get_spot_size_counts(spots)
# counts_df = pd.DataFrame([size_counts])
# st.write(counts_df)

# for i in range(2, 41):
#     url = f'https://www.visitraleigh.com/events/?startDate=03%2F01%2F2024&categories%5B0%5D=&page={i}&showallevents=on&regions=Downtown%20Raleigh&endDate=05%2F31%2F2024'
#     events_list = get_visit_raleigh_events(url)
#     st.write(events_list)

# for spot in diff_spots:
#     get_streetview_snapshots(spot_id=spot["id"], lat=spot["latitude"], long=spot["longitude"])

# Visit Raleigh Events Data
# events_df = pd.read_csv('sources/dra_events.csv')
# st.write(events_df)

# st.write("Spots Map")
# filtered_spots_map = create_map((spots[0]["latitude"], spots[0]["longitude"]), spots[0]["name"])
# spots.pop(0)
# filtered_spots_map_updated = add_markers_initial(map=filtered_spots_map, spots=spots)
# folium_static(filtered_spots_map_updated)

# Test Spot Data Collection
# st.write("Test Spot (for data collection using Google Maps API)")
# spot = get_spot('RKhtn3Gr3WYmf4cyaaTT')
# spot_df = pd.DataFrame([spot])
# spot_df = spot_df.drop('id', axis=1)
# spot_df['is_sipnstroll'] = is_sipnstroll(spot["latitude"], spot["longitude"])
# st.write(spot_df)

# st.write("Media Files")
# files_urls = get_spot_media('RKhtn3Gr3WYmf4cyaaTT')
# for name, url in files_urls.items():
#     st.write(f'{name}: {url}')

# st.write("Nearby Places Data and Map")
# nearby_spots = get_nearby_spots(spot["latitude"], spot["longitude"])
# nearby_spots_df = pd.DataFrame(nearby_spots)
# st.write(nearby_spots_df)

# spot_map = create_map((spot["latitude"], spot["longitude"]), spot["name"])
# updated_map = add_markers(map=spot_map, spots=nearby_spots)
# folium_static(updated_map)

# st.write(f'Popular Times for Nearby Places ({len(nearby_spots)})')
# popular_times_for_places = get_popular_times(nearby_spots)
# averages_for_popular_times = calculate_average_poi_activity(popular_times_for_places)
# averages_df = pd.DataFrame(averages_for_popular_times)
# st.write(averages_df)

# st.write("Nearby Events for Test Spot (from March to May)")
# dra_events_df = pd.read_csv('sources/dra_events.csv')
# dra_events_list = dra_events_df.to_dict(orient='records')
# nearby_dra_events = find_nearby_dra_events(dra_events_list, spot["latitude"], spot["longitude"])
# visit_raleigh_events_df = pd.read_csv('sources/visit_raleigh_events_short.csv')
# visit_raleigh_events_list = visit_raleigh_events_df.to_dict(orient='records')
# nearby_visit_raleigh_events = find_nearby_visit_raleigh_events(visit_raleigh_events_list, spot["latitude"], spot["longitude"])
# all_nearby_events = nearby_dra_events + nearby_visit_raleigh_events
# all_nearby_events_df = pd.DataFrame(all_nearby_events)
# st.write(all_nearby_events_df)

# Dataset for Test Spot
# st.write("inshallah")

# lat = 35.7770923562702
# long = -78.63837921140224

# nearby_locations_count, avg_distance, sold_here_count, avg_distance_sold_here, welcome_here_count, avg_distance_welcome_here = get_nearby_sipnstroll_info(lat, long)
# st.write(nearby_locations_count, avg_distance, sold_here_count, avg_distance_sold_here, welcome_here_count, avg_distance_welcome_here)

# st.write("POI Analysis")
# poi_count, avg_poi_distance, poi_weight = analyze_poi_data(nearby_spots)
# st.write(f"POI Count: {poi_count}")
# st.write(f"Avg POI Distance: {avg_poi_distance}")
# st.write(f"POI Density: {poi_weight}")

# st.write("Visual Analysis")
# walking_paths = analyze_walking_paths('RKhtn3Gr3WYmf4cyaaTT')
# print(walking_paths)
# st.write("Detected lines count: " + str(len(walking_paths)))
# for direction in walking_paths:
#     st.write(direction)

# Full prediction model workflow (tested and deployed to API)

# def predict_crowd_level(input_data):
#     encoder = load('encoder.joblib')
#     scaler = load('scaler.joblib')
#     target_encoder = load('target_encoder.joblib')
#     model = load_model('predictor')

#     input_df = pd.DataFrame([input_data])

#     input_df['matching_paths'] = input_df.apply(find_common_paths, axis=1)
#     input_df.drop(['walking_paths', 'poi_directions'], axis=1, inplace=True)
#     input_df['avg_poi_activity'] = input_df['avg_poi_activity'].str.rstrip('%').astype('float') / 100.0
#     input_df['events_count'] = input_df['events'].apply(lambda x: len(x))
#     input_df['matching_paths_count'] = input_df['matching_paths'].apply(lambda x: len(x))
#     input_df.drop(['events', 'matching_paths'], axis=1, inplace=True)
#     input_df['is_sipnstroll'] = input_df['is_sipnstroll'].apply(lambda x: 1 if x else 0)
    
#     input_df['date'] = pd.to_datetime(input_df['date'])
#     input_df['month'] = input_df['date'].dt.month
#     input_df['day_of_month'] = input_df['date'].dt.day
#     input_df['hour'] = pd.to_datetime(input_df['time'], format='%I:%M %p').dt.hour

#     day_encoded = encoder.transform(input_df[['day']])
#     day_encoded_df = pd.DataFrame(day_encoded, columns=encoder.get_feature_names_out(['day']))
#     input_df = pd.concat([input_df, day_encoded_df], axis=1)
#     input_df.drop('day', axis=1, inplace=True)

#     input_df.drop(['date', 'time', 'spot_id'], axis=1, inplace=True)

#     numerical_features = [
#         'latitude', 'longitude', 'avg_poi_activity', 'size',
#         'nearby_sns_count', 'avg_sns_proximity', 'poi_count',
#         'avg_poi_distance', 'poi_weight', 'events_count',
#         'matching_paths_count', 'month', 'day_of_month', 'hour',
#     ]

#     input_df[numerical_features] = scaler.transform(input_df[numerical_features])
    
#     predictions_prob = model.predict(input_df)
#     predicted_labels = target_encoder.inverse_transform(predictions_prob)

#     return predicted_labels[0]

# def prepare_input_for_prediction(
#     spot_id,
#     latitude,
#     longitude,
#     date,
#     time,
#     day
# ):
#     dataset = pd.read_csv('labeled.csv')
#     spot_data = dataset[
#         (dataset['spot_id'] == spot_id) & 
#         (dataset['day'] == day) & 
#         (dataset['time'] == time) &
#         (dataset['date'] == date)
#     ].head(1)
    
#     if spot_data.empty:
#         spot_data = dataset[
#             (dataset['spot_id'] == spot_id)
#         ].head(1)
#         print(spot_data)
        
#         spot_data['walking_paths'] = spot_data['walking_paths'].apply(ast.literal_eval)
#         spot_data['poi_directions'] = spot_data['poi_directions'].apply(ast.literal_eval)
#         spot_data['events'] = spot_data['events'].apply(ast.literal_eval)
        
#         average_times = pd.read_csv('sources/average_times.csv')
#         average_times_data = average_times[
#             (average_times['day'] == day) &
#             (average_times['time'] == time)
#         ]
#         print(average_times_data)
#         average_poi_activity = average_times_data['avg_poi_activity'].iloc[0]
#         percentage = math.ceil(average_poi_activity * 100)
#         formatted_average_poi_activity = f"{percentage}%"
        
#         input_data = {
#             'latitude': latitude,
#             'longitude': longitude,
#             'avg_poi_activity': formatted_average_poi_activity,
#             'size': spot_data['size'].iloc[0],
#             'nearby_sns_count': spot_data['nearby_sns_count'].iloc[0],
#             'avg_sns_proximity': spot_data['avg_sns_proximity'].iloc[0],
#             'poi_count': spot_data['poi_count'].iloc[0],
#             'avg_poi_distance': spot_data['avg_poi_distance'].iloc[0],
#             'poi_weight': spot_data['poi_weight'].iloc[0],
#             'walking_paths': spot_data['walking_paths'].iloc[0],
#             'poi_directions': spot_data['poi_directions'].iloc[0],
#             'events': [],
#             'date': date,
#             'time': time,
#             'spot_id': spot_id,
#             'day': day,
#             'is_sipnstroll': spot_data['is_sipnstroll'].iloc[0]
#         }
        
#         return input_data
#     else:
#         spot_data['walking_paths'] = spot_data['walking_paths'].apply(ast.literal_eval)
#         spot_data['poi_directions'] = spot_data['poi_directions'].apply(ast.literal_eval)
#         spot_data['events'] = spot_data['events'].apply(ast.literal_eval)

#         input_data = {
#             'latitude': latitude,
#             'longitude': longitude,
#             'avg_poi_activity': spot_data['avg_poi_activity'].iloc[0],
#             'size': spot_data['size'].iloc[0],
#             'nearby_sns_count': spot_data['nearby_sns_count'].iloc[0],
#             'avg_sns_proximity': spot_data['avg_sns_proximity'].iloc[0],
#             'poi_count': spot_data['poi_count'].iloc[0],
#             'avg_poi_distance': spot_data['avg_poi_distance'].iloc[0],
#             'poi_weight': spot_data['poi_weight'].iloc[0],
#             'walking_paths': spot_data['walking_paths'].iloc[0],
#             'poi_directions': spot_data['poi_directions'].iloc[0],
#             'events': spot_data['events'].iloc[0],
#             'date': date,
#             'time': time,
#             'spot_id': spot_id,
#             'day': day,
#             'is_sipnstroll': spot_data['is_sipnstroll'].iloc[0]
#         }
    
#         print(input_data)
#         return input_data

# spot_id = '1HB4RWnlDsitlpvngRFT'
# latitude = 35.78130887
# longitude = -78.64023569
# date = '4/26/24'
# time = '8:00 AM'
# day = 'Friday'

# input_data = prepare_input_for_prediction(
#     spot_id=spot_id,
#     latitude=latitude,
#     longitude=longitude,
#     date=date,
#     time=time,
#     day=day
# )
# print(input_data)
# crowd_level_prediction = predict_crowd_level(input_data)
# print(f"Predicted crowd level: {crowd_level_prediction}")