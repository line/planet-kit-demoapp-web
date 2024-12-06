import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { roomInfoSelectors } from '../reduxSlice/roomInfoSlice';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

function RoomInfoView() {
    /** Redux */
    const roomId = useSelector(roomInfoSelectors.selectRoomId);
    const totalPeersCount = useSelector(roomInfoSelectors.selectTotalPeersCount);

    /** States */
    const [elapsedTime, setElapsedTime] = useState(0);

    /** Functions */
    const formatElapsedTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [hours, minutes, secs].map((v) => v.toString().padStart(2, '0')).join(':');
    };

    /** Side effects */
    useEffect(() => {
        const startTime = Date.now();
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '10px',
                color: 'white',
                zIndex: '1'
            }}
        >
            <div>{`${roomId} (${totalPeersCount})`}</div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 'smaller' }}>
                <AccessTimeIcon style={{ marginRight: '5px' }} />
                <p>{formatElapsedTime(elapsedTime)}</p>
            </div>
        </div>
    );
}

export default RoomInfoView;
