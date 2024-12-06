import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    audioInputDeviceId: undefined,
    audioOutputDeviceId: undefined,
    videoInputDeviceId: undefined
};

export const mediaDevicesSlice = createSlice({
    name: 'mediaDevices',
    initialState,
    reducers: {
        changeAudioInputDeviceId: (state, action) => {
            state.audioInputDeviceId = action.payload;
        },
        changeAudioOutputDeviceId: (state, action) => {
            state.audioOutputDeviceId = action.payload;
        },
        changeVideoInputDeviceId: (state, action) => {
            state.videoInputDeviceId = action.payload;
        }
    },
    selectors: {
        selectAudioInputDeviceId: (state) => state.audioInputDeviceId,
        selectAudioOutputDeviceId: (state) => state.audioOutputDeviceId,
        selectVideoInputDeviceId: (state) => state.videoInputDeviceId
    },
    extraReducers: (builder) => {
        builder.addCase('RESET', () => initialState);
    }
});

export const { actions: mediaDevicesActions, reducer: mediaDevicesReducer, selectors: mediaDevicesSelectors } = mediaDevicesSlice;
