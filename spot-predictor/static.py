import googlemaps
from constants import GOOGLE_MAPS_API_KEY

gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

# GOAL: Gather static data on POIs within 50 meters of spot

# Input: coordinates of spot
# Output: list of all nearby POIs (coordinates + distance from spot)
def get_nearby_spots():
    return
