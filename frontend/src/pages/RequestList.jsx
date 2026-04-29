import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests, useAcceptRequest, useCompleteRequest } from '../hooks/useRequests';
import { STATUS_FILTERS, ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

export default function RequestList() {
    const { user } = useAuth();
    const [filter, setFilter] = useState('ALL');

    const { data: requests = [], isLoading } = useRequests(filter);
    const accept   = useAcceptRequest();
    const complete = useCompleteRequest();

    const isVolunteer = user?.role === ROLES.VOLUNTEER;
    const isAdmin     = user?.role === ROLES.ADMIN;
    const canAct      = isVolunteer || isAdmin;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Help Requests</h2>
                    <p className="page-subtitle" style={{ margin: 0 }}>
                        {requests.length} request{requests.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                {(user?.role === ROLES.USER || isAdmin) && (
                    <Link to="/requests/new" className="btn-primary">+ New Request</Link>
                )}
            </div>

            <div className="filter-bar">
                {STATUS_FILTERS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={filter === s ? 'btn-primary' : 'btn-secondary'}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <p className="loading-text">Loading…</p>
            ) : requests.length === 0 ? (
                <p className="empty-state">No requests found for this filter.</p>
            ) : (
                <div className="request-list">
                    {requests.map((req) => {
                        const acceptPending   = accept.isPending   && accept.variables   === req.id;
                        const completePending = complete.isPending && complete.variables === req.id;

                        return (
                            <div key={req.id} className="request-card">
                                <div className="request-header">
                                    <Link to={`/requests/${req.id}`} className="request-title-link">
                                        {req.title}
                                    </Link>
                                    <span className={`status-badge status-${req.status.toLowerCase()}`}>
                                        {req.status}
                                    </span>
                                </div>

                                <p className="request-desc">{req.description}</p>

                                <div className="request-meta">
                                    {req.category && <span className="tag">{req.category}</span>}
                                    {req.location && <span className="tag">📍 {req.location}</span>}
                                    <span className="request-author">
                                        by {req.createdBy?.name} · {formatDate(req.createdAt)}
                                    </span>
                                </div>

                                <div className="request-actions">
                                    <Link
                                        to={`/requests/${req.id}`}
                                        className="btn-secondary"
                                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                                    >
                                        View
                                    </Link>

                                    {canAct && req.status === 'OPEN' && (
                                        <button
                                            className="btn-accept"
                                            onClick={() => accept.mutate(req.id)}
                                            disabled={acceptPending}
                                        >
                                            {acceptPending ? 'Accepting…' : 'Accept'}
                                        </button>
                                    )}

                                    {canAct && req.status === 'ACCEPTED' && (isAdmin || req.acceptedBy?.id === user?.id) && (
                                        <button
                                            className="btn-complete"
                                            onClick={() => complete.mutate(req.id)}
                                            disabled={completePending}
                                        >
                                            {completePending ? 'Completing…' : 'Mark Complete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
