import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isCallStarted: false,
    isMicMuted: false,
    isCameraPaused: false,
    isTalking: false
};

const myCallStateSlice = createSlice({
    name: 'myCallState',
    initialState,
    reducers: {
        startCall: (state) => {
            state.isCallStarted = true;
        },
        muteMic: (state) => {
            state.isMicMuted = true;
        },
        unmuteMic: (state) => {
            state.isMicMuted = false;
        },
        pauseCamera: (state) => {
            state.isCameraPaused = true;
        },
        resumeCamera: (state) => {
            state.isCameraPaused = false;
        },
        activeTalkingStatus: (state) => {
            state.isTalking = true;
        },
        inactiveTalkingStatus: (state) => {
            state.isTalking = false;
        }
    },
    selectors: {
        selectIsCallStarted: (state) => state.isCallStarted,
        selectIsMicMuted: (state) => state.isMicMuted,
        selectIsCameraPaused: (state) => state.isCameraPaused,
        selectIsTalking: (state) => state.isTalking
    },
    extraReducers: (builder) => {
        builder.addCase('RESET', () => initialState);
    }
});

export const { actions: myCallStateActions, reducer: myCallStateReducer, selectors: myCallStateSelectors } = myCallStateSlice;
