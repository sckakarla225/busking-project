import streamlit as st 
from streamlit_folium import folium_static
import pandas as pd
from utils.spots_data import (
    get_spots, 
    get_spot,
    get_spot_media
)
from utils.map_visuals import create_map, add_markers, add_markers_initial
from data.static import (
    get_nearby_spots, 
    is_sipnstroll,
    get_nearby_sipnstroll_info,
    get_coords_of_sipnstroll_locations
)
from data.visual import (
    get_streetview_snapshots
)
from data.temporal import (
    get_popular_times,
    calculate_average_poi_activity
)

st.title("Spot Prediction API")
st.write("Key Regions: Capital District, Fayetteville Street, Moore Square, Glenwood South, Warehouse District, Historic Oakwood, East Raleigh/Prince Hall/South Park")
st.write("Target Areas: Hotels, Restaurants/Food Trucks, Music Venues, Museums, Events/Festivals, Nightlife, Stores, Parking Garages")
st.write("Data Collector: https://busking-project.vercel.app/")

# Given a spot and a time-frame, predict how many people will be around the spot OR walk through the spot
# Available spot data: name, coordinates, images + videos
# Useful data to retrieve: nearby POIs, connected walkways, nearby scheduled events & gatherings

# Nearby POIs data: distance from spot, estimated capacity of indoor space, hours and timings, popularity of space
# Connected walkways data: all paths that go through spot (with corresponding point A and point B + type of place)

# All Spots Data
st.write("Spots Data")
spots = get_spots('final-spots')
df = pd.DataFrame(spots)
df = df.drop('id', axis=1)
st.write(df)

# st.write("Spots Map")
# filtered_spots_map = create_map((spots[0]["latitude"], spots[0]["longitude"]), spots[0]["name"])
# spots.pop(0)
# filtered_spots_map_updated = add_markers_initial(map=filtered_spots_map, spots=spots)
# folium_static(filtered_spots_map_updated)

# Test Spot Data Collection
# st.write("Test Spot (for data collection using Google Maps API)")
# spot = get_spot('RQcWLwgIb9fooEdxQap4')
# spot_df = pd.DataFrame([spot])
# spot_df = spot_df.drop('id', axis=1)
# spot_df['is_sipnstroll'] = is_sipnstroll(spot["latitude"], spot["longitude"])
# st.write(spot_df)

# st.write("Media Files")
# files_urls = get_spot_media('RKhtn3Gr3WYmf4cyaaTT')
# for name, url in files_urls.items():
#     st.write(f'{name}: {url}')
    
# get_streetview_snapshots('RKhtn3Gr3WYmf4cyaaTT', spot["latitude"], spot["longitude"])

# st.write("Nearby Places Data and Map")
# nearby_spots = get_nearby_spots(spot["latitude"], spot["longitude"])
# nearby_spots_df = pd.DataFrame(nearby_spots)
# st.write(nearby_spots_df)

# spot_map = create_map((spot["latitude"], spot["longitude"]), spot["name"])
# updated_map = add_markers(map=spot_map, spots=nearby_spots)
# folium_static(updated_map)

# st.write(f'Popular Times for Nearby Places ({len(nearby_spots)})')
# popular_times_for_places = get_popular_times(nearby_spots)
# averages_for_popular_times = calculate_average_poi_activity(popular_times_for_places)
# averages_df = pd.DataFrame(averages_for_popular_times)
# st.write(averages_df)

# Dataset for Test Spot
st.write("Dataset for Test Spot")


