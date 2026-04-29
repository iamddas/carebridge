import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../Layout.css";

export default function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)");
        const handleResize = () => setIsMobile(media.matches);

        handleResize();
        media.addEventListener("change", handleResize);
        return () => media.removeEventListener("change", handleResize);
    }, []);

    return (
        <div className="app-layout">
            <Navbar
                isMobile={isMobile}
                onMenuClick={() => setDrawerOpen(true)}
            />

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                isMobile={isMobile}
                drawerOpen={drawerOpen}
                closeDrawer={() => setDrawerOpen(false)}
            />

            <main
                className={`main-content ${
                    !isMobile && !collapsed ? "expanded" : ""
                }`}
            >
                {children}
            </main>
        </div>
    );
}
