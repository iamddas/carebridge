// src/components/Sidebar.jsx
import { useState } from "react";
import {
    FiHome,
    FiUser,
    FiSettings,
    FiLogOut,
    FiChevronLeft
} from "react-icons/fi";

const items = [
    { icon: <FiHome />, label: "Home" },
    { icon: <FiUser />, label: "Profile" },
    { icon: <FiSettings />, label: "Settings" },
    { icon: <FiLogOut />, label: "Logout" }
];

export default function Sidebar({
                                    collapsed,
                                    setCollapsed,
                                    isMobile,
                                    drawerOpen,
                                    closeDrawer
                                }) {
    const [hovered, setHovered] = useState(false);
    const expanded = !collapsed || hovered;

    return (
        <>
            {isMobile && drawerOpen && (
                <div className="backdrop" onClick={closeDrawer} />
            )}

            <aside
                className={`sidebar
          ${expanded ? "expanded" : "collapsed"}
          ${isMobile ? "mobile" : ""}
          ${drawerOpen ? "open" : ""}
        `}
                onMouseEnter={() => !isMobile && setHovered(true)}
                onMouseLeave={() => !isMobile && setHovered(false)}
            >
                <div className="sidebar-header">
                    {!isMobile && (
                        <button
                            className="collapse-btn"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <FiChevronLeft />
                        </button>
                    )}
                    {expanded && <span className="logo">Dashboard</span>}
                </div>

                <nav>
                    {items.map((item, i) => (
                        <div className="menu-item" key={i}>
                            <span className="icon">{item.icon}</span>
                            {expanded && <span className="label">{item.label}</span>}
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
