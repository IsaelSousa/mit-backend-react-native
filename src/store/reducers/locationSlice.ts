import { AddLocationParams } from '@/src/services/queries/country/location';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface NotificationState {
  location: AddLocationParams[];
};

const initialState: NotificationState = {
    location: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<AddLocationParams[]>) => {
      state.location = action.payload;
    }
  },
});

export const { addLocation } = locationSlice.actions;

export const selectLocations = (state: RootState) => state.location.location;

export default locationSlice.reducer;