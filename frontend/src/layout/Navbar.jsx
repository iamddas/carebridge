import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/NotificationDropdown';

export default function Navbar({ isMobile, onMenuClick }) {
    const { user, logout } = useAuth();

    return (
        <header className="navbar">
            {isMobile && (
                <button className="nav-menu-btn" onClick={onMenuClick}>
                    <FiMenu />
                </button>
            )}
            <h1 className="nav-title">Carebridge</h1>
            {user && (
                <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <NotificationDropdown />
                    <span className="nav-user-name">{user.name}</span>
                    <span className="nav-user-role">{user.role}</span>
                    <button className="nav-logout-btn" onClick={logout} title="Logout">
                        <FiLogOut />
                    </button>
                </div>
            )}
        </header>
    );
}
