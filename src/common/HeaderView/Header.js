import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { AppBar, Button, Toolbar, IconButton, Typography, useTheme } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PlanetIcon from '../../img/planetLogo.png';

import { AccessControlContext } from '../../route/AccessControlContext';
import { myCallStateSelectors } from '../../reduxSlice/myCallStateSlice';

function Header() {
    const location = useLocation();
    const theme = useTheme();
    const { protectedNavigate } = useContext(AccessControlContext);
    const { t } = useTranslation();

    const isCallStarted = useSelector(myCallStateSelectors.selectIsCallStarted);

    const handleNavigate = () => {
        protectedNavigate({ path: '/' });
    };

    const handleClickSetting = () => {
        protectedNavigate({ path: '/setting', replace: false });
    };

    return (
        <>
            {!isCallStarted && (
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        mb: 2
                    }}
                    elevation={theme.palette.mode === 'dark' ? 1 : 0}
                >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="logo"
                            onClick={handleNavigate}
                            sx={{
                                width: '3.5rem',
                                height: '3rem',
                                '&:hover': {
                                    backgroundColor: 'transparent'
                                }
                            }}
                        >
                            <img src={PlanetIcon} alt="planet logo" style={{ width: '100%', height: '100%' }} />
                        </IconButton>
                        <Typography variant="h6" onClick={handleNavigate} style={{ marginLeft: '16px', cursor: 'pointer' }}>
                            {t('lp_demoweb_logotitle')}
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                        {location.pathname === '/' && (
                            <Button variant="contained" startIcon={<SettingsIcon />} size="small" onClick={handleClickSetting}>
                                {t('lp_demoweb_common_setting_btn')}
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            )}
            <Outlet />
        </>
    );
}

export default Header;
