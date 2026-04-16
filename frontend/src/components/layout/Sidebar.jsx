import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    Settings, 
    LogOut, 
    ChevronRight,
    Search,
    IndianRupee,
    Package,
    Building2,
    Clock,
    Gem,
    TrendingUp,
    X,
    Link2,
    Monitor,
    CircleUser,
    CalendarCheck,
    Banknote,
    Truck,
    Zap
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { logout, tenant, user } = useAuth();
    const { t } = useTranslation();

    const SidebarLink = ({ to, icon: Icon, label, active, locked }) => (
        <Link
            to={locked ? '#' : to}
            onClick={e => locked && e.preventDefault()}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group select-none
                ${active 
                    ? 'bg-[#B8860B] text-white shadow-xl shadow-yellow-900/25 scale-[1.02]' 
                    : locked
                        ? 'text-slate-300 cursor-not-allowed grayscale'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 active:scale-95'}
            `}
        >
            <div className="relative">
                <Icon size={20} className={`${active ? 'text-white' : locked ? 'text-slate-200' : 'text-slate-400 group-hover:text-[#B8860B]'} transition-colors duration-300`} />
                {locked && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <Zap size={8} className="text-slate-400 fill-slate-400" />
                    </div>
                )}
            </div>
            <span className={`text-sm font-bold tracking-tight whitespace-nowrap ${active ? 'opacity-100' : locked ? 'opacity-40' : 'opacity-85 group-hover:opacity-100'}`}>{label}</span>
            {active && <ChevronRight size={14} className="ml-auto opacity-70 animate-in fade-in slide-in-from-left-2" />}
            {locked && <span className="ml-auto text-[8px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded tracking-widest">LOCKED</span>}
        </Link>
    );

    const allowedApps = user?.allowed_apps || [];
    
    // Core apps that don't need plan checks
    const isAllowed = (item) => {
        if (!item.app) return true;
        return allowedApps.includes(item.app);
    };

    const sections = [
        {
            title: "General",
            items: [
                { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard', 'Dashboard') },
                { to: "/integrations", icon: Link2, label: t('integrations', 'Integrations'), app: 'integrations' },
                { to: "/tv-display", icon: Monitor, label: t('tv_display', 'TV Display'), app: 'tv' },
            ]
        },
        {
            title: "People",
            items: [
                { to: "/users", icon: CircleUser, label: t('users', 'Users') },
                { to: "/devotees", icon: Users, label: t('devotees', 'Devotees'), app: 'devotees' },
            ]
        },
        {
            title: "Operations",
            items: [
                { to: "/pooja", icon: Calendar, label: t('pooja_services', 'Pooja Services'), app: 'pooja' },
                { to: "/bookings", icon: CalendarCheck, label: t('bookings', 'Bookings'), app: 'bookings' },
                { to: "/events", icon: IndianRupee, label: t('events', 'Events'), app: 'events' },
                { to: "/hundi", icon: Banknote, label: t('hundi', 'Hundi'), app: 'hundi' },
                { to: "/inventory", icon: Package, label: t('inventory', 'Inventory'), app: 'inventory' },
                { to: "/shipments", icon: Truck, label: t('e_prasad_shipping', 'E-Prasad Shipping'), app: 'shipments' },
            ]
        },
        {
            title: "Administration",
            items: [
                { to: "/staff", icon: Clock, label: t('staff_attendance', 'Staff & Attendance'), app: 'staff' },
                { to: "/assets", icon: Gem, label: t('asset_registry', 'Asset Registry'), app: 'assets' },
                { to: "/finance", icon: TrendingUp, label: t('finance', 'Finance'), app: 'finance' },
                { to: "/billing", icon: Banknote, label: t('billing', 'Billing & Plans') },
                { to: "/settings", icon: Settings, label: t('settings', 'Settings') },
            ]
        }
    ];

    const trialDaysLeft = tenant?.trial_ends_at 
    ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

    const SidebarContent = (
        <div className="h-full flex flex-col bg-white">
            {/* Logo Section */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-[#B8860B] rounded-xl flex items-center justify-center text-white shadow-xl shadow-yellow-900/20">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none">{tenant?.name || 'Temple SaaS'}</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Heritage Portal</p>
                    </div>
                </div>

                {/* Trial Countdown Widget */}
                {tenant?.is_trial && (
                    <div className="mb-6 p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                            <Zap size={40} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">{trialDaysLeft} Days of Trial Left</p>
                        <Link to="/billing" className="text-[9px] font-bold underline decoration-amber-500 underline-offset-4 hover:text-amber-400 transition-colors">Upgrade to Premium</Link>
                    </div>
                )}

                <div className="relative mb-6 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#B8860B] transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder={t('search_placeholder', 'Quick Find...')} 
                        className="w-full h-11 pl-11 pr-4 rounded-[14px] bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 outline-none text-xs font-bold transition-all shadow-inner focus:shadow-md"
                    />
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar">
                {sections.map((section, sidx) => (
                    <div key={sidx} className="space-y-2">
                        <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-70">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => (
                                <SidebarLink
                                    key={item.to}
                                    to={item.to}
                                    icon={item.icon}
                                    label={item.label}
                                    active={location.pathname === item.to}
                                    locked={!isAllowed(item)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm tracking-tight"
                >
                    <LogOut size={20} />
                    <span>{t('logout', 'Sign Out')}</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (Anchored) */}
            <aside className="hidden lg:flex w-80 h-screen sticky left-0 top-0 bg-white border-r border-slate-100 flex-col z-40 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {SidebarContent}
            </aside>

            {/* Mobile Sidebar (Fixed/Overlay) */}
            <div className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                {/* Sidebar Drawer */}
                <aside 
                    className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 -right-12 p-2 bg-white rounded-full text-slate-900 shadow-xl"
                    >
                        <X size={20} />
                    </button>
                    {SidebarContent}
                </aside>
            </div>
        </>
    );
}
