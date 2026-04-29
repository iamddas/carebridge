import { NavLink } from 'react-router-dom';
import {
    FiHome, FiList, FiUser, FiPlusCircle, FiLogOut,
    FiChevronLeft, FiMessageSquare, FiUsers, FiRadio,
    FiAlertTriangle, FiShield, FiInbox, FiBell,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const NAV_ITEMS = [
    { icon: <FiHome />,         label: 'Dashboard',      path: '/dashboard',       roles: null },
    { icon: <FiList />,         label: 'Help Requests',  path: '/requests',        roles: null },
    { icon: <FiUser />,         label: 'My Requests',    path: '/my-requests',     roles: null },
    { icon: <FiPlusCircle />,   label: 'Create Request', path: '/requests/new',    roles: [ROLES.USER, ROLES.ADMIN] },
    { icon: <FiMessageSquare />,label: 'Messages',       path: '/chat',            roles: null },
];

const ADMIN_ITEMS = [
    { icon: <FiShield />,        label: 'Admin',          path: '/admin',                roles: [ROLES.ADMIN] },
    { icon: <FiUsers />,         label: 'Users',          path: '/admin/users',          roles: [ROLES.ADMIN] },
    { icon: <FiInbox />,         label: 'Messages',       path: '/admin/messages',       roles: [ROLES.ADMIN] },
    { icon: <FiBell />,          label: 'Notifications',  path: '/admin/notifications',  roles: [ROLES.ADMIN] },
    { icon: <FiRadio />,         label: 'Broadcast',      path: '/admin/broadcast',      roles: [ROLES.ADMIN] },
    { icon: <FiAlertTriangle />, label: 'Emergency',      path: '/admin/emergency',      roles: [ROLES.ADMIN] },
];

export default function Sidebar({ collapsed, setCollapsed, isMobile, drawerOpen, closeDrawer }) {
    const { user, logout } = useAuth();
    const expanded = !collapsed;
    const isAdmin = user?.role === ROLES.ADMIN;

    const visible = NAV_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(user?.role)
    );

    return (
        <>
            {isMobile && drawerOpen && (
                <div className="backdrop" onClick={closeDrawer} />
            )}

            <aside
                className={`sidebar ${expanded ? 'expanded' : 'collapsed'} ${isMobile ? 'mobile' : ''} ${drawerOpen ? 'open' : ''}`}
            >
                <div className="sidebar-header">
                    {!isMobile && (
                        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                            <FiChevronLeft style={{ transform: expanded ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                        </button>
                    )}
                    {expanded && <span className="logo">Carebridge</span>}
                </div>

                <nav className="sidebar-nav">
                    {visible.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `menu-item${isActive ? ' menu-item-active' : ''}`}
                            onClick={isMobile ? closeDrawer : undefined}
                        >
                            <span className="icon">{item.icon}</span>
                            {expanded && <span className="label">{item.label}</span>}
                        </NavLink>
                    ))}

                    {isAdmin && (
                        <>
                            {expanded && (
                                <div style={{
                                    padding: '12px 16px 4px',
                                    color: 'rgba(255,255,255,.3)',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                }}>
                                    Admin
                                </div>
                            )}
                            {ADMIN_ITEMS.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `menu-item${isActive ? ' menu-item-active' : ''}`}
                                    onClick={isMobile ? closeDrawer : undefined}
                                    end={item.path === '/admin'}
                                >
                                    <span className="icon">{item.icon}</span>
                                    {expanded && <span className="label">{item.label}</span>}
                                </NavLink>
                            ))}
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <button className="menu-item logout-item" onClick={logout}>
                        <span className="icon"><FiLogOut /></span>
                        {expanded && <span className="label">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
