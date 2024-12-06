import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { myCallStateSelectors } from '../reduxSlice/myCallStateSlice';
import { mediaDevicesSelectors } from '../reduxSlice/mediaDevicesSlice';

import RoomInfoView from './RoomInfoView';
import VideoNameTag from '../common/VideoNameTag/VideoNameTag';
import VideoPausedOverlay from '../common/VideoPausedOverlay/VideoPausedOverlay';

import * as commonStyles from '../styles/commonView.module.css';
import { getLocalStorageItem } from '../utils/WebStorageUtils';

function MyVideo({ myVideoRef }) {
    /** Redux */
    const myName = getLocalStorageItem('wpk_my_name');
    const isMyMicMuted = useSelector(myCallStateSelectors.selectIsMicMuted);
    const isMyCameraPaused = useSelector(myCallStateSelectors.selectIsCameraPaused);
    const isTalking = useSelector(myCallStateSelectors.selectIsTalking);
    const currentVideoInputDeviceId = useSelector(mediaDevicesSelectors.selectVideoInputDeviceId);

    /** States */
    const [isVideoVisible, setIsVideoVisible] = useState(true);

    /** Side effects */
    useEffect(() => {
        if (currentVideoInputDeviceId === null) {
            setIsVideoVisible(false);
        } else {
            setIsVideoVisible(true);
        }
    }, [currentVideoInputDeviceId]);

    return (
        <div
            className={`${isTalking ? commonStyles.actvieSpeaker : commonStyles.inactiveSpeaker}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: '#242424'
            }}
        >
            <RoomInfoView />
            <VideoPausedOverlay isCameraPaused={isMyCameraPaused} />
            <video
                ref={myVideoRef}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isVideoVisible ? 'block' : 'none'
                }}
                muted
                autoPlay
                playsInline
            />
            <VideoNameTag isMicMuted={isMyMicMuted} displayName={myName} />
        </div>
    );
}

export default MyVideo;
