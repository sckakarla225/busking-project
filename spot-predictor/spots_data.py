import firebase_admin
import random
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('spots-collector-firebase-adminsdk-o6g1h-92e223d0bd.json')
firebase_admin.initialize_app(cred)
# if not firebase_admin._apps:
#     firebase_admin.initialize_app(cred, name=f"Initialization: ${random.randint(1, 100000)}")

db = firestore.client()

def get_spots():
    spots = []
    spots_ref = db.collection('filtered-spots')
    docs = spots_ref.stream()
    for doc in docs:
        data = doc.to_dict()
        coords = data["coordinates"]
        spot = {
            "id": doc.id,
            "name": data["name"],
            "latitude": coords.latitude,
            "longitude": coords.longitude,
        }
        spots.append(spot)
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

