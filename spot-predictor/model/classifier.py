import ast
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import tensorflow as tf
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, InputLayer
from keras.utils import to_categorical
from keras.optimizers import Adam

from model.clustering import find_common_paths

def prepare_input_with_dummies(
    latitude, 
    longitude, 
    month, 
    day_of_month, 
    hour, day, 
    encoder, 
    scaler, 
    training_feature_names
):
    input_data = {'latitude': latitude, 'longitude': longitude, 'month': month, 'day_of_month': day_of_month, 'hour': hour, 'day': day}
    input_df = pd.DataFrame([input_data])
    
    day_encoded = encoder.transform(input_df[['day']])
    day_encoded_df = pd.DataFrame(day_encoded.toarray(), columns=encoder.get_feature_names_out(['day']))
    input_df = pd.concat([input_df.drop(columns=['day']), day_encoded_df], axis=1)
    
    for feature in training_feature_names:
        if feature not in input_df.columns:
            input_df[feature] = 0
    
    input_df = input_df[training_feature_names]
    input_df = scaler.transform(input_df)
    
    return input_df

def main():
    # Load and setup dataset
    df = pd.read_csv('labeled.csv')
    df['walking_paths'] = df['walking_paths'].apply(ast.literal_eval)
    df['poi_directions'] = df['poi_directions'].apply(ast.literal_eval)
    df['events'] = df['events'].apply(ast.literal_eval)
    
    # Basic preprocessing
    df['matching_paths'] = df.apply(find_common_paths, axis=1)
    df.drop(['walking_paths', 'poi_directions'], axis=1, inplace=True)
    df['avg_poi_activity'] = df['avg_poi_activity'].str.rstrip('%').astype('float') / 100.0
    df['events_count'] = df['events'].apply(lambda x: len(x))
    df['matching_paths_count'] = df['matching_paths'].apply(lambda x: len(x))
    df.drop(['events', 'matching_paths'], axis=1, inplace=True)
    df['is_sipnstroll'] = df['is_sipnstroll'].apply(lambda x: 1 if x == True else 0)
    
    # Numerically format datetime features
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    df['hour'] = pd.to_datetime(df['time'], format='%I:%M %p').dt.hour
    df.drop(['date', 'time', 'spot_id'], axis=1, inplace=True)
    
    # Encoding categorical variables
    encoder = OneHotEncoder(sparse_output=False)
    encoded_features = encoder.fit_transform(df[['day']])
    encoded_feature_names = encoder.get_feature_names_out(['day'])
    encoded_df = pd.DataFrame(encoded_features, columns=encoded_feature_names)
    final_df = pd.concat([df, encoded_df], axis=1)
    final_df.drop(['day', 'crowd_label'], axis=1, inplace=True)
    
    # Normalizing features
    scaler = StandardScaler()
    numerical_features = [
        'latitude', 'longitude', 'avg_poi_activity', 'size',
        'nearby_sns_count', 'avg_sns_proximity', 'poi_count',
        'avg_poi_distance', 'poi_weight', 'events_count',
        'matching_paths_count', 'month', 'day_of_month', 'hour'
    ]
    final_df[numerical_features] = scaler.fit_transform(final_df[numerical_features])
    print(final_df.head())
    
    # Preparing target variable 'crowd_label': 3 Classes - Low, Medium, High
    target_encoder = OneHotEncoder(sparse_output=False)
    y_encoded = target_encoder.fit_transform(df[['crowd_label']])
    num_classes = len(target_encoder.categories_[0])
    
    # Model training
    X_train, X_test, y_train, y_test = train_test_split(
        final_df, 
        y_encoded, 
        test_size=0.2, 
        random_state=42
    )
    
    model = Sequential([
        InputLayer(input_shape=(final_df.shape[1],)),
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(128, activation='relu'),
        Dropout(0.3),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    model.summary()
    model.fit(
        X_train,
        y_train,
        validation_split=0.2,
        epochs=200,
        batch_size=32,
        verbose=2
    )
    
    # Model evaluation and predictions
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=2)
    print(f"Test accuracy: {test_accuracy}")
    
    return