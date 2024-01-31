import googlemaps
import math
from geopy.distance import geodesic

from constants import GOOGLE_MAPS_API_KEY

gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

# GOAL: Gather static data on POIs within 50 meters of spot

# Input: coordinates of origin spot and nearby spot
# Output: direction of nearby spot relative to origin spot
def calculate_direction(origin_lat, origin_long, spot_lat, spot_long):
    compass_directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"]
    origin_lat, origin_long, spot_lat, spot_long = map(math.radians, [
        origin_lat, origin_long, spot_lat, spot_long
    ])
    distance_long = spot_long - origin_long
    x = math.sin(distance_long) * math.cos(spot_lat)
    y = math.cos(origin_lat) * math.sin(spot_lat) - (math.sin(origin_lat) * math.cos(spot_lat) * math.cos(distance_long))
    
    bearing = math.atan2(x, y)
    bearing = math.degrees(bearing)
    bearing = (bearing + 360) % 360
    
    index = round(bearing / 45)
    return compass_directions[index % 8]

# Input: place ID
# Output: details about place
def get_place_details(place_id):
    place_details = gmaps.place(place_id=place_id)
    details = place_details.get('result', {})
    details_dict = {
        'opening_hours': details.get('opening_hours', {}),
        'business_status': details.get('business_status'),
        'rating': details.get('rating'),
        'vicinity': details.get('vicinity', ""),
        'user_ratings_total': details.get('user_ratings_total')
    }
    return details_dict

# Input: coordinates of spot
# Output: list of all nearby POIs (coordinates + distance + direction from spot)
def get_nearby_spots(lat, long):
    radius = 75
    nearby_spots = []
    origin = (lat, long)
    places = gmaps.places_nearby(location=origin, radius=radius)
   
    for place in places['results']:
        place_name = place['name']
        place_lat = place['geometry']['location']['lat']
        place_long = place['geometry']['location']['lng']
        place_types = place['types']
        distance = geodesic(origin, (place_lat, place_long)).meters
        
        if 0 <= distance <= radius:
            direction = calculate_direction(lat, long, place_lat, place_long)
            place_details = get_place_details(place['place_id'])
            spot_info = {
                'name': place_name,
                'coordinates': (place_lat, place_long),
                'distance': distance,
                'types': place_types,
                'direction': direction,
                'hours': place_details['opening_hours'].get('weekday_text', []),
                'status': place_details['business_status'],
                'rating': place_details['rating'],
                'total_ratings': place_details['user_ratings_total'],
            }
            nearby_spots.append(spot_info)
            
    return nearby_spots