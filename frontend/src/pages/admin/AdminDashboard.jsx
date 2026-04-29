import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/adminApi';
import { getRequests } from '../../api/helpRequestApi';
import { getEmergencies } from '../../api/emergencyApi';
import { formatDate } from '../../utils/formatDate';
import './admin.css';

export default function AdminDashboard() {
    const { data: users = [] }       = useQuery({ queryKey: ['admin-users'], queryFn: () => getUsers() });
    const { data: requests = [] }    = useQuery({ queryKey: ['requests'], queryFn: () => getRequests() });
    const { data: emergencies = [] } = useQuery({ queryKey: ['emergencies'], queryFn: getEmergencies });

    const activeUsers    = users.filter((u) => u.enabled).length;
    const openRequests   = requests.filter((r) => r.status === 'OPEN').length;
    const latestEmerg    = emergencies[0];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Admin Dashboard</h2>
                    <p className="page-subtitle" style={{ margin: 0 }}>Platform overview</p>
                </div>
            </div>

            {latestEmerg && (
                <div className="emergency-banner">
                    <span className="emergency-banner-icon">🚨</span>
                    <div>
                        <p className="emergency-banner-title">Latest Emergency: {latestEmerg.title}</p>
                        <p className="emergency-banner-body">{latestEmerg.description} · {latestEmerg.priority} · {latestEmerg.location}</p>
                    </div>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{activeUsers}</div>
                    <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{requests.length}</div>
                    <div className="stat-label">Total Requests</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{openRequests}</div>
                    <div className="stat-label">Open Requests</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{emergencies.length}</div>
                    <div className="stat-label">Emergency Alerts</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {/* Recent Users */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <p className="section-title" style={{ margin: 0 }}>Recent Users</p>
                        <Link to="/admin/users" className="dash-view-all">View all →</Link>
                    </div>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.slice(0, 5).map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <Link to={`/admin/users/${u.id}`} style={{ color: 'white', textDecoration: 'none' }}>
                                            {u.name}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                                    </td>
                                    <td style={{ color: 'rgba(255,255,255,.45)', fontSize: '0.8rem' }}>
                                        {formatDate(u.createdAt)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Emergency Alerts */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <p className="section-title" style={{ margin: 0 }}>Emergency Alerts</p>
                        <Link to="/admin/emergency" className="dash-view-all">View all →</Link>
                    </div>
                    {emergencies.length === 0 ? (
                        <p className="empty-state" style={{ padding: '24px 0' }}>No alerts</p>
                    ) : (
                        <div>
                            {emergencies.slice(0, 3).map((e) => (
                                <div key={e.id} className="emergency-banner" style={{ marginBottom: 10 }}>
                                    <span className="emergency-banner-icon">⚠️</span>
                                    <div>
                                        <p className="emergency-banner-title">{e.title}</p>
                                        <p className="emergency-banner-body">
                                            <span className={`role-badge priority-${e.priority.toLowerCase()}`}>{e.priority}</span>
                                            {e.location && ` · ${e.location}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="dash-actions">
                <Link to="/admin/users" className="btn-primary">Manage Users</Link>
                <Link to="/admin/broadcast" className="btn-secondary">Send Broadcast</Link>
                <Link to="/admin/emergency" className="btn-secondary">Emergency Alert</Link>
            </div>
        </div>
    );
}
