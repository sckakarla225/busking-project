// General
export interface ApiResponse {
  success: boolean,
  data: Object
};

export interface ApiError {
  success: boolean,
  error: string
};

// User
export interface CreateUser {
  userId: string,
  email: string,
  name: string,
};

export interface SocialMediaHandle {
  platform: string,
  handle: string,
}

export interface SetupUser {
  userId: string,
  performerDescription: string,
  performanceStyles: string[],
  instrumentTypes: string[],
  audioTools: string[],
  stagingAndVisuals: string[],
  socialMediaHandles: SocialMediaHandle[]
};

export interface UpdateUser {
  userId: string,
  performanceStyles: string[]
};

export interface AddRecentSpot {
  userId: string,
  spotId: string,
  name: string,
  region: string
};

// Spots
export interface NewReservation {
  userId: string, 
  spotId: string, 
  name: string, 
  region: string, 
  latitude: number, 
  longitude: number,
  reservedFrom: string,
  reservedTo: string
};

export interface LeaveSpot {
  userId: string,
  spotId: string,
  reservationId: string
};

// Predictions
export interface PredictionInput {
  spotId: string,
  latitude: number,
  longitude: number,
  date: string,
  time: string,
  day: string
}