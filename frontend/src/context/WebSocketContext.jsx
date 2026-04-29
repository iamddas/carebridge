import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { showInfo, showSuccess, showWarning, showError } from '../utils/toast';

const WsContext = createContext(null);

const NOTIF_TOAST = {
    INFO: showInfo,
    SUCCESS: showSuccess,
    WARNING: showWarning,
    EMERGENCY: showError,
};

export function WebSocketProvider({ children }) {
    const { token, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [broadcasts, setBroadcasts] = useState([]);
    const [emergencies, setEmergencies] = useState([]);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setBroadcasts([]);
            setEmergencies([]);
            return;
        }

        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${proto}//${window.location.host}/ws`;

        const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/user/queue/messages', (frame) => {
                    const msg = JSON.parse(frame.body);
                    queryClient.invalidateQueries({ queryKey: ['conversation', msg.sender.id] });
                    showInfo(`New message from ${msg.sender.name}`);
                });

                client.subscribe('/user/queue/notifications', (frame) => {
                    const notif = JSON.parse(frame.body);
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                    queryClient.invalidateQueries({ queryKey: ['notif-count'] });
                    const toastFn = NOTIF_TOAST[notif.type] ?? showInfo;
                    toastFn(notif.title);
                });

                client.subscribe('/topic/broadcasts', (frame) => {
                    const broadcast = JSON.parse(frame.body);
                    setBroadcasts((prev) => [...prev, broadcast]);
                });

                client.subscribe('/topic/emergency', (frame) => {
                    const emergency = JSON.parse(frame.body);
                    setEmergencies((prev) => [...prev, emergency]);
                });
            },
        });

        client.activate();
        return () => { client.deactivate(); };
    }, [isAuthenticated, token, queryClient]);

    const dismissBroadcast = (id) => setBroadcasts((prev) => prev.filter((b) => b.id !== id));
    const dismissEmergency = (id) => setEmergencies((prev) => prev.filter((e) => e.id !== id));

    return (
        <WsContext.Provider value={{ broadcasts, emergencies, dismissBroadcast, dismissEmergency }}>
            {children}
        </WsContext.Provider>
    );
}

export function useWebSocket() {
    return useContext(WsContext);
}
