import ast
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.metrics import (
    precision_score, 
    recall_score, 
    f1_score, 
    confusion_matrix
)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import tensorflow as tf
from keras.models import Sequential, load_model
from keras.layers import Dense, Dropout, InputLayer
from keras.utils import to_categorical
from keras.optimizers import Adam
from joblib import dump

from model.clustering import find_common_paths

def prepare_input_for_prediction(
    spot_id,
    latitude, 
    longitude, 
    month, 
    day_of_month, 
    hour, 
    day, 
    encoder, 
    scaler
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
    
    spots_data_df = pd.read_csv('sources/preprocessed.csv')
    average_times_df = pd.read_csv('sources/average_times.csv')
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

def process_prediction_output(probs, target_encoder):
    predicted_index = np.argmax(probs, axis=1)
    labels = target_encoder.categories_[0]
    predicted_labels = labels[predicted_index]
    return predicted_labels

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
        epochs=150,
        batch_size=32,
        verbose=2
    )
    
    # Model evaluation and predictions
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=2)
    print(f"Test accuracy: {test_accuracy}")
    print(f"Test loss: {test_loss}")
    
    pipeline = make_pipeline(StandardScaler(), model)
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(pipeline, final_df, y_encoded, cv=kf, scoring='accuracy')
    print(f"Accuracy scores for each fold: {scores}")
    print(f"Mean accuracy: {np.mean(scores)}")
    print(f"Standard deviation of accuracy: {np.std(scores)}")
    
    predictions_prob = model.predict(X_test)
    predictions = np.argmax(predictions_prob, axis=1)
    true_labels = np.argmax(y_test, axis=1)

    precision = precision_score(true_labels, predictions, average='macro')
    recall = recall_score(true_labels, predictions, average='macro')
    f1 = f1_score(true_labels, predictions, average='macro')
    conf_matrix = confusion_matrix(true_labels, predictions)

    print(f"Precision: {precision}\nRecall: {recall}\nF1 Score: {f1}\n")
    print(f"Confusion Matrix:\n{conf_matrix}")
    
    dump(encoder, 'encoder.joblib')
    dump(scaler, 'scaler.joblib')
    dump(target_encoder, 'target_encoder.joblib')
    
    model.save('predictor', save_format="tf")
    
    return model