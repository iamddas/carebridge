import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Carebridge</h1>
        </div>

        {isAuthenticated ? (
          <div className="navbar-menu">
            <span className="navbar-user">
              Welcome, <strong>{user?.name || user?.email}</strong>
            </span>
            <span className="navbar-role">{user?.role}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Button size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
