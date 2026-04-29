import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';
import './auth.css';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login: setAuth, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setAuth(data.user, data.token);
            showSuccess('Welcome back!');
            navigate('/dashboard');
        },
        onError: () => {
            const msg = 'Invalid email or password';
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
                <p className="auth-subtitle">Sign in to your account</p>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
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
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        className="auth-input"
                        required
                    />
                    <button type="submit" className="auth-btn" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
                <p className="auth-link">
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
