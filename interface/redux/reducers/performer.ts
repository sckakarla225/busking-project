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

interface SocialMediaHandle {
  platform: string,
  handle: string,
};

interface PerformerState {
  name: string,
  dateJoined: string,
  setupComplete: boolean,
  currentSpot: Object | CurrentSpot,
  recentSpots: RecentSpot[],
  performerDescription: string,
  performanceStyles: string[],
  instrumentTypes: string[],
  audioTools: string[],
  stagingAndVisuals: string[],
  socialMediaHandles: SocialMediaHandle[]
};

const initialState: PerformerState = {
  name: "",
  dateJoined: "",
  setupComplete: false,
  currentSpot: {},
  recentSpots: [],
  performerDescription: "",
  performanceStyles: [],
  instrumentTypes: [],
  audioTools: [],
  stagingAndVisuals: [],
  socialMediaHandles: []
};

export const performer = createSlice({
  name: "performer",
  initialState,
  reducers: {
    loadUser: (state, action: PayloadAction<{ 
      name: string, 
      dateJoined: string,
      setupComplete: boolean,  
      currentSpot: Object | CurrentSpot, 
      recentSpots: RecentSpot[] 
    }>) => {
      return {
        ...state,
        name: action.payload.name,
        dateJoined: action.payload.dateJoined,
        setupComplete: action.payload.setupComplete,
        currentSpot: action.payload.currentSpot,
        recentSpots: action.payload.recentSpots
      }
    },
    loadUserFull: (state, action: PayloadAction<{
      performerDescription: string,
      performanceStyles: string[],
      instrumentTypes: string[],
      audioTools: string[],
      stagingAndVisuals: string[],
      socialMediaHandles: SocialMediaHandle[]
    }>) => {
      return {
        ...state,
        performerDescription: action.payload.performerDescription,
        performanceStyles: action.payload.performanceStyles,
        instrumentTypes: action.payload.instrumentTypes,
        audioTools: action.payload.audioTools,
        socialMediaHandles: action.payload.socialMediaHandles
      }
    },
    changeSetupComplete: (state, action: PayloadAction<{ setupComplete: boolean }>) => {
      return {
        ...state,
        setupComplete: action.payload.setupComplete
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
  loadUserFull,
  resetUser,
  changeSetupComplete,
  updatePerformanceStyles,
  updateCurrentSpot,
  updateRecentSpots
} = performer.actions;
export default performer.reducer;