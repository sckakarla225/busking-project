import axios from 'axios';

import { API_ENDPOINT } from '@/constants';
import { NearbyEvent } from './types';

const getNearbyEvents = async (
  date: string, 
  latitude: number | null, 
  longitude: number | null
) => {
  const eventsQuery: NearbyEvent = {
    date: date,
    latitude: latitude ? latitude : 0,
    longitude: longitude? longitude : 0
  };

  try {
    const { data } : any = await axios.post(
      API_ENDPOINT + `/events/nearby`, 
      eventsQuery,
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
        errorMessage = 'Events not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
};

export {
  getNearbyEvents
};