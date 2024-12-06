import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { callConfigsSelectors } from '../reduxSlice/callConfigsSlice';

import VideoNameTag from '../common/VideoNameTag/VideoNameTag';

import * as commonStyles from '../styles/commonView.module.css';
import VideoPausedOverlay from '../common/VideoPausedOverlay/VideoPausedOverlay';

function PeerVideo({ peerInfo, planetKit }) {
    const serviceId = useSelector(callConfigsSelectors.selectServiceId);

    /** States */
    const videoRef = useRef();

    /** Side effects */
    useEffect(() => {
        const requestVideoParams = {
            userId: peerInfo.userId,
            serviceId,
            resolution: 'vga',
            videoViewElement: videoRef.current
        };

        planetKit.requestPeerVideo(requestVideoParams).catch((error) => {
            console.log(`Reject to request peer video because of ${error.name}. ${error.message}`);
        });
    }, []);

    return (
        <div className={`${peerInfo.isTalking ? commonStyles.actvieSpeaker : commonStyles.inactiveSpeaker}`} style={{ position: 'relative', height: '100%' }}>
            <VideoPausedOverlay isCameraPaused={peerInfo.videoState === 'enabled' ? false : true} />
            <video key={peerInfo.key} ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#242424' }} muted autoPlay playsInline />
            <VideoNameTag isMicMuted={peerInfo.micMuted} displayName={peerInfo.displayName} />
        </div>
    );
}

export default React.memo(PeerVideo);
