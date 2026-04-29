import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests, useMyRequests, useAcceptedByMe } from '../hooks/useRequests';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

function StatCard({ number, label, isLoading }) {
    return (
        <div className="stat-card">
            <div className="stat-number">{isLoading ? '—' : number}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

function RequestRow({ req, showAuthor = true }) {
    return (
        <div className="request-card">
            <div className="request-header">
                <Link to={`/requests/${req.id}`} className="request-title-link">
                    {req.title}
                </Link>
                <span className={`status-badge status-${req.status.toLowerCase()}`}>
                    {req.status}
                </span>
            </div>
            <div className="request-meta">
                {req.category && <span className="tag">{req.category}</span>}
                {req.location && <span className="tag">📍 {req.location}</span>}
                {showAuthor && (
                    <span className="request-author">
                        by {req.createdBy?.name} · {formatDate(req.createdAt)}
                    </span>
                )}
                {!showAuthor && (
                    <span className="request-author">{formatDate(req.createdAt)}</span>
                )}
            </div>
        </div>
    );
}

function SectionHeader({ title, linkTo, linkLabel = 'View all →' }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>{title}</h3>
            <Link to={linkTo} className="dash-view-all">{linkLabel}</Link>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const isVolunteer = user?.role === ROLES.VOLUNTEER;
    const isAdmin     = user?.role === ROLES.ADMIN;
    const isUser      = user?.role === ROLES.USER;

    const { data: allRequests  = [], isLoading: loadingAll }      = useRequests();
    const { data: myRequests   = [], isLoading: loadingMine }     = useMyRequests();
    const { data: acceptedByMe = [], isLoading: loadingAccepted } = useAcceptedByMe();

    const open      = allRequests.filter((r) => r.status === 'OPEN').length;
    const completed = allRequests.filter((r) => r.status === 'COMPLETED').length;

    const myCount     = isVolunteer ? acceptedByMe.length : myRequests.length;
    const myCardLabel = isVolunteer ? 'Accepted by Me' : 'My Requests';

    const recentAll = allRequests.slice(0, 5);
    const myRecent  = isVolunteer ? acceptedByMe.slice(0, 4) : myRequests.slice(0, 4);
    const myLoading = isVolunteer ? loadingAccepted : loadingMine;

    return (
        <div className="page-container">
            <h2 className="page-title">Dashboard</h2>
            <p className="page-subtitle">Welcome back, {user?.name}</p>

            {/* Stat cards */}
            <div className="stats-grid">
                <StatCard number={allRequests.length} label="Total Requests" isLoading={loadingAll} />
                <StatCard number={myCount}            label={myCardLabel}     isLoading={myLoading} />
                <StatCard number={completed}          label="Completed"       isLoading={loadingAll} />
                <StatCard number={open}               label="Open"            isLoading={loadingAll} />
            </div>

            {/* Quick actions */}
            <div className="dash-actions">
                <Link to="/requests" className="btn-primary">Browse Requests</Link>
                {(isUser || isAdmin) && (
                    <Link to="/requests/new" className="btn-primary">+ Create Request</Link>
                )}
                <Link to="/my-requests" className="btn-secondary">My Requests</Link>
            </div>

            {/* Recent requests */}
            <section style={{ marginTop: '40px' }}>
                <SectionHeader title="Recent Requests" linkTo="/requests" />
                {loadingAll ? (
                    <p className="loading-text">Loading…</p>
                ) : recentAll.length === 0 ? (
                    <p className="empty-state">No requests yet.</p>
                ) : (
                    <div className="request-list">
                        {recentAll.map((req) => (
                            <RequestRow key={req.id} req={req} />
                        ))}
                    </div>
                )}
            </section>

            {/* My activity */}
            <section style={{ marginTop: '40px' }}>
                <SectionHeader
                    title={isVolunteer ? 'Accepted by Me' : 'My Requests'}
                    linkTo="/my-requests"
                />
                {myLoading ? (
                    <p className="loading-text">Loading…</p>
                ) : myRecent.length === 0 ? (
                    <p className="empty-state">
                        {isVolunteer ? (
                            <>No accepted requests yet. <Link to="/requests" style={{ color: 'white' }}>Browse open requests</Link></>
                        ) : (
                            <>No requests yet. <Link to="/requests/new" style={{ color: 'white' }}>Create one</Link></>
                        )}
                    </p>
                ) : (
                    <div className="request-list">
                        {myRecent.map((req) => (
                            <RequestRow
                                key={req.id}
                                req={req}
                                showAuthor={isVolunteer}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
