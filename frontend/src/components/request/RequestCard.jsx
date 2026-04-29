import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/helpers';
import './RequestCard.css';

export const RequestCard = ({ request }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      ACCEPTED: 'info',
      IN_PROGRESS: 'primary',
      COMPLETED: 'success',
      CANCELLED: 'danger',
    };
    return variants[status] || 'primary';
  };

  return (
    <Card hoverable className="request-card">
      <div className="request-card-header">
        <h3>{request.title}</h3>
        <Badge variant={getStatusVariant(request.status)} size="sm">
          {request.status}
        </Badge>
      </div>

      <p className="request-description">{request.description}</p>

      <div className="request-meta">
        <div className="meta-item">
          <span className="meta-label">Category:</span>
          <span>{request.category}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Date:</span>
          <span>{formatDate(request.createdAt)}</span>
        </div>
        {request.urgency && (
          <div className="meta-item">
            <span className="meta-label">Urgency:</span>
            <Badge variant={request.urgency === 'HIGH' ? 'danger' : 'warning'} size="sm">
              {request.urgency}
            </Badge>
          </div>
        )}
      </div>

      <div className="request-card-footer">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/requests/${request.id}`)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};
