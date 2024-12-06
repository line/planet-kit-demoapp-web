import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Container, TextField, Button, Typography, Grid } from '@mui/material';

import { callConfigsActions } from '../reduxSlice/callConfigsSlice';
import { roomInfoActions } from '../reduxSlice/roomInfoSlice';

import useInput from '../hook/useInput';
import { AccessControlContext } from '../route/AccessControlContext';
import HomeBreadcrumbs from '../common/HeaderView/HomeBreadcrumbs';

function GroupcallHomeView() {
    const dispatch = useDispatch();
    const { protectedNavigate } = useContext(AccessControlContext);
    const { t } = useTranslation();
    const [roomId, handleChangeRoomId] = useInput('');

    /** Functions */
    const isValidRoomId = () => {
        return /^[a-zA-Z0-9-_]{1,20}$/.test(roomId);
    };

    /** Event handlers */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isValidRoomId()) return;

        dispatch(callConfigsActions.setCallConfigs({ roomId }));
        dispatch(roomInfoActions.setRoomId(roomId));
        protectedNavigate({ path: '/video' });
    };

    return (
        <Container>
            <HomeBreadcrumbs path={t('lp_demoweb_group_scenarios_title')} />
            <Typography variant="h4" align="left" gutterBottom>
                {t('lp_demoweb_group_scenarios_title')}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="subtitle1" align="left">
                            {t('lp_demoweb_group_scenarios_basic_setup_roomname')}
                        </Typography>
                        <TextField value={roomId} onChange={handleChangeRoomId} fullWidth placeholder={t('lp_demoweb_group_scenarios_basic_setup_roomnameplaceholder')} margin="normal" sx={{ mt: 0 }} helperText={t('lp_demoweb_group_scenarios_basic_setup_roomnameguide')} error={!isValidRoomId()} />
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }} disabled={!isValidRoomId()}>
                            {t('lp_demoweb_group_scenarios_basic_setup_btn')}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default GroupcallHomeView;
