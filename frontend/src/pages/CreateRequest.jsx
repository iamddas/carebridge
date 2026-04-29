import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRequest } from '../hooks/useRequests';
import { CATEGORIES } from '../utils/constants';

export default function CreateRequest() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
    const [error, setError] = useState('');

    const mutation = useCreateRequest({
        onSuccess: () => navigate('/my-requests'),
        onError: (err) => setError(err.response?.data?.message || 'Failed to create request.'),
    });

    const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        mutation.mutate({ ...form, category: form.category || null });
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Create Help Request</h2>
            <p className="page-subtitle">Describe what you need and the community will help.</p>

            {error && <div className="form-error">{error}</div>}

            <div className="form-card">
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={set('title')}
                            className="form-input"
                            placeholder="Brief title for your request"
                            maxLength={200}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            value={form.description}
                            onChange={set('description')}
                            className="form-input form-textarea"
                            placeholder="Describe what you need help with in detail"
                            maxLength={1000}
                            required
                            rows={5}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select value={form.category} onChange={set('category')} className="form-input">
                                <option value="">Select category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={set('location')}
                                className="form-input"
                                placeholder="City, area…"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Creating…' : 'Create Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
