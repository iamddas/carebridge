import { useParams } from 'react-router-dom';
import { useRequestById, useUpdateRequestStatus } from '../../hooks/useRequests';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { RequestStatus } from '../../components/request/RequestStatus';
import { formatDate, formatDateTime } from '../../utils/helpers';
import './RequestDetails.css';

export default function RequestDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useRequestById(id);
  const updateStatus = useUpdateRequestStatus();

  const request = data?.data;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading request</div>;
  if (!request) return <div>Request not found</div>;

  const handleStatusChange = async (newStatus) => {
    await updateStatus.mutate({ id, status: newStatus });
  };

  return (
    <div className="request-details-page">
      <Card>
        <div className="request-details-header">
          <div>
            <h1>{request.title}</h1>
            <p className="request-details-meta">
              Created: {formatDateTime(request.createdAt)}
            </p>
          </div>
          <RequestStatus status={request.status} />
        </div>

        <div className="request-details-content">
          <section>
            <h2>Description</h2>
            <p>{request.description}</p>
          </section>

          <section>
            <h2>Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span>{request.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Urgency:</span>
                <Badge
                  variant={request.urgency === 'HIGH' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {request.urgency}
                </Badge>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span>{request.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Requested By:</span>
                <span>{request.requesterName}</span>
              </div>
            </div>
          </section>

          <section>
            <h2>Volunteer Assignment</h2>
            {request.volunteer ? (
              <div className="volunteer-info">
                <p>
                  <strong>Assigned to:</strong> {request.volunteer.name}
                </p>
                <p>
                  <strong>Contact:</strong> {request.volunteer.email}
                </p>
              </div>
            ) : (
              <p className="text-muted">No volunteer assigned yet</p>
            )}
          </section>

          <div className="action-buttons">
            {request.status === 'PENDING' && (
              <Button
                variant="secondary"
                onClick={() => handleStatusChange('ACCEPTED')}
              >
                Accept Request
              </Button>
            )}
            {request.status === 'ACCEPTED' && (
              <Button
                variant="primary"
                onClick={() => handleStatusChange('IN_PROGRESS')}
              >
                Start Work
              </Button>
            )}
            {request.status === 'IN_PROGRESS' && (
              <Button
                variant="success"
                onClick={() => handleStatusChange('COMPLETED')}
              >
                Mark Completed
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
