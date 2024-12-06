import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { getTheme } from './AppTheme';

import { AccessControlProvider } from '../route/AccessControlContext';
import { ProtectedRoute } from '../route/ProtectedRoute';
import '../i18next/i18n';

import Header from '../common/HeaderView/Header';
import HomeView from '../common/HomeView/HomeView';
import SettingView from '../common/SettingView/SettingView';
import GroupcallHomeView from '../groupcall/GroupcallHomeView';
import Preview from '../groupcall/Preview';
import EndpageView from '../groupcall/EndpageView';
import ErrorDialog from '../common/ErrorDialog/ErrorDialog';
import './App.css';

function App() {
    const theme = getTheme();

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <AccessControlProvider>
                        <Routes>
                            <Route paht="/" element={<Header />}>
                                <Route index element={<HomeView />} />
                                <Route path="groupcall" element={<ProtectedRoute component={GroupcallHomeView} path="/groupcall" />} />
                                <Route path="setting" element={<ProtectedRoute component={SettingView} path="/setting" />} />
                                <Route path="video" element={<ProtectedRoute component={Preview} path="/video" />} />
                                <Route path="endpage" element={<ProtectedRoute component={EndpageView} path="/endpage" />} />
                            </Route>
                        </Routes>
                        <ErrorDialog />
                    </AccessControlProvider>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default App;
