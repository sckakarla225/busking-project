import folium

def create_map(location, name):
    map = folium.Map(location=location, zoom_start=12)
    folium.Marker(location, popup=name).add_to(map)
    return map

def add_markers(map, spots):
    for spot in spots:
        folium.Marker(spot["coordinates"]).add_to(map)
    return map

def add_markers_initial(map, spots):
    for spot in spots:
        folium.Marker(
            (spot["latitude"], spot["longitude"]),
            popup=spot["name"] + spot["id"]
        ).add_to(map)
    return map