import axios from 'axios';

import { API_ENDPOINT } from '@/constants';
import { ApiResponse, ApiError, PredictionInput } from './types';

const predictSpot = async (input: PredictionInput): Promise<ApiResponse | ApiError> => {
  try {
    const { data } : any = await axios.post(
      API_ENDPOINT + "/predictions/predict",
      input,
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
        errorMessage = 'Error generating prediction';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
}

const predictSpots = async (inputs: PredictionInput[]): Promise<ApiResponse | ApiError> => {
  try {
    const { data } : any = await axios.post(
      API_ENDPOINT + "/predictions/predict",
      inputs,
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
      if (error.response.status == 204 || error.response.status == 404) {
        errorMessage = 'Error generating predictions';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
}

export { 
  predictSpot,
  predictSpots
};