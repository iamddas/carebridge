import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, changeUserRole, setUserStatus, deleteUser } from '../../api/adminApi';
import { showSuccess } from '../../utils/toast';
import { formatDate } from '../../utils/formatDate';
import { ROLES } from '../../utils/constants';
import './admin.css';

const ROLE_OPTIONS = Object.values(ROLES);

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin-users', search],
        queryFn: () => getUsers(search || undefined),
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] });

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
        onSuccess: () => { showSuccess('User deleted'); invalidate(); },
    });

    return (
        <div className="page-container" style={{ maxWidth: 1100 }}>
            <div className="page-header">
                <div>
                    <h2 className="page-title">User Management</h2>
                    <p className="page-subtitle" style={{ margin: 0 }}>{users.length} users</p>
                </div>
            </div>

            <div className="search-bar">
                <input
                    className="search-input"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button className="btn-secondary" style={{ padding: '8px 14px' }} onClick={() => setSearch('')}>
                        Clear
                    </button>
                )}
            </div>

            {isLoading ? (
                <p className="loading-text">Loading…</p>
            ) : users.length === 0 ? (
                <p className="empty-state">No users found.</p>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>
                                        <Link to={`/admin/users/${u.id}`} style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>
                                            {u.name}
                                        </Link>
                                    </td>
                                    <td style={{ color: 'rgba(255,255,255,.55)', fontSize: '0.83rem' }}>{u.email}</td>
                                    <td>
                                        <select
                                            className="role-select"
                                            value={u.role}
                                            onChange={(e) => roleM.mutate({ id: u.id, role: e.target.value })}
                                        >
                                            {ROLE_OPTIONS.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <span className={u.enabled ? 'status-active' : 'status-inactive'}>
                                            {u.enabled ? '● Active' : '● Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.8rem' }}>
                                        {formatDate(u.createdAt)}
                                    </td>
                                    <td>
                                        <div className="tbl-actions">
                                            <button
                                                className={`btn-xs ${u.enabled ? 'btn-xs-warning' : 'btn-xs-success'}`}
                                                onClick={() => statusM.mutate({ id: u.id, enabled: !u.enabled })}
                                            >
                                                {u.enabled ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                className="btn-xs btn-xs-danger"
                                                onClick={() => {
                                                    if (window.confirm(`Delete ${u.name}?`)) deleteM.mutate(u.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
