import { configureStore } from '@reduxjs/toolkit';

import { callConfigsReducer } from '../reduxSlice/callConfigsSlice';
import { myCallStateReducer } from '../reduxSlice/myCallStateSlice';
import { roomInfoReducer } from '../reduxSlice/roomInfoSlice';
import { appStateReducer } from '../reduxSlice/appStateSlice';
import { mediaDevicesReducer } from '../reduxSlice/mediaDevicesSlice';

export default configureStore({
    reducer: {
        callConfigs: callConfigsReducer,
        myCallState: myCallStateReducer,
        roomInfo: roomInfoReducer,
        appState: appStateReducer,
        mediaDevices: mediaDevicesReducer
    }
});
