import axios from 'axios';

import { API_ENDPOINT } from '@/constants';
import { EditTimeSlot } from './types';

const getTimeSlots = async () => {
  try {
    const { data } : any = await axios.get(
      API_ENDPOINT + `/time-slots/all`, 
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
        errorMessage = 'Time slots not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
};

const reserveTimeSlot = async (timeSlotId: string, performerId: string) => {
  const timeSlotToChange: EditTimeSlot = {
    timeSlotId: timeSlotId,
    performerId: performerId
  };

  try {
    const { data } : any = await axios.post(
      API_ENDPOINT + "/time-slots/reserve",
      timeSlotToChange,
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
        errorMessage = 'Time slot and/or user not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
};

const cancelTimeSlot = async (timeSlotId: string, performerId: string) => {
  const timeSlotToChange: EditTimeSlot = {
    timeSlotId: timeSlotId,
    performerId: performerId
  };

  try {
    const { data } : any = await axios.put(
      API_ENDPOINT + "/time-slots/free",
      timeSlotToChange,
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
        errorMessage = 'Time slot and/or user not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
};

const getPicks = async () => {
  try {
    const { data } : any = await axios.get(
      API_ENDPOINT + `/time-slots/ideal`, 
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
        errorMessage = 'Time slot and/or user not found';
      } else if (error.response.status = 500) {
        errorMessage = 'Internal server error';
      };
      return { success: false, error: errorMessage };
    }
    return { success: false, error: errorMessage };
  }
};

export {
  getTimeSlots,
  reserveTimeSlot,
  cancelTimeSlot,
  getPicks
};