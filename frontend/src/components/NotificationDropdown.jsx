import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiBell } from 'react-icons/fi';
import { getNotifications, getUnreadCount, markNotificationRead } from '../api/notificationApi';
import { formatDate } from '../utils/formatDate';

const TYPE_COLORS = {
    INFO:      'rgba(59,130,246,.35)',
    SUCCESS:   'rgba(34,197,94,.35)',
    WARNING:   'rgba(251,191,36,.35)',
    EMERGENCY: 'rgba(239,68,68,.35)',
};

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const queryClient = useQueryClient();

    const { data: unread = 0 } = useQuery({
        queryKey: ['notif-count'],
        queryFn: getUnreadCount,
    });

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        enabled: open,
    });

    const markM = useMutation({
        mutationFn: markNotificationRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notif-count'] });
        },
    });

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen((o) => !o)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,.7)',
                    cursor: 'pointer',
                    position: 'relative',
                    fontSize: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                }}
                title="Notifications"
            >
                <FiBell />
                {unread > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: -2,
                        right: -3,
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        width: 16,
                        height: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: 320,
                    background: '#1e1e2f',
                    border: '1px solid rgba(255,255,255,.15)',
                    borderRadius: 14,
                    boxShadow: '0 12px 40px rgba(0,0,0,.5)',
                    zIndex: 1000,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,.1)',
                        color: 'rgba(255,255,255,.6)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                    }}>
                        Notifications {unread > 0 && <span style={{ color: '#ef4444' }}>({unread} unread)</span>}
                    </div>

                    <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <p style={{ padding: '24px 16px', textAlign: 'center', color: 'rgba(255,255,255,.35)', fontSize: '0.88rem', margin: 0 }}>
                                No notifications
                            </p>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => !n.read && markM.mutate(n.id)}
                                    style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid rgba(255,255,255,.06)',
                                        cursor: n.read ? 'default' : 'pointer',
                                        background: n.read ? 'transparent' : 'rgba(255,255,255,.04)',
                                        borderLeft: `3px solid ${TYPE_COLORS[n.type] ?? 'rgba(255,255,255,.2)'}`,
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                        <span style={{ color: 'white', fontSize: '0.87rem', fontWeight: n.read ? 400 : 600 }}>
                                            {n.title}
                                        </span>
                                        {!n.read && (
                                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 4 }} />
                                        )}
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '0.81rem', margin: '3px 0 4px', lineHeight: 1.4 }}>
                                        {n.message}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.72rem', margin: 0 }}>
                                        {formatDate(n.createdAt)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
