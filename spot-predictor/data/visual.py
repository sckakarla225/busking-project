import requests

from constants import GOOGLE_MAPS_API_KEY

# GOAL: Gather visual data on spots using images, videos, and StreetView API

# Input: spot info (ID + coordinates)
# Output: saved StreetView snapshots of spot
def get_streetview_snapshots(spot_id, lat, long):
    image_save_location = f'{spot_id}-streetviewmap.jpg'
    url = "https://maps.googleapis.com/maps/api/staticmap"
    params = {
        'center': f'{lat},{long}',
        'zoom': 20,
        'size': '600x400',
        'maptype': 'satellite',
        'key': GOOGLE_MAPS_API_KEY
    } 
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        with open(image_save_location, 'wb') as file:
            file.write(response.content)
        print(f"Map image successfully saved to {image_save_location}.")
    else:
        print(f"Failed to retrieve map image. Status code: {response.status_code}")

# Input: spot info (ID + coordinates) + headings (120-340)
# Output: saved StreetView imagery of spot
def get_streetview_imagery(spot_id, lat, long, heading):
    image_save_location = f'{spot_id}-streetview.jpg'
    url = "https://maps.googleapis.com/maps/api/streetview"
    # Run for each heading from 120-340 to get several images
    params = {
        'size': '600x300',
        'location': f'{lat},{long}',
        'fov': 110,
        'heading': heading,
        'key': GOOGLE_MAPS_API_KEY
    }
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        # Process imagery here, maybe store to firebase?
        with open(image_save_location, 'wb') as file:
            file.write(response.content)
        print(f"Image successfully saved to {image_save_location}.")
    else:
        print(f"Failed to retrieve image. Status code: {response.status_code}")