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