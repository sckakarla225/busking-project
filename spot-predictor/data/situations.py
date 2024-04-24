import csv 
import re
import json
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Input: URL for downtownraleigh.org Event
# Output: Saved event info to raleigh_events.csv file
def get_raleigh_event_info(url: str):
    event_info = {}
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.get(url)
    driver.implicitly_wait(10)
    html_content = driver.page_source
    soup = BeautifulSoup(html_content, 'html.parser')
    
    event_name_header = soup.find('div', { 'class': 'dra-header' })
    event_details = soup.find('div', { 'class': 'container-fluid-wide' })
    
    with open('raleigh_events.csv', 'a', newline='') as file:
        writer = csv.writer(file)
    
        name = event_name_header.find('h1')
        event_info['name'] = name.text
        
        date_info = event_details.find('ul', { 'class': 'datelist' })
        date = date_info.find('span', { 'class': 'dldate' })
        time = date_info.find('span', { 'class': 'dltime' })
        event_info['date'] = date.text
        event_info['time'] = time.text
        
        location_info = event_details.find_all('div', { 'class': 'awesome-box' })[1].find('div', { 'class': 'awesome-box-link' })
        location = location_info.find('p')
        match = re.search(r'\d', location.text)
        if match:
            index = match.start()
            venue = location.text[:index].strip()
            address = location.text[index:].strip()
            event_info['venue'] = venue
            event_info['address'] = address
        else:
            event_info['venue'] = location
            event_info['address'] = ''
        
        details = event_details.find_all('p')
        details.pop(0)
        details_text = ''
        for detail in details:
            details_text += detail.text
        event_info['details'] = details_text
        
        writer.writerow([
            event_info['name'],
            event_info['date'],
            event_info['address'],
            event_info['venue'],
            event_info['time'],
            event_info['details']
        ])
    
    driver.quit()
    return event_info

# Input: All events raleigh_events.csv file
# Output: Formatted events into events.json file
def reformat_events():
    df = pd.read_csv('raleigh_events.csv')
    df.columns = df.columns.str.strip().str.lower()

    def format_date(date_str):
        month, day, year = date_str.split('/')
        return f'{month.zfill(2)}/{day.zfill(2)}/20{year.zfill(2)}'

    def extract_times(time_str):
        times = time_str.split('-')
        start_time = times[0].strip()
        end_time = times[1].strip() if len(times) > 1 else ""
        return start_time, end_time

    def extract_coordinates(coord_str):
        coords = coord_str.split(',')
        latitude = float(coords[0].strip())
        longitude = float(coords[1].strip())
        return latitude, longitude

    events_list = []
    for _, row in df.iterrows():
        formatted_date = format_date(row['date'])
        start_time, end_time = extract_times(row['time'])
        latitude, longitude = extract_coordinates(row['coordinates'])

        event_json = {
            "date": formatted_date,
            "name": row['name'],
            "venue": row['venue'],
            "address": row['address'],
            "startTime": start_time,
            "endTime": end_time,
            "latitude": latitude,
            "longitude": longitude,
            "details": row['details'],
        }

        events_list.append(event_json)

    with open('raleigh_events.json', mode='w', encoding='utf-8') as json_file:
        json.dump(events_list, json_file, indent=4)

    print("Converted all events to raleigh_events.json")