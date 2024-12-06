import React, { createContext, useContext, useReducer } from 'react';

const PeerListStateContext = createContext([]);
const PeerListDispatchContext = createContext(() => {});

function peerListReducer(state, action) {
    switch (action.type) {
        case 'UPDATE':
            const { addedPeers, removedPeers } = action.payload;
            let newState = [...state];
            if (addedPeers?.length) {
                const additionalPeers = addedPeers.map((peerInfo) => ({
                    key: Date.now() + Math.random().toString(36).substr(2, 9),
                    userId: peerInfo.userId,
                    videoState: peerInfo.videoState, // disabled, enabled, paused
                    videoRequested: peerInfo.videoRequested,
                    micMuted: peerInfo.micMuted,
                    displayName: peerInfo.displayName,
                    isTalking: false
                }));
                newState = [...newState, ...additionalPeers];
            }

            if (removedPeers?.length) {
                const removedUserIdList = removedPeers.map((peerInfo) => peerInfo.userId);
                newState = newState.filter((peer) => !removedUserIdList.includes(peer.userId));
            }
            return newState;
        case 'TALKING_STATUS':
            const { active, inactive } = action.payload;

            return state.map((peer) => {
                if (active.includes(peer.userId)) {
                    return { ...peer, isTalking: true };
                } else if (inactive.includes(peer.userId)) {
                    return { ...peer, isTalking: false };
                }
                return peer;
            });
        case 'VIDEO_PAUSED':
            const videoPausedUserIdList = action.payload.map((peerVideoPausedParam) => peerVideoPausedParam.peer.userId);
            return state.map((peer) => {
                if (videoPausedUserIdList.includes(peer.userId)) {
                    return { ...peer, videoState: 'paused' };
                }
                return peer;
            });
        case 'VIDEO_RESUMED':
            const videoResumedUserIdList = action.payload.map((peerInfo) => peerInfo.userId);
            return state.map((peer) => {
                if (videoResumedUserIdList.includes(peer.userId)) {
                    return { ...peer, videoState: 'enabled' };
                }
                return peer;
            });
        case 'MIC_MUTED':
        case 'MIC_UNMUTED':
            const userIdList = action.payload.map((peerInfo) => peerInfo.userId);
            return state.map((peer) => {
                if (userIdList.includes(peer.userId)) {
                    return { ...peer, micMuted: action.type === 'MIC_MUTED' ? true : false };
                }
                return peer;
            });
        default:
            return state;
    }
}

export const usePeerListState = () => useContext(PeerListStateContext);
export const usePeerListDispatch = () => useContext(PeerListDispatchContext);

export const PeerListProvider = ({ children }) => {
    const [peerList, peerListDispatch] = useReducer(peerListReducer, []);
    return (
        <PeerListDispatchContext.Provider value={peerListDispatch}>
            <PeerListStateContext.Provider value={peerList}>{children}</PeerListStateContext.Provider>
        </PeerListDispatchContext.Provider>
    );
};
