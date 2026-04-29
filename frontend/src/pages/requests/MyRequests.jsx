import { useMyRequests } from '../../hooks/useRequests';
import { RequestCard } from '../../components/request/RequestCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import './MyRequests.css';

export default function MyRequests() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMyRequests();
  const requests = data?.data || [];

  return (
    <div className="my-requests-page">
      <div className="page-header">
        <h1>My Requests</h1>
        <Button variant="primary" onClick={() => navigate('/requests/create')}>
          Create New Request
        </Button>
      </div>

      {isLoading && <div className="loading">Loading your requests...</div>}

      {error && (
        <div className="error-message">
          Error loading requests. Please try again later.
        </div>
      )}

      {!isLoading && requests.length === 0 && (
        <Card className="empty-state">
          <h2>No requests yet</h2>
          <p>Create a request to get help from our volunteer community.</p>
          <Button onClick={() => navigate('/requests/create')}>
            Create Your First Request
          </Button>
        </Card>
      )}

      <div className="requests-grid">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
