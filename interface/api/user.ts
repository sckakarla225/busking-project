import axios from 'axios';

import { API_ENDPOINT } from '@/constants';
import { 
  ApiError, 
  ApiResponse, 
  CreateUser,
  UpdateUser,
  AddRecentSpot 
} from './types';

const getUser = async (userId: string) => {
  try {
    const { data } : any = await axios.get(
      API_ENDPOINT + `/users/user/${userId}`, 
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

const createUser = async (
  userId: string,
  email: string,
  name: string,
  performanceStyles: string[]
) => {
  const newUser: CreateUser = {
    userId: userId,
    email: email,
    name: name,
    performanceStyles: performanceStyles
  };

  try {
    const { data } : any = await axios.post(
      API_ENDPOINT + "/users/create",
      newUser,
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
      if (error.response.status == 204) {
        errorMessage = 'Could not create user';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
}

const updatePerformanceStyles = async (
  userId: string, 
  performanceStyles: string[]
): Promise<ApiResponse | ApiError> => {
  const updatedUser: UpdateUser = {
    userId: userId,
    performanceStyles: performanceStyles
  };

  try {
    const { data } : any = await axios.post(
      API_ENDPOINT + "/users/update_performance_styles",
      updatedUser,
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

const updateRecentSpots = async (
  userId: string,
  spotId: string,
  name: string,
  region: string
) => {
  const recentSpot: AddRecentSpot = {
    userId: userId,
    spotId: spotId,
    name: name,
    region: region
  };

  try {
    const { data } : any = await axios.put(
      API_ENDPOINT + "/users/update_recent_spots",
      recentSpot,
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

export {
  getUser,
  createUser,
  updatePerformanceStyles,
  updateRecentSpots
};