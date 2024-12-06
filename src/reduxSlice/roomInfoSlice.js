import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    roomId: undefined,
    totalPeersCount: 1
};

export const roomInfoSlice = createSlice({
    name: 'roomInfo',
    initialState,
    reducers: {
        setRoomId: (state, action) => {
            state.roomId = action.payload;
        },
        setTotalPeersCount: (state, action) => {
            state.totalPeersCount = action.payload;
        }
    },
    selectors: {
        selectRoomId: (state) => state.roomId,
        selectTotalPeersCount: (state) => state.totalPeersCount
    },
    extraReducers: (builder) => {
        builder.addCase('RESET', () => initialState);
    }
});

export const { actions: roomInfoActions, reducer: roomInfoReducer, selectors: roomInfoSelectors } = roomInfoSlice;
