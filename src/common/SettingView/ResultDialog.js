import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

function ResultDialog(props) {
    const { t } = useTranslation();
    const { open, handleClose, message } = props;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>{t('lp_demoweb_common_error_title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" sx={{ mt: 2, backgroundColor: '#06C755', '&:hover': { backgroundColor: '#05A94D' }, textTransform: 'none' }} color="success">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ResultDialog;
