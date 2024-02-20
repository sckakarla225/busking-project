import ast
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# Input: each row in dataset
# Output: Common path values that are in walking_paths and poi_directions for each row
def find_common_paths(row):
    return list(set(row['walking_paths']) & set(row['poi_directions']))

# Input: sns_count (float), sns_distance (float), poi_weight (int), poi_distance (float), matching_paths_count (int), events (boolean)
# Output: spot_info_value (float - 0.0-1.0)
def spot_preprocessing(sns_count, sns_distance, poi_weight, poi_distance, matching_paths_count, events):
    SNS_COUNT_RANGE = (1, 17)
    SNS_DISTANCE_RANGE = (1.0, 98.73)
    POI_WEIGHT_RANGE = (9, 94)
    POI_DISTANCE_RANGE = (6.93, 64.35)
    MATCHING_PATHS_COUNT_RANGE = (1, 9)
    
    percentiles = {}
    sns_count += 1
    sns_distance += 1.0
    matching_paths_count += 1
    
    sns_count_lower_bound = SNS_COUNT_RANGE[0]
    sns_count_upper_bound = SNS_COUNT_RANGE[1]
    multiplier = 100 / sns_count_upper_bound
    sns_count = sns_count * multiplier
    sns_count_upper_bound = 100
    sns_count_lower_bound = sns_count_lower_bound * multiplier
    new_range = sns_count_upper_bound - sns_count_lower_bound
    scaled_value = sns_count - sns_count_lower_bound
    percentile = scaled_value / new_range
    percentiles["sns_count"] = percentile
    
    sns_distance_lower_bound = SNS_DISTANCE_RANGE[0]
    sns_distance_upper_bound = SNS_DISTANCE_RANGE[1]
    multiplier = 100 / sns_distance_upper_bound
    sns_distance = sns_distance * multiplier
    sns_distance_upper_bound = 100
    sns_distance_lower_bound = sns_distance_lower_bound * multiplier
    new_range = sns_distance_upper_bound - sns_distance_lower_bound
    scaled_value = sns_distance - sns_distance_lower_bound
    percentile = scaled_value / new_range
    percentiles["sns_distance"] = 1.0 - percentile
    
    poi_distance_lower_bound = POI_DISTANCE_RANGE[0]
    poi_distance_upper_bound = POI_DISTANCE_RANGE[1]
    multiplier = 100 / poi_distance_upper_bound
    poi_distance = poi_distance * multiplier
    poi_distance_upper_bound = 100
    poi_distance_lower_bound = poi_distance_lower_bound * multiplier
    new_range = poi_distance_upper_bound - poi_distance_lower_bound
    scaled_value = poi_distance - poi_distance_lower_bound
    percentile = scaled_value / new_range
    percentiles["poi_distance"] = 1.0 - percentile
    percentiles["avg_distance"] = (percentiles['poi_distance'] + percentiles['sns_distance']) / 2
    
    poi_weight_lower_bound = POI_WEIGHT_RANGE[0]
    poi_weight_upper_bound = POI_WEIGHT_RANGE[1]
    multiplier = 100 / poi_weight_upper_bound
    poi_weight = poi_weight * multiplier
    poi_weight_upper_bound = 100
    poi_weight_lower_bound = poi_weight_lower_bound * multiplier
    new_range = poi_weight_upper_bound - poi_weight_lower_bound
    scaled_value = poi_weight - poi_weight_lower_bound
    percentile = scaled_value / new_range
    percentiles["poi_weight"] = percentile
    
    matching_paths_count_lower_bound = MATCHING_PATHS_COUNT_RANGE[0]
    matching_paths_count_upper_bound = MATCHING_PATHS_COUNT_RANGE[1]
    multiplier = 100 / matching_paths_count_upper_bound
    matching_paths_count = matching_paths_count * multiplier
    matching_paths_count_upper_bound = 100
    matching_paths_count_lower_bound = matching_paths_count_lower_bound * multiplier
    new_range = matching_paths_count_upper_bound - matching_paths_count_lower_bound
    scaled_value = matching_paths_count - matching_paths_count_lower_bound
    percentile = scaled_value / new_range
    percentiles["matching_paths_count"] = percentile
    
    if events:
        events_val = 1.0
        POI_WEIGHT_WEIGHT = 0.40
        AVG_DISTANCE_WEIGHT = 0.30
        SNS_COUNT_WEIGHT = 0.075
        MATCHING_PATHS_COUNT_WEIGHT = 0.075
        EVENTS_WEIGHT = 0.15
        scaled_poi_weight = percentiles['poi_weight'] * POI_WEIGHT_WEIGHT
        scaled_avg_distance_weight = percentiles['avg_distance'] * AVG_DISTANCE_WEIGHT
        scaled_sns_count_weight = percentiles['sns_count'] * SNS_COUNT_WEIGHT
        scaled_matching_paths_count_weight = percentiles['matching_paths_count'] * MATCHING_PATHS_COUNT_WEIGHT
        scaled_events_weight = events_val * EVENTS_WEIGHT
        spot_info_val = scaled_poi_weight + scaled_avg_distance_weight + scaled_sns_count_weight + scaled_matching_paths_count_weight + scaled_events_weight
        return spot_info_val
    else:
        events_val = 0.0
        POI_WEIGHT_WEIGHT = 0.45
        AVG_DISTANCE_WEIGHT = 0.35
        SNS_COUNT_WEIGHT = 0.10
        MATCHING_PATHS_COUNT_WEIGHT = 0.10
        EVENTS_WEIGHT = 0.0
        scaled_poi_weight = percentiles['poi_weight'] * POI_WEIGHT_WEIGHT
        scaled_avg_distance_weight = percentiles['avg_distance'] * AVG_DISTANCE_WEIGHT
        scaled_sns_count_weight = percentiles['sns_count'] * SNS_COUNT_WEIGHT
        scaled_matching_paths_count_weight = percentiles['matching_paths_count'] * MATCHING_PATHS_COUNT_WEIGHT
        scaled_events_weight = events_val * EVENTS_WEIGHT
        spot_info_val = scaled_poi_weight + scaled_avg_distance_weight + scaled_sns_count_weight + scaled_matching_paths_count_weight + scaled_events_weight
        return spot_info_val

