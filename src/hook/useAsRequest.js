import React, { useCallback } from 'react';
import axios from 'axios';

import { getBrowserInfo } from '../utils/PlanetKitUtils';

function useAsRequest() {
    const registerUser = useCallback(async (userId, serviceId, displayName) => {
        const registerUri = `${process.env.REACT_APP_AS_URI}/v2/register_user`;
        const data = {
            userId,
            serviceId,
            region: process.env.REACT_USER_REGION,
            apiKey: process.env.REACT_APP_AS_API_KEY
        };

        try {
            const response = await axios.post(registerUri, data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }, []);

    const registerDevice = async (accessToken) => {
        const browserInfo = getBrowserInfo();
        const registerUri = `${process.env.REACT_APP_AS_URI}/v2/register_device`;
        const data = {
            appType: browserInfo.browser === 'Chrome' ? 'CHROMEOS' : 'BROWSER',
            appVer: browserInfo.version
        };

        try {
            const response = await axios.post(registerUri, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            return error.response?.data;
        }
    };

    const issueAccessToken = async (accessToken) => {
        const issueTokenUri = `${process.env.REACT_APP_AS_URI}/v2/access_token/issue`;

        const response = await axios.get(issueTokenUri, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json'
            }
        });
        const responseData = response.data;
        if (responseData.status === 'error' && responseData.code === '500') {
            return null;
        }
        return responseData.data.gwAccessToken;
    };

    return { registerUser, registerDevice, issueAccessToken };
}

export default useAsRequest;
