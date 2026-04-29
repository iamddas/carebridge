import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, getUserRequests, changeUserRole, setUserStatus, deleteUser } from '../../api/adminApi';
import { showSuccess } from '../../utils/toast';
import { formatDate } from '../../utils/formatDate';
import { ROLES } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const ROLE_OPTIONS = Object.values(ROLES);

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ['admin-user', id],
        queryFn: () => getUser(id),
    });

    const { data: requests = [] } = useQuery({
        queryKey: ['admin-user-requests', id],
        queryFn: () => getUserRequests(id),
        enabled: !!id,
    });

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    };

    const roleM = useMutation({
        mutationFn: changeUserRole,
        onSuccess: () => { showSuccess('Role updated'); invalidate(); },
    });

    const statusM = useMutation({
        mutationFn: setUserStatus,
        onSuccess: (_, vars) => { showSuccess(vars.enabled ? 'User activated' : 'User deactivated'); invalidate(); },
    });

    const deleteM = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => { showSuccess('User deleted'); navigate('/admin/users'); },
    });

    if (isLoading) return <p className="loading-text">Loading…</p>;
    if (!user) return <p className="empty-state">User not found.</p>;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <Link to="/admin/users" className="dash-view-all" style={{ display: 'inline-block', marginBottom: 8 }}>← Back to users</Link>
                    <h2 className="page-title">{user.name}</h2>
                </div>
                <div className="tbl-actions">
                    <button
                        className={`btn-xs ${user.enabled ? 'btn-xs-warning' : 'btn-xs-success'}`}
                        style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                        onClick={() => statusM.mutate({ id: user.id, enabled: !user.enabled })}
                    >
                        {user.enabled ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                        className="btn-xs btn-xs-danger"
                        style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                        onClick={() => {
                            if (window.confirm(`Delete ${user.name}?`)) deleteM.mutate(user.id);
                        }}
                    >
                        Delete User
                    </button>
                </div>
            </div>

            <div className="detail-card" style={{ maxWidth: 700, marginBottom: 28 }}>
                <div className="user-detail-grid">
                    <div className="user-detail-field">
                        <div className="user-detail-label">Email</div>
                        <div className="user-detail-value">{user.email}</div>
                    </div>
                    <div className="user-detail-field">
                        <div className="user-detail-label">Status</div>
                        <div className={user.enabled ? 'status-active' : 'status-inactive'}>
                            {user.enabled ? '● Active' : '● Inactive'}
                        </div>
                    </div>
                    <div className="user-detail-field">
                        <div className="user-detail-label">Role</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
                            <select
                                className="role-select"
                                value={user.role}
                                onChange={(e) => roleM.mutate({ id: user.id, role: e.target.value })}
                            >
                                {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="user-detail-field">
                        <div className="user-detail-label">Joined</div>
                        <div className="user-detail-value">{formatDate(user.createdAt)}</div>
                    </div>
                </div>
            </div>

            <p className="section-title">Help Requests ({requests.length})</p>

            {requests.length === 0 ? (
                <p className="empty-state" style={{ padding: '24px 0' }}>No requests by this user.</p>
            ) : (
                <div className="request-list">
                    {requests.map((req) => (
                        <div key={req.id} className="request-card">
                            <div className="request-header">
                                <Link to={`/requests/${req.id}`} className="request-title-link">{req.title}</Link>
                                <span className={`status-badge status-${req.status.toLowerCase()}`}>{req.status}</span>
                            </div>
                            <p className="request-desc">{req.description}</p>
                            <div className="request-meta">
                                {req.category && <span className="tag">{req.category}</span>}
                                <span className="request-author">{formatDate(req.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
