import React from 'react';
import { Box, Grid } from '@mui/material';

import { usePeerListState } from './PeerListContext';
import PeerVideo from './PeerVideo';

function PeerVideos({ planetKit }) {
    const peerList = usePeerListState();

    return (
        <>
            {/* Peers view */}
            {peerList?.slice(0, 5).map((peerInfo) => (
                <Grid key={peerInfo.key} item xs={4} sx={{ height: '50%' }}>
                    <PeerVideo peerInfo={peerInfo} planetKit={planetKit}></PeerVideo>
                </Grid>
            ))}
            {Array.from({ length: 5 - (peerList?.length ? peerList.length : 0) }, (_, index) => (
                <Grid key={`empty-${index}`} item xs={4} sx={{ height: '50%' }}>
                    <div style={{ height: '100%' }}>
                        <Box style={{ backgroundColor: '#242424', height: '100%', width: '100%' }} />
                    </div>
                </Grid>
            ))}
        </>
    );
}

export default PeerVideos;
