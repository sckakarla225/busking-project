import ast
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

def find_common_paths(row):
    return list(set(row['walking_paths']) & set(row['poi_directions']))

def main():
    # Load Dataset
    df = pd.read_csv('dataset.csv')
    
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
    
    identifiers = df['spot']
    features = ['size', 'avg_poi_activity', 'poi_count', 'avg_poi_distance', 'poi_weight', 'nearby_sns_count', 'avg_sns_proximity', 'events_count', 'matching_paths_count']
    X = df[features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    print(X_scaled)
    
    # Principal Component Analysis (PCA)
    poi_features = ['poi_count', 'avg_poi_distance', 'poi_weight']
    sns_features = ['nearby_sns_count', 'avg_sns_proximity']
    spot_dim_features = ['size', 'matching_paths_count']

    poi_indexes = [features.index(feat) for feat in poi_features]
    sns_indexes = [features.index(feat) for feat in sns_features]
    spot_dim_indexes = [features.index(feat) for feat in spot_dim_features]

    X_poi_scaled = X_scaled[:, poi_indexes]
    X_sns_scaled = X_scaled[:, sns_indexes]
    X_spot_dim_scaled = X_scaled[:, spot_dim_indexes]
    
    pca_poi = PCA(n_components=0.90)
    X_poi_pca = pca_poi.fit_transform(X_poi_scaled)

    pca_sns = PCA(n_components=0.90)
    X_sns_pca = pca_sns.fit_transform(X_sns_scaled)
    
    pca_spot_dim = PCA(n_components=0.90)
    X_spot_dim_pca = pca_spot_dim.fit_transform(X_spot_dim_scaled)
    
    print("POI - Number of PCA components:", pca_poi.n_components_)
    print("POI - Explained variance ratio:", pca_poi.explained_variance_ratio_)

    print("SNS - Number of PCA components:", pca_sns.n_components_)
    print("SNS - Explained variance ratio:", pca_sns.explained_variance_ratio_)
    
    print("Spot Dim - Number of PCA components:", pca_spot_dim.n_components_)
    print("Spot Dim - Explained variance ratio:", pca_spot_dim.explained_variance_ratio_)
    
    # DBSCAN Clustering Model
    all_pca_features = set(poi_features + sns_features + spot_dim_features)
    non_pca_feature_indexes = [i for i, feature in enumerate(features) if feature not in all_pca_features]
    X_non_pca_scaled = X_scaled[:, non_pca_feature_indexes]
    X_combined = np.concatenate([X_non_pca_scaled, X_poi_pca, X_sns_pca, X_spot_dim_pca], axis=1)
    
    dbscan = DBSCAN(eps=0.9, min_samples=18)
    clusters = dbscan.fit_predict(X_combined)
    
    pca_for_viz = PCA(n_components=2)
    features_for_viz = pca_for_viz.fit_transform(X_combined)
   
    plt.figure(figsize=(10, 7))
    plt.scatter(features_for_viz[:, 0], features_for_viz[:, 1], c=clusters, cmap='viridis', marker='o', edgecolor='k', s=50, alpha=0.5)
    plt.title('DBSCAN Clustering with PCA')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.colorbar(label='Cluster label')
    plt.show()
    
    

    
    