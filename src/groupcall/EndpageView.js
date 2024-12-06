import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Container, Typography, Button, Box } from '@mui/material';

import { callConfigsSelectors } from '../reduxSlice/callConfigsSlice';

import HomeBreadcrumbs from '../common/HeaderView/HomeBreadcrumbs';

function EndpageView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const roomId = useSelector(callConfigsSelectors.selectRoomId);

    /** Event handlers */
    const handleClickHomeButton = (event) => {
        navigate('/', { replace: true });
    };

    return (
        <Container>
            <HomeBreadcrumbs path={t('lp_demoweb_group_scenarios_title') + '/' + t('lp_demoweb_group_common_navi_callend')} />
            <Typography variant="h4" align="left" gutterBottom>
                {roomId}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '600px',
                    padding: 2
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    {t('lp_demoweb_group_common_callend_guide')}
                </Typography>
                <Typography variant="subtitle1" component="h2" gutterBottom>
                    ({location.state?.disconnectReason})
                </Typography>
                <Button onClick={handleClickHomeButton} variant="contained" size="large" sx={{ mt: 2, backgroundColor: '#06C755', '&:hover': { backgroundColor: '#05A94D' }, width: '70%' }}>
                    {t('lp_demoweb_group_common_callend_btn')}
                </Button>
            </Box>
        </Container>
    );
}

export default EndpageView;
