import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import { loadState, saveState } from './persistor';
import throttle from 'lodash/throttle'
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const persistedState = loadState();

// TODO: Make state persist work
export const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;