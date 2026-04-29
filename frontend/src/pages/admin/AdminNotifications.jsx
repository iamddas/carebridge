import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUsers } from '../../api/adminApi';
import { notifyUser, broadcastNotification } from '../../api/notificationApi';
import { showSuccess } from '../../utils/toast';
import './admin.css';

const TYPES = ['INFO', 'SUCCESS', 'WARNING', 'EMERGENCY'];

const EMPTY_FORM = { title: '', message: '', type: 'INFO' };

export default function AdminNotifications() {
    const [mode, setMode] = useState('user'); // 'user' | 'broadcast'
    const [selectedUserId, setSelectedUserId] = useState('');
    const [form, setForm] = useState(EMPTY_FORM);

    const { data: users = [] } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => getUsers(),
    });

    const userM = useMutation({
        mutationFn: ({ userId, ...data }) => notifyUser({ userId, ...data }),
        onSuccess: () => {
            showSuccess('Notification sent to user');
            setForm(EMPTY_FORM);
            setSelectedUserId('');
        },
    });

    const broadcastM = useMutation({
        mutationFn: broadcastNotification,
        onSuccess: (result) => {
            showSuccess(`Notification broadcast to ${result?.notified ?? 'all'} users`);
            setForm(EMPTY_FORM);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'user') {
            if (!selectedUserId) return;
            userM.mutate({ userId: selectedUserId, ...form });
        } else {
            broadcastM.mutate(form);
        }
    };

    const isPending = userM.isPending || broadcastM.isPending;

    return (
        <div className="page-container" style={{ maxWidth: 700 }}>
            <div className="page-header">
                <h2 className="page-title">Send Notifications</h2>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                <button
                    className={mode === 'user' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setMode('user')}
                    style={{ padding: '8px 20px' }}
                >
                    Notify User
                </button>
                <button
                    className={mode === 'broadcast' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setMode('broadcast')}
                    style={{ padding: '8px 20px' }}
                >
                    Broadcast to All
                </button>
            </div>

            <div className="form-card">
                <p className="section-title">
                    {mode === 'user' ? 'Send to a specific user' : 'Broadcast to all users'}
                </p>

                <form onSubmit={handleSubmit} className="request-form">
                    {mode === 'user' && (
                        <div className="form-group">
                            <label>Select User</label>
                            <select
                                className="form-input"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                required
                            >
                                <option value="">— choose user —</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                className="form-input"
                                placeholder="Notification title"
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                className="form-input"
                                value={form.type}
                                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                            >
                                {TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Write your notification message…"
                            value={form.message}
                            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className={form.type === 'EMERGENCY' ? 'btn-danger' : 'btn-primary'}
                            disabled={isPending || (mode === 'user' && !selectedUserId)}
                        >
                            {isPending
                                ? 'Sending…'
                                : mode === 'user'
                                ? 'Send Notification'
                                : 'Broadcast to All Users'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Type guide */}
            <div style={{ marginTop: 28 }}>
                <p className="section-title">Notification Types</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                        { type: 'INFO', desc: 'General information', color: '#93c5fd' },
                        { type: 'SUCCESS', desc: 'Positive outcome', color: '#86efac' },
                        { type: 'WARNING', desc: 'Caution or alert', color: '#fde68a' },
                        { type: 'EMERGENCY', desc: 'Urgent — shown as error toast', color: '#fca5a5' },
                    ].map(({ type, desc, color }) => (
                        <div
                            key={type}
                            style={{
                                background: 'rgba(255,255,255,.05)',
                                border: `1px solid rgba(255,255,255,.1)`,
                                borderLeft: `3px solid ${color}`,
                                borderRadius: 10,
                                padding: '10px 14px',
                            }}
                        >
                            <div style={{ color, fontWeight: 600, fontSize: '0.82rem', marginBottom: 2 }}>{type}</div>
                            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.78rem' }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
