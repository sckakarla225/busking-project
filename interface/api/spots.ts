import axios from 'axios';

import { API_ENDPOINT } from '@/constants';
import { 
  ApiResponse, 
  ApiError, 
  NewReservation, 
  LeaveSpot 
} from './types';

const getSpots = async () => {
  try {
    const { data } : any = await axios.get(
      API_ENDPOINT + `/spots/all`, 
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return { success: true, data: data };
  } catch (error: any) {
    let errorMessage = 'An unknown error has occurred';
    if (error.response) {
      if (error.response.status == 404) {
        errorMessage = 'Spots not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
}

const getCurrentSpot = async (userId: string): Promise<ApiResponse | ApiError> => {
  try {
    const { data } : any = await axios.get(
      API_ENDPOINT + `/spots/current/${userId}`, 
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return { success: true, data: data };
  } catch (error: any) {
    let errorMessage = 'An unknown error has occurred';
    if (error.response) {
      if (error.response.status == 404) {
        errorMessage = 'User not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
}

const reserveSpot = async (
  userId: string, 
  spotId: string, 
  name: string, 
  region: string, 
  latitude: number, 
  longitude: number,
  reservedFrom: string,
  reservedTo: string
): Promise<ApiResponse | ApiError> => {
  const reservation: NewReservation = {
    userId: userId,
    spotId: spotId,
    name: name,
    region: region,
    latitude: latitude,
    longitude: longitude,
    reservedFrom: reservedFrom,
    reservedTo: reservedTo
  };

  try {
    const { data } : any = await axios.post(
      API_ENDPOINT + "/spots/reserve",
      reservation,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return { success: true, data: data };
  } catch (error: any) {
    let errorMessage = 'An unknown error has occurred';
    if (error.response) {
      if (error.response.status == 404) {
        errorMessage = 'Spot and/or user not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
}

const leaveSpot = async (
  userId: string,
  spotId: string,
  reservationId: string
): Promise<ApiResponse | ApiError> => {
  const spotToLeave: LeaveSpot = {
    userId: userId,
    spotId: spotId,
    reservationId: reservationId
  };

  try {
    const { data } : any = await axios.put(
      API_ENDPOINT + "/users/create",
      spotToLeave,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return { success: true, data: data };
  } catch (error: any) {
    let errorMessage = 'An unknown error has occurred';
    if (error.response) {
      if (error.response.status == 404) {
        errorMessage = 'Spot and/or user not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
}

export {
  getSpots,
  getCurrentSpot,
  reserveSpot,
  leaveSpot
};