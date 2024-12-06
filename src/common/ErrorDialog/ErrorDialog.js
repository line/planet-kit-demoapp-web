import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, IconButton, List, ListItem, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { appStateActions, appStateSelectors } from '../../reduxSlice/appStateSlice';

function ErrorDialog() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const openErrorDialog = useSelector(appStateSelectors.selectOpenErrorDialog);
    const errorMessage = useSelector(appStateSelectors.selectErrorMessage);

    const handleClose = () => {
        dispatch(appStateActions.clearError());
        navigate('/', { replace: true });
    };

    return (
        <Dialog open={openErrorDialog} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {t('lp_demoweb_common_error_title')}
                <IconButton style={{ position: 'absolute', right: 8, top: 8 }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" sx={{ mt: 2, backgroundColor: '#06C755', '&:hover': { backgroundColor: '#05A94D' }, textTransform: 'none' }} color="success">
                    {t('lp_demoweb_common_layer_confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ErrorDialog;
