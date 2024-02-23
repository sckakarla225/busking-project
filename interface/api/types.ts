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
  performanceStyles: string[]
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