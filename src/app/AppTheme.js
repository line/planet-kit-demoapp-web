import { createTheme } from '@mui/material';

export const getTheme = () => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            background: {
                default: prefersDarkMode ? '#121212' : '#fff',
                paper: prefersDarkMode ? '#121212' : '#f5f5f5'
            }
        },
        typography: {
            h6: {
                color: prefersDarkMode ? '#fff' : 'black'
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    contained: {
                        color: 'white',
                        backgroundColor: '#06C755',
                        '&:hover': {
                            backgroundColor: '#05A94D'
                        },
                        '&.MuiButton-colorError': {
                            color: 'white',
                            backgroundColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#f44336'
                            }
                        }
                    }
                }
            }
        }
    });
};
