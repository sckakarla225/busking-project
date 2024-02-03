import googlemaps
import math
import requests
from collections import Counter
from geopy.distance import geodesic

from constants import GOOGLE_MAPS_API_KEY, ALL_TYPES

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

# Input: place ID
# Output: advanced details about place
def get_place_details_advanced(place_id):
    fields = [
        "curbside_pickup", "delivery", "dine_in", "editorial_summary", 
        "price_level", "reservable", "serves_beer", 
        "serves_breakfast", "serves_brunch", "serves_dinner", 
        "serves_lunch", "serves_wine", "takeout"
    ]
    fields_param = ",".join(fields)
    
    place_advanced_details = gmaps.place(place_id=place_id, fields=fields_param)
    details = place_advanced_details.get('result', {})
    print(details)
    return details

# Input: place types
# Output: formatted and filtered types (primary vs. secondary)
def format_types(types):
    all_keys = list(ALL_TYPES.keys())
    primary_types = []
    secondary_types = []
    for key in all_keys:
        for type in types:
            if type in ALL_TYPES[key]:
                secondary_types.append(type)
                if key not in primary_types:
                    primary_types.append(key)
            if (len(primary_types) == 0) & (Counter(types) == Counter(["point_of_interest", "establishment"])):
                primary_types.append("corporate")
    if primary_types == []:
        primary_types = None
    if secondary_types == []:
        secondary_types = None
    return primary_types, secondary_types

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
        place_primary_types, place_secondary_types = format_types(place['types'])
        distance = geodesic(origin, (place_lat, place_long)).meters
        
        if 0 <= distance <= radius:
            direction = calculate_direction(lat, long, place_lat, place_long)
            place_details = get_place_details(place['place_id'])
            # advanced_place_details = get_place_details_advanced(place['place_id'])
            opening_hours = place_details['opening_hours'].get('weekday_text', [])
            if opening_hours == []:
                if any(item in place_primary_types for item in ["lodging", "automotive", "transportation"]):
                    opening_hours = ["24 Hours"]
            
            spot_info = {
                'name': place_name,
                'coordinates': (place_lat, place_long),
                'distance': distance,
                'primary_types': place_primary_types,
                'secondary_types': place_secondary_types,
                'direction': direction,
                'hours': opening_hours,
                'rating': place_details['rating'],
                'total_ratings': place_details['user_ratings_total'],
            }
            nearby_spots.append(spot_info)
            
    return nearby_spots