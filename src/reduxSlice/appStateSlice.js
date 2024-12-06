import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openErrorDialog: false,
    errorMessage: ''
};

export const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.openErrorDialog = true;
            state.errorMessage = action.payload;
        },
        clearError: (state) => {
            state.openErrorDialog = false;
            state.errorMessage = '';
        }
    },
    selectors: {
        selectOpenErrorDialog: (state) => state.openErrorDialog,
        selectErrorMessage: (state) => state.errorMessage
    }
});

export const { actions: appStateActions, reducer: appStateReducer, selectors: appStateSelectors } = appStateSlice;
