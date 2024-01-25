import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import { loadState, saveState } from './persistor';
import throttle from 'lodash/throttle'

const persistedState = loadState();

// TODO: Make state persist work
const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

store.subscribe(throttle(() => {
  saveState(store.getState());
}, 1000));

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };