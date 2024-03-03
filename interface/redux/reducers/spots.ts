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
};

const initialState: SpotsState = {
  spots: []
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
    resetSpots: () => {
      return initialState
    }
  }
});

export const { loadSpots, resetSpots } = spots.actions;
export default spots.reducer;