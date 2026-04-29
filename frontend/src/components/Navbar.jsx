import { FiMenu } from "react-icons/fi";

export default function Navbar({ isMobile, onMenuClick }) {
    return (
        <header className="navbar">
            {isMobile && (
                <button className="nav-menu-btn" onClick={onMenuClick}>
                    <FiMenu />
                </button>
            )}
            <h1 className="nav-title">Glass UI</h1>
        </header>
    );
}
