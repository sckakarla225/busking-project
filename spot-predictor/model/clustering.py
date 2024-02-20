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

# Input: dataframe for dataset
# Output: new dataframe with column 'crowd_label' + scatter plot visualization
def test_label_spots(df):
    labels_df_columns = ['poi_activity', 'spot_info_scaled', 'crowd_label']
    labels_df = pd.DataFrame(columns=labels_df_columns)
    rows_to_add = []

    for index, row in df.iterrows():
        avg_poi_activity = row['avg_poi_activity']
        sns_count = row['nearby_sns_count']
        sns_distance = row['avg_sns_proximity']
        poi_distance = row['avg_poi_distance']
        poi_weight = row['poi_weight']
        matching_paths_count = row['matching_paths_count']
        events_count = row['events_count']
        if events_count == 0:
            events_val = False
        else:
            events_val = True
        
        spot_info_val = spot_preprocessing(
            sns_count=sns_count,
            sns_distance=sns_distance,
            poi_distance=poi_distance,
            poi_weight=poi_weight,
            matching_paths_count=matching_paths_count,
            events=events_val
        )
        spot_info_scaled = spot_info_val * avg_poi_activity
        
        MIN_VALUE = 0.002711
        MAX_VALUE = 0.635803
        LOW_PERCENTILE = 0.13385779332636374
        MEDIUM_PERCENTILE = 0.22620513691567307
        if MIN_VALUE <= spot_info_scaled < LOW_PERCENTILE:
            crowd_label = 'Low'
        elif LOW_PERCENTILE <= spot_info_scaled < MEDIUM_PERCENTILE:
            crowd_label = 'Medium'
        elif MEDIUM_PERCENTILE <= spot_info_scaled <= MAX_VALUE:
            crowd_label = 'High'
        
        new_row = [avg_poi_activity, spot_info_scaled, crowd_label]
        rows_to_add.append(new_row)
    
    labels_df = pd.concat(
        [labels_df, pd.DataFrame(rows_to_add, columns=labels_df.columns)], 
        ignore_index=True
    )
    print(labels_df.head()) 
    
    color_map = { 'Low': 'blue', 'Medium': 'green', 'High': 'red' }
    labels_df['color'] = labels_df['crowd_label'].map(color_map)
    plt.scatter(labels_df['spot_info_scaled'], labels_df['poi_activity'], c=labels_df['color'])
    plt.title('Scatter Plot of POI Activity vs. Spot Info Scaled')
    plt.xlabel('Spot Info Scaled')
    plt.ylabel('POI Activity')
    plt.show()

# Input: each row of the dataframe for the dataset
# Output: updated row with column 'crowd_label'
def label_spots_to_dataset(row):
    avg_poi_activity = row['avg_poi_activity']
    sns_count = row['nearby_sns_count']
    sns_distance = row['avg_sns_proximity']
    poi_distance = row['avg_poi_distance']
    poi_weight = row['poi_weight']
    matching_paths_count = row['matching_paths_count']
    events_count = row['events_count']
    if events_count == 0:
        events_val = False
    else:
        events_val = True
    
    spot_info_val = spot_preprocessing(
        sns_count=sns_count,
        sns_distance=sns_distance,
        poi_distance=poi_distance,
        poi_weight=poi_weight,
        matching_paths_count=matching_paths_count,
        events=events_val
    )
    spot_info_scaled = spot_info_val * avg_poi_activity
    
    MIN_VALUE = 0.002711
    MAX_VALUE = 0.635803
    LOW_PERCENTILE = 0.13385779332636374
    MEDIUM_PERCENTILE = 0.22620513691567307
    crowd_label = ''
    if MIN_VALUE <= spot_info_scaled < LOW_PERCENTILE:
        crowd_label = 'Low'
    elif LOW_PERCENTILE <= spot_info_scaled < MEDIUM_PERCENTILE:
        crowd_label = 'Medium'
    elif MEDIUM_PERCENTILE <= spot_info_scaled <= MAX_VALUE:
        crowd_label = 'High'
    
    return crowd_label

def main():
    # Load Dataset
    df = pd.read_csv('dataset.csv')
    original_df = pd.read_csv('dataset.csv')
    
    # Preprocessing
    df['spot'] = df['spot_id'] + '-' + df['date'] + '-' + df['time']
    df.drop(['spot_id', 'date', 'day', 'time', 'is_sipnstroll'], axis=1, inplace=True)
    df['walking_paths'] = df['walking_paths'].apply(ast.literal_eval)
    df['poi_directions'] = df['poi_directions'].apply(ast.literal_eval)
    df['events'] = df['events'].apply(ast.literal_eval)
    
    df['matching_paths'] = df.apply(find_common_paths, axis=1)
    df.drop(['walking_paths', 'poi_directions'], axis=1, inplace=True)
    df['avg_poi_activity'] = df['avg_poi_activity'].str.rstrip('%').astype('float') / 100.0
    df['events_count'] = df['events'].apply(lambda x: len(x))
    df['matching_paths_count'] = df['matching_paths'].apply(lambda x: len(x))
    df.drop(['latitude', 'longitude', 'events', 'matching_paths'], axis=1, inplace=True)
    
    # Clustering
    # test_label_spots(df) # for testing purposes
    df['crowd_label'] = df.apply(lambda row: label_spots_to_dataset(row), axis=1)
    print(df.head())
    print(df.columns)
    original_df['crowd_label'] = df['crowd_label']
    print(original_df.head())
    original_df.to_csv('labeled.csv', index=False)
    
