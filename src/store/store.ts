import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './reducers/locationSlice';
import notificationReducer from './reducers/notificationSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    location: locationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;