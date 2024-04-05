import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Reservation {
  reservationId: string;
  startTime: Date;
  endTime: Date;
  performerId: string;
}

interface Spot {
  spotId: string;
  name: string;
  latitude: number;
  longitude: number;
  region: string;
  spotSize: number;
  reservations: Reservation[];
}

interface SpotsState {
  // TODO: save map instance and viewport here too
  spots: Spot[],
  selectedTime: string,
  selectedDate: string,
  selectedSpotName: string,
};

const initialState: SpotsState = {
  spots: [],
  selectedTime: '',
  selectedDate: '',
  selectedSpotName: ''
};

export const spots = createSlice({
  name: "spots",
  initialState,
  reducers: {
    loadSpots: (state, action: PayloadAction<{ spots: Spot[] }>) => {
      return {
        ...state,
        spots: action.payload.spots
      }
    },
    changeSelectedTime: (state, action: PayloadAction<{ selectedTime: string }>) => {
      return {
        ...state,
        selectedTime: action.payload.selectedTime
      }
    },
    changeSelectedDate: (state, action: PayloadAction<{ selectedDate: string }>) => {
      return {
        ...state,
        selectedDate: action.payload.selectedDate
      }
    },
    changeSelectedSpotName: (state, action: PayloadAction<{ selectedSpotName: string }>) => {
      return {
        ...state,
        selectedSpotName: action.payload.selectedSpotName
      }
    },
    resetSpots: () => {
      return initialState
    }
  }
});

export const { 
  loadSpots, 
  resetSpots,
  changeSelectedTime,
  changeSelectedDate,
  changeSelectedSpotName 
} = spots.actions;
export default spots.reducer;