import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    useRequest,
    useAcceptRequest,
    useCompleteRequest,
    useDeleteRequest,
} from '../hooks/useRequests';
import { formatDateTime } from '../utils/formatDate';
import { ROLES } from '../utils/constants';

export default function RequestDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: request, isLoading, isError } = useRequest(id);
    const accept   = useAcceptRequest();
    const complete = useCompleteRequest({ onSuccess: () => {} });
    const remove   = useDeleteRequest({ onSuccess: () => navigate('/requests') });

    if (isLoading) {
        return <div className="page-container"><p className="loading-text">Loading…</p></div>;
    }

    if (isError || !request) {
        return (
            <div className="page-container">
                <p className="empty-state">Request not found.</p>
                <Link to="/requests" className="btn-secondary" style={{ marginTop: '16px', display: 'inline-block' }}>
                    ← Back to list
                </Link>
            </div>
        );
    }

    const isOwner     = user?.id === request.createdBy?.id;
    const isAcceptor  = user?.id === request.acceptedBy?.id;
    const isAdmin     = user?.role === ROLES.ADMIN;
    const isVolunteer = user?.role === ROLES.VOLUNTEER;

    const canAccept   = (isVolunteer || isAdmin) && request.status === 'OPEN';
    const canComplete = (isAcceptor || isAdmin) && request.status === 'ACCEPTED';
    const canDelete   = (isOwner || isAdmin) && request.status !== 'COMPLETED';

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="btn-secondary" onClick={() => navigate(-1)}>← Back</button>
                <span className={`status-badge status-${request.status.toLowerCase()}`}>
                    {request.status}
                </span>
            </div>

            <div className="detail-card">
                <h2 className="page-title" style={{ marginBottom: '12px' }}>{request.title}</h2>

                <div className="request-meta" style={{ marginBottom: '20px' }}>
                    {request.category && <span className="tag">{request.category}</span>}
                    {request.location && <span className="tag">📍 {request.location}</span>}
                    <span className="request-author">by {request.createdBy?.name}</span>
                </div>

                <p className="detail-description">{request.description}</p>

                <div className="detail-meta">
                    <div className="detail-meta-row">
                        <span className="detail-label">Posted</span>
                        <span className="detail-value">{formatDateTime(request.createdAt)}</span>
                    </div>
                    <div className="detail-meta-row">
                        <span className="detail-label">Status</span>
                        <span className={`status-badge status-${request.status.toLowerCase()}`}>
                            {request.status}
                        </span>
                    </div>
                    {request.acceptedBy && (
                        <div className="detail-meta-row">
                            <span className="detail-label">Accepted by</span>
                            <span className="detail-value">{request.acceptedBy.name}</span>
                        </div>
                    )}
                </div>

                {(canAccept || canComplete || canDelete) && (
                    <div
                        className="request-actions"
                        style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,.1)' }}
                    >
                        {canAccept && (
                            <button
                                className="btn-accept"
                                onClick={() => accept.mutate(request.id)}
                                disabled={accept.isPending}
                            >
                                {accept.isPending ? 'Accepting…' : 'Accept Request'}
                            </button>
                        )}
                        {canComplete && (
                            <button
                                className="btn-complete"
                                onClick={() => complete.mutate(request.id)}
                                disabled={complete.isPending}
                            >
                                {complete.isPending ? 'Completing…' : 'Mark Complete'}
                            </button>
                        )}
                        {canDelete && (
                            <button
                                className="btn-danger"
                                onClick={() => {
                                    if (window.confirm('Delete this request? This cannot be undone.')) {
                                        remove.mutate(request.id);
                                    }
                                }}
                                disabled={remove.isPending}
                            >
                                {remove.isPending ? 'Deleting…' : 'Delete Request'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
