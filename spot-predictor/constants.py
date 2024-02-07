GOOGLE_MAPS_API_KEY = 'AIzaSyDAA-SdGc6_vLZhhm6VwcQ-kTe1wdWGc2w'
OUTSCRAPER_API_KEY = 'M2ZkYjg1NTBkZmUyNDYxNjk3MjI3YWY2NmIwMzFhNWN8YmQxMWZlNThmMQ'

ALL_TYPES = {
    "automotive": ['parking', 'rest_stop'], 
    "business": ['farm'],
    "culture": ['art_gallery', 'museum', 'performing_arts_theater'],
    "corporate": [
        'accounting', 'finance', 'dental_clinic', 'child_care_agency', 'consultant', 'courier_service',
        'insurance_agency', 'lawyer', 'real_estate_agency', 'roofing_contractor', 
        'telecommunications_service_provider', 'travel_agency', 'political'
    ],
    "entertainment_and_recreation": [
        'amusement_center', 'amusement_park', 'aquarium', 'banquet_hall','bowling_alley', 'casino'
        'community_center', 'convention_center', 'cultural_center', 'dog_park', 'event_venue', 'hiking_area', 'historical_landmark',
        'marina', 'movie_rental', 'movie_theater', 'national_park', 'night_club', 'park', 'tourist_attraction', 'visitor_center'
        'wedding_venue', 'zoo'
    ],
    "finance": ['atm', 'bank'], 
    "food_and_drink": [
        'bakery', 'bar', 'cafe', 'coffee_shop', 'fast_food_restaurant', 'ice_cream_shop', 'meal_delivery',
        'meal_takeaway', 'restaurant'
    ],
    "general": ['landmark', 'natural_feature', 'town_square'],
    "government": ['city_hall', 'courthouse', 'embassy', 'local_government_office'],
    "health_and_wellness": ['dentist', 'doctor', 'drugstore', 'hospital', 'pharmacy', 'spa'],
    "lodging": [
        'bed_and_breakfast', 'campground', 'camping_cabin', 'extended_stay_hotel', 'farm_stay', 
        'guest_house', 'hostel', 'hotel', 'lodging', 'motel', 'resort_hotel', 'rv_park' 
    ],
    "religious": ['church', 'hindu_temple', 'mosque', 'synagogue'],
    "services": [
        'barber_shop', 'beauty_salon', 'child_care_agency', 'courier_service', 'florist', 'hair_care',
        'hair_salon', 'laundry', 'storage', 'travel_agency'
    ],
    "shopping": [
        'clothing_store', 'convenience_store', 'department_store', 'discount_store', 'electronics_store',
        'furniture_store', 'gift_shop', 'grocery_store', 'jewelry_store', 'liquor_store', 'market', 'shoe_store',
        'shopping_mall', 'sporting_goods_store', 'store', 'supermarket'
    ],
    "sports": [
        'athletic_field', 'fitness_center', 'gym', 'playground', 'sports_club', 'sports_complex', 
        'stadium', 'swimming_pool'
    ],
    "transportation": ['bus_station', 'bus_stop', 'park_and_ride', 'train_station', 'transit_depot', 'transit_station']
}

SIP_N_STROLL_OUTER_VERTICES = [
    (35.77737105286942, -78.64965644349358),
    (35.778616674634314, -78.64924317919072),
    (35.77856269011956, -78.64703039840839),
    (35.78067850356867, -78.64688966097884),
    (35.78045257651624, -78.64006410946325),
    (35.7796552320093, -78.64010842842977),
    (35.77949265281787, -78.63646146073818),
    (35.776848874958425, -78.636662199567),
    (35.776791768366614, -78.63498590007087),
    (35.77545927006731, -78.63507975199147),
    (35.77551003230504, -78.63672737452895),
    (35.77207927734255, -78.63690204335174),
    (35.77214061766263, -78.63853141689759),
    (35.77091380223958, -78.63859659180098),
    (35.770913802240756, -78.64032763826349),
    (35.77220618829101, -78.6405361980496),
    (35.77231252364505, -78.64346227722368)
]

SIP_N_STROLL_INNER_VERTICES = [
    (35.7770963169622, -78.64344254422342), 
    (35.777059739469465, -78.64199981891262),
    (35.778342380164396, -78.6419126542584),
    (35.77839846474162, -78.64339745905747)
]

