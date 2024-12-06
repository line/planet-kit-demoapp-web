import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigationType } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { appStateActions } from '../reduxSlice/appStateSlice';
import { callConfigsSelectors } from '../reduxSlice/callConfigsSlice';
import { roomInfoActions } from '../reduxSlice/roomInfoSlice';
import { mediaDevicesSelectors } from '../reduxSlice/mediaDevicesSlice';
import { myCallStateActions } from '../reduxSlice/myCallStateSlice';
import { usePeerListDispatch } from './PeerListContext';

import { Box, Container, Grid } from '@mui/material';

import * as PlanetKit from '@line/planet-kit';
import CallToolbarView from '../common/CallToolbarView/CallToolbarView';
import MyVideo from './MyVideo';
import PeerVideos from './PeerVideos';
import SnackbarWrapper from '../common/Snackbar/SanckbarWrapper';
import { getLocalStorageItem } from '../utils/WebStorageUtils';
import { AccessControlContext } from '../route/AccessControlContext';

function BasicView({ initMediaStream }) {
    const { protectedNavigate } = useContext(AccessControlContext);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const peerListDispatch = usePeerListDispatch();
    const navigationType = useNavigationType();

    const myId = getLocalStorageItem('wpk_my_id');
    const myName = getLocalStorageItem('wpk_my_name');
    const roomId = useSelector(callConfigsSelectors.selectRoomId);
    const serviceId = useSelector(callConfigsSelectors.selectServiceId);
    const micOn = useSelector(callConfigsSelectors.selectMicOn);
    const cameraOn = useSelector(callConfigsSelectors.selectCameraOn);
    const accessToken = useSelector(callConfigsSelectors.selectAccessToken);
    const audioInputDeviceId = useSelector(mediaDevicesSelectors.selectAudioInputDeviceId);
    const audioOutputDeviceId = useSelector(mediaDevicesSelectors.selectAudioOutputDeviceId);
    const videoInputDeviceId = useSelector(mediaDevicesSelectors.selectVideoInputDeviceId);

    /** Functions */
    const printCallParams = (callParams) => {
        console.log(`
        myId: ${callParams.myId}
        peerId: ${callParams.peerId}
        roomId: ${callParams.roomId}
        myServiceId: ${callParams.myServiceId}
        roomServiceId: ${callParams.roomServiceId}
        mediaType: ${callParams.mediaType}
        micOn: ${callParams.micOn}
        cameraOn: ${callParams.cameraOn}
        ignoreDeviceError: ${callParams.ignoreDeviceError}
        enableTalkingStatusEvent: ${callParams.enableTalkingStatusEvent}
        displayName: ${callParams.displayName}
        mediaDeviceId: ${callParams.mediaDeviceId ? JSON.stringify(callParams.mediaDeviceId) : callParams.mediaDeviceId}
        initMedia: ${callParams.initMedia}
        accessToken: ${callParams.accessToken}`);
    };

    /** States */
    const [planetKit] = useState(
        () =>
            new PlanetKit.Conference({
                logLevel: 'debug'
            })
    );
    const hasCalled = useRef(false);
    const [callState, setCallState] = useState('init');
    const [snackbarMessage, setSnackbarMessage] = useState();
    const roomAudioRef = useRef();
    const myVideoRef = useRef();

    /** Conference delegate */
    const onEvtConnected = () => {
        if (hasCalled.current === false) {
            console.warn('DemoApp | BasicView | leave conference by system');
            planetKit.leaveConference();
            return;
        }

        if (audioOutputDeviceId) {
            planetKit.changeAudioOutputDevice(audioOutputDeviceId).catch((error) => {
                console.warn(`DemoApp | BasicView | Fail to change speaker(id=${audioOutputDeviceId}).`, error);
            });
        }

        setCallState('connected');
    };

    const onEvtDisconnected = (disconnectedParam) => {
        const disconnectSource = disconnectedParam?.source;
        const disconnectReason = disconnectedParam?.reason;
        setCallState('disconnected');
        protectedNavigate({ path: '/endpage', params: { disconnectReason: disconnectReason.strCode || '' } });
        dispatch({ type: 'RESET' });
    };

    const onEvtPeerListUpdated = (conferencePeerUpdatedParam) => {
        const { addedPeers, removedPeers, totalPeersCount } = conferencePeerUpdatedParam;
        peerListDispatch({ type: 'UPDATE', payload: { addedPeers, removedPeers } });

        if (removedPeers?.length) {
            const removedPeersNameString = removedPeers.map((peerInfo) => peerInfo.displayName).join(',');
            setSnackbarMessage({ message: t(`lp_demoweb_group_scenarios_basic_inacall_toast`, { 'User name': removedPeersNameString }), key: new Date().getTime() });
        }

        dispatch(roomInfoActions.setTotalPeersCount(totalPeersCount));
    };

    const onEvtPeersVideoPaused = (peersVideoPausedParam) => {
        peerListDispatch({ type: 'VIDEO_PAUSED', payload: peersVideoPausedParam });
    };

    const onEvtPeersVideoResumed = (peersVideoResumedParam) => {
        peerListDispatch({ type: 'VIDEO_RESUMED', payload: peersVideoResumedParam });
    };

    const onEvtPeersMicMuted = (peersMicMutedParam) => {
        peerListDispatch({ type: 'MIC_MUTED', payload: peersMicMutedParam });
    };

    const onEvtPeersMicUnmuted = (peersMicUnmutedParam) => {
        peerListDispatch({ type: 'MIC_UNMUTED', payload: peersMicUnmutedParam });
    };

    const onEvtMyTalkingStatusUpdated = (isActive) => {
        dispatch(isActive ? myCallStateActions.activeTalkingStatus() : myCallStateActions.inactiveTalkingStatus());
    };

    const onEvtPeersTalkingStatusUpdated = (peersTalkingStatusUpdatedParam) => {
        const { active, inactive } = peersTalkingStatusUpdatedParam;
        peerListDispatch({ type: 'TALKING_STATUS', payload: { active, inactive } });
    };

    /** Side effects */
    useEffect(() => {
        if (hasCalled.current === false) {
            // To perceive browser's backwrd action
            history.pushState(null, '', window.location.href);

            setCallState('connecting');
            hasCalled.current = true;
            const planetKitConferenceJoinParams = {
                myId: String(myId),
                myServiceId: serviceId,
                roomId: String(roomId),
                roomServiceId: serviceId,
                mediaType: 'video',
                mediaDeviceId: {
                    inputAudio: audioInputDeviceId !== 'denied' ? audioInputDeviceId : null,
                    inputVideo: videoInputDeviceId !== 'denied' ? videoInputDeviceId : null
                },
                mediaHtmlElement: {
                    myVideo: myVideoRef.current,
                    roomAudio: roomAudioRef.current
                },
                delegate: {
                    evtConnected: onEvtConnected,
                    evtDisconnected: onEvtDisconnected,
                    evtPeerListUpdated: onEvtPeerListUpdated,
                    evtPeersVideoPaused: onEvtPeersVideoPaused,
                    evtPeersVideoResumed: onEvtPeersVideoResumed,
                    evtPeersMicMuted: onEvtPeersMicMuted,
                    evtPeersMicUnmuted: onEvtPeersMicUnmuted,
                    evtMyTalkingStatusUpdated: onEvtMyTalkingStatusUpdated,
                    evtPeersTalkingStatusUpdated: onEvtPeersTalkingStatusUpdated
                },
                micOn,
                cameraOn,
                accessToken,
                displayName: myName.replace(/\\/g, '\\\\'),
                ignoreDeviceError: true,
                enableTalkingStatusEvent: true
            };

            if (initMediaStream.getVideoTracks().length) {
                planetKitConferenceJoinParams.initMedia = {
                    mediaStream: initMediaStream
                };
            }

            try {
                // printCallParams(planetKitConferenceJoinParams);
                planetKit.joinConference(planetKitConferenceJoinParams);
            } catch (error) {
                dispatch(appStateActions.setError(`${error.message}`));
                console.error(error);
            }
        }
    }, []);

    // handle change of navigationType for browser history
    useEffect(() => {
        if (navigationType === 'POP') {
            if (callState === 'connected') {
                planetKit.leaveConference();
            } else if (callState === 'connecting') {
                hasCalled.current = false;
            }
        }
    }, [navigationType]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%'
            }}
        >
            <SnackbarWrapper messageProp={snackbarMessage} />
            <Container
                maxWidth={false}
                sx={{
                    position: 'relative',
                    pb: 8,
                    maxHeight: 'calc(100vh - 64px)',
                    '@media (max-width:600px)': {
                        maxHeight: 'calc(100vh - 56px)'
                    }
                }}
            >
                <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={2}
                    alignItems="stretch"
                    sx={{
                        maxHeight: 'calc(95vh - 64px)',
                        '@media (max-width:600px)': {
                            maxHeight: 'calc(95h - 56px)'
                        },
                        aspectRatio: '16 / 9'
                    }}
                >
                    {/* My view */}
                    <Grid item xs={4} sx={{ height: '50%' }}>
                        <MyVideo myVideoRef={myVideoRef}></MyVideo>
                        <audio ref={roomAudioRef} autoPlay />
                    </Grid>
                    <PeerVideos planetKit={planetKit}></PeerVideos>
                </Grid>
            </Container>
            <CallToolbarView callState={callState} planetKit={planetKit}></CallToolbarView>
        </Box>
    );
}

export default React.memo(BasicView);
