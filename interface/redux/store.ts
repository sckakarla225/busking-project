import { configureStore } from '@reduxjs/toolkit';
import throttle from 'lodash/throttle'
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import authReducer from './reducers/auth';
import performerReducer from './reducers/performer';
import spotsReducer from './reducers/spots';
import { loadState, saveState } from './persistor';

const persistedState = loadState();

// TODO: Make state persist work
export const store = configureStore({
  reducer: {
    auth: authReducer,
    performer: performerReducer,
    spots: spotsReducer
  }
});

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;