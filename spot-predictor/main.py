import streamlit as st 
from streamlit_folium import folium_static
import pandas as pd
from spots_data import get_spots, get_spot
from map_visuals import create_map, add_markers
from static import get_nearby_spots

st.title("Spot Prediction API")
st.write("Key Regions: Capital District, Fayetteville Street, Moore Square, Glenwood South, Warehouse District, Historic Oakwood, East Raleigh/Prince Hall/South Park")
st.write("Target Areas: Hotels, Restaurants/Food Trucks, Music Venues, Museums, Events/Festivals, Nightlife, Stores, Parking Garages")
st.write("Data Collector: https://busking-project.vercel.app/")

# Given a spot and a time-frame, predict how many people will be around the spot OR walk through the spot
# Available spot data: name, coordinates, images + videos
# Useful data to retrieve: nearby POIs, connected walkways, nearby scheduled events & gatherings

# Nearby POIs data: distance from spot, estimated capacity of indoor space, hours and timings, popularity of space
# Connected walkways data: all paths that go through spot (with corresponding point A and point B + type of place)

st.write("Spots Data")
spots = get_spots()
df = pd.DataFrame(spots)
df = df.drop('id', axis=1)
st.write(df)

st.write("Test Spot (for data collection using Google Maps API)")
spot = get_spot('XMo7AYD1SHKkPSdnWRXe')
spot_df = pd.DataFrame([spot])
spot_df = spot_df.drop('id', axis=1)
st.write(spot_df)

nearby_spots = get_nearby_spots(spot["latitude"], spot["longitude"])
nearby_spots_df = pd.DataFrame(nearby_spots)
st.write(nearby_spots_df)

spot_map = create_map((spot["latitude"], spot["longitude"]))
updated_map = add_markers(map=spot_map, spots=nearby_spots)
folium_static(updated_map)



