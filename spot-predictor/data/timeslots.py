import pandas as pd
import json
import random
from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from utils import prepare_input_for_spot_prediction, predict_crowd_level

cred = credentials.Certificate('../spots-collector-firebase-adminsdk-o6g1h-92e223d0bd.json')
firebase_admin.initialize_app(cred, options={
    'storageBucket': 'spots-collector.appspot.com'
})
# if not firebase_admin._apps:
#     firebase_admin.initialize_app(
#         cred, 
#         options={
#             'storageBucket': 'spots-collector.appspot.com'
#         }, 
#         name=f"Initialization: ${random.randint(1, 100000)}"
#     )

db = firestore.client()

# Load all spots (relevant data)
def load_spots():
    with open('spots-data.json', 'r') as file:
        data = json.load(file)
        
    filtered_data = [{
        'spotId': item['spotId'],
        'latitude': item['latitude'],
        'longitude': item['longitude'], 
        'name': item['name'], 
        'region': item['region']
    } for item in data]
    return filtered_data

data = load_spots()
print(data)

# Get predictions for each spot (April 2-8, 8:00 AM to 11:00 PM)
dates = [
    '4/3/24', '4/4/24', '4/5/24', '4/6/24', '4/7/24' '4/8/24', '4/9/24'
]
times = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
    '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
]

def get_day_of_week(date_str):
    date_obj = datetime.strptime(date_str, '%m/%d/%y')
    day_of_week = date_obj.strftime('%A')
    return day_of_week

def get_predictions(spots):
    columns = ['spot_id', 'date', 'time', 'prediction']
    df = pd.DataFrame(columns=columns)
    predictions = []
    
    for spot in spots:
        for date in dates:
            for time in times:
                input_data = prepare_input_for_spot_prediction(
                    spot_id=spot['spotId'],
                    latitude=spot['latitude'],
                    longitude=spot['longitude'],
                    date=date,
                    time=time,
                    day=get_day_of_week(date_str=date)
                )
                crowd_level_prediction = predict_crowd_level(input_data)
                if len(crowd_level_prediction) != 0:
                    prediction = {
                        'spot_id': spot['spotId'],
                        'date': date,
                        'time': time,
                        'prediction': crowd_level_prediction[0]
                    }
                    predictions.append(prediction)
    
    predictions_df = pd.DataFrame(predictions)
    df = pd.concat([df, predictions_df], ignore_index=True)
    df.reset_index()
    df.to_csv('predictions.csv', index=False)
    return df

# Create timeslots from predictions
timeslot_dicts = []
with open('timeslots.txt', 'r') as file:
    text_data = file.read()

entries = text_data.strip().split("Name:")
for entry in entries:
    if entry.strip():
        lines = entry.strip().split("\n")
        spotName = lines[0].strip()
        spotId = lines[1].split("ID:")[1].strip()
        time_slots = lines[3:]

        for slot in time_slots:
            parts = slot.split(" - ")
            date = parts[0]
            startTime = parts[1]
            endTime = parts[2]
            timeslot_dict = {
                "spotName": spotName,
                "spotId": spotId,
                "date": date,
                "startTime": startTime,
                "endTime": endTime
            }
            timeslot_dicts.append(timeslot_dict)

print(timeslot_dicts)
print(len(timeslot_dicts))

for timeslot in timeslot_dicts:
    for spot in data:
        if spot['spotId'] == timeslot['spotId']:
            timeslot['spotRegion'] = spot['region']

with open('timeslots.json', 'w') as file:
    json.dump(timeslot_dicts, file, indent=4)

# Upload timeslots to firebase
def upload_to_firebase(timeslots):
    timeslots_ref = db.collection('time-slots')
    for timeslot in timeslots:
        date_string = timeslot['date']
        date_obj = datetime.strptime(date_string, '%m/%d/%y')
        new_date_string = date_obj.strftime('%m/%d/%Y')
        timeslot['date'] = new_date_string
        timeslots_ref.add(timeslot)

upload_to_firebase(timeslot_dicts)

# Get timeslots from firebase and create json file
def get_timeslots_and_create_json():
    try:
        docs = db.collection('time-slots').stream()
        docs_list = [{**doc.to_dict(), "id": doc.id} for doc in docs]
        
        # Write data to JSON file
        with open('timeslots-data.json', 'w') as file:
            json.dump(docs_list, file, indent=4)
            
        print(f"Data successfully written to {'timeslots-data.json'}")
    except Exception as e:
        print(f"An error occurred: {e}")
        
get_timeslots_and_create_json()
