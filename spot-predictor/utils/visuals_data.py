import firebase_admin
import random
from firebase_admin import credentials, storage
from firebase_admin.exceptions import FirebaseError

cred = credentials.Certificate('streetview-images-6561c-firebase-adminsdk-rl5u7-16d89d72bd.json')
# firebase_admin.initialize_app(cred, options={
#     'storageBucket': 'streetview-images-6561c.appspot.com'
# })
if not firebase_admin._apps:
    firebase_admin.initialize_app(
        cred, 
        options={
            'storageBucket': 'streetview-images-6561c.appspot.com'
        }, 
        name=f"Initialization: ${random.randint(1, 100000)}"
    )

bucket = storage.bucket()

def setup_images_folder(spot_id, file):
    try:
        image_path = f'images/{spot_id}/'
        blob = bucket.blob(image_path)
        blob.upload_from_string(file, content_type='image/jpg')
        print(f"Map image successfully saved to storage at path: {image_path}")
    except FirebaseError as e:
        print(f'Failed to upload to firebase {e}')
    except Exception as e:
        print(f'Some error occurred {e}')