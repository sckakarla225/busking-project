import firebase_admin
import random
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('spots-collector-firebase-adminsdk-o6g1h-92e223d0bd.json')
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, name=f"Initialization: ${random.randint(1, 100000)}")

db = firestore.client()

def get_spots():
    spots = []
    spots_ref = db.collection('spots')
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
