import folium

def create_map(location):
    map = folium.Map(location=location, zoom_start=12)
    folium.Marker(location).add_to(map)
    return map