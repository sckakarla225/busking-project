import requests
import math
import cv2
import numpy as np

from constants import GOOGLE_MAPS_API_KEY
from utils.visuals_data import setup_images_folder

# GOAL: Gather visual data on spots using images, videos, and StreetView API

# Input: spot info (ID + coordinates)
# Output: saved StreetView snapshots of spot
def get_streetview_snapshots(spot_id, lat, long):
    image_save_location = f'images/{spot_id}-streetviewmap.jpg'
    url = "https://maps.googleapis.com/maps/api/staticmap"
    params = {
        'center': f'{lat},{long}',
        'zoom': 19,
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
def get_streetview_imagery(spot_id, lat, long):
    url = "https://maps.googleapis.com/maps/api/streetview"
    heading = 120
    while heading <= 340:
        image_save_location = f'images/{spot_id}-streetview-{heading}.jpg'
        params = {
            'size': '800x500',
            'location': f'{lat},{long}',
            'fov': 110,
            'heading': heading,
            'key': GOOGLE_MAPS_API_KEY
        }
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            with open(image_save_location, 'wb') as file:
                file.write(response.content)
            print(f"Image successfully saved to {image_save_location}.")
        else:
            print(f"Failed to retrieve image. Status code: {response.status_code}")
            
        heading += 45
        
# Input: spot ID and its coordinates + StreetView image of spot
# Output: # of walking paths relative to spot
def analyze_walking_paths(spot_id):
    image_path = f'images/{spot_id}-streetviewmap.png'
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Image not found.")
    
    blue_lower = np.array([100, 150, 50])
    blue_upper = np.array([140, 255, 255])
    black_lower = np.array([0, 0, 0])
    black_upper = np.array([180, 255, 50])
    
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    blue_mask = cv2.inRange(hsv_image, blue_lower, blue_upper)
    black_mask = cv2.inRange(hsv_image, black_lower, black_upper)
    blue_filtered_image = cv2.bitwise_and(image, image, mask=blue_mask)
    black_filtered_image = cv2.bitwise_and(image, image, mask=black_mask)
    
    gray_image = cv2.cvtColor(blue_filtered_image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray_image, 50, 150)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=50, minLineLength=10, maxLineGap=250)
    
    circle_center = (0, 0)
    directions = []
    if lines is None:
        return directions
    for line in lines:
        for x1, y1, x2, y2 in line:
            angle = math.atan2(y2 - y1, x2 - x1) * 180.0 / np.pi
            directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
            rounded_angle = int((angle + 22.5) % 360 / 45)
            direction = directions[rounded_angle]
            directions.append(direction)
    
    return directions