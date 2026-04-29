import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmergencies, createEmergency } from '../../api/emergencyApi';
import { showSuccess } from '../../utils/toast';
import { formatDate } from '../../utils/formatDate';
import { PRIORITIES } from '../../utils/constants';
import './admin.css';

export default function Emergency() {
    const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', location: '' });
    const queryClient = useQueryClient();

    const { data: alerts = [], isLoading } = useQuery({
        queryKey: ['emergencies'],
        queryFn: getEmergencies,
    });

    const createM = useMutation({
        mutationFn: createEmergency,
        onSuccess: () => {
            showSuccess('Emergency alert created');
            setForm({ title: '', description: '', priority: 'MEDIUM', location: '' });
            queryClient.invalidateQueries({ queryKey: ['emergencies'] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createM.mutate(form);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">Emergency Alerts</h2>
            </div>

            <div className="form-card" style={{ marginBottom: 32 }}>
                <p className="section-title">Create Alert</p>
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                className="form-input"
                                placeholder="Emergency title"
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                className="form-input"
                                value={form.priority}
                                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                            >
                                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Describe the emergency…"
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Location (optional)</label>
                        <input
                            className="form-input"
                            placeholder="Affected area"
                            value={form.location}
                            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-danger" disabled={createM.isPending}>
                            {createM.isPending ? 'Creating…' : '🚨 Create Alert'}
                        </button>
                    </div>
                </form>
            </div>

            <p className="section-title">All Alerts</p>

            {isLoading ? (
                <p className="loading-text">Loading…</p>
            ) : alerts.length === 0 ? (
                <p className="empty-state">No emergency alerts.</p>
            ) : (
                <div>
                    {alerts.map((a) => (
                        <div key={a.id} className="emergency-banner" style={{ marginBottom: 12 }}>
                            <span className="emergency-banner-icon">🚨</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                                    <p className="emergency-banner-title" style={{ margin: 0 }}>{a.title}</p>
                                    <span className={`role-badge priority-${a.priority.toLowerCase()}`}>{a.priority}</span>
                                </div>
                                <p className="emergency-banner-body">{a.description}</p>
                                <p className="broadcast-meta" style={{ marginTop: 6 }}>
                                    {a.location && `📍 ${a.location} · `}
                                    by {a.createdBy?.name} · {formatDate(a.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