# Input: each row in dataset
# Output: updated dataframe with column 'crowd_label'
def label_spots():
    return

def main():
    # Load Dataset
    df = pd.read_csv('dataset.csv')
    
    columns_of_interest = ['poi_count', 'nearby_sns_count', 'avg_sns_proximity', 'avg_poi_distance', 'poi_weight']
    min_values = df[columns_of_interest].min()
    max_values = df[columns_of_interest].max()
    print("Minimum values:\n", min_values)
    print("Maximum values:\n", max_values)
    
    # Preprocessing
    df['spot'] = df['spot_id'] + '-' + df['date'] + '-' + df['time']
    df.drop(['spot_id', 'date', 'day', 'time', 'is_sipnstroll'], axis=1, inplace=True)
    df['walking_paths'] = df['walking_paths'].apply(ast.literal_eval)
    df['poi_directions'] = df['poi_directions'].apply(ast.literal_eval)
    df['matching_paths'] = df.apply(find_common_paths, axis=1)
    df.drop(['walking_paths', 'poi_directions'], axis=1, inplace=True)
    df['avg_poi_activity'] = df['avg_poi_activity'].str.rstrip('%').astype('float') / 100.0
    df['events_count'] = df['events'].apply(lambda x: len(x))
    df['matching_paths_count'] = df['matching_paths'].apply(lambda x: len(x))
    df.drop(['latitude', 'longitude', 'events', 'matching_paths'], axis=1, inplace=True)
    
    
    
    

    
    