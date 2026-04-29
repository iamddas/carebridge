import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';
import './Sidebar.css';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', roles: [USER_ROLES.USER, USER_ROLES.VOLUNTEER, USER_ROLES.ADMIN] },
    { label: 'All Requests', path: '/requests', roles: [USER_ROLES.USER, USER_ROLES.VOLUNTEER, USER_ROLES.ADMIN] },
    { label: 'Create Request', path: '/requests/create', roles: [USER_ROLES.USER] },
    { label: 'My Requests', path: '/my-requests', roles: [USER_ROLES.USER] },
    { label: 'Admin Panel', path: '/admin', roles: [USER_ROLES.ADMIN] },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const visibleItems = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          {visibleItems.map((item) => (
            <button
              key={item.path}
              className="sidebar-item"
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};
