import React from 'react';
import MicOffIcon from '@mui/icons-material/MicOff';

import * as styles from './VideoNameTag.module.css';

function VideoNameTag({ isMicMuted, displayName }) {
    return (
        <div className={styles.nameContainer}>
            {isMicMuted && <MicOffIcon sx={{ fontSize: '1rem' }} />} {displayName}
        </div>
    );
}

export default VideoNameTag;
