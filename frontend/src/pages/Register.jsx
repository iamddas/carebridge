import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';
import './auth.css';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
    const [error, setError] = useState('');
    const { login: setAuth, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            showSuccess('Account created! Welcome to Carebridge.');
            navigate('/dashboard');
        },
        onError: (err) => {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            showError(msg);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        mutation.mutate(form);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-logo">Carebridge</h1>
                <p className="auth-subtitle">Create your account</p>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="auth-input"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className="auth-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={form.password}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        className="auth-input"
                        required
                        minLength={6}
                    />
                    <select
                        value={form.role}
                        onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                        className="auth-input"
                    >
                        <option value="USER">User — I need help</option>
                        <option value="VOLUNTEER">Volunteer — I want to help</option>
                    </select>
                    <button type="submit" className="auth-btn" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Creating account…' : 'Create account'}
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
