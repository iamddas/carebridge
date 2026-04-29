import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRequest } from '../../hooks/useRequests';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { REQUEST_CATEGORIES } from '../../utils/constants';
import './CreateRequest.css';

export default function CreateRequest() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: REQUEST_CATEGORIES[0],
    urgency: 'MEDIUM',
    location: '',
  });
  const [error, setError] = useState('');
  const createRequest = useCreateRequest();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await createRequest.mutateAsync(formData);
      navigate('/my-requests');
    } catch (err) {
      setError('Failed to create request');
    }
  };

  return (
    <div className="create-request-page">
      <Card className="create-request-card">
        <h1>Create New Request</h1>
        <p className="subtitle">Help us understand what you need</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <Input
            label="Title"
            type="text"
            placeholder="Brief title of your request"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              name="description"
              className="input"
              rows="4"
              placeholder="Describe your request in detail..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
                required
              >
                {REQUEST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <Input
            label="Location"
            type="text"
            placeholder="Your location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <Button
              variant="outline"
              onClick={() => navigate('/my-requests')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createRequest.isPending}>
              {createRequest.isPending ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
