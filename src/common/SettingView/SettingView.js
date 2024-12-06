import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Container, TextField, Button, Typography, Grid } from '@mui/material';

import useInput from '../../hook/useInput';
import useAsRequest from '../../hook/useAsRequest';
import HomeBreadcrumbs from '../HeaderView/HomeBreadcrumbs';
import { getLocalStorageItem, setLocalStorageItem } from '../../utils/WebStorageUtils';
import ResultDialog from './ResultDialog';
import { formatDate, getGMTInfo, decodeJWTPayload } from '../../utils/Utils';

function SettingView() {
    const { t } = useTranslation();
    const { registerUser, registerDevice } = useAsRequest();

    const [myId, handleChangeMyId, setMyId] = useInput(getLocalStorageItem('wpk_my_id') || '');
    const [myName, handleChangeMyName, setMyName] = useInput(getLocalStorageItem('wpk_my_name') || '');

    const [expiredTime, setExpiredTime] = useState(getLocalStorageItem('wpk_expired_time'));
    const [didUserRegistered, setDidUserRegistered] = useState(() => !!myId);
    const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false);
    const [resultDialogOption, setResultDialogOption] = useState({
        open: false,
        message: ''
    });

    /** Functions */
    const isValidMyName = () => {
        return myName && myName.length <= 10;
    };

    const isValidMyId = () => {
        const isValidCharacters = /^[a-zA-Z0-9-_]+$/.test(myId);
        const byteLength = new Blob([myId]).size;
        return isValidCharacters && byteLength <= 64 ? true : false;
    };

    const setUserInfoToLocalStorage = ({ myId, myName, accessToken, expiredTime }) => {
        setLocalStorageItem('wpk_my_id', myId);
        setLocalStorageItem('wpk_my_name', myName);
        setLocalStorageItem('wpk_access_token', accessToken);
        setLocalStorageItem('wpk_expired_time', expiredTime);
    };

    const resetUser = () => {
        // clear setting view
        setUserInfoToLocalStorage({
            myId: null,
            myName: null,
            accessToken: null,
            expiredTime: null
        });
        setMyId('');
        setMyName('');
        setExpiredTime();
        setDidUserRegistered(false);
    };

    /** Event handlers */
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isValidMyId() || !isValidMyName()) {
            return;
        }

        try {
            setDisabledSubmitBtn(true);
            const response = await registerUser(myId, process.env.REACT_USER_SERVICE_ID);

            const responseStatus = response?.status;
            const responseCode = response?.code;
            let accessToken;
            switch (responseStatus) {
                case 'success':
                    accessToken = response?.data.accessToken;
                    const payload = decodeJWTPayload(accessToken);
                    setUserInfoToLocalStorage({
                        myId,
                        myName,
                        accessToken,
                        expiredTime: payload.exp * 1000
                    });
                    setExpiredTime(payload.exp * 1000);
                    break;
                case 'error':
                    if (responseCode === '409') {
                        setResultDialogOption({ open: true, message: t('lp_demoweb_common_layer_body1') });
                        return;
                    } else {
                        setResultDialogOption({ open: true, message: t('lp_demoweb_common_default_error_msg') });
                        return;
                    }
                    break;
                default:
                    setResultDialogOption({ open: true, message: t('lp_demoweb_common_default_error_msg') });
                    return;
            }

            if (accessToken !== undefined) {
                await registerDevice(accessToken);
                setDidUserRegistered(true);
            } else {
                throw Error();
            }
        } catch (error) {
            setResultDialogOption({ open: true, message: t('lp_demoweb_common_default_error_msg') });
            resetUser();
            console.warn(error);
            return;
        } finally {
            setDisabledSubmitBtn(false);
        }
    };

    const handleReset = (event) => {
        event.preventDefault();
        resetUser();
    };

    // Siede effects
    useEffect(() => {
        if (expiredTime <= Date.now()) {
            resetUser();
        } else if (didUserRegistered) {
            registerDevice(getLocalStorageItem('wpk_access_token'));
        }
    }, []);

    return (
        <Container>
            <ResultDialog
                open={resultDialogOption.open}
                handleClose={() => {
                    setResultDialogOption((prev) => ({ ...prev, open: false }));
                }}
                message={resultDialogOption.message}
            />
            <HomeBreadcrumbs path={t('lp_demoweb_setting_title')} />
            <Typography variant="h4" align="left" gutterBottom>
                {t('lp_demoweb_setting_title')}
            </Typography>

            <form onSubmit={didUserRegistered ? handleReset : handleSubmit}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="subtitle1" align="left">
                            {t('lp_demoweb_setting_name')}
                            <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField value={myName} onChange={handleChangeMyName} fullWidth placeholder={t('lp_demoweb_setting_placeholder1')} margin="normal" sx={{ mt: 0 }} helperText={t('lp_demoweb_setting_guide1')} error={!isValidMyName()} disabled={didUserRegistered} />
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" align="left">
                            {t('lp_demoweb_setting_myuserid')}
                            <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField value={myId} onChange={handleChangeMyId} fullWidth placeholder={t('lp_demoweb_setting_placeholder2')} margin="normal" sx={{ mt: 0, mb: 0 }} helperText={t('lp_demoweb_setting_guide2')} error={!isValidMyId()} disabled={didUserRegistered} />
                        {expiredTime && (
                            <Typography variant="caption" align="left" sx={{ color: 'red', display: 'block' }}>
                                {t('lp_demoweb_setting_guide4', { 'YYYY-MM-DD hh.mm.ss': formatDate(expiredTime), 'gmt info': getGMTInfo() })}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" fullWidth size="large" sx={{ backgroundColor: didUserRegistered ? '#FF334B' : '#06C755', '&:hover': { backgroundColor: didUserRegistered ? 'red' : '#05A94D' } }} disabled={!isValidMyId() || !isValidMyName() || disabledSubmitBtn}>
                            {didUserRegistered ? t('lp_demoweb_setting_reset_btn') : t('lp_demoweb_setting_save_btn')}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default SettingView;
