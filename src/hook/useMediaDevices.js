import React, { useState, useEffect } from 'react';

function useMediaDevices() {
    const [audioInputDevices, setAudioInputDevices] = useState(null);
    const [audioOutputDevices, setAudioOutputDevices] = useState(null);
    const [videoInputDevices, setVideoInputDevices] = useState(null);

    const checkPermissions = async () => {
        let [micGranted, cameraGranted] = [true, true];
        const permissions = ['camera', 'microphone']; // Note: speaker's permission is not "speaker-selection"
        const deniedDeviceInfo = [{ deviceId: 'denied', label: 'Permission denied' }];
        try {
            for (const permission of permissions) {
                const result = await navigator.permissions.query({ name: permission });
                if (result.state === 'denied') {
                    if (permission === 'camera') {
                        setVideoInputDevices(deniedDeviceInfo);
                        cameraGranted = false;
                    } else if (permission === 'microphone') {
                        setAudioInputDevices(deniedDeviceInfo);
                        micGranted = false;
                    }
                }
            }
            return [micGranted, cameraGranted];
        } catch (error) {
            console.log('Checking permission is not supported');
            return [true, true];
        }
    };

    const updateDevices = async () => {
        const [micGranted, cameraGranted] = await checkPermissions();

        const deviceList = await navigator.mediaDevices.enumerateDevices();
        let deviceListLog = '';
        deviceList.forEach((device) => {
            deviceListLog += `${device.kind} / ${device.deviceId} / ${device.label}\n`;
        });

        micGranted && setAudioInputDevices(deviceList.filter((device) => device.kind === 'audioinput'));
        cameraGranted && setVideoInputDevices(deviceList.filter((device) => device.kind === 'videoinput'));
        setAudioOutputDevices(deviceList.filter((device) => device.kind === 'audiooutput'));
    };

    useEffect(() => {
        updateDevices();
        navigator.mediaDevices.addEventListener('devicechange', updateDevices);
        ['microphone', 'camera'].forEach((device) => {
            navigator.permissions.query({ name: device }).then((permissionStatus) => {
                permissionStatus.onchange = () => {
                    updateDevices();
                };
            });
        });

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
        };
    }, []);

    return [audioInputDevices, audioOutputDevices, videoInputDevices];
}

export default useMediaDevices;
