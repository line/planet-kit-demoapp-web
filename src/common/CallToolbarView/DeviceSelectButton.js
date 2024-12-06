import React, { useState } from 'react';

import { IconButton, Menu, MenuItem } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function DeviceSelectButton({ devices, currentDeviceId, onChangeDevice }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton size="small" onClick={handleMenuOpen} color="inherit" aria-label="select microphone" sx={{ padding: '1px', ml: -1, mr: 2, borderRadius: 1 }}>
                {anchorEl ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowUpIcon fontSize="small" />}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
            >
                {devices?.map((device) => (
                    <MenuItem
                        key={`${device.deviceId}ai`}
                        selected={device.deviceId === currentDeviceId}
                        onClick={() => {
                            onChangeDevice(device);
                            handleMenuClose();
                        }}
                    >
                        {device.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default DeviceSelectButton;
