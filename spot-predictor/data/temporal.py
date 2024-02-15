import csv
from datetime import datetime
from outscraper import ApiClient
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from geopy.distance import geodesic

from constants import OUTSCRAPER_API_KEY, DAYS_DICT, TIME_DICT

# GOAL: Gather temporal data on POIs within 50 meters of spot

api_client = ApiClient(api_key=OUTSCRAPER_API_KEY)

# Input: place ID
# Output: popular times data for given place (Mon(Day 1) - Sun(Day 7))
def get_popular_times_for_place(place_id):
    res = api_client.google_maps_search(place_id)
    popular_times_obj = res[0][0]['popular_times']
    
    return popular_times_obj

# Input: popular times data for place
# Output: formatted dict for popular times
def format_popular_times(popular_times):
    popular_times_formatted = []
    
    for day in popular_times:
        if day['day'] == 'live':
            continue
        day_of_the_week = DAYS_DICT[str(day['day'])]
        times = []
        for time in day['popular_times']:
            formatted_time_hour = TIME_DICT[str(time['hour'])]
            formatted_time = {
                'time': formatted_time_hour,
                'occupancy': time['percentage'],
                'description': time['title']
            }
            times.append(formatted_time)
        popular_times_formatted.append({
            'day': day_of_the_week,
            'times': times
        })
    
    return popular_times_formatted

# Input: place IDs of nearby POIs (culture, entertainment & rec, food & drink, 
# government, services, shopping, sports, transportation)
# Ouput: popular times data for each place (for each day and time)
def get_popular_times(places):
    places_popular_times = []
    relevant_place_types = [
        "culture", "entertainment_and_recreation", "food_and_drink", "government",
        "services", "shopping", "sports", "transportation"
    ]
    
    for place in places:
        if place['primary_types'] is not None:
            if any(item in relevant_place_types for item in place['primary_types']):
                popular_times_obj = get_popular_times_for_place(place['id'])
                if popular_times_obj is not None:
                    formatted_popular_times = format_popular_times(popular_times_obj)
                    places_popular_times.append({
                        'name': place['name'],
                        'popular_times': formatted_popular_times
                    })
        else:
            popular_times_obj = get_popular_times_for_place(place['id'])
            if popular_times_obj is not None:
                formatted_popular_times = format_popular_times(popular_times_obj)
                places_popular_times.append({
                    'name': place['name'],
                    'popular_times': formatted_popular_times
                })
        
    return places_popular_times

# Input: list of all POIs and their popular times
# Output: averages of POI occupancy for every day and time (18/7)
def calculate_average_poi_activity(places_popular_times):
    occupancy_data = {}
    for day in range(1, 8):
        times_dict = {}
        for hour in range(6, 24):
            day_key = DAYS_DICT[str(day)]
            time_key = TIME_DICT[str(hour)]
            times_dict[time_key] = {
                'total_occupancy': 0,
                'count': 0
            }
        occupancy_data[day_key] = times_dict
            
    for place in places_popular_times:
        for times in place['popular_times']:
            day = times['day']
            for time in times['times']:
                time_str = time['time']
                if time_str in occupancy_data[day]:
                    if time['occupancy'] != 0:
                        occupancy_data[day][time_str]['total_occupancy'] += time['occupancy']
                        occupancy_data[day][time_str]['count'] += 1

    averages = []
    for day, value in occupancy_data.items():
        for time, data in value.items():
            if data['count'] != 0:
                avg = data['total_occupancy']/data['count']
                average_obj = {
                    'day': day,
                    'time': time,
                    'average_poi_activity': f'{int(avg)}%'
                }
                averages.append(average_obj)
            
    return averages

# Input: URL for Visit Raleigh events site
# Output: 10 events saved to visit_raleigh.csv file (repeat until all ~390 events)
def get_visit_raleigh_events(url):
    events_list = []
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.get(url)
    driver.implicitly_wait(10)
    html_content = driver.page_source
    soup = BeautifulSoup(html_content, 'html.parser')

    event_container = soup.find_all('div', { 'class': 'columns large-6 end' })
    with open('visit_raleigh.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Event Name', 'Date', 'Time', 'Location'])

        for event in event_container:
            name = event.find('h3')
            if name is not None:
                name = name.text 
            else:
                name = ""
            date = event.find('li', { 'class': 'dateInfo' })
            if date is not None:
                date = date.text 
            else:
                date = ""
            time = event.find('li', { 'class': 'times' })
            if time is not None:
                time = time.text
            else:
                time = ""
            location = event.find('li', { 'class': 'location' })
            if location is not None:
                location = location.text 
                formatted_string = ' '.join(location.replace("Venue:", "").split())
            else:
                formatted_string = ""
            
            writer.writerow([name, date, time, formatted_string])
            events_list.append({ 
                'name': name, 
                'date': date,
                'time': time, 
                'location': formatted_string 
            })
    
    driver.quit()
    return events_list

# Input: list of Visit Raleigh events and their info
# Output: modified list without duplicate events
def find_and_remove_duplicates(events_list):
    seen_events = set()
    unique_events = []
    
    for event in events_list:
        identifier = (event["name"], event["date"])
        if identifier not in seen_events:
            seen_events.add(identifier)
            unique_events.append(event)
            
    return unique_events

# Input: list of DRA events and their info, coordinates of origin spot
# Output: all nearby events (<=150 events) from March to May (name, date, and times for each)
def find_nearby_dra_events(events_list, lat, long):
    radius = 150
    nearby_events = []
    
    for event in events_list:
        coordinates = event["Coordinates"]
        coordinates_split = coordinates.split(",")
        event_lat = float(coordinates_split[0].strip())
        event_long = float(coordinates_split[1].strip())
        distance = geodesic((lat, long), (event_lat, event_long)).meters
        
        if 0 <= distance <= radius:
            nearby_event = {
                "date": event["Date"],
                "name": event["Name"],
                "start_time": event["Start"],
                "end_time": event["End"]
            }
            nearby_events.append(nearby_event)
    
    return nearby_events

# Input: list of Visit Raleigh events and their info, coordinates of origin spot
# Output: all nearby events (<= 150 meters) from March to May (name, date, and times for each)
def find_nearby_visit_raleigh_events(events_list, lat, long):
    radius = 150
    nearby_events = []
    
    for event in events_list:
        coordinates = event["location"]
        coordinates_split = coordinates.split(",")
        event_lat = float(coordinates_split[0].strip())
        event_long = float(coordinates_split[1].strip())
        distance = geodesic((lat, long), (event_lat, event_long)).meters
        
        if 0 <= distance <= radius:
            name = event["name"]
            times_split = event["time"].split("-")
            start_time = times_split[0].replace('PM', ' PM').replace('AM', ' AM')
            end_time = times_split[1].replace('PM', ' PM').replace('AM', ' AM')
            dates = event["date"]
            dates_split = dates.split(",")
            
            for date in dates_split:
                date_stripped = date.strip()
                if len(date_stripped.split('/')[-1]) == 4:
                    date_format = "%m/%d/%Y"
                else:
                    date_format = "%m/%d/%y"

                date_obj = datetime.strptime(date_stripped, date_format)
                formatted_date = date_obj.strftime("%m/%d/%Y")
                
                nearby_event = {
                    "date": formatted_date,
                    "name": name,
                    "start_time": start_time,
                    "end_time": end_time
                }
                nearby_events.append(nearby_event)
        
    return nearby_events