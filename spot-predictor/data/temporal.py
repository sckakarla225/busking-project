import math
from outscraper import ApiClient

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
        if any(item in relevant_place_types for item in place['primary_types']):
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