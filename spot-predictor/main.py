import streamlit as st 
import pandas as pd
from spots_data import get_spots

st.title("Spot Prediction API")
st.write("Key Regions: Capital District, Fayetteville Street, Moore Square, Glenwood South, Warehouse District, Historic Oakwood, East Raleigh/Prince Hall/South Park")
st.write("Target Areas: Hotels, Restaurants/Food Trucks, Music Venues, Museums, Events/Festivals, Nightlife, Stores, Parking Garages")
st.write("Data Collector: https://busking-project.vercel.app/")

# Given a spot and a time-frame, predict how many people will be around the spot OR walk through the spot
# Available spot data: name, coordinates, images + videos
# Useful data to retrieve: nearby POIs, connected walkways, nearby scheduled events & gatherings

# Nearby POIs data: distance from spot, estimated capacity of indoor space, hours and timings, popularity of space
# Connected walkways data: all paths that go through spot (with corresponding point A and point B + type of place)

spots = get_spots()
df = pd.DataFrame(spots)
df = df.drop('id', axis=1)
st.write("Spots Data")
st.write(df)