SIP_N_STROLL_LOCATIONS_DATA = [
    { "name": "10th & Terrace", "address": "616 S Salisbury St", "type": "sold_here" },
    { "name": "The Anchor Bar", "address": "207 Fayetteville St", "type": "sold_here" },
    { "name": "The Architect Bar and Social House", "address": "108 1/2 E Hargett St", "type": "sold_here" },
    { "name": "Barcelona Wine Bar", "address": "430 W Martin St", "type": "sold_here" },
    { "name": "Beasley's Chicken + Honey", "address": "237 S Wilmington St", "type": "sold_here" },
    { "name": "Bida Manda Laotian Restaurant and Bar", "address": "222 S Blount St", "type": "sold_here" },
    { "name": "The Big Easy NC", "address": "222 Fayetteville St", "type": "sold_here" },
    { "name": "Bittersweet", "address": "16 E Martin St", "type": "sold_here" },
    { "name": "Brewery Bhavana", "address": "218 S Blount St", "type": "sold_here" },
    { "name": "The Bridge DTR", "address": "110 E Hargett St", "type": "sold_here" },
    { "name": "Centro Mexican Restaurant", "address": "106 S Wilmington St", "type": "sold_here" },
    { "name": "Chido Taco", "address": "555 Fayetteville St", "type": "sold_here" },
    { "name": "City of Raleigh Museum", "address": "220 Fayetteville St", "type": "sold_here" },
    { "name": "Clyde Cooper's Barbecue", "address": "327 S Wilmington St", "type": "sold_here" },
    { "name": "Crank Arm Brewing", "address": "319 W Davie St", "type": "sold_here" },
    { "name": "The Davie", "address": "444 S Blount St", "type": "sold_here" },
    { "name": "El Rodeo Mexican Restaurant", "address": "329 S Blount St", "type": "sold_here" },
    { "name": "Element Plant-Based Gastropub", "address": "421 Fayetteville St", "type": "sold_here" },
    { "name": "The Flavor Hills", "address": "319 Fayetteville St", "type": "sold_here" },
    { "name": "Flying Saucer Draught Emporium", "address": "328 W Morgan St", "type": "sold_here" },
    { "name": "FOUNDATION", "address": "213 Fayetteville St", "type": "sold_here" },
    { "name": "Gravy", "address": "135 S Wilmington St", "type": "sold_here" },
    { "name": "The Green Monkey", "address": "215 S Wilmington St", "type": "sold_here" },
    { "name": "Haymaker", "address": "555 Fayetteville St", "type": "sold_here" },
    { "name": "The Hippo Wine Bar + Shop", "address": "123 E Martin St", "type": "sold_here" },
    { "name": "Jimmy V's Osteria + Bar", "address": "420 Fayetteville St", "type": "sold_here" },
    { "name": "The Junction Salon & Bar", "address": "327 W Davie St", "type": "sold_here" },
    { "name": "Junction West", "address": "310 S West St", "type": "sold_here" },
    { "name": "Landmark Tavern", "address": "117 E Hargett St", "type": "sold_here" },
    { "name": "Libations 317", "address": "317 W Morgan St", "type": "sold_here" },
    { "name": "Lincoln Theatre", "address": "126 E Cabarrus St", "type": "sold_here" },
    { "name": "The Mecca Restaurant", "address": "13 E Martin St", "type": "sold_here" },
    { "name": "MOFU Shoppe", "address": "321 S Blount St", "type": "sold_here" },
    { "name": "The Morning Times Cafe", "address": "10 E Hargett St", "type": "sold_here" },
    { "name": "Neptunes Parlour", "address": "14 W Martin St", "type": "sold_here" },
    { "name": "Oak City Meatball Shoppe", "address": "180 E Davie St", "type": "sold_here" },
    { "name": "On My Way Bartending + Mixology Studio", "address": "501 W Martin St", "type": "sold_here" },
    { "name": "Parkside", "address": "301 W Martin St", "type": "sold_here" },
    { "name": "The Pit", "address": "328 W Davie St", "type": "sold_here" },
    { "name": "Poole's Diner", "address": "426 S McDowell St", "type": "sold_here" },
    { "name": "Poole'side Pies", "address": "428 S McDowell St", "type": "sold_here" },
    { "name": "The Pour House Music Hall, Record Shop, & Pressing Plant", "address": "224 S Blount St", "type": "sold_here" },
    { "name": "Raleigh Convention Center", "address": "500 S Salisbury St", "type": "sold_here" },
    { "name": "The Raleigh Times Bar", "address": "14 E Hargett St", "type": "sold_here" },
    { "name": "Ruby Deluxe", "address": "415 S Salisbury St", "type": "sold_here" },
    { "name": "Sir Walter Coffee", "address": "145 E Davie St", "type": "sold_here" },
    { "name": "Sitti Authentic Lebanese", "address": "137 S Wilmington St", "type": "sold_here" },
    { "name": "Sono", "address": "319 Fayetteville St", "type": "sold_here" },
    { "name": "St. Roch Fine Oysters + Bar", "address": "223 S Wilmington St", "type": "sold_here" },
    { "name": "State of Beer Bottle + Sandwich Shop", "address": "401 Hillsborough St", "type": "sold_here" },
    { "name": "Tasty Beverage Company", "address": "327 W Davie St", "type": "sold_here" },
    { "name": "Tonbo Ramen", "address": "211 S Wilmington St", "type": "sold_here" },
    { "name": "Trolley Pub + Beer Shop", "address": "323 W Davie St", "type": "sold_here" },
    { "name": "Ugly Monkey Party Bar", "address": "400 W Morgan St", "type": "sold_here" },
    { "name": "Virgil's Cocktails & Cocina", "address": "126 S Salisbury St", "type": "sold_here" },
    { "name": "Vita Vite", "address": "313 W Hargett St", "type": "sold_here" },
    { "name": "Watts and Ward", "address": "200 S Blount St", "type": "sold_here" },
    { "name": "Weaver Street Market", "address": "404 W Hargett St", "type": "sold_here" },
    { "name": "Whiskey Kitchen", "address": "201 W Martin St", "type": "sold_here" },
    { "name": "Woody's at City Market", "address": "205 Wolfe St", "type": "sold_here" },
    { "name": "Wye Hill Kitchen & Brewing", "address": "201 S Boylan Ave", "type": "sold_here" },
    { "name": "Young Hearts Distilling", "address": "225 S Wilmington St", "type": "sold_here" },
    { "name": "Zenith Raleigh", "address": "226 Fayetteville St", "type": "sold_here" },
    { "name": "311 Gallery", "address": "311 W Martin St", "type": "welcome_here" },
    { "name": "Aesthetic Appeal Jewelry at Pop-Up Shops at Martin Street", "address": "17 E Martin St", "type": "welcome_here" },
    { "name": "Alter Ego Salon & Blow Dry Bar", "address": "119 E Hargett St", "type": "welcome_here" },
    { "name": "Amitie Macaron", "address": "227 Fayetteville St", "type": "welcome_here" },
    { "name": "Arrow Haircuts & Shaves", "address": "115 E Hargett St", "type": "welcome_here" },
    { "name": "Artspace", "address": "201 E Davie St", "type": "welcome_here" },
    { "name": "Blackbird Books & Coffee", "address": "323 Blake St", "type": "welcome_here" },
    { "name": "City Market Artist Collective", "address": "300 Blake St", "type": "welcome_here" },
    { "name": "Copperline Plant Co.", "address": "300 Blake St", "type": "welcome_here" },
    { "name": "Curate Raleigh", "address": "15 W Hargett St", "type": "welcome_here" },
    { "name": "DECO Raleigh", "address": "207 S Salisbury St", "type": "welcome_here" },
    { "name": "Decree Company", "address": "135 E Martin St", "type": "welcome_here" },
    { "name": "Fifi + Talbot", "address": "300 W Hargett Street", "type": "welcome_here" },
    { "name": "The Gathering Gallery", "address": "111 E Hargett St", "type": "welcome_here" },
    { "name": "Mustang House", "address": "411 Fayetteville St", "type": "welcome_here" },
    { "name": "NASHONA", "address": "21 W Hargett St", "type": "welcome_here" },
    { "name": "Office Revolution", "address": "301 Fayetteville St", "type": "welcome_here" },
    { "name": "Pallbearer Vintage", "address": "111 E Hargett St", "type": "welcome_here" },
    { "name": "Raleigh Popsicle Co.", "address": "119 E Hargett St", "type": "welcome_here" },
    { "name": "Residence Inn by Marriott", "address": "616 S Salisbury St", "type": "welcome_here" },
    { "name": "The Self Care Marketplace", "address": "12 W Martin St", "type": "welcome_here" },
    { "name": "Union Special", "address": "401 Fayetteville St", "type": "welcome_here" },
    { "name": "Unorthodox Vintage", "address": "206 S Wilmington St", "type": "welcome_here" },
    { "name": "Videri Chocolate Factory", "address": "327 W Davie St", "type": "welcome_here" },
]

DAYS_DICT = {
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
    '7': 'Sunday'
}

TIME_DICT = {
    '0': '12:00 AM',
    '1': '1:00 AM',
    '2': '2:00 AM',
    '3': '3:00 AM',
    '4': '4:00 AM',
    '5': '5:00 AM',
    '6': '6:00 AM',
    '7': '7:00 AM',
    '8': '8:00 AM',
    '9': '9:00 AM',
    '10': '10:00 AM',
    '11': '11:00 AM',
    '12': '12:00 PM',
    '13': '1:00 PM',
    '14': '2:00 PM',
    '15': '3:00 PM',
    '16': '4:00 PM',
    '17': '5:00 PM',
    '18': '6:00 PM',
    '19': '7:00 PM',
    '20': '8:00 PM',
    '21': '9:00 PM',
    '22': '10:00 PM',
    '23': '11:00 PM',
}