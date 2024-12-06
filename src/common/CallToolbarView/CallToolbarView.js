import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';

import useMediaDevices from '../../hook/useMediaDevices';
import { mediaDevicesActions, mediaDevicesSelectors } from '../../reduxSlice/mediaDevicesSlice';
import { myCallStateActions, myCallStateSelectors } from '../../reduxSlice/myCallStateSlice';

import DeviceSelectButton from './DeviceSelectButton';

function CallToolbarView({ callState, planetKit }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isMyMicMuted = useSelector(myCallStateSelectors.selectIsMicMuted);
    const isMyCameraPaused = useSelector(myCallStateSelectors.selectIsCameraPaused);
    const currentAudioInputDeviceId = useSelector(mediaDevicesSelectors.selectAudioInputDeviceId);
    const currentAudioOutputDeviceId = useSelector(mediaDevicesSelectors.selectAudioOutputDeviceId);
    const currentVideoInputDeviceId = useSelector(mediaDevicesSelectors.selectVideoInputDeviceId);

    const [audioInputDevices, audioOutputDevices, videoInputDevices] = useMediaDevices();

    /** Event handlers */
    const handleClickCallEnd = () => {
        planetKit.leaveConference();
    };

    const handleClickMicToggle = () => {
        planetKit.muteMyAudio(!isMyMicMuted);
        dispatch(isMyMicMuted ? myCallStateActions.unmuteMic() : myCallStateActions.muteMic());
    };

    const handleClickCameraToggle = () => {
        if (isMyCameraPaused) {
            planetKit
                .resumeMyVideo()
                .then(() => {
                    dispatch(myCallStateActions.resumeCamera());
                })
                .catch();
        } else {
            planetKit
                .pauseMyVideo()
                .then(() => {
                    dispatch(myCallStateActions.pauseCamera());
                })
                .catch((error) => console.log('Fail to pause my video. ', error));
        }
    };

    const handleChangeMediaDevice = (mediaDevice) => {
        switch (mediaDevice.kind) {
            case 'audioinput':
                dispatch(mediaDevicesActions.changeAudioInputDeviceId(mediaDevice.deviceId));
                planetKit.changeAudioInputDevice(mediaDevice.deviceId).catch((error) => console.log('DeomApp | ToolbarButtonView | Fail to change audio input device', error));
                break;
            case 'audiooutput':
                dispatch(mediaDevicesActions.changeAudioOutputDeviceId(mediaDevice.deviceId));
                if (mediaDevice.deviceId) planetKit.changeAudioOutputDevice(mediaDevice.deviceId).catch((error) => console.log('DeomApp | ToolbarButtonView | Fail to change audio output device', error));
                break;
            case 'videoinput':
                dispatch(mediaDevicesActions.changeVideoInputDeviceId(mediaDevice.deviceId));
                if (mediaDevice.deviceId) planetKit.changeVideoInputDevice(mediaDevice.deviceId).catch((error) => console.log('DeomApp | ToolbarButtonView | Fail to change video input device', error));
                break;
            default:
                console.log('Change media devices.', mediaDevice);
        }
    };

    const handleChangeMediaDevices = (devices, currentDeviceId, deviceKind) => {
        if (devices === null || callState !== 'connected') return;
        const isDevicePresent = devices.some((device) => device.deviceId === currentDeviceId);
        if (currentDeviceId === 'default' || currentDeviceId === 'communications' || !isDevicePresent) {
            if (devices.length === 0) {
                handleChangeMediaDevice({ kind: deviceKind, deviceId: deviceKind === 'audioinput' ? 'empty' : null, label: 'empty' });
            } else {
                handleChangeMediaDevice(devices[0]);
            }
        }
    };

    /** Side effects */
    useEffect(() => {
        handleChangeMediaDevices(audioInputDevices, currentAudioInputDeviceId, 'audioinput');
    }, [audioInputDevices]);

    useEffect(() => {
        handleChangeMediaDevices(audioOutputDevices, currentAudioOutputDeviceId, 'audiooutput');
    }, [audioOutputDevices]);

    useEffect(() => {
        handleChangeMediaDevices(videoInputDevices, currentVideoInputDeviceId, 'videoinput');
    }, [videoInputDevices]);

    return (
        <AppBar position="fixed" sx={{ height: { xs: '56px', sm: '64px' }, backgroundColor: '#111111', top: 'auto', bottom: 0 }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                    onClick={handleClickMicToggle}
                    edge="start"
                    color="inherit"
                    aria-label="microphone"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    {isMyMicMuted ? <MicOffOutlinedIcon /> : <MicNoneOutlinedIcon />}
                </IconButton>
                <DeviceSelectButton devices={audioInputDevices} currentDeviceId={currentAudioInputDeviceId} onChangeDevice={handleChangeMediaDevice} />

                <IconButton
                    onClick={handleClickCameraToggle}
                    color="inherit"
                    aria-label="video"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    {isMyCameraPaused ? <VideocamOffOutlinedIcon /> : <VideocamOutlinedIcon />}
                </IconButton>
                <DeviceSelectButton devices={videoInputDevices} currentDeviceId={currentVideoInputDeviceId} onChangeDevice={handleChangeMediaDevice} />

                <div style={{ flexGrow: 1 }} />
                <Button onClick={handleClickCallEnd} color="error" variant="contained">
                    {t('lp_demoweb_group_scenarios_basic_inacall_btn')}
                </Button>
            </Toolbar>
        </AppBar>
    );
}
export default React.memo(CallToolbarView);
