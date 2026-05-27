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
    Zap,
    Shield,
    ChevronDown
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { logout, tenant, user, checkPermission } = useAuth();
    const { t } = useTranslation();

    const [expandedSections, setExpandedSections] = useState([]);

    const toggleSection = (title) => {
        setExpandedSections(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title) 
                : [...prev, title]
        );
    };

    const SidebarLink = ({ to, icon: Icon, label, active, locked }) => (
        <Link
            to={locked ? '#' : to}
            onClick={e => locked && e.preventDefault()}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group select-none
                ${active 
                    ? 'bg-primary text-white shadow-xl shadow-primary/25 scale-[1.02]' 
                    : locked
                        ? 'text-slate-300 cursor-not-allowed grayscale'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-primary active:scale-95'}
            `}
        >
            <div className="relative">
                <Icon size={18} className={`${active ? 'text-white' : locked ? 'text-slate-200' : 'text-slate-400 group-hover:text-primary'} transition-colors duration-300`} />
            </div>
            <span className={`text-[15px] font-bold tracking-tight whitespace-nowrap ${active ? 'opacity-100' : locked ? 'opacity-40' : 'opacity-85 group-hover:opacity-100'}`}>{label}</span>
            {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
            {locked && <Zap size={10} className="ml-auto text-slate-300 fill-slate-300" />}
        </Link>
    );

    const sections = [
        {
            title: t('main_menu', 'Main Menu'),
            items: [
                { to: "/dashboard", icon: LayoutDashboard, label: t('dashboard', 'Dashboard'), app: 'dashboard' },
                { to: "/integrations", icon: Link2, label: t('integrations', 'Integrations'), app: 'integrations' },
                { to: "/tv-display", icon: Monitor, label: t('tv_display', 'TV Display'), app: 'tv' },
            ]
        },
        user?.is_superuser && {
            title: "SaaS Admin",
            items: [
                { to: "/admin/subscriptions", icon: Shield, label: "Subscriptions" },
            ]
        },
        {
            title: t('people', 'People'),
            items: [
                { to: "/users", icon: CircleUser, label: t('users', 'Users'), app: 'users' },
                { to: "/devotees", icon: Users, label: t('trust_members', 'Trust Members'), app: 'devotees' },
            ]
        },
        {
            title: t('operations', 'Operations'),
            items: [
                { to: "/pooja", icon: Calendar, label: t('pooja_services', 'Pooja Services'), app: 'pooja' },
                { to: "/bookings", icon: CalendarCheck, label: t('bookings', 'Bookings'), app: 'bookings' },
                { to: "/donations", icon: Banknote, label: t('donations', 'Donations'), app: 'donations' },
                { to: "/events", icon: IndianRupee, label: t('events', 'Events'), app: 'events' },
                { to: "/hundi", icon: Banknote, label: t('hundi', 'Hundi'), app: 'hundi' },
                { to: "/inventory", icon: Package, label: t('inventory', 'Inventory'), app: 'inventory' },
            ]
        },
        {
            title: t('administration', 'Administration'),
            items: [
                { to: "/staff", icon: Clock, label: t('staff_attendance', 'Staff & Attendance'), app: 'staff' },
                { to: "/assets", icon: Gem, label: t('asset_registry', 'Asset Registry'), app: 'assets' },
                { to: "/finance", icon: TrendingUp, label: t('finance', 'Finance'), app: 'finance' },
                { to: "/billing", icon: Banknote, label: t('billing', 'Billing & Plans') },
                { to: "/settings", icon: Settings, label: t('settings', 'Settings') },
            ]
        }
    ].filter(Boolean);

    // Auto-expand section containing current route
    useEffect(() => {
        const currentSection = sections.find(section => 
            section.items.some(item => location.pathname === item.to)
        );
        if (currentSection && !expandedSections.includes(currentSection.title)) {
            setExpandedSections(prev => [...prev, currentSection.title]);
        }
    }, [location.pathname]);

    const trialDaysLeft = tenant?.trial_ends_at
        ? Math.max(0, Math.ceil((new Date(tenant.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)))
        : 0;

    const isTrialExpired = tenant?.status === 'trial' && (!tenant?.is_trial || trialDaysLeft <= 0);
    const isRestricted = !user?.is_superuser && (['approved', 'pending_approval', 'expired', 'suspended'].includes(tenant?.status) || isTrialExpired);

    const SidebarContent = (
        <div className="h-full flex flex-col bg-white">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-10">
                    <div className="h-11 w-11 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none">{tenant?.name || 'Temple SaaS'}</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Management Suite</p>
                    </div>
                </div>

                {tenant?.is_trial && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-5 rounded-3xl bg-slate-900 text-white relative overflow-hidden group shadow-xl shadow-slate-900/20"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                            <Zap size={40} />
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1.5">{trialDaysLeft} Days Remaining</p>
                        <Link to="/billing" className="text-[10px] font-bold underline decoration-primary underline-offset-4 hover:text-primary transition-colors">Upgrade to Premium</Link>
                    </motion.div>
                )}

                <div className="relative mb-8 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder={t('search_placeholder', 'Quick Search...')} 
                        className="w-full h-11 pl-11 pr-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-slate-100 outline-none text-xs font-bold transition-all shadow-inner focus:shadow-xl focus:shadow-slate-200/40"
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-3 overflow-y-auto custom-scrollbar">
                {sections.map((section, sidx) => {
                    const isExpanded = expandedSections.includes(section.title);
                    
                    return (
                        <div key={sidx} className="space-y-1">
                            <button
                                onClick={() => toggleSection(section.title)}
                                className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 group
                                    ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50'}
                                `}
                            >
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 opacity-80 group-hover:text-primary transition-colors">
                                    {section.title}
                                </h3>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "circOut" }}
                                    className="text-slate-300 group-hover:text-primary"
                                >
                                    <ChevronDown size={14} strokeWidth={3} />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className="overflow-hidden space-y-1"
                                    >
                                        <div className="pt-1 pb-2">
                                            {section.items.map((item) => (
                                                <SidebarLink
                                                    key={item.to}
                                                    to={item.to}
                                                    icon={item.icon}
                                                    label={item.label}
                                                    active={location.pathname === item.to}
                                                    locked={isRestricted 
                                                        ? (item.to !== '/billing' && !item.to.startsWith('/settings')) 
                                                        : (item.app ? !checkPermission(item.app, 'view') : false)}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-50 bg-slate-50/20">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-[13px] tracking-tight group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{t('logout', 'Sign Out')}</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="hidden lg:flex w-80 h-screen sticky left-0 top-0 bg-white border-r border-slate-100 flex-col z-40 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
                {SidebarContent}
            </aside>

            <AnimatePresence>
                {isOpen && (
                    <div className="lg:hidden fixed inset-0 z-[100]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={onClose}
                        />

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"
                            >
                                <X size={20} />
                            </button>
                            {SidebarContent}
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

