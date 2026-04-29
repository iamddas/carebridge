import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBroadcasts, createBroadcast } from '../../api/emergencyApi';
import { showSuccess } from '../../utils/toast';
import { formatDate } from '../../utils/formatDate';
import './admin.css';

export default function Broadcast() {
    const [form, setForm] = useState({ title: '', message: '' });
    const queryClient = useQueryClient();

    const { data: broadcasts = [], isLoading } = useQuery({
        queryKey: ['broadcasts'],
        queryFn: getBroadcasts,
    });

    const sendM = useMutation({
        mutationFn: createBroadcast,
        onSuccess: () => {
            showSuccess('Broadcast sent to all users');
            setForm({ title: '', message: '' });
            queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        sendM.mutate(form);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Broadcast Messages</h2>
            </div>

            <div className="form-card" style={{ marginBottom: 32 }}>
                <p className="section-title">Send Broadcast</p>
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            className="form-input"
                            placeholder="Broadcast title"
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Write your message…"
                            value={form.message}
                            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={sendM.isPending}>
                            {sendM.isPending ? 'Sending…' : 'Send Broadcast'}
                        </button>
                    </div>
                </form>
            </div>

            <p className="section-title">Sent Broadcasts</p>

            {isLoading ? (
                <p className="loading-text">Loading…</p>
            ) : broadcasts.length === 0 ? (
                <p className="empty-state">No broadcasts yet.</p>
            ) : (
                <div>
                    {broadcasts.map((b) => (
                        <div key={b.id} className="broadcast-card">
                            <p className="broadcast-title">{b.title}</p>
                            <p className="broadcast-body">{b.message}</p>
                            <p className="broadcast-meta">
                                by {b.createdBy?.name} · {formatDate(b.createdAt)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
