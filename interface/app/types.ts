export interface Spot {
  id: string,
  name: string,
  regionName: string,
  latitude: number,
  longitude: number
};

export interface User {
  name: string,
  email: string,
  dateJoined: string,
  currentSpot: Spot,
  reservedFrom: string,
  reservedTo: string,
  performanceStyles: string[],
  recentSpots: Spot[],
};

export interface Reservation {
  timeSlotId: string,
  spotId: string,
  spotName: string,
  spotLatitude: number,
  spotLongitude: number,
  date: string,
  startTime: string,
  endTime: string
};

export interface TimeSlot {
  timeSlotId: string,
  spotId: string,
  performerId: string | null,
  spotName: string,
  spotRegion: string,
  date: string,
  startTime: string,
  endTime: string,
  activityLevel: number,
  isIdeal?: boolean,
};

export interface Event {
  date: string,
  name: string,
  venue: string,
  address: string,
  startTime: string,
  endTime: string,
  details: string,
  tags: string[],
  location: Object
};