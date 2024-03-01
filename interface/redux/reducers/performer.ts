import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentSpot {
  spotId?: string;
  name?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  reservedFrom?: Date;
  reservedTo?: Date;
}

interface RecentSpot {
  spotId: string;
  name: string;
  region: string;
  dateAdded: Date;
}

interface PerformerState {
  name: string,
  dateJoined: string,
  performanceStyles: string[],
  currentSpot: Object | CurrentSpot,
  recentSpots: RecentSpot[]
};

const initialState: PerformerState = {
  name: "",
  dateJoined: "",
  performanceStyles: [],
  currentSpot: {},
  recentSpots: []
};

export const performer = createSlice({
  name: "performer",
  initialState,
  reducers: {
    loadUser: (state, action: PayloadAction<{ name: string, dateJoined: string, performanceStyles: string[], currentSpot: Object | CurrentSpot, recentSpots: RecentSpot[] }>) => {
      return {
        name: action.payload.name,
        dateJoined: action.payload.dateJoined,
        performanceStyles: action.payload.performanceStyles,
        currentSpot: action.payload.currentSpot,
        recentSpots: action.payload.recentSpots
      }
    },
    resetUser: () => {
      return initialState
    },
    updatePerformanceStyles: (state, action: PayloadAction<{ performanceStyles: string[] }>) => {
      return {
        ...state,
        performanceStyles: action.payload.performanceStyles
      }
    },
    updateCurrentSpot: (state, action: PayloadAction<{ currentSpot: CurrentSpot }>) => {
      return {
        ...state,
        currentSpot: action.payload.currentSpot
      }
    },
    updateRecentSpots: (state, action: PayloadAction<{ recentSpots: RecentSpot[] }>) => {
      return {
        ...state,
        recentSpots: action.payload.recentSpots
      }
    }
  }
});

export const {
  loadUser,
  resetUser,
  updatePerformanceStyles,
  updateCurrentSpot,
  updateRecentSpots
} = performer.actions;
export default performer.reducer;