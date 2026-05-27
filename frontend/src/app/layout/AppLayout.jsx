import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();

    // Scroll to top on route change
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.scrollTo(0, 0);
    }, [location.pathname]);

    // Mapping of paths to titles
    const pageTitles = {
        "/dashboard": t('dashboard', 'Dashboard'),
        "/users": t('user_management', 'Users'),
        "/devotees": t('devotee_registry', 'Devotees'),
        "/pooja": t('pooja_services', 'Pooja Services'),
        "/pooja/book": t('new_booking', 'Booking Portal'),
        "/bookings": t('bookings', 'Bookings'),
        "/donations": t('donations', 'Donations'),
        "/hundi": t('hundi', 'Hundi'),
        "/inventory": t('inventory', 'Inventory'),
        "/events": t('events', 'Events'),
        "/billing": t('billing', 'Billing & Plans'),
        "/settings": t('settings', 'Settings'),
        "/finance": t('finance', 'Financial Reports'),
        "/assets": t('assets', 'Asset Registry'),
        "/staff": t('staff', 'Staff & Attendance'),
        "/integrations": t('integrations', 'Integrations'),
        "/tv-display": t('tv_display', 'TV Display'),
        "/admin/subscriptions": "SaaS Subscriptions"
    };

    const currentTitle = pageTitles[location.pathname] || t('temple_workspace', 'Temple Workspace');

    return (
        <div className="flex h-screen bg-mesh font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
            <Sidebar 
                isOpen={mobileOpen} 
                onClose={() => setMobileOpen(false)} 
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header 
                    title={currentTitle} 
                    onMenuClick={() => setMobileOpen(true)} 
                />

                <main 
                    id="main-content"
                    className="flex-1 overflow-y-auto custom-scrollbar"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="p-4 md:p-10 max-w-[1600px] mx-auto"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

