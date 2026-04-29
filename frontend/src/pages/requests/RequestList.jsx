import { useState } from 'react';
import { useRequests } from '../../hooks/useRequests';
import { RequestCard } from '../../components/request/RequestCard';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import './RequestList.css';

export default function RequestList() {
  const [filters, setFilters] = useState({ status: '', category: '' });
  const { data, isLoading, error } = useRequests(filters);
  const requests = data?.data || [];

  return (
    <div className="request-list-page">
      <h1>Community Requests</h1>

      <Card className="filters-card">
        <div className="filters-grid">
          <Input
            label="Status"
            type="text"
            placeholder="Filter by status..."
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
          <Input
            label="Category"
            type="text"
            placeholder="Filter by category..."
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
        </div>
      </Card>

      {isLoading && <div className="loading">Loading requests...</div>}

      {error && (
        <div className="error-message">
          Error loading requests. Please try again later.
        </div>
      )}

      {!isLoading && requests.length === 0 && (
        <Card className="empty-state">
          <p>No requests found.</p>
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
