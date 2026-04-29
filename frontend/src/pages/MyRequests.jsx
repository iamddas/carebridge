import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    useMyRequests,
    useAcceptedByMe,
    useDeleteRequest,
    useCompleteRequest,
} from '../hooks/useRequests';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

export default function MyRequests() {
    const { user } = useAuth();
    const isVolunteer = user?.role === ROLES.VOLUNTEER;
    const isAdmin     = user?.role === ROLES.ADMIN;
    const isUser      = user?.role === ROLES.USER;

    const { data: myRequests = [],   isLoading: loadingMine }     = useMyRequests();
    const { data: acceptedByMe = [], isLoading: loadingAccepted } = useAcceptedByMe();

    const remove   = useDeleteRequest();
    const complete = useCompleteRequest();

    return (
        <div className="page-container">
            <div className="page-header">
                <h2 className="page-title">My Requests</h2>
                {(isUser || isAdmin) && (
                    <Link to="/requests/new" className="btn-primary">+ New Request</Link>
                )}
            </div>

            {/* Created by me — USER and ADMIN */}
            {(isUser || isAdmin) && (
                <section style={{ marginBottom: '40px' }}>
                    <h3 className="section-title">Created by me</h3>

                    {loadingMine ? (
                        <p className="loading-text">Loading…</p>
                    ) : myRequests.length === 0 ? (
                        <p className="empty-state">
                            No requests yet.{' '}
                            <Link to="/requests/new" style={{ color: 'white' }}>Create one</Link>
                        </p>
                    ) : (
                        <div className="request-list">
                            {myRequests.map((req) => (
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
                                        {req.acceptedBy && (
                                            <span className="tag">✓ Accepted by {req.acceptedBy.name}</span>
                                        )}
                                        <span className="request-author">{formatDate(req.createdAt)}</span>
                                    </div>

                                    {req.status === 'OPEN' && (
                                        <div className="request-actions">
                                            <button
                                                className="btn-danger"
                                                onClick={() => {
                                                    if (window.confirm('Delete this request?')) {
                                                        remove.mutate(req.id);
                                                    }
                                                }}
                                                disabled={remove.isPending && remove.variables === req.id}
                                            >
                                                {remove.isPending && remove.variables === req.id
                                                    ? 'Deleting…'
                                                    : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Accepted by me — VOLUNTEER and ADMIN */}
            {(isVolunteer || isAdmin) && (
                <section>
                    <h3 className="section-title">Accepted by me</h3>

                    {loadingAccepted ? (
                        <p className="loading-text">Loading…</p>
                    ) : acceptedByMe.length === 0 ? (
                        <p className="empty-state">
                            You haven't accepted any requests yet.{' '}
                            <Link to="/requests" style={{ color: 'white' }}>Browse open requests</Link>
                        </p>
                    ) : (
                        <div className="request-list">
                            {acceptedByMe.map((req) => (
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
                                        <span className="request-author">by {req.createdBy?.name}</span>
                                    </div>

                                    {req.status === 'ACCEPTED' && (
                                        <div className="request-actions">
                                            <button
                                                className="btn-complete"
                                                onClick={() => complete.mutate(req.id)}
                                                disabled={complete.isPending && complete.variables === req.id}
                                            >
                                                {complete.isPending && complete.variables === req.id
                                                    ? 'Completing…'
                                                    : 'Mark Complete'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
