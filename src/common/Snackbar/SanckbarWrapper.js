import React, { useEffect, useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import * as styles from './SnackbarWrapper.module.css';

export default function SnackbarWrapper({ messageProp }) {
    const [snackPack, setSnackPack] = useState([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState(undefined);

    const handleClose = () => {
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    /** Side effects */
    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    useEffect(() => {
        if (messageProp) {
            setSnackPack((prev) => [...prev, { message: messageProp.message, key: messageProp.key }]);
        }
    }, [messageProp]);

    return <Snackbar key={messageInfo ? messageInfo.key : undefined} open={open} className={styles.snackbarCustom} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} autoHideDuration={5000} onClose={handleClose} TransitionProps={{ onExited: handleExited }} message={messageInfo ? messageInfo.message : undefined} />;
}
