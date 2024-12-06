import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Container, Typography, Button, Box } from '@mui/material';

import HomeBreadcrumbs from '../HeaderView/HomeBreadcrumbs';
import { getLocalStorageItem } from '../../utils/WebStorageUtils';
import { AccessControlContext } from '../../route/AccessControlContext';

function HomeView() {
    const { protectedNavigate } = useContext(AccessControlContext);
    const { t } = useTranslation();
    const userId = getLocalStorageItem('wpk_my_id');
    const expiredTime = getLocalStorageItem('wpk_expired_time');
    const [didUserRegistered, setDidUserRegistered] = useState(() => userId && expiredTime > Date.now());

    /** Functions */
    const checkUserRegistered = () => {
        return userId && expiredTime > Date.now();
    };

    /** Event handlers */
    const handleClickGroupCall = () => {
        if (checkUserRegistered()) {
            protectedNavigate({ path: '/groupcall', replace: false });
        } else {
            setDidUserRegistered(false);
        }
    };

    return (
        <Container>
            <HomeBreadcrumbs path="" />
            <Button onClick={handleClickGroupCall} variant="contained" size="large" sx={{ mt: 2, width: '70%' }} disabled={!didUserRegistered}>
                {t('lp_demoweb_group_scenarios_title')}
            </Button>
            {!didUserRegistered && (
                <Typography variant="body1" color="error" sx={{ mt: 4 }}>
                    {t('lp_demoweb_default_guide1')}
                </Typography>
            )}
            <Box sx={{ mt: 10, textAlign: 'center', width: '100%' }}>
                <Typography variant="caption" display="block">
                    Demo App 1.0.0
                </Typography>
                <Typography variant="caption" display="block">
                    SDK 5.2.0
                </Typography>
            </Box>
        </Container>
    );
}

export default HomeView;
