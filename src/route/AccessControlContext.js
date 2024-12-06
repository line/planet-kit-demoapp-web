import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AccessControlContext = createContext();

export function AccessControlProvider({ children }) {
    const navigate = useNavigate();

    const [allowedAccess, setAllowedAccess] = useState({
        '/groupcall': false,
        '/video': false,
        '/setting': false
    });
    const [navigation, setNavigation] = useState({ path: null, replace: null, params: {} });

    useEffect(() => {
        const { path, replace, params } = navigation;
        if (path && allowedAccess[path]) {
            navigate(path, { replace, state: params });
            setNavigation({ path: null, params: {} });
        }
    }, [allowedAccess, navigation, navigate]);

    const protectedNavigate = ({ path, replace = true, params = {} }) => {
        setAllowedAccess((prev) => ({ ...prev, [path]: true }));
        setNavigation({ path, replace, params });
    };

    return <AccessControlContext.Provider value={{ allowedAccess, protectedNavigate }}>{children}</AccessControlContext.Provider>;
}
