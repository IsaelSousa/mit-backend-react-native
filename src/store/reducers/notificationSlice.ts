import { IMessage } from '@/src/models/type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface NotificationState {
  messages: IMessage[];
}

const initialState: NotificationState = {
  messages: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<IMessage>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload.id);
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification.messages;

export default notificationSlice.reducer;
