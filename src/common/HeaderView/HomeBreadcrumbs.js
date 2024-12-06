import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography, Breadcrumbs, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function HomeBreadcrumbs({ path }) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/', { replace: true });
    };

    return (
        <Breadcrumbs sx={{ mb: 2 }} separator={<NavigateNextIcon fontSize="small" />}>
            <IconButton
                edge="end"
                aria-label="home"
                onClick={handleNavigate}
                sx={{
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <HomeIcon sx={{ mr: 0.5, alignItems: 'center' }} fontSize="inherit" />
            </IconButton>
            {path &&
                path.split('/').map((subpath, index) => (
                    <Typography key={subpath + index} sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
                        {subpath}
                    </Typography>
                ))}
        </Breadcrumbs>
    );
}

export default HomeBreadcrumbs;
