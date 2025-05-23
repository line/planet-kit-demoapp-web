import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Container, Typography, Grid, IconButton, Button, Box, Select, MenuItem } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import { appStateActions } from '../reduxSlice/appStateSlice';
import { callConfigsActions, callConfigsSelectors } from '../reduxSlice/callConfigsSlice';
import { mediaDevicesActions } from '../reduxSlice/mediaDevicesSlice';
import { myCallStateActions } from '../reduxSlice/myCallStateSlice';
import { PeerListProvider } from './PeerListContext';

import useMediaDevices from '../hook/useMediaDevices';
import useAsRequest from '../hook/useAsRequest';
import HomeBreadcrumbs from '../common/HeaderView/HomeBreadcrumbs';
import VideoPausedOverlay from '../common/VideoPausedOverlay/VideoPausedOverlay';
import BasicView from './BasicView';
import { getLocalStorageItem } from '../utils/WebStorageUtils';

function Preview() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { issueAccessToken } = useAsRequest();

    const accessToken = getLocalStorageItem('wpk_access_token');
    const roomId = useSelector(callConfigsSelectors.selectRoomId);

    const [audioInputDevices, audioOutputDevices, videoInputDevices] = useMediaDevices();
    const [mic, setMic] = useState({ id: '' });
    const [speaker, setSpeaker] = useState({ id: '' });
    const [camera, setCamera] = useState({ id: '' });

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [isCallStarted, setIsCallStarted] = useState(false);
    const [isCallEnabled, setIsCallEnabled] = useState(false);

    const previewMediaStream = useRef(new MediaStream());
    const videoRef = useRef();

    /** Functions */
    const replaceTrackOfPreviewMediaStream = async (mediaType) => {
        const constraints = {
            audio: mediaType === 'audio' ? (mic.id ? { deviceId: { exact: mic.id } } : true) : false,
            video: mediaType === 'video' ? (camera.id ? { deviceId: { exact: camera.id }, width: 1280, height: 720 } : { width: 1280, height: 720 }) : false
        };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const oldTrack = previewMediaStream.current.getTracks().find((track) => track.kind === mediaType);
            if (oldTrack) {
                oldTrack.stop();
                previewMediaStream.current.removeTrack(oldTrack);
            }
            const newTrack = stream.getTracks().find((track) => track.kind === mediaType);
            if (newTrack) previewMediaStream.current.addTrack(newTrack);
        } catch (error) {
            console.warn('Fail to get mediaStream during repalce track.', error.message);
        }
    };

    /** Event handlers */
    const handleClickMicToggle = () => {
        setMicOn(!micOn);
    };

    const handleClickCameraToggle = () => {
        setCameraOn(!cameraOn);
    };

    const handleChangeDeviceId = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'mic':
                setMic({ id: value });
                break;
            case 'camera':
                setCamera({ id: value });
                break;
            case 'speaker':
                setSpeaker({ id: value });
                break;
            default:
                console.log('Invalid device type');
        }
    };

    const handleClickMakeRoom = () => {
        issueAccessToken(accessToken)
            .then((gwAccessToken) => {
                dispatch(
                    callConfigsActions.setCallConfigs({
                        micOn: micOn,
                        cameraOn: cameraOn,
                        accessToken: gwAccessToken
                    })
                );

                dispatch(mediaDevicesActions.changeAudioInputDeviceId(mic.id));
                dispatch(mediaDevicesActions.changeAudioOutputDeviceId(speaker.id));
                dispatch(mediaDevicesActions.changeVideoInputDeviceId(camera.id));

                dispatch(micOn ? myCallStateActions.unmuteMic() : myCallStateActions.muteMic());
                dispatch(cameraOn ? myCallStateActions.resumeCamera() : myCallStateActions.pauseCamera());
                dispatch(myCallStateActions.startCall());
                setIsCallStarted(true);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    dispatch(appStateActions.setError('Register user has expired'));
                } else {
                    dispatch(appStateActions.setError(`${error?.message}`));
                }
            });
    };

    const handleChangeMediaDevices = (devices, currentDeviceId, deviceKind) => {
        /** Check the state of isCallStarted for Safari browser */
        if (isCallStarted || devices === null) return;
        const isDevicePresent = devices.some((device) => device.deviceId === currentDeviceId);
        if (currentDeviceId === 'default' || currentDeviceId === 'communications' || !isDevicePresent) {
            const newDeviceId = devices[0]?.deviceId || '';
            switch (deviceKind) {
                case 'audioinput':
                    setMic({ id: newDeviceId });
                    break;
                case 'audiooutput':
                    setSpeaker({ id: newDeviceId });
                    break;
                case 'videoinput':
                    setCamera({ id: newDeviceId });
                    if (devices.length === 0) {
                        /**
                         * Set the call enable option to true, as there is no video track to prepare if there is no camera.
                         */
                        setIsCallEnabled(true);
                    }
                    break;
                default:
                    return;
            }
        }
    };

    /** Side effects */
    useEffect(() => {
        // Get permission
        navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
                let hasAudioInput = false;
                let hasVideoInput = false;

                devices.forEach((device) => {
                    if (device.kind === 'audioinput') {
                        hasAudioInput = true;
                    }
                    if (device.kind === 'videoinput') {
                        hasVideoInput = true;
                    }
                });

                const constraints = {
                    audio: hasAudioInput,
                    video: hasVideoInput ? { width: 1280, height: 720 } : false
                };

                if (hasAudioInput || hasVideoInput) {
                    navigator.mediaDevices
                        .getUserMedia(constraints)
                        .then((stream) => {
                            stream.getTracks().forEach((track) => track.stop());
                        })
                        .catch((error) => {
                            /** For Safari
                             * Safari's denied permission not checked in useMediaDevices
                             */
                            if (hasVideoInput && error.name === 'NotAllowedError') setIsCallEnabled(true);
                            console.error('Failed to get init media permissions. ', error.message);
                        });
                } else {
                    console.log('No audio and video devices found');
                }
            })
            .catch((error) => {
                console.error('Error enumerating devices', error);
            });
    }, []);

    useEffect(() => {
        let isActive = true;
        let currentPreviewMediaStream = previewMediaStream.current;
        const asyncFunction = async () => {
            setIsCallEnabled(false);
            if (cameraOn) {
                await replaceTrackOfPreviewMediaStream('video');
                if (isActive && videoRef?.current) {
                    videoRef.current.srcObject = currentPreviewMediaStream;
                } else {
                    currentPreviewMediaStream.getVideoTracks().forEach((track) => track.stop());
                }
            } else {
                if (currentPreviewMediaStream) {
                    videoRef.current.srcObject = null;
                    currentPreviewMediaStream.getVideoTracks().forEach((track) => track.stop());
                }
            }

            setIsCallEnabled(true);
        };
        if (camera.id) asyncFunction();

        return () => {
            isActive = false;
            if (currentPreviewMediaStream) {
                currentPreviewMediaStream.getVideoTracks().forEach((track) => {
                    track.stop();
                    currentPreviewMediaStream.removeTrack(track);
                });
            }
        };
    }, [cameraOn, camera]);

    useEffect(() => {
        let isActive = true;
        let currentPreviewMediaStream = previewMediaStream.current;
        const asyncFunction = async () => {
            await replaceTrackOfPreviewMediaStream('audio');
            if (!isActive) {
                currentPreviewMediaStream.getAudioTracks().forEach((track) => track.stop());
            }
        };
        if (mic.id) asyncFunction();

        return () => {
            isActive = false;
            if (currentPreviewMediaStream) {
                currentPreviewMediaStream.getAudioTracks().forEach((track) => {
                    track.stop();
                    currentPreviewMediaStream.removeTrack(track);
                });
            }
        };
    }, [mic]);

    useEffect(() => {
        handleChangeMediaDevices(audioInputDevices, mic.id, 'audioinput');
    }, [audioInputDevices]);

    useEffect(() => {
        handleChangeMediaDevices(audioOutputDevices, speaker.id, 'audiooutput');
    }, [audioOutputDevices]);

    useEffect(() => {
        handleChangeMediaDevices(videoInputDevices, camera.id, 'videoinput');
    }, [videoInputDevices]);

    return (
        <>
            {!isCallStarted && (
                <Container>
                    <HomeBreadcrumbs path={t('lp_demoweb_group_scenarios_title') + '/' + t('lp_demoweb_group_scenarios_basic_preview_title')} />
                    <Typography variant="h4" align="left" gutterBottom>
                        {roomId}
                    </Typography>
                    <Grid container spacing={2} alignItems="center" style={{ height: '50vh' }}>
                        <Grid item xs={1} />
                        <Grid item xs sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flex: 9, width: '100%', height: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#242424', borderRadius: '20px' }}>
                                <VideoPausedOverlay isCameraPaused={!cameraOn} borderRadius={'20px'} />
                                <video
                                    ref={videoRef}
                                    style={{
                                        zIndex: 1,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '20px'
                                    }}
                                    muted
                                    autoPlay
                                    playsInline
                                />
                            </Box>
                            {/* Buttons Section */}
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <IconButton onClick={handleClickMicToggle}>{micOn ? <MicIcon /> : <MicOffIcon />}</IconButton>
                                <IconButton onClick={handleClickCameraToggle}>{cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}</IconButton>
                                <Button onClick={handleClickMakeRoom} variant="contained" sx={{ textTransform: 'none' }} disabled={!isCallEnabled}>
                                    {t('lp_demoweb_group_scenarios_basic_preview_btn')}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs>
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <Typography variant="subtitle1" align="left">
                                        {t('lp_demoweb_group_scenarios_basic_preview_camera')}
                                    </Typography>
                                    <Select value={camera.id} name="camera" onChange={handleChangeDeviceId} fullWidth size="small">
                                        {videoInputDevices?.map((videoInputDevice) => (
                                            <MenuItem key={videoInputDevice.deviceId} value={videoInputDevice.deviceId}>
                                                {videoInputDevice.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" align="left">
                                        {t('lp_demoweb_group_scenarios_basic_preview_mic')}
                                    </Typography>
                                    <Select value={mic.id} name="mic" onChange={handleChangeDeviceId} fullWidth size="small">
                                        {audioInputDevices?.map((audioInputDevice) => (
                                            <MenuItem key={audioInputDevice.deviceId} value={audioInputDevice.deviceId}>
                                                {audioInputDevice.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" align="left">
                                        {t('lp_demoweb_group_scenarios_basic_preview_speaker')}
                                    </Typography>
                                    <Select value={speaker.id} name="speaker" onChange={handleChangeDeviceId} fullWidth size="small">
                                        {audioOutputDevices?.map((audioOutputDevice) => (
                                            <MenuItem key={audioOutputDevice.deviceId} value={audioOutputDevice.deviceId}>
                                                {audioOutputDevice.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            )}
            {isCallStarted && (
                <PeerListProvider>
                    <BasicView initMediaStream={previewMediaStream.current} />
                </PeerListProvider>
            )}
        </>
    );
}

export default Preview;
