import firebase_admin
import random
import datetime
from firebase_admin import credentials
from firebase_admin import firestore, storage

from constants import FINAL_SPOT_IDS

cred = credentials.Certificate('spots-collector-firebase-adminsdk-o6g1h-92e223d0bd.json')
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
bucket = storage.bucket()

def get_spots(collection_name):
    spots = []
    spot_ids = []
    spots_ref = db.collection(collection_name)
    docs = spots_ref.stream()
    for doc in docs:
        data = doc.to_dict()
        coords = data["coordinates"]
        spot = {
            "id": doc.id,
            "name": data["name"],
            "latitude": coords.latitude,
            "longitude": coords.longitude,
            "size": data["size"],
        }
        spots.append(spot)
        spot_ids.append(doc.id)
    return spots

def get_spots_difference():
    spots = []
    spot_ids = []
    spots_ref = db.collection('filtered-spots')
    docs = spots_ref.stream()
    for doc in docs:
        if doc.id not in FINAL_SPOT_IDS:
            data = doc.to_dict()
            coords = data["coordinates"]
            spot = {
                "id": doc.id,
                "name": data["name"],
                "latitude": coords.latitude,
                "longitude": coords.longitude,
                "size": data["size"]
            }
            spots.append(spot)
            spot_ids.append(doc.id)
    return spots

def get_spot(spot_id: str):
    spot_ref = db.collection('spots').document(spot_id)
    spot = spot_ref.get()
    if spot.exists:
        data = spot.to_dict()
        spot_coords = data["coordinates"]
        spot_data = {
            "id": spot.id,
            "name": data["name"],
            "latitude": spot_coords.latitude,
            "longitude": spot_coords.longitude,
        }
        return spot_data
    else:
        return {}
    
def load_walking_paths(walking_paths):
    for key, value in walking_paths.items():
        doc_ref = db.collection('filtered-spots').document(key)
        update_data = {
            'paths': value,
        }
        try:
            doc_ref.update(update_data)
        except:
            print(f"Error updating {key}")
    
def duplicate_all_spots():
    source_ref = db.collection('spots')
    docs = source_ref.stream()

    batch = db.batch()
    count = 0

    for doc in docs:
        target_ref = db.collection('filtered-spots').document(doc.id)
        batch.set(target_ref, doc.to_dict())
        count += 1

        if count % 500 == 0:
            batch.commit()
            batch = db.batch()
    
    batch.commit()
    print(f'Collection spots duplicated to filtered-spots successfully.')

def make_final_list(names):
    count = 0
    for name in names:
        doc_ref = db.collection('filtered-spots').where('name', '==', name).stream()
        if doc_ref is None:
            print(f'${name} not found.')
        for doc in doc_ref:
            doc_dict = doc.to_dict()
            db.collection('final-spots').document(doc.id).set(doc_dict)
            count += 1
    print(f'${count} spots transferred to final-spots collection.')

def get_spot_media(spot_id):
    folder_path = f'images/{spot_id}/'
    blobs = bucket.list_blobs(prefix=folder_path)
    files_urls = {}
    
    for blob in blobs:
        url = blob.generate_signed_url(datetime.timedelta(hours=1), method='GET')
        files_urls[blob.name] = url
    
    return files_urls