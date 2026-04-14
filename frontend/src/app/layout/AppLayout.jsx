import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTo(0, 0);
  }, [location.pathname]);

  const getPageTitle = (path) => {
    const segment = path.split("/")[1] || "dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      {/* Navigation Sidebar */}
      <Sidebar 
          isOpen={mobileOpen} 
          onClose={() => setMobileOpen(false)} 
      />

      {/* Main Workspace */}
      <main 
          id="main-content"
          className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto scroll-smooth"
      >
        <Header 
            title={getPageTitle(location.pathname)} 
            onMenuClick={() => setMobileOpen(true)}
        />
        
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
