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
    Truck
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const SidebarLink = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group select-none
            ${active 
                ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-[1.02]' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 active:scale-95'}
        `}
    >
        <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-primary'} transition-colors duration-300`} />
        <span className={`text-sm font-bold tracking-tight whitespace-nowrap ${active ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'}`}>{label}</span>
        {active && <ChevronRight size={14} className="ml-auto opacity-70 animate-in fade-in slide-in-from-left-2" />}
    </Link>
);

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { logout, tenant } = useAuth();
    const { t } = useTranslation();

    const sections = [
        {
            title: "General",
            items: [
                { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard', 'Dashboard') },
                { to: "/integrations", icon: Link2, label: t('integrations', 'Integrations') },
                { to: "/tv-display", icon: Monitor, label: t('tv_display', 'TV Display') },
            ]
        },
        {
            title: "People",
            items: [
                { to: "/users", icon: CircleUser, label: t('users', 'Users') },
                { to: "/devotees", icon: Users, label: t('devotees', 'Devotees') },
            ]
        },
        {
            title: "Operations",
            items: [
                { to: "/pooja", icon: Calendar, label: t('pooja_services', 'Pooja Services') },
                { to: "/bookings", icon: CalendarCheck, label: t('bookings', 'Bookings') },
                { to: "/events", icon: IndianRupee, label: t('events', 'Events') },
                { to: "/hundi", icon: Banknote, label: t('hundi', 'Hundi') },
                { to: "/inventory", icon: Package, label: t('inventory', 'Inventory') },
                { to: "/shipments", icon: Truck, label: t('e_prasad_shipping', 'E-Prasad Shipping') },
            ]
        },
        {
            title: "Administration",
            items: [
                { to: "/staff", icon: Clock, label: t('staff_attendance', 'Staff & Attendance') },
                { to: "/assets", icon: Gem, label: t('asset_registry', 'Asset Registry') },
                { to: "/finance", icon: TrendingUp, label: t('finance', 'Finance') },
                { to: "/settings", icon: Settings, label: t('settings', 'Settings') },
            ]
        }
    ];

    const SidebarContent = (
        <div className="h-full flex flex-col bg-white">
            {/* Logo Section */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none">{tenant?.name || 'Temple SaaS'}</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Heritage Portal</p>
                    </div>
                </div>

                <div className="relative mb-6 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={14} />
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
