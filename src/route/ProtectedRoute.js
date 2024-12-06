import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AccessControlContext } from './AccessControlContext';

export function ProtectedRoute({ component: Component, path }) {
    const { allowedAccess } = useContext(AccessControlContext);

    return allowedAccess[path] ? <Component /> : <Navigate to="/" />;
}
