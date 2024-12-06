import React from 'react';
import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';
import * as commonStyles from '../../styles/commonView.module.css';

function VideoPausedOverlay({ isCameraPaused, borderRadius }) {
    return (
        <>
            {isCameraPaused && (
                <div className={commonStyles.videoPausedOverlay} style={{ borderRadius: borderRadius || 'unset' }}>
                    <VideocamOffTwoToneIcon fontSize="large" style={{ color: '#fff' }} />
                </div>
            )}
        </>
    );
}
export default VideoPausedOverlay;
