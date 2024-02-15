import googlemaps
import math
from collections import Counter
from geopy.distance import geodesic
from geopy.geocoders import Nominatim
from shapely.geometry import Point, Polygon
from outscraper import ApiClient

from constants import (
    GOOGLE_MAPS_API_KEY, 
    OUTSCRAPER_API_KEY,
    ALL_TYPES,
    SIP_N_STROLL_OUTER_VERTICES,
    SIP_N_STROLL_INNER_VERTICES,
    SIP_N_STROLL_LOCATIONS_DATA
)

gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
geolocator = Nominatim(user_agent="geoapiExercises")
outscraper_client = ApiClient(api_key=OUTSCRAPER_API_KEY)

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
                if place_primary_types is not None:
                    if any(item in place_primary_types for item in ["lodging", "automotive", "transportation"]):
                        opening_hours = ["24 Hours"]
                else:
                    opening_hours = ["None"]
            
            spot_info = {
                'id': place['place_id'],
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

# Input: coordinates of spot
# Output: is spot in Sip n' Stroll region (T or F)
def is_sipnstroll(lat, long):
    vertices = SIP_N_STROLL_OUTER_VERTICES
    region_polygon = Polygon(vertices)
    point_to_check = Point(lat, long)
    
    if point_to_check.within(region_polygon):
        inner_vertices = SIP_N_STROLL_INNER_VERTICES
        inner_region_polygon = Polygon(inner_vertices)
        if point_to_check.within(inner_region_polygon) is not True:
            return True
    
    return False

# Input: list of all POIs and their info
# Output: # of POIs, POI density (weighted average), POI proximity (average distance)
def analyze_poi_data(nearby_spots):
    tot_distance = 0
    poi_weight = 0
    weights = {
        "automotive": 1, 
        "business": 1, 
        "culture": 4, 
        "corporate": 2, 
        "entertainment_and_recreation": 5, 
        "finance": 2, 
        "food_and_drink": 5, 
        "general": 4, 
        "government": 2, 
        "health_and_wellness": 1, 
        "lodging": 3, 
        "religious": 2, 
        "services": 3, 
        "shopping": 4, 
        "sports": 2, 
        "transportation": 3
    }
    
    poi_count = len(nearby_spots)
    for spot in nearby_spots:
        tot_distance += spot['distance']
        spot_primary_types = spot['primary_types']
        spot_weight = 0
        for primary_type in spot_primary_types:
            if primary_type in weights:
                spot_weight += weights[primary_type]

        poi_weight += spot_weight

    if poi_count > 0:
        avg_poi_distance = tot_distance / poi_count
    else:
        avg_poi_distance = 0
    
    return poi_count, avg_poi_distance, poi_weight

# Input: list of all Sip n' Stroll locations (name + address)
# Output: modified list of all Sip n' Stroll locations with coordinates (due to rate-limiting)
def get_coords_of_sipnstroll_locations():
    modified_locations = []
    
    for location in SIP_N_STROLL_LOCATIONS_DATA:
        res = outscraper_client.google_maps_search(location['address'])
        latitude = res[0][0]['latitude']
        longitude = res[0][0]['longitude']
        modified_location = {
            "name": location["name"],
            "address": location["address"],
            "type": location["type"],
            "latitude": latitude,
            "longitude": longitude
        }
        print(modified_location)
        modified_locations.append(modified_location)
        
    return modified_locations

# Input: coordinates of spot
# Output: # of Sip n' Stroll locations within 50 meters (+ distances from spot)

def get_nearby_sipnstroll_info(lat, long):
    nearby_locations_count = 0
    total_distance = 0
    sold_here_count = 0
    total_sold_here_distance = 0
    welcome_here_count = 0
    total_welcome_here_distance = 0

    for location in SIP_N_STROLL_LOCATIONS_DATA:
        distance = geodesic((lat, long), (location['latitude'], location['longitude'])).meters
        if distance <= 100:
            nearby_locations_count += 1
            total_distance += distance
            if location['type'] == 'sold_here':
                sold_here_count += 1
                total_sold_here_distance += distance
            elif location['type'] == 'welcome_here':
                welcome_here_count += 1
                total_welcome_here_distance += distance
    avg_distance = total_distance / nearby_locations_count if nearby_locations_count > 0 else 0
    avg_distance_sold_here = total_sold_here_distance / sold_here_count if sold_here_count > 0 else 0
    avg_distance_welcome_here = total_welcome_here_distance / welcome_here_count if welcome_here_count > 0 else 0
    
    return nearby_locations_count, avg_distance, sold_here_count, avg_distance_sold_here, welcome_here_count, avg_distance_welcome_here

# Input: list of final spots data
# Output: counts for each spot size (1-5)
def get_spot_size_counts(final_spots):
    num_one = 0
    num_two = 0
    num_three = 0
    num_four = 0
    num_five = 0
    
    for spot in final_spots:
        if spot["size"] == 1:
            num_one += 1
        elif spot["size"] == 2:
            num_two += 1
        elif spot["size"] == 3:
            num_three += 1
        elif spot["size"] == 4:
            num_four += 1
        elif spot["size"] == 5:
            num_five += 1
    
    return { "1": num_one, "2": num_two, "3": num_three, "4": num_four, "5": num_five }