import { useState, useEffect } from "react";
import ProductsManagement from "./ProductsManagement/ProductsManagement";
import CategoriesManagement from "./CategoriesManagement/CategoriesManagement";
import VideosManagement from "./VideosManagement/VideosManagement";
import DashboardHome from "./DashboardHome/DashboardHome";
import ContactManagement from "./ContactManagement/ContactManagement";
import Login from "./Login/Login";

import { FaAngleRight } from "react-icons/fa6";
import { MdShoppingBag, MdCategory, MdVideoLibrary, MdContactMail } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import AdvertisementsManagement from './AdvertisementsManagement/AdvertisementsManagement'
import "./Dashboard.css";

export default function Dashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("admin") === "true");
    const [activePage, setActivePage] = useState("DashboardHome");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Handle window resize to detect mobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin");
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) return <Login setIsLoggedIn={setIsLoggedIn} />;

    return (
        <div className="dashboard">

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>

                {/* Header */}
                <div className="sidebar-header">
                    {(sidebarOpen || isMobile) && <h2 className="brand">جاليري الفريده</h2>}
                    
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FaAngleRight className={`arrow ${sidebarOpen ? "rotate" : ""}`} />
                    </button>
                </div>

                {/* Buttons */}
                <div className="sidebar-buttons">

                    <button onClick={() => setActivePage("DashboardHome")} className={activePage === "DashboardHome" ? "active" : ""}>
                        <MdCategory size={22} />
                        {(sidebarOpen || isMobile) && <span>الرئيسيه</span>}
                    </button>

                    {/* <button onClick={() => setActivePage("categories")} className={activePage === "categories" ? "active" : ""}>
                        <MdCategory size={22} />
                        {(sidebarOpen || isMobile) && <span>الاقسام</span>}
                    </button> */}

                    <button onClick={() => setActivePage("products")} className={activePage === "products" ? "active" : ""}>
                        <MdShoppingBag size={22} />
                        {(sidebarOpen || isMobile) && <span>المنتجات</span>}
                    </button>

                   
                    <button onClick={() => setActivePage("videos")} className={activePage === "videos" ? "active" : ""}>
                        <MdVideoLibrary size={22} />
                        {(sidebarOpen || isMobile) && <span>الفيديوهات</span>}
                    </button>

                    <button onClick={() => setActivePage("contact")} className={activePage === "contact" ? "active" : ""}>
                        <MdContactMail size={22} />
                        {(sidebarOpen || isMobile) && <span>تواصل معنا</span>}
                    </button>
                    <button onClick={() => setActivePage("AdvertisementsManagement")} className={activePage === "AdvertisementsManagement" ? "active" : ""}>
                        <MdContactMail size={22} />
                        {(sidebarOpen || isMobile) && <span> اعلان </span>}
                    </button>

                </div>

                {/* Logout */}
                <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut size={22} />
                    {(sidebarOpen || isMobile) && <span>تسجيل خروج</span>}
                </button>
            </aside>

            {/* Main content */}
            <main className="main-content">
                {activePage === "products" && <ProductsManagement />}
                {activePage === "categories" && <CategoriesManagement />}
                {activePage === "videos" && <VideosManagement />}
                {activePage === "contact" && <ContactManagement />}
                {activePage === "DashboardHome" && <DashboardHome />}
                {activePage === "AdvertisementsManagement" && <AdvertisementsManagement />}
                
            </main>

        </div>
    );
}
