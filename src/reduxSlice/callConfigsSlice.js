import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    logLevel: 'debug',
    // myName: undefined,   /**  myName and myId are handled in the localStorage */
    // myId: undefined,
    roomId: undefined,
    serviceId: process.env.REACT_USER_SERVICE_ID,
    mediaType: 'audio',
    micOn: true,
    cameraOn: true,
    accessToken: undefined
};

export const callConfigsSlice = createSlice({
    name: 'callConfigs',
    initialState,
    reducers: {
        setCallConfigs: (state, action) => {
            Object.entries(action.payload).forEach(([key, value]) => {
                state[key] = value;
            });
        }
    },
    selectors: {
        selectLogLevel: (state) => state.logLevel,
        selectRoomId: (state) => state.roomId,
        selectServiceId: (state) => state.serviceId,
        selectMicOn: (state) => state.micOn,
        selectCameraOn: (state) => state.cameraOn,
        selectAccessToken: (state) => state.accessToken
    }
});

export const { actions: callConfigsActions, reducer: callConfigsReducer, selectors: callConfigsSelectors } = callConfigsSlice;
